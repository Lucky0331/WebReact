/* 登录页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast, Button, List, InputItem } from "antd-mobile";
import tools from "../../util/all";
import P from "prop-types";
import { Link } from "react-router-dom";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================
import ImgLogo from "../../assets/logo2@3x.png";
import ImgPhone from "../../assets/phone@3x.png";
import ImgMima from "../../assets/mima@3x.png";
// import ImgWx from './assets/weixin@3x.png';
// ==================
// 本页面所需action
// ==================

import { login } from "../../a_action/app-action";

// ==================
// Definition
// ==================
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loading: false // 是否正在登录中
    };
  }

  componentDidMount() {
    document.title = "登录";
  }
  // 输入用户名
  onUserNameInput(e) {
    const v = tools.trim(e);
    if (v.length <= 11) {
      this.setState({
        username: v
      });
    }
  }

  // 输入用户名
  onPasswordInput(e) {
    const v = tools.trim(e);
    if (v.length <= 20) {
      this.setState({
        password: v
      });
    }
  }

  // 登录提交
  onSubmit() {
    const reg = /^[1][3578][0-9]{9}$/g; // 正确的手机号码

    if (!this.state.username || !reg.test(this.state.username)) {
      Toast.info("请输入正确的手机号", 1);
    } else if (!this.state.password || this.state.password.length < 6) {
      Toast.info("请输入6位以上密码", 1);
    }

    const params = {
      loginName: this.state.username,
      password: this.state.password,
      mobile: this.state.username,
      loginIp: typeof returnCitySN !== "undefined" ? returnCitySN["cip"] : "",
      appType: 1,
      appVersion: "web"
    };

    this.setState({
      loading: true
    });
    this.props.actions
      .login(params)
      .then(res => {
        if (res.status === 200) {
          Toast.success("登录成功", 1);
          // 如果用户信息中有openId,就把这个openId存入localStorage
          if (res.data.openid) {
            sessionStorage.setItem("openId", res.data.openid);
          }

          // 登录成功后，如果设置了回跳地址，就跳转到回跳地址
          if (this.props.history.length) {
            this.props.history.go(-1);
          } else {
            this.props.history.replace("/my");
          }
        } else {
          Toast.info(res.message || "登录失败", 1);
        }
        this.setState({
          loading: false
        });
      })
      .catch(err => {
        this.setState({
          loading: false
        });
      });
  }

  render() {
    return (
      <div
        className="flex-auto page-box page-login"
        style={{ backgroundColor: "#fff", minHeight: "100vh" }}
      >
        <div className="login-box">
          <img className="logo" src={ImgLogo} />
          <div className="input-box">
            <List className="this-list">
              <InputItem
                clear
                placeholder="经销商账号/手机号/e家号"
                maxLength={11}
                value={this.state.username}
                onChange={e => this.onUserNameInput(e)}
              >
                账号
              </InputItem>
              <InputItem
                clear
                placeholder="输入您的登录密码"
                maxLength={20}
                type="password"
                value={this.state.password}
                onChange={e => this.onPasswordInput(e)}
              >
                密码
              </InputItem>
            </List>
          </div>
          {/*<div className="input-box2">*/}
          {/*<div className="btn"><Link to="/forgot">忘记密码?</Link></div>*/}
          {/*</div>*/}
          <Button
            type="primary"
            className="this-btn"
            disabled={this.state.loading}
            onClick={() => this.onSubmit()}
          >
            登录
          </Button>
        </div>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Login.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({ login }, dispatch)
  })
)(Login);
