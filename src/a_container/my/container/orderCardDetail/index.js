/* 我的订单 - 查看评估卡详情页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";
import tools from "../../../../util/all";
// ==================
// 所需的所有组件
// ==================

import ImgRight from "../../../../assets/xiangyou2@3x.png";
import ImgShareArr from "../../../../assets/share-arr.png";
import Img404 from "../../../../assets/not-found.png";
import { Modal, Toast } from "antd-mobile";
import Config from "../../../../config";

// ==================
// 本页面所需action
// ==================

import {
  mallCardList,
  wxInit,
  saveCardInfo,
  mallOrderHraCard,
  ticketHandsel
} from "../../../../a_action/shop-action";
// ==================
// Definition
// ==================
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null, // 当前页的数据
      wxReady: true, // 微信是否已初始化
      shareShow: false, // 分享提示框是否显示
      which: -1 // 当前选中哪一个进行分享
    };
  }

  componentDidMount() {
    document.title = "评估卡";
    this.getData();
    this.initWeiXinPay();
  }

  // 工具 - 获取已使用了多少张卡
  getHowManyByTicket(list) {
    if (!list) {
      return 0;
    }
    return list.filter(item => item.ticketStatus !== 1).length;
  }

  /**
   * 获取评估卡列表
   * type=falsh 刷新
   * type=update 累加
   * **/
  getData() {
    const pathname = this.props.location.pathname.split("/");
    const id = pathname[pathname.length - 1];
    this.props.actions
      .mallOrderHraCard({ orderId: id, pageNum: 1, pageSize: 99 })
      .then(res => {
        if (res.status === 200) {
          if (res.data.result) {
            this.setState({
              data: res.data.result
            });
          } else {
            this.setState({
              data: []
            });
          }
        } else {
          Toast.info(res.message || "查询评估卡信息失败");
        }
      });
  }

  // 失败
  onFail() {
    this.setState({
      wxReady: false
    });
  }
  // 获取微信初始化所需参数
  initWeiXinPay() {
    // 后台需要给个接口，返回appID,timestamp,nonceStr,signature
    this.props.actions
      .wxInit()
      .then(res => {
        if (res.status === 200) {
          this.initWxConfig(res.data);
        } else {
          this.onFail();
        }
      })
      .catch(() => {
        this.onFail();
      });
  }

  // 初始化微信JS-SDK
  initWxConfig(data) {
    const me = this;
    if (typeof wx === "undefined") {
      console.log("weixin sdk load failed!");
      this.onFail();
      return false;
    }
    console.log("到这里了", data);
    wx.config({
      debug: false,
      appId: Config.appId,
      timestamp: data.timestamp,
      nonceStr: data.noncestr,
      signature: data.signature,
      jsApiList: [
        "onMenuShareTimeline", // 分享到朋友圈
        "onMenuShareAppMessage", // 分享给微信好友
        "onMenuShareQQ" // 分享到QQ
      ]
    });
    wx.ready(() => {
      console.log("微信JS-SDK初始化成功");
      // 如果没有点选，就分享主页
      wx.onMenuShareAppMessage({
        title: "翼猫健康e家",
        desc: "欢迎关注 - 翼猫健康e家 专注疾病早期筛查",
        link: `${Config.baseURL}/gzh`,
        imgUrl: "https://isluo.com/imgs/catlogoheiheihei.png",
        type: "link",
        success: () => {
          Toast.info("分享成功", 1);
        }
      });
      wx.onMenuShareTimeline({
        title: "翼猫健康e家",
        desc: "欢迎关注 - 翼猫健康e家 专注疾病早期筛查",
        link: `${Config.baseURL}/gzh`,
        imgUrl: "https://isluo.com/imgs/catlogoheiheihei.png",
        success: () => {
          Toast.info("分享成功", 1);
        }
      });
    });
    wx.error(e => {
      console.log("微信JS-SDK初始化失败：", e);
      this.onFail();
    });
  }

  // 点击分享按钮，
  onStartShare(obj, index, e) {
    e.stopPropagation();
    const me = this;
    console.log("要分享的信息：", obj, tools.isWeixin());
    if (tools.isWeixin() && this.checkCardStatus(obj) === 1) {
      // 是微信中并且卡的状态正常才能分享
      alert(
        "确认赠送?",
        "赠送后您的卡将转移给对方，您将无法再查看该卡，该赠送24小时内有效",
        [
          { text: "取消", onPress: () => console.log("cancel") },
          {
            text: "确认",
            onPress: () =>
              new Promise((resolve, rej) => {
                /**
                 * 拼凑要带过去的数据
                 * userId - 用户ID
                 * name - 用户名
                 * head - 头像
                 * no - 评估卡号
                 * price - 价格
                 * date - 有效期
                 * **/
                const u = this.props.userinfo;
                const dateTime = new Date().getTime();
                const str = `${u.id}_fff_${encodeURIComponent(
                  u.nickName
                )}_fff_${encodeURIComponent(u.headImg)}_fff_${obj.id}_fff_${
                  obj.cardPrice
                }_fff_${obj.validTime}_fff_${dateTime}`;
                wx.onMenuShareAppMessage({
                  title: `${u.nickName}赠送您一张翼猫HRA健康风险评估卡`,
                  desc:
                    "请您在奋斗的时候不要忘记家人身体健康，关注疾病早期筛查和预防。",
                  link: `${Config.baseURL}/gzh/#/share/${str}`,
                  imgUrl: "https://isluo.com/imgs/catlogoheiheihei.png",
                  type: "link",
                  success: () => {
                    Toast.info("分享成功", 1);
                    me.ticketHandsel({
                      userId: u.id,
                      shareType: 2,
                      shareNo: obj.ticketNo,
                      dateTime
                    });
                  }
                });
                wx.onMenuShareTimeline({
                  title: `${u.nickName}赠送您一张翼猫HRA健康风险评估卡`,
                  desc:
                    "请您在奋斗的时候不要忘记家人身体健康，关注疾病早期筛查和预防。",
                  link: `${Config.baseURL}/gzh/#/share/${str}`,
                  imgUrl: "https://isluo.com/imgs/catlogoheiheihei.png",
                  success: () => {
                    Toast.info("分享成功", 1);
                    me.ticketHandsel({
                      userId: u.id,
                      shareType: 2,
                      shareNo: obj.ticketNo,
                      dateTime
                    });
                  }
                });
                this.setState({
                  shareShow: true,
                  which: index
                });
                resolve();
              })
          }
        ]
      );
    }
  }

  // 点击卡片进入体检券页
  onClickCard(obj) {
    // this.props.actions.saveCardInfo(obj);
    // setTimeout(() => this.props.history.push('/healthy/cardvoucher'), 16);
    this.props.history.push(`/healthy/cardvoucher/${obj.id}`);
  }

  // 工具 - 判断当前评估卡状态（正常1、过期2、已使用3）
  checkCardStatus(item) {
    try {
      const validTime = new Date(`${item.validTime} 23:59:59`).getTime();
      if (validTime - new Date().getTime() < 0) {
        // 已过期
        return 2;
      } else if (item.totalCount - item.useCount <= 0) {
        // 全部用完
        return 3;
      }
      return 1;
    } catch (e) {
      return 1;
    }
  }

  // 工具 - 计算使用了多少张体检券
  useNum(list) {
    let num = 0;
    if (!list) {
      return num;
    }
    list.forEach(item => {
      if (item.ticketStatus !== 1) {
        num++;
      }
    });
    return num;
  }

  // 分享成功后还要调个接口更改状态
  ticketHandsel(params) {
    this.props.actions.ticketHandsel(params).then(res => {
      if (res.status === 200) {
        this.getData();
      }
    });
  }

  render() {
    return (
      <div className="page-ordercarddetail">
        <ul className="the-ul">
          {(() => {
            if (!this.state.data) {
              return (
                <li key={0} className="nodata">
                  加载中...
                </li>
              );
            } else if (this.state.data.length === 0) {
              return (
                <li key={0} className="data-nothing">
                  <img src={Img404} />
                  <div>亲，这里什么也没有哦~</div>
                </li>
              );
            } else {
              return this.state.data.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={
                      this.checkCardStatus(item) === 1
                        ? "cardbox page-flex-col flex-jc-sb"
                        : "cardbox abnormal page-flex-col flex-jc-sb"
                    }
                    onClick={() => this.onClickCard(item)}
                  >
                    <div className="row1 flex-none page-flex-row flex-jc-sb">
                      <div>
                        <div className="t">健康风险评估卡</div>
                        <div className="i">专注疾病早期筛查</div>
                      </div>
                      <div className="flex-none">
                        {item.handselStatus === 1 ? "赠送中 " : null}
                        <img src={ImgRight} />
                      </div>
                    </div>
                    <div
                      className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end"
                      onClick={e => this.onStartShare(item, index, e)}
                    >
                      <div>
                        <div className="t">
                          共{item.totalCount || item.ticketNo}张
                          <span>
                            已使用
                            {item.useCount}张
                          </span>
                        </div>
                        <div className="i">
                          有效期至：
                          {tools.dateformart(item.validTime)}
                        </div>
                      </div>
                      {tools.isWeixin() && item.handselStatus !== 1 ? (
                        <div
                          className={
                            this.state.which === index
                              ? "flex-none share-btn check"
                              : "flex-none share-btn"
                          }
                        >
                          赠送
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              });
            }
          })()}
        </ul>
        <div
          className={this.state.shareShow ? "share-modal" : "share-modal hide"}
          onClick={() => this.setState({ shareShow: false })}
        >
          <img className="share" src={ImgShareArr} />
          <div className="title">点击右上角进行分享</div>
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
    actions: bindActionCreators(
      { mallCardList, wxInit, saveCardInfo, mallOrderHraCard, ticketHandsel },
      dispatch
    )
  })
)(HomePageContainer);
