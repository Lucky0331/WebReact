/**
 * 嵌在其他页面中的模版
 * **/

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./shareHra.scss";
// ==================
// 所需的所有组件
// ==================
import ImgTitle from "../../assets/share/han@3x.png";
import ImgDefault from "../../assets/logo-img.png";
//import ImgQrCode from '../../assets/share/qrcode_for_gh.jpg';   // 二维码图标
import ImgQrCode from "../../assets/share/qrcode_test.jpg"; // 二维码图标
import ImgZhiWen from "../../assets/share/zhiwen@3x.png";
// ==================
// 本页面所需action
// ==================

import { shareBuild, getUserInfo } from "../../a_action/app-action";

// ==================
// Definition
// ==================

class Register extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imgCode: "",
      id: "",
      headImg: null,
      nickName: ""
    };
  }

  UNSAFE_componentWillMount() {
    // 处理location中的数据 id_nickName_headImg
    const pathname = this.props.location.pathname.split("/");
    const p = pathname[pathname.length - 1];
    if (Number(p)) {
      // 获取到了信息
      this.setState({
        id: Number(p)
      });
    }
  }

  componentDidMount() {
    this.getCode(this.state.id);
    if (this.state.id) {
      this.getUserInfo(this.state.id);
    }
  }

  // 获取二维码图片
  getCode(userId) {
    this.props.actions.shareBuild({ userId, shareType: 0 }).then(res => {
      if (res.status === 200) {
        this.setState({
          imgCode: res.data.qrcode
        });
      }
    });
  }

  // 获取头像和昵称
  getUserInfo(userId) {
    this.props.actions.getUserInfo({ userId }).then(res => {
      if (res.status === 200) {
        this.setState({
          headImg: res.data.headImg,
          nickName: res.data.nickName
        });
      }
    });
  }

  render() {
    return (
      <div
        className="flex-auto page-box page-sharehra"
        style={{ minHeight: "100vh" }}
      >
        <div className="title">
          {this.state.id
            ? "本页包含您的专属二维码，快快转发分享给您的好友吧"
            : "好东西别忘了分享哦！快快转发分享给您的好友吧"}
        </div>
        <div className="info-box">
          <img className="t" src={ImgTitle} />
          <div className="head-box">
            <img className="head" src={this.state.headImg || ImgDefault} />
            <div className="line" />
            <div className="circle-left" />
            <div className="circle-right" />
          </div>
          <div className="info">
            <span>[{this.state.nickName || "健康e家"}]</span>
            邀请您关注更多健康资讯
          </div>
          <div className="info">长按识别二维码接受邀请</div>
          <div className="codes page-flex-row flex-jc-center">
            <div>
              <img
                src={this.state.imgCode || ImgQrCode}
                style={{ position: "absolute", zIndex: 9999 }}
              />
              {this.state.headImg && (
                <img className="head" src={this.state.headImg} />
              )}
            </div>
            <div>
              <img src={ImgZhiWen} />
            </div>
          </div>
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
  actions: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({ shareBuild, getUserInfo }, dispatch)
  })
)(Register);
