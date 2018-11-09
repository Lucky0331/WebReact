/* 我的代言卡详情 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./daiyanh5Share.scss";
// ==================
// 所需的所有组件
// ==================

import ImgQrCode from "../../assets/share/qrcode_for_gh.jpg"; // 二维码图标
// ==================
// 本页面所需action
// ==================

import { wxInit, getShareInfo } from "../../a_action/shop-action";
import { shareBuild } from "../../a_action/app-action";
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
    document.title = "我的宣传卡分享";
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
    return (
      <div className="page-daiyankah5share">
        <iframe
          className="body-box"
          wmode="transparent"
          src={d1.speakCardUrl}
        />
        <div className="code-box">
          <div className="codes page-flex-row flex-jc-center">
            <div>
              <img src={this.state.imgCode || ImgQrCode} />
              <img className="head" src={decodeURIComponent(d.head)} />
            </div>
          </div>
          <div className="t">
            长按识别二维码
            <br />
            了解更多精彩
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
    actions: bindActionCreators({ wxInit, shareBuild, getShareInfo }, dispatch)
  })
)(Register);
