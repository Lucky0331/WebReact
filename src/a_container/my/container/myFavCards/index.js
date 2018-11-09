/*  我的优惠卡 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Checkbox } from "antd-mobile";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";
import tools from "../../../../util/all";
import _ from "lodash";
// ==================
// 所需的所有组件
// ==================
import Luo from "iscroll-luo";
import ImgRight from "../../../../assets/xiangyou2@3x.png";
import ImgShareArr from "../../../../assets/share-arr.png";
import Img404 from "../../../../assets/not-found.png";
import ImgGuoQi from "../../../../assets/favcards/guoqi@3x.png";
import ImgGuoQiKa from "../../../../assets/favcards/ka3_no@3x.png";
import ImgShiYong from "../../../../assets/favcards/shiyong@3x.png";
import ImgChose from "../../../../assets/chose@3x.png";
import { Tabs, Toast, List, Modal, Badge, SwipeAction } from "antd-mobile";
import Config from "../../../../config";

// ==================
// 本页面所需action
// ==================

import {
  wxInit,
  queryListFree,
  saveFreeCardInfo,
  ticketHandsel,
  ticketHandselMany,
  createMcardList,
  wxPay,
  getSendCount,
  batchShare,
  mallQuanDel
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
      data: [
        {
          title: "待支付",
          data: [],
          type: 3,
          badge: true,
          pageNum: 1,
          total: 0
        },
        {
          title: "待使用",
          data: [],
          type: 1,
          badge: true,
          pageNum: 1,
          total: 0
        },
        {
          title: "已使用",
          data: [],
          type: 2,
          badge: true,
          pageNum: 1,
          total: 0
        },
        {
          title: "已赠出",
          data: [],
          type: 5,
          badge: true,
          pageNum: 1,
          total: 0
        },
        {
          title: "已过期",
          data: [],
          type: 4,
          badge: true,
          pageNum: 1,
          total: 0
        }
      ],
      nPay: 0, // 可以批量支付的数量
      canSendNum: 0, // 可以批量赠送的数量 待支付
      canSendNum2: 0, // 可以批量赠送的数量 服了 牛逼啊 待使用
      loading: false, // 是否正在支付中
      wxReady: true, // 微信是否已初始化
      ticketPrice: 50, // 优惠卡的价格 以得到数据的第1个为准 没有就是50
      tabIndex: 0, // 当前选择了哪一个tab页 非受控
      pageSize: 10,
      shareShow: false, // 分享提示框是否显示
      whichShare: -1, // 当前选中哪一个进行分享
      search: null,
      btn1Show: false, // 批量赠送模态框 是否显示
      btn2Show: false, // 批量支付模态框 是否显示
      modal1Num: "", // 批量赠送数量
      modal2Num: "", // 批量支付数量
      modal1Check: false, // 批量赠送全选是否选中
      modal2Check: false // 批量支付全选是否选中
    };
    this.s3data = null;
    this.s4data = null;
  }

  componentDidMount() {
    document.title = "我的优惠卡";
    let p = this.props.location.pathname.split("/");
    p = p[p.length - 1];
    const arr = p.split("_");
    let search = null;
    if (arr[0] === "fav") {
      // 来自我的订单优惠卡点击进入
      search = arr[1];
      this.setState({
        tabIndex: 1
      });
      this.getData(1, this.state.pageSize, "flash", search, 1);
    }
    this.getData(
      1,
      this.state.pageSize,
      "flash",
      search,
      this.state.data[0].type
    );
    this.setState({
      search,
      tabIndex: 0
    });
    this.initWeiXinPay();
    this.getSendCount(search);
  }

  componentWillUnmount() {
    Toast.hide();
  }

  // 获取有多少张可赠送的优惠卡
  getSendCount() {
    this.props.actions.getSendCount({ ticketStatus: 3 }).then(res => {
      if (res.status === 200) {
        this.setState({
          canSendNum: res.data
        });
      }
    });
    this.props.actions.getSendCount({ ticketStatus: 1 }).then(res => {
      if (res.status === 200) {
        this.setState({
          canSendNum2: res.data
        });
      }
    });
  }

  /**
   * 获取数据
   * @param pageNum
   * @param pageSize
   * @param type flash刷新，update加载更多
   * @param search 来自我的订单优惠卡查询，会有值
   * @param which 是哪一个tab页获取数据
   */
  getData(
    pageNum = 1,
    pageSize = 10,
    type = "flash",
    search = null,
    which = 1
  ) {
    console.log("searh是什么2：", this.props.location, search);
    const u = this.props.userinfo || {};
    const params = {
      userId: u.id,
      pageNum,
      pageSize,
      orderId: search,
      ticketStatus: which
    };
    Toast.loading("请稍后...", 0);
    this.props.actions
      .queryListFree(tools.clearNull(params))
      .then(res => {
        if (res.status === 200) {
          // 获得是哪一个tab的数据
          const temp = _.cloneDeep(this.state.data);
          let ticketPrice = this.state.ticketPrice;
          // 更新各数量
          // temp[0].total = res.data.nPay;
          temp[1].total = res.data.yPay;
          temp[2].total = res.data.yUse;
          temp[3].total = res.data.yGive;
          temp[4].total = res.data.yPast;
          if (
            !res.data ||
            !res.data.ticketList ||
            !res.data.ticketList.result ||
            res.data.ticketList.result.length === 0
          ) {
            if (type === "update") {
              Toast.info("没有更多数据了", 1);
            } else {
              Toast.hide();
            }
          } else {
            for (let i = 0; i < temp.length; i++) {
              if (temp[i].type === which) {
                temp[i].data =
                  type === "flash"
                    ? res.data.ticketList.result
                    : [...temp[i].data, ...res.data.ticketList.result];
                temp[i].pageNum = pageNum;
                temp[i].total = res.data.total;
                break;
              }
            }
            ticketPrice = res.data.ticketList.result[0].ticketPrice;
          }
          console.log("所以TMD怎么回事", temp[1].total);
          this.setState({
            data: temp,
            ticketPrice,
            nPay: res.data.nPay
          });
          Toast.hide();
        } else {
          Toast.info(res.message || "数据加载失败", 1);
          this.setState({
            data: this.state.data
          });
        }
      })
      .catch(() => {
        Toast.hide();
      });
  }

  // Tab切换时触发
  onTabsChange(tab, index) {
    const which = tab.type;
    const t = this.state.data.find(item => item.type === which);
    // this.props.actions.gotoFavCardType(index);
    this.setState({
      tabIndex: index,
      btn1Show: false, // 批量赠送模态框 是否显示
      btn2Show: false // 批量支付模态框 是否显示
    });
    if (t.data.length === 0) {
      this.getData(1, this.state.pageSize, "flash", this.state.search, which);
    }
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
    console.log("what fuck?", data);
    if (typeof wx === "undefined") {
      this.onFail();
      return false;
    }
    console.log("到这里了", data);
    return new Promise((res, rej) => {
      wx.config({
        debug: false,
        appId: data.appid,
        timestamp: data.timestamp,
        nonceStr: data.noncestr,
        signature: data.signature,
        jsApiList: [
          "onMenuShareTimeline", // 分享到朋友圈
          "onMenuShareAppMessage", // 分享给微信好友
          "onMenuShareQQ", // 分享到QQ
          "chooseWXPay" // 微信支付
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
            this.setState({
              shareShow: false
            });
          },
        });
        wx.onMenuShareTimeline({
          title: "翼猫健康e家",
          desc: "欢迎关注 - 翼猫健康e家 专注疾病早期筛查",
          link: `${Config.baseURL}/gzh`,
          imgUrl: "https://isluo.com/imgs/catlogoheiheihei.png",
          success: () => {
            Toast.info("分享成功", 1);
            this.setState({
              shareShow: false
            });
          }
        });
        res(true);
      });
      wx.error(e => {
        console.log("微信JS-SDK初始化失败：", e);
        rej(false);
        this.onFail();
      });
    });
  }

  // 点击分享按钮
  onStartShare(obj, indexSrc, e) {
    e.stopPropagation();
    const me = this;
    if (obj.handsel) {
      // 卡的状态正常才能分享
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
                       * 用户ID_昵称_头像_有效期_分享日期_卡类型_类型信息
                       * userId: p[0],
                       name: p[1],
                       head: p[2],
                       date: p[3],  有效期
                       dateTime: p[4], 分享日期
                       type: P[5] 1金卡，2紫卡，3普通卡
                       str: p[6] 金卡为公司名，紫卡为“分销版”，普通卡没有
                       cardNo: p[7] 分享的卡的No, 分享页面需要传给后台生成动态二维码
                        count: p[8] 分享几张卡，单张就为1
                       * **/
                const u = this.props.userinfo;
                const dateTime = new Date().getTime();
                const str = `${u.id}_fff_${encodeURIComponent(
                  u.nickName
                )}_fff_${encodeURIComponent(
                  u.headImg
                )}_fff_${encodeURIComponent(
                  obj.validEndTime.split(" ")[0]
                )}_fff_${dateTime}_fff_${
                  obj.ticketStyle
                }_fff_${encodeURIComponent(
                  obj.ticketContent
                )}_fff_${encodeURIComponent(obj.ticketNo)}_fff_1_fff_${encodeURIComponent(
                    obj.image
                )}`;
                wx.onMenuShareAppMessage({
                  title: `${u.nickName}赠送您一张翼猫HRA健康风险评估优惠卡`,
                  desc:
                    "请您在奋斗的时候不要忘记家人身体健康，关注疾病早期筛查和预防。",
                  link: `${Config.baseURL}/gzh/?#/sharefreecard/${str}`,
                  imgUrl: "https://isluo.com/imgs/catlogoheiheihei.png",
                  type: "link",
                  success: () => {
                    Toast.info("分享成功", 1);
                    this.setState({
                      shareShow: false
                    });
                    me.ticketHandsel({
                      userId: u.id,
                      shareType: 2,
                      shareNo: obj.ticketNo,
                      dateTime
                    });
                  },
                });
                wx.onMenuShareTimeline({
                  title: `${u.nickName}赠送您一张翼猫HRA健康风险评估优惠卡`,
                  desc:
                    "请您在奋斗的时候不要忘记家人身体健康，关注疾病早期筛查和预防。",
                  link: `${Config.baseURL}/gzh/?#/sharefreecard/${str}`,
                  imgUrl: "https://isluo.com/imgs/catlogoheiheihei.png",
                  success: () => {
                    Toast.info("分享成功", 1);
                    this.setState({
                      shareShow: false
                    });
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
                  whichShare: indexSrc
                });
                resolve();
              })
          }
        ]
      );
    }
  }

  // 点击批量赠送分享确定
  onStartShareMany() {
    const me = this;
    const num = this.state.modal1Num;
    if (
      !num ||
      (this.state.tabIndex === 0
        ? this.state.canSendNum
        : this.state.canSendNum2) < num
    ) {
      Toast.info("请输入有效数量", 1);
      return;
    }
    /**
         * 拼凑要带过去的数据
         * 用户ID_昵称_头像_有效期_分享日期_卡类型_类型信息
         userId: p[0], 用户ID
         name: p[1], 昵称
         head: p[2], 头像
         dateTime: p[3], 分享的日期
         num: p[4], 分享的数量
         cardNo: p[5] 分享的卡的No, 分享页面需要传给后台生成动态二维码

     * 用户ID_昵称_头像_有效期_分享日期_卡类型_类型信息
     * userId: p[0],
     name: p[1],
     head: p[2],
     date: p[3],  有效期
     dateTime: p[4], 分享日期
     type: P[5] 1金卡，2紫卡，3普通卡
     str: p[6] 金卡为公司名，紫卡为“分销版”，普通卡没有
     cardNo: p[7] 分享的卡的No, 分享页面需要传给后台生成动态二维码
     count: p[8] 分享的数量
         * **/
    const u = this.props.userinfo;
    const dateTime = new Date().getTime();
    let ticketNo = "";
    // 获取待分享的userId
    Toast.loading("请稍后...", 0);
      this.props.actions.batchShare({
        sendCount: num,
        dateTime: dateTime,
        ticketStatus: this.state.tabIndex === 0 ? 3 : 1
      }).then(res => {
        if (res.status === 200) {
          Toast.hide();
          ticketNo = res.data;
          const str = `${u.id}_fff_${encodeURIComponent(
              u.nickName
          )}_fff_${encodeURIComponent(
              u.headImg
          )}_fff_0_fff_${dateTime}_fff_3_fff__fff_${encodeURIComponent(
              ticketNo
          )}_fff_${num}`;
          wx.onMenuShareAppMessage({
            title: `${u.nickName}赠送您${num}张翼猫HRA健康风险评估优惠卡`,
            desc:
                "请您在奋斗的时候不要忘记家人身体健康，关注疾病早期筛查和预防。",
            link: `${Config.baseURL}/gzh/?#/sharefreecard/${str}`,
            imgUrl: "https://isluo.com/imgs/catlogoheiheihei.png",
            type: "link",
            success: () => {
              Toast.info("批量分享成功", 1);
              this.setState({
                shareShow: false
              });
              me.ticketHandselMany({
                userId: u.id,
                shareType: 4,
                shareNo: ticketNo,
                dateTime
              });
            },
            //这是我刚刚写的测试一下用户取消分享
            cancel:()=>{
              this.setState({
                shareShow: false
              });
            }
          });
          wx.onMenuShareTimeline({
            title: `${u.nickName}赠送您${num}张翼猫HRA健康风险评估优惠卡`,
            desc:
                "请您在奋斗的时候不要忘记家人身体健康，关注疾病早期筛查和预防。",
            link: `${Config.baseURL}/gzh/?#/sharefreecard/${str}`,
            imgUrl: "https://isluo.com/imgs/catlogoheiheihei.png",
            success: () => {
              Toast.info("批量分享成功", 1);
              this.setState({
                shareShow: false
              });
              me.ticketHandselMany({
                userId: u.id,
                shareType: 4,
                shareNo: ticketNo,
                dateTime
              });
            }
          });
          this.setState({
            shareShow: true
          });
        } else {
          Toast.info(res.message, 1);
          return;
        }
      })
      .finally(() => {
        this.setState({
          btn1Show: false
        });
      });
  }

  /**
   * 1.
   * **/
  async startPay() {
    try {
      const s1 = await this.props.actions.wxInit(); // 1. 向后台获取timestamp,nonceStr,signature等微信JS-SDK初始化所需参数
      console.log("第1：获取wxInit：", s1);
      if (s1.status !== 200) {
        return false;
      }
      const s2 = await this.initWxConfig(s1.data); // 2. 初始化js-sdk
      console.log("第2：初始化js-sdk：", s2);
      if (!s2) {
        return false;
      }

      const s3 = await this.props.actions.createMcardList({
        // 3. 创建订单
        orderFrom: 2,
        num: this.state.modal2Num,
        fee: tools.point2(this.state.modal2Num * this.state.ticketPrice)
      });
      console.log("第3：创建订单：", s3);
      if (s3.status !== 200) {
        return false;
      }
      this.s3data = s3.data;
      const s4 = await this.props.actions.wxPay({
        // 4. 向后台发起统一下单请求
        body: "翼猫微信商城优惠卡", // 商品描述
        total_fee: s3.data.orderAmountTotal * 100, // 总价格（分）
        spbill_create_ip:
          typeof returnCitySN !== "undefined" ? returnCitySN["cip"] : "", // 用户终端IP，通过腾讯服务拿的
        out_trade_no: s3.data.mainOrderId
          ? String(s3.data.mainOrderId)
          : `${new Date().getTime()}`, // 商户订单号，通过后台生成订单接口获取
        code: null, // 授权code, 后台为了拿openid
        trade_type: "JSAPI"
      });
      console.log("第4：统一下单返回：", s4);
      if (s4.status !== 200) {
        return false;
      }
      Toast.hide();
      this.s4data = s4.data;
      return true;
    } catch (e) {
      return false;
    }
  }

  // 创建订单
  onPay() {
    const max = this.state.nPay;
    if (!this.state.modal2Num || this.state.modal2Num > max) {
      Toast.info("请输入有效数量", 1);
      return;
    }

    if (tools.point2(this.state.modal2Num * this.state.ticketPrice) > 10000) {
      Toast.info("您已超过最大支付金额10000.00元，请重新选择数量", 1);
      return;
    }
    if (!this.props.userinfo || !this.props.userinfo.mobile) {
      alert("确认支付？", "您还未绑定手机号，绑定后才能进行支付", [
        { text: "取消", onPress: () => console.log("cancel") },
        {
          text: "确认",
          onPress: () =>
            new Promise(resolve => {
              this.props.history.push("/my/bindphone");
              resolve();
            })
        }
      ]);
      return;
    }
    this.setState({
      loading: true
    });
    Toast.loading("请稍后...", 0);
    if (this.s4data) {
      // 已经获取过统一下单了，直接调起支付就行 （即用户取消支付、支付失败后，重新点击支付）
      this.onWxPay(this.s4data).then(msg => {
        this.payResult(msg);
      });
    } else {
      // 没有发起过统一下单，需重头开始，初始化JS-SDK什么的
      this.startPay()
        .then(res => {
          if (res) {
            this.onWxPay(this.s4data).then(msg => {
              this.payResult(msg);
            });
          } else {
            Toast.info("支付遇到错误，请重试.", 1);
            this.s3data = null;
          }
        })
        .catch(() => {
          Toast.info("支付遇到错误，请重试..", 1);
          this.s3data = null;
        });
    }
  }

  /**
   * (公众号支付专用) 真正的调起微信支付原生控件，等待用户操作
   * **/
  onWxPay(data) {
    return new Promise((res, rej) => {
      try {
        wx.chooseWXPay({
          appId: Config.appId,
          timestamp: data.timeStamp || data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.nonceStr || data.noncestr, // 支付签名随机串，不长于 32 位
          package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: data.signType || data.signtype, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.paySign || data.paysign, // 支付签名
          success: msg => {
            console.log("支付流程完结：", msg);
            res(msg);
          },
          cancel: msg => {
            console.log("支付流程取消：", msg);
            res(msg);
          },
          error: msg => {
            console.log("支付流程错误：", msg);
            res(msg);
          }
        });
      } catch (err) {
        rej(err);
      }
    });
  }

  // 支付结果处理
  payResult(msg) {
    if (!msg) {
      Toast.info("支付失败, 请重试", 1);
      this.s4data = null;
    } else if (msg.errMsg === "chooseWXPay:ok") {
      // 支付成功
      // 支付成功后在后台添加对应数量的评估卡 (现在由后台自动生成)
      // this.makeCards();
      Toast.success("支付成功", 1);
      this.onDown(3);
      this.onDown(1);
      this.setState({
        btn2Show: false,
        modal2Num: 1
      });
      this.s3data = null;
      this.s4data = null;
    } else if (msg.errMsg === "chooseWXPay:cancel") {
      // 支付被取消
      this.s4data = null;
    } else {
      // 支付遇到错误
      Toast.info("支付失败, 请重试", 1);
      this.s4data = null;
    }
  }

  // 分享成功后还要调个接口更改状态
  ticketHandsel(params) {
    this.props.actions.ticketHandsel(params).then(res => {
      if (res.status === 200) {
        this.onDown(3);
        this.onDown(1);
      }
    });
  }

  ticketHandselMany(params) {
    this.props.actions.ticketHandselMany(params).then(res => {
      if (res.status === 200) {
        this.onDown(3);
        this.onDown(1);
      }
    });
  }

  // 下拉刷新
  onDown(which) {
    this.getData(1, this.state.pageSize, "flash", this.state.search, which);
  }
  // 上拉加载
  onUp(which) {
    // 先得到该第几页了
    const t = this.state.data.find(item => item.type === which) || {};
    this.getData(
      Number(t.pageNum + 1) || 1,
      this.state.pageSize,
      "update",
      this.state.search,
      which
    );
  }

  // 工具 - 判断当前评估卡状态（正常(待支付、待使用)1、过期2、已使用3、已赠送5）
  checkCardStatus(item) {
    try {
      if (item.ticketStatus === 4) {
        // 已过期
        return 2;
      } else if (item.ticketStatus === 2) {
        // 已使用
        return 3;
      } else if (item.ticketStatus === 5) {
        // 已赠送
        return 5;
      }
      return 1;
    } catch (e) {
      return 1;
    }
  }

  // 点击一张评估卡
  onCardClick(item, item_son) {
    if (item.type === 5) {
      // 已赠送的进入卡记录
      this.props.history.push(`/my/favrecord/${item_son.ticketNo}`);
    } else if ([2, 4].includes(item.type)) {
      // 已使用已过期分类的不能进入详情页
    } else {
      this.props.actions.saveFreeCardInfo(item_son); // 保存该张卡信息，下个页面要用
      setTimeout(() => this.props.history.push(`/my/favcardsdetail`), 16);
    }
  }

  /**
   * 底部按钮点击 num: 1批量赠送，2批量支付
   * */
  onBtnClick(type) {
    if (type === 1) {
      this.setState({
        btn1Show: true,
        btn2Show: false
      });
    } else if (type === 2) {
      this.setState({
        btn2Show: true,
        btn1Show: false
      });
    }
  }

  // 批量赠送数量加减
  onModal1Num(type, e) {
    let num = 0;
    if (type === 0) {
      // -
      num = Number(this.state.modal1Num) - 1 || 0;
    } else if (type === 1) {
      // 手动输入
      let onlyNum=e.target.value.replace(/[^\d]/g,'');
      if(onlyNum.substr(0,1)==0){
        if(onlyNum>0){
            onlyNum=onlyNum.substr(1);
        }
      }
      num = Number(onlyNum);
    } else if (type === 2) {
      // +
      num = Number(this.state.modal1Num) + 1 || 1;
    }
    if (num < 0) {
      num = 0;
    }
    this.setState({
      modal1Num: num || "",
      modal1Check: false
    });
  }

  // 批量支付数量加减
  onModal2Num(type, e) {
    let num = 0;
    if (type === 0) {
      // -
      num = Number(this.state.modal2Num) - 1 || 0;
    } else if (type === 1) {
      // 手动输入
      let onlyNum=e.target.value.replace(/[^0-9]/ig,"");
      if(onlyNum.substr(0,1)==0){
        if(onlyNum>0){
            onlyNum=onlyNum.substr(1);
        }
      }
      num = Number(onlyNum);
    } else if (type === 2) {
      // +
      num = Number(this.state.modal2Num) + 1 || 1;
    }

    if (num < 0) {
      num = 0;
    }
    this.setState({
      modal2Num: num || "",
      modal2Check: false
    });
  }

  // 找某个类型的total
  findTotalByType(type) {
    return this.state.data.find(item => item.type === type).total;
  }

  // 删除评估卡
  onDelete(item) {
    alert("确认删除优惠卡?", "删除后将无法再查看该优惠卡", [
      { text: "取消", onPress: () => console.log("cancel") },
      {
        text: "确认",
        onPress: () =>
          new Promise((resolve, rej) => {
            this.props.actions
              .mallQuanDel({
                ticketId: item.id
              })
              .then(res => {
                if (res.status === 200) {
                  Toast.success("删除成功", 1);
                  this.getData(
                    1,
                    this.state.pageSize,
                    "flash",
                    this.state.search,
                    2
                  );
                  this.getData(
                    1,
                    this.state.pageSize,
                    "flash",
                    this.state.search,
                    4
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
      <div className="page-myfavcards">
        <Tabs
          tabs={this.state.data.map(item => ({
            title: (
              <Badge className="tabs-bars-div">
                <div>{item.title}</div>
                <div>{item.total}</div>
              </Badge>
            ),
            type: item.type
          }))}
          page={this.state.tabIndex}
          swipeable={false}
          onChange={(tab, index) => this.onTabsChange(tab, index)}
        >
          {this.state.data.map((item, index) => {
            return (
              <div key={index} className="tabs-div">
                <Luo
                  id={`luo-${index}`}
                  className="touch-none"
                  onDown={() => this.onDown(item.type)}
                  onUp={() => this.onUp(item.type)}
                  iscrollOptions={{
                    disableMouse: true
                  }}
                >
                  <div className="the-ul">
                    {item.type === 1 ? (
                      <div className={"what-f"}>
                        <div>优惠卡使用规则：</div>
                        <div>
                          每个e家号用户每月限制最多使用3张，超出使用数量的优惠卡在HRA设备上无法验证通过
                        </div>
                      </div>
                    ) : null}
                    {(() => {
                      if (item.data.length === 0) {
                        return (
                          <div key={0} className="data-nothing">
                            <img src={Img404} />
                            <div>亲，这里什么也没有哦~</div>
                          </div>
                        );
                      } else {
                        return item.data.map((item_son, index_son) => {
                          return (
                            <SwipeAction
                              style={{ backgroundColor: "transparent" }}
                              key={index}
                              autoClose
                              disabled={![2, 4].includes(item.type)}
                              right={[
                                {
                                  text: "删除",
                                  onPress: () => this.onDelete(item_son),
                                  style: {
                                    backgroundColor: "transparent",
                                    color: "#f00",
                                    padding: "0 10px"
                                  }
                                }
                              ]}
                            >
                              <div
                                key={index_son}
                                className={(() => {
                                  const classNames = [
                                    "cardbox",
                                    "page-flex-col",
                                    "flex-jc-sb"
                                  ];
                                  if (
                                    [2, 4].includes(item.type) &&
                                    this.checkCardStatus(item_son) !== 1
                                  ) {
                                    // 只有已使用、已过期才灰色，其他即使过期也不灰
                                    switch (item_son.ticketStyle) {
                                      case 1:
                                        classNames.push("abnormal1");
                                        break;
                                      case 2:
                                        classNames.push("abnormal2");
                                        break;
                                      // default:
                                      //   classNames.push("abnormal3");
                                    }
                                  }
                                  switch (item_son.ticketStyle) {
                                    case 1:
                                      //黄
                                      classNames.push("a");
                                      break;
                                    case 2:
                                      //紫色
                                      classNames.push("b");
                                      break;
                                    case 3:
                                      //蓝
                                      classNames.push("c");
                                      break;
                                  }
                                  return classNames.join(" ");
                                })()}
                                style={(() => {
                                  // 如果是京东百度的，那就直接取背景图
                                  if(item_son.ticketStyle == 4){
                                    return {
                                      backgroundImage: `url(${item_son.image})`
                                    };
                                  }
                                  //如果是过期的卡有就直接拿imageUsed，没有就默认过期的卡
                                  if(item_son.ticketStatus == 4){
                                    return {
                                      backgroundImage:item_son.imageUsed ? `url(${item_son.imageUsed})`:`url(${ImgGuoQiKa})`
                                    }
                                  }
                                  if (
                                    [2, 4].includes(item.type) &&
                                    this.checkCardStatus(item_son) !== 1 &&
                                    item_son.imageUsed
                                  ) {
                                    return {
                                      backgroundImage: `url(${item_son.imageUsed})`
                                    };
                                  }else if (item_son.image) {
                                    return {
                                      backgroundImage: `url(${item_son.image})`
                                    };
                                  }
                                  return null;
                                })()}
                                onClick={() => this.onCardClick(item, item_son)}
                              >
                                <div className="row1 flex-none page-flex-row flex-jc-sb">
                                  <div>
                                    <div className="t" />
                                  </div>
                                  {(() => {
                                    switch (item.type) {
                                      case 4:
                                        return (
                                          <img className="tip" src={ImgGuoQi} />
                                        ); // 已过期
                                      case 2:
                                        return (
                                          <img
                                            className="tip"
                                            src={ImgShiYong}
                                          />
                                        ); // 已使用
                                      case 5:
                                        return (
                                          <div className="flex-none">
                                            赠送记录 <img src={ImgRight} />
                                          </div>
                                        ); // 已赠送
                                      default:
                                        return (
                                          <div className="flex-none">
                                            {item_son.handselStatus === 1
                                              ? "赠送中 "
                                              : item_son.stationId
                                                ? "已预约"
                                                : null}
                                            <img src={ImgRight} />
                                          </div>
                                        );
                                    }
                                  })()}
                                </div>
                                <div className="row-center all_nowarp">
                                  {(() => {
                                    switch (item_son.ticketStyle) {
                                      case 1:
                                        return item_son.ticketContent;
                                      case 2:
                                        return "";
                                      case 3:
                                        return ""
                                      case 4:
                                        return "";
                                      default:
                                        return "";
                                    }
                                  })()}
                                </div>
                                <div className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end">
                                  <div>
                                    <div className="t">
                                      卡号：
                                      {tools.cardFormart(item_son.ticketNo)}
                                    </div>
                                    <div className="i">
                                      有效期至：
                                      {item_son.validEndTime
                                        ? item_son.validEndTime.split(" ")[0]
                                        : ""}
                                    </div>
                                  </div>
                                  <div
                                    onClick={e =>
                                      this.onStartShare(
                                        item_son,
                                        `${index}_${index_son}`,
                                        e
                                      )
                                    }
                                  >
                                    <div className="money">￥1000</div>
                                    {item_son.handsel ? (
                                      <div
                                        className={
                                          this.state.whichShare ===
                                          `${index}_${index_son}`
                                            ? "flex-none share-btn check"
                                            : "flex-none share-btn"
                                        }
                                      >
                                        赠送
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </SwipeAction>
                          );
                        });
                      }
                    })()}
                    <div className={"zw"} />
                  </div>
                </Luo>
              </div>
            );
          })}
        </Tabs>
        <div
          className="footer"
          style={{ display: this.state.tabIndex < 2 ? "flex" : "none" }}
        >
          <div onClick={() => this.onBtnClick(1)}>批量赠送</div>
          <div
            style={{ display: this.state.tabIndex === 0 ? "block" : "none" }}
            onClick={() => this.onBtnClick(2)}
          >
            批量支付
          </div>
        </div>
        <div
          className={this.state.shareShow ? "share-modal" : "share-modal hide"}
          onClick={() => this.setState({ shareShow: false })}
        >
          <img className="share" src={ImgShareArr} />
          <div className="title">点击右上角进行赠送</div>
        </div>

        {/** Modal1 **/}
        <div className={this.state.btn1Show ? "modal1 show" : "modal1"}>
          <div className="title">
            可赠送的优惠卡数量：
            {this.state.tabIndex === 0
              ? this.state.canSendNum
              : this.state.canSendNum2}
            张
          </div>
          <div className="title-2">(赠送中、预约中的卡不可赠送)</div>
          <div className="form-box">
            <Checkbox
              checked={this.state.modal1Check}
              onChange={e => {
                let k = "";
                if (e.target.checked) {
                  k = Math.max(
                    this.state.tabIndex === 0
                      ? this.state.canSendNum
                      : this.state.canSendNum2,
                    0
                  );
                }
                this.setState({
                  modal1Check: e.target.checked,
                  modal1Num: k
                });
              }}
            >
              <span className={"label-span"}>全部赠送</span>
            </Checkbox>
            <div className="err">
              {(() => {
                const max =
                  this.state.tabIndex === 0
                    ? this.state.canSendNum
                    : this.state.canSendNum2;
                if (this.state.modal1Num > max) {
                  return "超过有效数量，请重新输入";
                }
              })()}
            </div>
            <div className="fuckUpBox">
              <div className="btn" onClick={() => this.onModal1Num(0)}>
                -
              </div>
              <input
                type="text"
                pattern="[0-9]*"
                className="input"
                placeholder={`请输入有效数量`}
                value={this.state.modal1Num}
                onChange={e => this.onModal1Num(1, e)}
              />
              <div className="btn" onClick={() => this.onModal1Num(2)}>
                +
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <div
              onClick={() =>
                this.setState({
                  btn1Show: false
                })
              }
            >
              取消
            </div>
            <div
              style={{ backgroundColor: "rgb(65,132,243)", color: "#fff" }}
              onClick={() => this.onStartShareMany()}
            >
              确定
            </div>
          </div>
        </div>

        {/** Modal2 **/}
        <div className={this.state.btn2Show ? "modal1 show" : "modal1"}>
          <div className="title">
            可支付的优惠卡数量：
            <span>{this.state.nPay}</span>张
          </div>
          <div className="title-2">
            (赠送中、预约中的卡不可支付;有效期仅剩1天的卡不可批量支付)
          </div>
          <div className="form-box">
            <Checkbox
              checked={this.state.modal2Check}
              onChange={e => {
                let k = "";
                if (e.target.checked) {
                  k = Math.max(this.state.nPay, 0);
                }
                this.setState({
                  modal2Check: e.target.checked,
                  modal2Num: k
                });
              }}
            >
              <span className={"label-span"}>全部支付</span>
            </Checkbox>
            <div className="err">
              {(() => {
                const max = this.state.nPay;
                if (this.state.modal2Num > max) {
                  return "超过有效数量，请重新输入";
                } else if (this.state.modal2Num * 50 > 10000) {
                  return "超过最大支付金额限制，请重新选择数量";
                }
              })()}
            </div>
            <div className="fuckUpBox">
              <div className="btn" onClick={() => this.onModal2Num(0)}>
                -
              </div>
              <input
                type="text"
                pattern="[0-9]*"
                className="input"
                placeholder={`请输入有效数量`}
                value={this.state.modal2Num}
                onChange={e => this.onModal2Num(1, e)}
              />
              <div className="btn" onClick={() => this.onModal2Num(2)}>
                +
              </div>
            </div>
            <div style={{ marginTop: "5px" }}>
              支付数量：
              {this.state.modal2Num || 0}
            </div>
            <div>
              合计金额：
              <span
                style={{
                  color:
                    tools.point2(
                      (this.state.modal2Num || 0) * this.state.ticketPrice
                    ) > 10000
                      ? "#cc3333"
                      : "#222222"
                }}
              >
                {tools
                  .point2((this.state.modal2Num || 0) * this.state.ticketPrice)
                  .toFixed(2)}
              </span>
            </div>
          </div>
          <div className="modal-footer">
            <div
              onClick={() =>
                this.setState({
                  btn2Show: false
                })
              }
            >
              取消
            </div>
            <div
              style={{ backgroundColor: "rgb(65,132,243)", color: "#fff" }}
              onClick={() => this.onPay()}
            >
              确定
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
      {
        wxInit,
        queryListFree,
        saveFreeCardInfo,
        ticketHandsel,
        ticketHandselMany,
        createMcardList,
        wxPay,
        getSendCount,
        batchShare,
        mallQuanDel
      },
      dispatch
    )
  })
)(HomePageContainer);
