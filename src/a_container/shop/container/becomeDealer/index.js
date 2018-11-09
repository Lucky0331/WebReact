/* 水机下单，方式选择（原价、成为经销商） */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================

// ==================
// 本页面所需action
// ==================

import { Button, List, InputItem, Toast } from "antd-mobile";

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formName: "", // 姓名
      formID: "", // 身份证
      formPhone: "", // 手机号
      formEmail: "", // 邮箱
      formServer: "" // 服务站
    };
  }

  componentDidMount() {}

  // 姓名改变
  onFormName(v) {
    v.length <= 12 &&
      this.setState({
        formName: v
      });
  }

  // 身份证
  onFormID(v) {
    v.length <= 18 &&
      this.setState({
        formID: v
      });
  }

  // 手机号
  onFormPhone(v) {
    v.length <= 11 &&
      this.setState({
        formPhone: v
      });
  }

  // 邮箱
  onFormEmail(v) {
    v.length <= 80 &&
      this.setState({
        formEmail: v
      });
  }

  // 服务站
  onFormServer(v) {
    this.setState({
      formServer: v
    });
  }

  // 下一步
  onSubmit() {
    if (!this.state.formName) {
      Toast.info("请输入姓名", 1);
      return false;
    } else if (!this.state.formID || this.state.formID.length !== 18) {
      Toast.info("请输入正确的身份证", 1);
      return false;
    } else if (!tools.checkPhone(this.state.formPhone)) {
      Toast.info("请输入正确的手机号", 1);
      return false;
    } else if (
      this.state.formEmail &&
      !tools.checkEmail(this.state.formEmail)
    ) {
      Toast.info("请输入正确的邮箱", 1);
      return false;
    }
    this.props.history.push(
      `/shop/confirmPay/${this.props.orderParams.nowProduct.id}`
    );
  }

  render() {
    return (
      <div className="flex-auto page-box become-dealer">
        <List>
          <InputItem
            placeholder="请输入姓名"
            value={this.state.formName}
            onChange={v => this.onFormName(v)}
            clear
          >
            姓名
          </InputItem>
          <InputItem
            placeholder="请输入身份证"
            value={this.state.formID}
            onChange={v => this.onFormID(v)}
            clear
            type="number"
          >
            身份证
          </InputItem>
          <InputItem
            placeholder="请输入手机号"
            value={this.state.formPhone}
            onChange={v => this.onFormPhone(v)}
            clear
            type="number"
          >
            手机号
          </InputItem>
          <InputItem
            placeholder="选填"
            value={this.state.formEmail}
            onChange={v => this.onFormEmail(v)}
            clear
          >
            邮箱
          </InputItem>
          <InputItem
            placeholder="请输入服务站"
            value={this.state.formServer}
            onChange={v => this.onFormServer(v)}
            clear
          >
            服务站
          </InputItem>
        </List>
        <div className="thefooter page-flex-row">
          <div
            className="flex-none"
            style={{ textAlign: "center", width: "100%" }}
            onClick={() => this.onSubmit()}
          >
            下一步
          </div>
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
  orderParams: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    orderParams: state.shop.orderParams
  }),
  dispatch => ({
    actions: bindActionCreators({}, dispatch)
  })
)(HomePageContainer);
