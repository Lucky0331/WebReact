/* 健康管理 - 填写被评估者信息 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";
import tools from "../../../../util/all";
// ==================
// 所需的所有组件
// ==================
import { DatePicker, Button, Modal, Toast, Picker, List } from "antd-mobile";
import ImgRight from "../../../../assets/xiangyou@3x.png";

// ==================
// 本页面所需action
// ==================

import { savePreInfo } from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================
const prompt = Modal.prompt;
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formDate: undefined, // 出生日期
      formName: "", // 体检人姓名
      formPhone: "", // 设置手机号
      formSex: "1", // 性别
      formTall: "", // 身高
      formWeight: "", // 体重
      formID: "" // 身份证号
    };
  }

  componentDidMount() {
    document.title = "填写被评估者信息";
    const p = this.props.preInfo;

    this.setState({
      formName: p.userName,
      formPhone: p.phone,
      formSex: String(p.sex),
      formTall: p.height,
      formWeight: p.weight,
      formDate: p.birthDate ? tools.formatStrToDate(p.birthDate) : undefined
    });
  }

  UNSAFE_componentWillReceiveProps(nextP) {
    if (nextP.preInfo !== this.props.preInfo) {
      const p = nextP.preInfo;

      this.setState({
        formName: p.userName,
        formPhone: p.phone,
        formSex: String(p.sex),
        formTall: p.height,
        formWeight: p.weight,
        formDate: p.birthDate ? tools.formatStrToDate(p.birthDate) : undefined
      });
    }
  }

  // 设置体检人姓名
  setName() {
    prompt("输入姓名", "", [
      { text: "取消" },
      {
        text: "确定",
        onPress: value => {
          const v = tools.trim(value);
          if (!v) {
            Toast.info("姓名不能为空", 1);
            return false;
          } else if (v.length > 12) {
            Toast.info("做多输入12个字符", 1);
            return false;
          }
          this.setState({ formName: v });
        }
      }
    ]);
  }

  // 设置手机号
  setPhone() {
    prompt("输入手机号", "", [
      { text: "取消" },
      {
        text: "确定",
        onPress: value => {
          const v = tools.trim(value);
          if (!tools.checkPhone(v)) {
            Toast.info("请输入有效手机号", 1);
            return false;
          }
          this.setState({ formPhone: v });
        }
      }
    ]);
  }

  // 设置身高
  setTall() {
    prompt("输入身高(cm)", "", [
      { text: "取消" },
      {
        text: "确定",
        onPress: value => {
          const v = Number(tools.trim(value));
          if (!v || v < 0 || v > 300) {
            Toast.info("请输入有效身高", 1);
            return false;
          }
          this.setState({ formTall: v });
        }
      }
    ]);
  }

  // 设置身份证
  setID() {
    prompt("输入身份证", "", [
      { text: "取消" },
      {
        text: "确定",
        onPress: value => {
          const v = tools.trim(value);
          if (!tools.checkID(v)) {
            Toast.info("请输入有效身份证号", 1);
            return false;
          }
          this.setState({ formID: v });
        }
      }
    ]);
  }

  // 设置体重
  setWeight() {
    prompt("输入体重(kg)", "", [
      { text: "取消" },
      {
        text: "确定",
        onPress: value => {
          const v = Number(tools.trim(value));
          if (!v || v < 0 || v > 500) {
            Toast.info("请输入有效体重", 1);
            return false;
          }
          this.setState({ formWeight: v });
        }
      }
    ]);
  }

  // 保存
  savePreInfo() {
    if (!this.state.formName) {
      Toast.info("请输入体检人姓名", 1);
      return;
    } else if (!tools.checkPhone(this.state.formPhone)) {
      Toast.info("请输入正确的手机号", 1);
      return;
    } else if (!this.state.formDate) {
      Toast.info("请填写出生日期", 1);
      return;
    } else if (!this.state.formTall) {
      Toast.info("请输入身高", 1);
      return;
    } else if (!this.state.formWeight) {
      Toast.info("请输入体重", 1);
      return;
    }
    this.props.actions.savePreInfo({
      userName: this.state.formName,
      phone: this.state.formPhone,
      sex: Number(this.state.formSex),
      birthDate: tools
        .dateformart(this.state.formDate)
        .split("-")
        .join(""),
      idCard: this.state.formID,
      height: Number(this.state.formTall),
      weight: Number(this.state.formWeight)
    });
    setTimeout(() => {
      this.props.history.go(-1);
    }, 16);
  }

  render() {
    return (
      <div className="page-pre-info">
        {/* 下方各横块 */}
        <List>
          <Item
            arrow="horizontal"
            extra={this.state.formName}
            onClick={() => this.setName()}
          >
            体检人姓名
          </Item>
          <Item
            arrow="horizontal"
            extra={this.state.formID || "非必填"}
            onClick={() => this.setID()}
          >
            身份证号
          </Item>
          <Item
            arrow="horizontal"
            extra={this.state.formPhone}
            onClick={() => this.setPhone()}
          >
            手机号码
          </Item>
        </List>
        <List className="mt">
          <DatePicker
            mode="date"
            value={this.state.formDate}
            minDate={new Date("1900-01-01")}
            onChange={date => {
              const nowTimes=new Date().getTime();
              if(date.getTime()>nowTimes){
                  Toast.info("出生日期不能大于当前时间！", 1);
                  return
              }
              this.setState({ formDate: date });
            }}
          >
            <Item arrow="horizontal">出生日期</Item>
          </DatePicker>
          <Picker
            title="请选择性别"
            extra={this.state.formSex[0] === "1" ? "男" : "女"}
            data={[{ value: "1", label: "男" }, { value: "0", label: "女" }]}
            onOk={v => this.setState({ formSex: v })}
            cols={1}
          >
            <Item arrow="horizontal">性别</Item>
          </Picker>
          <Item
            arrow="horizontal"
            extra={this.state.formTall ? `${this.state.formTall}cm` : null}
            onClick={() => this.setTall()}
          >
            身高
          </Item>
          <Item
            arrow="horizontal"
            extra={this.state.formWeight ? `${this.state.formWeight}kg` : null}
            onClick={() => this.setWeight()}
          >
            体重
          </Item>
        </List>
        <div className="thefooter">
          <Button type="primary" onClick={() => this.savePreInfo()}>
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
  preInfo: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    preInfo: state.shop.preInfo
  }),
  dispatch => ({
    actions: bindActionCreators({ savePreInfo }, dispatch)
  })
)(HomePageContainer);
