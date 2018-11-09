/* 我的e家 - 主页 - 个人信息 */

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
import { Button, Toast } from "antd-mobile";

import ImgRight from "../../../../assets/xiangyou@3x.png";
import defaultPic from "../../../../assets/default-head.jpg";
// ==================
// 本页面所需action
// ==================

import { getUserInfo, logout, unBindWx } from "../../../../a_action/app-action";

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.title = "个人信息";
    if (!this.props.userinfo) {
      this.getUserInfo();
    }
  }

  // 获取当前登录用户的相关信息
  getUserInfo() {
    const openId = sessionStorage.getItem("openId");
    if (openId) {
      this.props.actions.getUserInfo({ openId });
    }
  }

  // 退出登录
  onLogOut() {
    this.props.actions.logout({ userId: this.props.userinfo.id });
    sessionStorage.removeItem("userinfo"); // 清除用户信息
    localStorage.removeItem("userlogininfo"); // 清除缓存的用户帐号和密码
    sessionStorage.removeItem("openId"); // 清除保存的openId
    setTimeout(() => {
      this.props.history.replace("/login");
    });
  }

  // 点击绑定经销商按钮
  onBindDealear() {
    const u = this.props.userinfo;
    if (!u) {
      Toast.info("请先登录", 1);
      this.props.history.replace("/login");
      return false;
    }
    if (u.disUser && [0, 1, 2, 5, 6].indexOf(u.userType) >= 0) {
      // 已绑定经销商
      Toast.info("您已是经销商用户", 1);
    } else {
      // 不是经销商就跳转到经销商绑定页
      this.props.history.push("/my/binddealer");
    }
  }

  // 点击设置密码按钮
  onSetPassword() {
    const u = this.props.userinfo;
    if (!u) {
      Toast.info("请先登录", 1);
      this.props.history.replace("/login");
      return false;
    }
    if (!u.mobile) {
      Toast.info("请先绑定手机号", 1);

      this.props.history.push("/my/bindphone/password");
      return false;
    }
    if (u.disUser && [0, 1, 2].indexOf(u.userType) >= 0) {
      // 如果是经销商用户或已设置过密码的普通用户，就不能进入
      Toast.info("您是经销商，无需设置密码", 1);
      return false;
    } else {
      this.props.history.push("/my/setpassword");
    }
  }

  // 点击绑定手机号
  onBindPhone() {
    const u = this.props.userinfo;
    if (!u) {
      Toast.info("请先登录", 1);
      this.props.history.replace("/login");
      return false;
    } else if (u.mobile) {
      Toast.info("已绑定过手机号", 1);
      return false;
    }
    this.props.history.push("/my/bindphone");
  }

  // 解除绑定微信
  onUnBdingWx() {
    const u = this.props.userinfo;
    if (!u && !u.openid) {
      Toast.info("未获取到您的微信信息", 1);
      return false;
    }
    this.props.actions.unBindWx({ userId: u.id }).then(res => {
      if (res.status === 200) {
        Toast.success("解绑成功", 1);
      } else {
        Toast.info(res.message, 1);
      }
    });
  }

  // 点击收货地址
  onAddrClick() {
    this.props.history.push("/my/addr/1"); // 1表示是普通的收货地址管理，2表示是从商品进入的选择收货地址
  }

  render() {
    const u = this.props.userinfo;
    console.log("u是什么：", u);
    return (
      <div className="userinfo-main">
        {/* 下方各横块 */}
        <div className="bar-list">
          <div className="item all_active">
            <Link to="/my/perinfo" className="page-flex-row">
              <div className="title">基本信息</div>
              <div className="photo">
                <img src={u && u.headImg ? u.headImg : defaultPic} />
              </div>
              <div className="line" />
            </Link>
          </div>
          <div
            className="item page-flex-row all_active mt"
            onClick={() => this.onAddrClick()}
          >
            <div className="title">收货地址</div>
            <div className="info mr" />
            <div className="arrow">
              <img src={ImgRight} />
            </div>
            <div className="line" />
          </div>
          <div className="item page-flex-row all_active">
            <div className="title">e家号</div>
            <div className="info mr">{u ? u.id : ""}</div>
            <div className="line" />
          </div>
          {/*<div className="item page-flex-row all_active" onClick={() => this.onBindDealear()}>*/}
          {/*<div className="title">绑定经销商账户</div>*/}
          {/*<div className={u && u.disUser ? "info mr" : 'info'}>{(u && u.disUser) ? u.userName : ''}</div>*/}
          {/*{u && u.disUser ? null : <div className="arrow"><img src={ImgRight} /></div>}*/}
          {/*<div className="line"/>*/}
          {/*</div>*/}
          <div
            className="item page-flex-row all_active"
            onClick={() => this.onBindPhone()}
          >
            <div className="title">绑定手机号</div>
            <div className={u && u.mobile ? "info mr" : "info"}>
              {u ? u.mobile : ""}
            </div>
            {u && u.mobile ? null : (
              <div className="arrow">
                <img src={ImgRight} />
              </div>
            )}

            <div className="line" />
          </div>
          {/*<div className="item page-flex-row all_active" onClick={() => this.onSetPassword()}>*/}
          {/*<div className="title">密码设置</div>*/}
          {/*<div className="arrow"><img src={ImgRight} /></div>*/}
          {/*<div className="line"/>*/}
          {/*</div>*/}
          {/*{*/}
          {/*u && u.openid ? (*/}
          {/*<div className="item page-flex-row all_active mt" onClick={() => this.onUnBdingWx()}>*/}
          {/*<div className="title">解绑微信</div>*/}
          {/*<div className="info"></div>*/}
          {/*<div className="arrow"><img src={ImgRight} /></div>*/}
          {/*<div className="line"/>*/}
          {/*</div>*/}
          {/*) : null*/}
          {/*}*/}
        </div>
        {/*{*/}
        {/*tools.isWeixin() ? (*/}
        {/*<div className="thefooter">*/}
        {/*<Button type="default" onClick={() => this.onLogOut()}>退出登录</Button>*/}
        {/*</div>*/}
        {/*) : null*/}
        {/*}*/}
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
    actions: bindActionCreators({ getUserInfo, logout, unBindWx }, dispatch)
  })
)(HomePageContainer);
