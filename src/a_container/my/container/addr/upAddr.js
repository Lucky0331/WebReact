/* 我的e家 - 个人主页 - 修改收货地址 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import "./upAddr.scss";
// ==================
// 所需的所有组件
// ==================
import { Button, List, InputItem, Toast, Picker } from "antd-mobile";

// ==================
// 本页面所需action
// ==================

import { upAddr } from "../../../../a_action/shop-action";
import { getAreaList } from "../../../../a_action/app-action";
// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null, // 当前编辑的数据的ID
      formName: "",
      formPhone: "",
      formAddr: "",
      formSex: undefined,
      formArea: undefined, // 地区
      sourceData: [] // 所有省市数据（层级）
    };
  }

  componentDidMount() {
    document.title = "修改收货地址";
    if (!this.props.areaData.length) {
      this.getArea();
    } else {
      this.makeAreaData(this.props.areaData);
    }
    const n = this.props.nowData;
    console.log("NowData:", n);
    if (n) {
      this.setState({
        id: n.id,
        formName: n.contact,
        formPhone: n.mobile,
        formSex: [n.sex],
        formAddr: n.street,
        formArea: n.province ? [n.province, n.city, n.region] : undefined
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextP) {
    if (nextP.areaData !== this.props.areaData) {
      this.makeAreaData(nextP.areaData || []);
    }
  }

  // 获取所有省市区
  getArea() {
    this.props.actions.getAreaList();
  }

  // 通过区域原始数据组装Picker所需数据
  makeAreaData(d) {
    const data = d.map((item, index) => {
      return {
        label: item.areaName,
        value: item.areaName,
        parentId: item.parentId,
        id: item.id,
        level: item.level
      };
    });
    const areaData = this.recursionAreaData(null, data);
    this.setState({
      sourceData: areaData || []
    });
  }
  // 工具 - 递归生成区域层级数据
  recursionAreaData(one, data) {
    let kids;
    if (!one) {
      // 第1次递归
      kids = data.filter(item => item.level === 0);
    } else {
      kids = data.filter(item => item.parentId === one.id);
    }
    kids.forEach(item => (item.children = this.recursionAreaData(item, data)));
    return kids;
  }

  // 保存
  onSubmit() {
    const u = this.props.userinfo;
    if (!u) {
      Toast.info("请先登录", 1);
      return;
    }
    if (!this.state.formName) {
      Toast.info("请输入姓名", 1);
      return;
    } else if (!tools.checkPhone(this.state.formPhone)) {
      Toast.info("请输入正确的手机号", 1);
      return;
    } else if (!this.state.formSex && this.state.formSex !== 0) {
      Toast.info("请选择性别", 1);
      return;
    } else if (!this.state.formArea) {
      Toast.info("请选择区域", 1);
      return;
    } else if (!this.state.formAddr) {
      Toast.info("请输入详细地址", 1);
      return;
    }
    const params = {
      id: this.state.id,
      userId: u.id,
      contact: this.state.formName,
      mobile: this.state.formPhone,
      sex: this.state.formSex && this.state.formSex[0],
      province: this.state.formArea && this.state.formArea[0],
      city: this.state.formArea && this.state.formArea[1],
      region: this.state.formArea && this.state.formArea[2],
      street: this.state.formAddr
    };
    Toast.loading("请稍后…");
    this.props.actions
      .upAddr(tools.clearNull(params))
      .then(res => {
        if (res.status === 200) {
          Toast.success("修改成功");
          this.props.history.go(-1);
        } else {
          Toast.info(res.message || "修改失败");
        }
      })
      .catch(() => {
        Toast.hide();
      });
  }

  // onNameChange
  onNameChange(v) {
    const value = tools.trim(v);
    if (value.length <= 12) {
      this.setState({
        formName: value
      });
    }
  }

  // onPhoneChange
  onPhoneChange(v) {
    const value = tools.trim(v);
    if (value.length <= 11) {
      this.setState({
        formPhone: value
      });
    }
  }

  // 详细地址改变
  onAddrChange(v) {
    const value = tools.trim(v);
    if (value.length <= 150) {
      this.setState({
        formAddr: value
      });
    }
  }

  // 所在地区点击
  onCityChose(data) {
    console.log("是个啥:", data);
    this.setState({
      formArea: data
    });
  }

  // 性别选择
  onSexChose(v) {
    this.setState({
      formSex: v
    });
  }

  render() {
    console.log("Picker妈的你不更新吗：", this.state.sourceData);
    return (
      <div className="newaddr-page">
        <List>
          <InputItem
            clear
            value={this.state.formName}
            onChange={v => this.onNameChange(v)}
          >
            收货人
          </InputItem>
          <InputItem
            type="number"
            clear
            value={this.state.formPhone}
            onChange={v => this.onPhoneChange(v)}
          >
            联系方式
          </InputItem>
          <Picker
            data={[{ label: "男", value: 1 }, { label: "女", value: 2 }]}
            extra={""}
            value={this.state.formSex}
            cols={1}
            onOk={v => this.onSexChose(v)}
          >
            <Item arrow={"horizontal"}>性别</Item>
          </Picker>
          <Picker
            data={this.state.sourceData}
            extra={""}
            value={this.state.formArea}
            format={v => v.join("/")}
            cols={3}
            onOk={v => this.onCityChose(v)}
          >
            <Item arrow={"horizontal"}>所在区域</Item>
          </Picker>
          <InputItem
            clear
            value={this.state.formAddr}
            onChange={v => this.onAddrChange(v)}
            placeholder={"请输入详细地址信息"}
          >
            详细地址
          </InputItem>
        </List>
        <div className="page-footer">
          <Button type="primary" onClick={() => this.onSubmit()}>
            保存
          </Button>
        </div>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

HomePageContainer.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any,
  areaData: P.array,
  userinfo: P.any,
  nowData: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    areaData: state.app.areaData,
    userinfo: state.app.userinfo,
    nowData: state.shop.upAddrData
  }),
  dispatch => ({
    actions: bindActionCreators({ getAreaList, upAddr }, dispatch)
  })
)(HomePageContainer);
