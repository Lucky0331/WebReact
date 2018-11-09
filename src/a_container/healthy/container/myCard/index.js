/* 健康管理 - 我的评估卡 */

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
import Luo from "iscroll-luo";
import ImgRight from "../../../../assets/xiangyou2@3x.png";
import ImgShareArr from "../../../../assets/share-arr.png";
import Img404 from "../../../../assets/not-found.png";
import ImgGuoQi from "../../../../assets/share/yiguoqi@3x.png";
import ImgShiYong from "../../../../assets/share/yishiyong@3x.png";
import { Toast, SwipeAction, List, Modal } from "antd-mobile";
import Config from "../../../../config";

// ==================
// 本页面所需action
// ==================

import {
  mallCardList,
  wxInit,
  saveCardInfo,
  saveMyCardInfo,
  mallCardDel,
  mallCardListQuan,
  ticketHandsel
} from "../../../../a_action/shop-action";
// ==================
// Definition
// ==================
const Item = List.Item;
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wxReady: true, // 微信是否已初始化
      shareShow: false, // 分享提示框是否显示
      which: -1 // 当前选中哪一个进行分享
    };
  }

  componentDidMount() {
    document.title = "我的评估卡";
    if (!this.props.myCard.data || !this.props.myCard.data.length) {
      this.getData();
    }
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
   * type=flash 刷新
   * type=update 累加
   * **/
  getData(pageNum = 1, pageSize = 10, type) {
    Toast.loading("搜索中...", 0);
    this.props.actions
      .mallCardList({ pageNum, pageSize })
      .then(res => {
        if (res.status === 200) {
          console.log("我的评估卡：", res.data.result);
          Toast.hide();
          if (!res.data || !res.data.result || res.data.result.length === 0) {
            if (type === "update") {
              Toast.info("没有更多数据了", 1);
            } else {
              Toast.hide();
            }

            this.props.actions.saveMyCardInfo(
              type === "flash" ? [] : this.props.myCard.data,
              this.props.myCard.pageNum,
              this.props.myCard.pageSize,
              this.props.myCard.total
            );
            return;
          }
          this.props.actions.saveMyCardInfo(
            type === "update"
              ? [...this.props.myCard.data, ...res.data.result]
              : res.data.result,
            pageNum,
            pageSize,
            res.data.total
          );
        } else {
          Toast.info(res.message || "数据加载失败", 1);
          this.props.actions.saveMyCardInfo(
            this.props.myCard.data,
            this.props.myCard.pageNum,
            this.props.myCard.pageSize,
            this.props.myCard.total
          );
        }
      })
      .catch(() => {
        Toast.info("网络错误，请稍后");
        this.props.actions.saveMyCardInfo(
          this.props.myCard.data,
          this.props.myCard.pageNum,
          this.props.myCard.pageSize,
          this.props.myCard.total
        );
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
        console.log("返回的是什么：", res);
        if (res.status === 200) {
          console.log("走这里：", res);
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

  // 点击分享按钮，需判断是否是原生系统
  onStartShare(obj, index, e) {
    const me = this;
    e.stopPropagation();
    console.log("要分享的信息：", obj);
    if (tools.isWeixin() && obj.handsel) {
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
                 * dateTime - 分享的时间（通过此时间来判断过期）
                 * **/
                const u = this.props.userinfo;
                const dateTime = new Date().getTime();
                const str = `${u.id}_fff_${encodeURIComponent(
                  u.nickName
                )}_fff_${encodeURIComponent(u.headImg)}_fff_${obj.id}_fff_${
                  obj.cardPrice
                }_fff_${encodeURIComponent(obj.validTime)}_fff_${dateTime}`;
                wx.onMenuShareAppMessage({
                  title: `${u.nickName}赠送您一张翼猫HRA健康风险评估卡`,
                  desc:
                    "请您在奋斗的时候不要忘记家人身体健康，关注疾病早期筛查和预防。",
                  link: `${Config.baseURL}/gzh/?#/share/${str}`,
                  imgUrl: "https://isluo.com/imgs/catlogoheiheihei.png",
                  type: "link",
                  success: () => {
                    Toast.info("分享成功", 1);
                    me.ticketHandsel({
                      userId: u.id,
                      shareType: 1,
                      shareNo: obj.id,
                      dateTime
                    });
                  }
                });
                wx.onMenuShareTimeline({
                  title: `${u.nickName}赠送您一张翼猫HRA健康风险评估卡`,
                  desc:
                    "请您在奋斗的时候不要忘记家人身体健康，关注疾病早期筛查和预防。",
                  link: `${Config.baseURL}/gzh/?#/share/${str}`,
                  imgUrl: "https://isluo.com/imgs/catlogoheiheihei.png",
                  success: () => {
                    Toast.info("分享成功", 1);
                    me.ticketHandsel({
                      userId: u.id,
                      shareType: 1,
                      shareNo: obj.id,
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

  // 分享成功后还要调个接口更改状态
  ticketHandsel(params) {
    this.props.actions.ticketHandsel(params).then(res => {
      if (res.status === 200) {
        this.onDown();
      }
    });
  }
  // 点击卡片进入体检券页
  onClickCard(obj) {
    // this.props.actions.saveCardInfo(obj);
    // setTimeout(() => this.props.history.push('/healthy/cardvoucher'), 16);
    this.props.history.push(`/healthy/cardvoucher/${obj.id}`);
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

  // 下拉刷新
  onDown() {
    console.log("触发");
    this.getData(1, this.props.myCard.pageSize, "flash");
  }
  // 上拉加载
  onUp() {
    this.getData(
      this.props.myCard.pageNum + 1,
      this.props.myCard.pageSize,
      "update"
    );
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

  // 删除评估卡
  onDelete(item) {
    console.log("是什么：", item);
    if (item.ticketNum - item.useCount > 0) {
      Toast.info("存在未使用的卡，不可以删除哦");
      return;
    }
    alert("确认删除评估卡?", "删除后将无法再查看该评估卡", [
      { text: "取消", onPress: () => console.log("cancel") },
      {
        text: "确认",
        onPress: () =>
          new Promise((resolve, rej) => {
            this.props.actions
              .mallCardDel({
                cardId: item.id
              })
              .then(res => {
                if (res.status === 200) {
                  Toast.success("删除成功");
                  this.getData(
                    this.props.myCard.pageNum,
                    this.props.myCard.pageSize,
                    "flash"
                  );
                } else {
                  Toast.info(res.message || "删除失败，请重试");
                }
                resolve();
              })
              .catch(() => {
                rej();
              });
          })
      }
    ]);
  }
  render() {
    return (
      <div className="page-mycard">
        <List>
          <Item extra={`总计：${this.props.myCard.total}张`}>评估卡</Item>
        </List>
        <div className="luo-box">
          <Luo
            id="luo1"
            className="touch-none"
            onPullDownRefresh={() => this.onDown()}
            onPullUpLoadMore={() => this.onUp()}
            iscrollOptions={{
              disableMouse: false
            }}
          >
            <div className="the-ul">
              {(() => {
                if (!this.props.myCard.data) {
                  return (
                    <div key={0} className="nodata">
                      加载中...
                    </div>
                  );
                } else if (this.props.myCard.data.length === 0) {
                  return (
                    <div key={0} className="data-nothing">
                      <img src={Img404} />
                      <div>亲，这里什么也没有哦~</div>
                    </div>
                  );
                } else {
                  return this.props.myCard.data.map((item, index) => {
                    return (
                      <SwipeAction
                        style={{ backgroundColor: "transparent" }}
                        key={index}
                        autoClose
                        disabled={true}
                        right={[
                          {
                            text: "删除",
                            onPress: () => this.onDelete(item),
                            style: {
                              backgroundColor: "transparent",
                              color: "#f00",
                              padding: "0 10px"
                            }
                          }
                        ]}
                      >
                        <div
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
                              {item.handselStatus === 1 ? "赠送中 " : null}￥
                              {item.cardPrice}
                            </div>
                            {(() => {
                              const type = this.checkCardStatus(item);
                              if (type === 2) {
                                // 已过期
                                return <img className="tip" src={ImgGuoQi} />;
                              } else if (type === 3) {
                                // 全部用完
                                return <img className="tip" src={ImgShiYong} />;
                              } else if (type === 4) {
                              }
                              return null;
                            })()}
                          </div>
                          <div className="row-center page-flex-row flex-jc-end">
                            <div className="flex-none">
                              <img src={ImgRight} />
                            </div>
                          </div>
                          <div
                            className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end"
                            onClick={e => this.onStartShare(item, index, e)}
                          >
                            <div>
                              <div className="t">
                                共{item.totalCount}张
                                <span>
                                  已使用
                                  {item.useCount}张
                                </span>
                              </div>
                              <div className="i">
                                有效期至：
                                {item.validTime}
                              </div>
                            </div>
                            {tools.isWeixin() && item.handsel ? (
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
                        </div>
                      </SwipeAction>
                    );
                  });
                }
              })()}
            </div>
          </Luo>
        </div>
        <div
          className={this.state.shareShow ? "share-modal" : "share-modal hide"}
          onClick={() => this.setState({ shareShow: false })}
        >
          <img className="share" src={ImgShareArr} />
          <div className="title">点击右上角进行赠送</div>
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
  userinfo: P.any,
  myCard: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    userinfo: state.app.userinfo,
    myCard: state.shop.myCard
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        mallCardList,
        wxInit,
        saveCardInfo,
        saveMyCardInfo,
        mallCardDel,
        mallCardListQuan,
        ticketHandsel
      },
      dispatch
    )
  })
)(HomePageContainer);
