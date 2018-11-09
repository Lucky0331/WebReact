/* 分享页 - 体检券的分享页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./shareTicket.scss";
import tools from "../../util/all";
// ==================
// 所需的所有组件
// ==================

import ImgQrCode from "../../assets/share/qrcode_for_gh.jpg"; // 二维码图标
import ImgZhiWen from "../../assets/share/zhiwen@3x.png"; // 指纹图标
import ImgTitle from "../../assets/share/zenSongKa.png";
import ImgOut24Hour from "../../assets/share/tuihui@3x.png"; // 超过24小时未领取图标
import ImgOutTime from "../../assets/share/guoqi24@3x.png"; // 卡本身过期图标
import ImgLingQu from "../../assets/share/lingqu@3x.png"; // 已被领取
// ==================
// 本页面所需action
// ==================

import { shareBuild } from "../../a_action/app-action";
// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      productData: {}, // 分享的卡片信息
      imgCode: "", // 分享的二维码、
      isExpired: false, // 卡是否超过24小时
      isReceived: false, // 卡是否已被领取
      isTicketExpired: false // 卡是否已过期
    };
  }

  componentDidMount() {
    document.title = "我的体检券分享";
    this.getData();
  }

  getData() {
    const path = this.props.location.pathname.split("/");
    const pathLast = path[path.length - 1];
    const splitStr = pathLast.includes("_fff_") ? "_fff_" : "_";
    let p = path[path.length - 1].split(splitStr);

    this.setState({
      data: {
        userId: p[0],
        name: decodeURIComponent(p[1]),
        head: decodeURIComponent(p[2]),
        no: p[3],
        date: decodeURIComponent(p[4]),
        dateTime: Number(p[5])
      }
    });

    this.props.actions
      .shareBuild({
        userId: Number(p[0]),
        shareType: 2,
        shareNo: p[3],
        dateTime: p[5]
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            imgCode: res.data.qrcode,
            isExpired: res.data.isExpired,
            isReceived: res.data.isReceived,
            isTicketExpired: res.data.isTicketExpired
          });
        }
      });
  }

  // 各异常状态 0正常，1卡过期，2领取时间超24小时
  makeAbnormal() {
    let abnormal = 0;
    if (this.state.isReceived) {
      // 卡已被领取
      abnormal = 1;
    } else if (this.state.isTicketExpired) {
      // 卡本身已过期
      abnormal = 2;
    } else if (this.state.isExpired) {
      // 超过24小时
      abnormal = 3;
    }
    return abnormal;
  }

  render() {
    const d = this.state.data;
    const type = this.makeAbnormal();

    return (
      <div className="flex-auto page-share-ticket">
        <div className="title-box">
          <img src={ImgTitle} />
        </div>
        <div className="body-box">
          <div className="img-box">
            <div className="head-box">
              <div className="pic">
                <img src={d.head} />
              </div>
              <div className="name">{d.name || "-"}</div>
              <div className="name-info">送您一张健康风险评估卡</div>
            </div>
            <div
              className={
                type !== 0
                  ? "cardbox page-flex-col flex-jc-sb no-normal"
                  : "cardbox page-flex-col flex-jc-sb"
              }
            >
              <div className="row1 flex-none page-flex-row flex-jc-sb">
                <div>
                  <div className="t" />
                </div>
              </div>
              <div className="row-center page-flex-row flex-jc-end">
                <div />
              </div>
              <div className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end">
                <div>
                  <div className="i">
                    有效期至：
                    {d.date}
                  </div>
                </div>
                <div className="flex-none">￥1000</div>
              </div>
              {(() => {
                switch (type) {
                  case 1:
                    return <img className="card-state" src={ImgLingQu} />;
                  case 2:
                    return <img className="card-state" src={ImgOutTime} />;
                  case 3:
                    return <img className="card-state" src={ImgOut24Hour} />;
                  default:
                    return null;
                }
              })()}
            </div>
            <div className={"info-box"}>
              {this.state.data.dateTime ? (
                <div className="page-flex-row">
                  <div className="flex-none">限时领取：</div>
                  <div className="flex-auto">
                    {tools.dateToStrMin(
                      new Date(this.state.data.dateTime + 86400000)
                    )}
                    之前可领取
                  </div>
                </div>
              ) : null}
              <div className="page-flex-row">
                <div className="flex-none">查看方式：</div>
                <div className="flex-auto">
                  进入公众号[健康管理]-[我的评估卡]中查看。
                </div>
              </div>
            </div>
          </div>
          <div className="code-box">
            <div className="t">长按识别二维码领取赠送卡</div>
            <div className="codes page-flex-row flex-jc-center">
              <div>
                <img src={this.state.imgCode || ImgQrCode} />
                <img className="head" src={d.head} />
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

HomePageContainer.propTypes = {
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
    actions: bindActionCreators({ shareBuild }, dispatch)
  })
)(HomePageContainer);
