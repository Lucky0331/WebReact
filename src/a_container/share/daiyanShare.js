/* 我的代言卡 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../util/all";

import "./daiyanShare.scss";
// ==================
// 所需的所有组件
// ==================

import Img from "../../assets/share/daiyanka.png";
import ImgCyan from "../../assets/share/y_cyan.png";
import ImgGreen from "../../assets/share/y_green.png";
import ImgBlue from "../../assets/share/y_blue.png";
import ImgOrange from "../../assets/share/y_orange.png";

import ImgLCyan from "../../assets/share/l_cyan.png";
import ImgLGreen from "../../assets/share/l_green.png";
import ImgLBlue from "../../assets/share/l_blue.png";
import ImgLOrange from "../../assets/share/l_orange.png";

import ImgQrCode from "../../assets/share/qrcode_for_gh.jpg"; // 二维码图标
import ImgZhiWen from "../../assets/share/zhiwen@3x.png";
// ==================
// 本页面所需action
// ==================

import { shareBuild } from "../../a_action/app-action";
import { getShareInfo } from "../../a_action/shop-action";
// ==================
// Definition
// ==================

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgCode: "",
      data: {},
      d1: {}, // 从后台获取的信息
      type: null
    };
  }

  componentWillUnmount() {}

  componentDidMount() {
    document.title = "我的代言卡分享";
    this.getCode();
    this.getShareInfo();
  }

  // 获取分享所需内容
  getShareInfo() {
    const pathname = this.props.location.pathname.split("/");
    const pathLast = pathname[pathname.length - 1];
    const splitStr = pathLast.includes("_fff_") ? "_fff_" : "_";
    const info = pathname[pathname.length - 1].split(splitStr);
    const t = Number(info[3]);
    this.setState({
      type: t || null
    });

    if (t) {
      this.props.actions.getShareInfo({ speakCardId: t }).then(res => {
        if (res.status === 200) {
          this.setState({
            d1: res.data
          });
        }
      });
    }
  }

  // 获取二维码图片
  getCode() {
    const pathname = this.props.location.pathname.split("/");
    const pathLast = pathname[pathname.length - 1];
    const splitStr = pathLast.includes("_fff_") ? "_fff_" : "_";
    const temp = pathname[pathname.length - 1].split(splitStr);

    /**
     * userid - 用户ID
     * name - 名字
     * head - 头像
     * type - 是哪种类型的代言卡
     * **/
    this.setState({
      data: {
        userid: temp[0],
        name: temp[1],
        head: temp[2]
      }
    });
    this.props.actions
      .shareBuild({ userId: temp[0], shareType: 0 })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            imgCode: res.data.qrcode
          });
        }
      });
  }

  render() {
    const d = this.state.data;
    const d1 = this.state.d1;
    console.log("d1是各什么：", d1);
    return (
      <div
        className="flex-auto page-box page-daiyankashare"
        style={{ minHeight: "100vh", backgroundImage: `url(${d1.backImage})` }}
      >
        <div className="body-box">
          <div className="head-box">
            <div className="pic">
              <img src={decodeURIComponent(d.head)} />
            </div>
            <div className="name" style={{ color: d1.colorOne || "#fff" }}>
              {decodeURIComponent(d.name) || "-"}
            </div>
            <div className="name-info" style={{ color: d1.colorOne || "#fff" }}>
              {d1.title}
            </div>
          </div>
          <div className="img-box">
            {d1.contentImage ? (
              <img className="img" src={d1.contentImage} />
            ) : null}
          </div>
          <div className="code-box">
            <div className="t">长按识别二维码接受邀请</div>
            <div className="codes page-flex-row flex-jc-center">
              <div>
                <img src={this.state.imgCode || ImgQrCode} />
                <img className="head" src={decodeURIComponent(d.head)} />
              </div>
              <div>
                <img src={ImgZhiWen} />
              </div>
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
    actions: bindActionCreators({ shareBuild, getShareInfo }, dispatch)
  })
)(Register);
