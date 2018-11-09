/**
 * 校验经销商密码页
 * 有些用户数据来自经销商APP
 * 所以需要校验这些用户在APP端数据库的密码
 * **/

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================
import { Button, Toast, List, InputItem } from "antd-mobile";

// ==================
// 本页面所需action
// ==================

import { bindPhonePwd } from "../../../../a_action/app-action";

// ==================
// Definition
// ==================

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password1: "" // 表单password
    };
  }

  componentWillUnmount() {
    document.title = "校验经销商密码";
  }

  // 密码输入框改变
  onPassword1Change(e) {
    this.setState({
      password1: e.target.value
    });
  }

  // 提交
  onSubmit() {
    const u = this.props.userinfo;
    if (!u || !u.mobile) {
      Toast.info("您没有绑定手机号", 1);
      return;
    }
    if (!this.state.password1.length) {
      Toast.info("请输入您的经销商App密码", 1);
      return;
    }

    const params = {
      userId: u.id,
      mobile: u.mobile,
      password: this.state.password1
    };
    this.props.actions.bindPhonePwd(params).then(res => {
      if (res.status === 200) {
        Toast.success("校验成功", 1);
        this.props.history.go(-1);
      } else {
        Toast.info(res.message || "校验失败", 1);
      }
    });
  }

  render() {
    return (
      <div
        className="flex-auto page-box page-checkpwd"
        style={{ backgroundColor: "#fff", minHeight: "100vh" }}
      >
        <div className="login-box">
          <div className="logo-info">
            <span className="small">
              为了帐号安全，需要验证您的经销商App密码
            </span>
          </div>
          <div className="input-box">
            <List className="this-list">
              <InputItem
                clear
                placeholder="请输入您的经销商APP密码"
                type="password"
                maxLength={18}
                value={this.state.password1}
                onInput={e => this.onPassword1Change(e)}
              />
            </List>
          </div>
          <div className="sayInfo">
            您是经销商身份，请输入您的经销商App密码绑定经销商账户，绑定后可以行使您的产品经销权，并通过分享为您锁定客户，享受更多服务
          </div>
          <Button
            type="primary"
            className="this-btn"
            disabled={this.state.loading}
            onClick={() => this.onSubmit()}
          >
            确认
          </Button>
        </div>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Register.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any,
  userinfo: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    userinfo: state.app.userinfo
  }),
  dispatch => ({
    actions: bindActionCreators({ bindPhonePwd }, dispatch)
  })
)(Register);
