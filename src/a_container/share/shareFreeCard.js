/* 分享页 - 优惠卡的分享页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./shareFreeCard.scss";
import tools from "../../util/all";
// ==================
// 所需的所有组件
// ==================

import ImgQrCode from "../../assets/share/qrcode_for_gh.jpg"; // 二维码图标
import ImgZhiWen from "../../assets/share/zhiwen@3x.png"; // 指纹图标
import ImgTitle from "../../assets/share/youhuika@3x.png";
import ImgOut24Hour from "../../assets/favcards/chaoshi@3x.png"; // 超过24小时未领取图标
import ImgOutTime from "../../assets/favcards/yiguoqi@3x.png"; // 卡本身过期图标
import ImgLingQu from "../../assets/favcards/yilingqu@3x.png"; // 已被领取
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
      imgCode: "", // 分享的二维码、
      isExpired: false, // 卡是否超过24小时未领取
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
    /**
         * 单个 和 批量 统一
         * userId: p[0],
         name: p[1],
         head: p[2],
         date: p[3],  有效期
         dateTime: p[4], 分享日期
         type: P[5] 1金卡，2紫卡，3普通卡
         str: p[6] 金卡为公司名，紫卡为“分销版”，普通卡没有
         cardNo: p[7] 分享的卡的No, 分享页面需要传给后台生成动态二维码
         count: p[8] 分享卡的数量
         image:p[9] 卡的背景图
         * **/
    this.setState({
      data: {
        userId: p[0],
        name: decodeURIComponent(p[1]),
        head: decodeURIComponent(p[2]),
        date: decodeURIComponent(p[3]),
        dateTime: Number(p[4]),
        type: Number(p[5]),
        str: decodeURIComponent(p[6]),
        cardNo: decodeURIComponent(p[7]),
        count: p[8],
        image:decodeURIComponent(p[9])
      }
    });

    // userId，分享类型，分享的卡ID，
    this.props.actions
      .shareBuild({
        userId: Number(p[0]),
        shareType: p[7].includes("LIST") ? 4 : 2,
        shareNo: decodeURIComponent(p[7]),
        dateTime: p[4]
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
    console.log('打印d',d)
    const type = this.makeAbnormal();
    return (
      <div className="flex-auto page-sharefreecard">
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
              <div className="name-info">{`送您${d.count ||
                1}张健康风险评估卡`}</div>
            </div>
            <div
              className={(() => {
                const classNames = ["cardbox", "page-flex-col", "flex-jc-sb"];
                if (type !== 0) {
                  switch (d.type) {
                    case 1:
                      classNames.push("no-normal1");
                      break;
                    case 2:
                      classNames.push("no-normal2");
                      break;
                    case 4:
                      classNames.push("no-normal4");
                      break;
                    default:
                      classNames.push("no-normal3");
                  }
                }
                switch (d.type) {
                  case 1:
                    classNames.push("a");
                    break;
                  case 2:
                    classNames.push("b");
                    break;
                  case 4:
                    // classNames.push("c");
                    break;
                }
                return classNames.join(" ");
              })()}
              style={(() => {
                // 如果是京东百度的，那就直接取背景图
                if(d.type == 4){
                  return {
                    backgroundImage: `url(${d.image})`
                  };
                }
                return null;
              })()}
            >
              <div className="row1 flex-none page-flex-row flex-jc-sb">
                <div>
                  <div className="t">&#12288;</div>
                </div>
                {(() => {
                  switch (type) {
                    case 1:
                      return <img className="tip" src={ImgLingQu} />;
                    case 2:
                      return <img className="tip" src={ImgOutTime} />;
                    case 3:
                      return <img className="tip" src={ImgOut24Hour} />;
                    default:
                      return null;
                  }
                })()}
              </div>
              <div className="row-center">
                {(() => {
                  switch (d.type) {
                    case 1:
                      return d.str;
                    case 2:
                      return "";
                    case 3:
                      return "";
                    case 4:
                      return "";
                    default:
                      return "";
                  }
                })()}
              </div>
              <div className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end">
                <div>
                  {String(d.date) === "0" ? null : (
                    <div className="i">
                      有效期至：
                      {d.date}
                    </div>
                  )}
                </div>
                <div className="flex-none">￥1000</div>
              </div>
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
                  进入公众号[我的e家]-[我的优惠卡]中查看。
                </div>
              </div>
            </div>
          </div>
          <div className="code-box">
            <div className="t">长按识别二维码领取优惠卡</div>
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
