/* 提现确认，输入验证码页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import "./tiXianNow.scss";
// ==================
// 所需的所有组件
// ==================
import { Checkbox, Modal, Button, Toast, List, InputItem } from "antd-mobile";
import ImgLogo from "../../../../assets/dunpai@3x.png";

// ==================
// 本页面所需action
// ==================

import { getVerifyCode2 } from "../../../../a_action/app-action";
import { newTiXian2 } from "../../../../a_action/shop-action";
// ==================
// Definition
// ==================
const AgreeItem = Checkbox.AgreeItem;
const operation = Modal.operation;
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vcode: "", // 表单验证码值
      verifyCode: false, // 获取验证码按钮是否正在冷却
      verifyCodeInfo: "获取验证码", // 获取验证码按钮显示的内容
      myVcode: "", // 后台传来的验证码信息
      loading: false // 是否正在submit
    };
    this.timer = null; // 获取验证码的tiemr
  }

  componentDidMount() {
    document.title = "提现";
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // 表单vcode输入时
  onVcodeInput(e) {
    const v = tools.trim(e);
    if (v.length <= 6) {
      this.setState({
        vcode: v
      });
    }
  }

  // 点击获取验证码按钮
  getVerifyCode() {
    const me = this;
    let time = 60;
    if (this.state.verifyCode) {
      return;
    }
    if (!this.props.userinfo) {
      Toast.info("请先登录", 1);
      return;
    }
    if (!tools.checkPhone(this.props.userinfo.mobile)) {
      Toast.info("您没有绑定手机号", 1);
      return;
    }
    me.setState({
      verifyCode: true,
      verifyCodeInfo: `${time}秒后重试`
    });
    me.timer = setInterval(() => {
      time--;
      me.setState({
        // verifyCodeTimer: time,
        verifyCodeInfo: time > 0 ? `${time}秒后重试` : "获取验证码",
        verifyCode: time > 0
      });
      if (time <= 0) {
        clearInterval(me.timer);
      }
    }, 1000);

    me.props.actions
      .getVerifyCode2({ mobile: this.props.userinfo.mobile, countryCode: "86" })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            myVcode: res.data.text
          });
        } else {
          Toast.info(res.message || "验证码获取失败", 1);
        }
      });
  }

  // 提交
  onSubmit() {
    if (!this.state.vcode) {
      Toast.info("请填写验证码", 1);
      return;
    }

    const pathname = this.props.location.pathname.split("/");
    const v = pathname[pathname.length - 1].split("_");
    if (!v || !Number(v[0])) {
      Toast.info("提现金额异常");
      return;
    }

    const params = {
      amount: Number(v[0]), // 提现金额
      verifyCode: this.state.vcode, // 验证码
      countryCode: 86, // 城市码
      partnerTradeNo: v[1] // 提现单号
    };
    this.setState({
      loading: true
    });
    this.props.actions
      .newTiXian2(params)
      .then(res => {
        if (res.status === 200) {
          Toast.success("提现申请成功", 1);
          this.props.history.replace("/profit"); // 回到收益明细页（因为信息改变了，在这个页才能更新信息）
        } else {
          Toast.info(res.message || "提现申请失败", 1);
        }
        this.setState({
          loading: false
        });
      })
      .catch(() => {
        Toast.info("网络错误，请重试");
        this.setState({
          loading: false
        });
      });
  }

  render() {
    return (
      <div
        className="flex-auto page-box page-tixiannow"
        style={{ backgroundColor: "#fff", minHeight: "100vh" }}
      >
        <div className="login-box">
          <div className="logo-info">
            <span className="small">
              将向
              {this.props.userinfo
                ? tools.addMosaic(this.props.userinfo.mobile)
                : ""}
              的手机号发送验证码
            </span>
          </div>
          <div className="input-box">
            <List className="this-list">
              <InputItem
                clear
                placeholder="请输入验证码"
                maxLength={6}
                value={this.state.vcode}
                extra={
                  <span className="btn" onClick={() => this.getVerifyCode()}>
                    {this.state.verifyCodeInfo}
                  </span>
                }
                onChange={e => this.onVcodeInput(e)}
              />
            </List>
          </div>
          <Button
            type="primary"
            className="this-btn"
            disabled={this.state.loading}
            onClick={() => this.onSubmit()}
          >
            全部提现
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
    actions: bindActionCreators({ getVerifyCode2, newTiXian2 }, dispatch)
  })
)(Register);
