/* 微信支付页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================
import { Toast, Carousel, List, Button } from "antd-mobile";
import tools from "../../../../util/all";
import Config from "../../../../config";
import imgDefault from "../../../../assets/logo-img.png";
// ==================
// 本页面所需action
// ==================

import {
  wxPay,
  wxInit,
  mallCardCreate,
  payResultNeed
} from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wxReady: false, // 微信支付是否初始化成功
      modalShow: false, // 等待用户操作的弹窗是否显示
      wx_code: "", // 网页授权第一步获取到的code
      pay_info: {} // 订单信息
    };
    this.s3data = {}; // 统一下单请求返回的数据
  }

  UNSAFE_componentWillMount() {
    this.getPayInfo();
  }
  componentDidMount() {
    Toast.loading("请稍后……");
    setTimeout(() => {
      this.onSubmit();
    }, 16);
  }

  componentWillUnmount() {}

  async startPay() {
    try {
      const s1 = await this.props.actions.wxInit(); // 向后台获取timestamp,nonceStr,signature等微信JS-SDK初始化所需参数
      console.log("第1：获取wxInit：", s1);
      if (s1.status !== 200) {
        return false;
      }
      if (tools.isWeixin()) {
        // 是微信端才初始化微信SDK
        const s2 = await this.initWxConfig(s1.data); // 初始化js-sdk
        console.log("第2：初始化js-sdk：", s2);
        if (!s2) {
          return false;
        }
      }
      const s3 = await this.props.actions.wxPay({
        // 向后台发起统一下单请求
        body: "yimaokeji-card", // 商品描述
        total_fee: Number(this.state.pay_info.fee * 100) || 1, // 总价格（分）
        spbill_create_ip:
          typeof returnCitySN !== "undefined" ? returnCitySN["cip"] : "", // 用户终端IP，通过腾讯服务拿的
        out_trade_no: this.state.pay_info.id
          ? String(this.state.pay_info.id)
          : `${new Date().getTime()}`, // 商户订单号，通过后台生成订单接口获取
        code: tools.isWeixin() ? sessionStorage.getItem("wx_code") : null, // 授权code, 后台为了拿openid
        trade_type: tools.isWeixin() ? "JSAPI" : "MWEB"
      });
      console.log("第3：统一下单返回：", s3);
      if (s3.status !== 200) {
        return false;
      }
      Toast.hide();
      this.s3data = s3.data;
      if (tools.isWeixin()) {
        // 是微信端才初始化微信SDK
        const s4 = await this.onPay(s3.data); // 调起微信支付控件
        console.log("第4：调起微信支付控件：", s4);
        return s4;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  // 获取订单信息
  getPayInfo() {
    // 获取订单信息
    let pay = sessionStorage.getItem("pay-info");
    if (!pay) {
      Toast.info("未获取到订单信息", 1);
      this.props.history.replace("/");
    } else {
      pay = JSON.parse(pay);
      console.log("当前订单信息：", pay);
      this.setState({
        pay_info: pay
      });
    }
  }

  // 初始化微信JS-SDK
  initWxConfig(data) {
    console.log("DATA是个啥2", data);
    return new Promise((res, rej) => {
      if (typeof wx === "undefined") {
        res(false);
      }
      wx.config({
        debug: false,
        appId: Config.appId,
        timestamp: data.timestamp,
        nonceStr: data.noncestr,
        signature: data.signature,
        jsApiList: ["chooseWXPay"]
      });
      wx.ready(() => {
        console.log("微信JS-SDK初始化成功");
        res(true);
      });
    });
  }

  // 真正的开始支付
  onPay(data) {
    return new Promise((res, rej) => {
      wx.chooseWXPay({
        appId: Config.appId,
        timestamp: data.timeStamp || data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: data.nonceStr || data.noncestr, // 支付签名随机串，不长于 32 位
        package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: data.signType || data.signtype, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: data.paySign || data.paysign, // 支付签名
        success: function(msg) {
          console.log("支付流程完结：", msg);
          res(msg);
        }
      });
    });
  }

  // 支付取消后可以重新开始支付
  onSubmit() {
    this.startPay()
      .then(res => {
        console.log("你有返回什么吗：", res);
        const msg = JSON.parse(JSON.stringify(res));
        if (!res) {
          Toast.info("支付失败", 1);
        } else if (msg.errMsg === "chooseWXPay:ok") {
          // 支付成功
          // 支付成功后在后台添加对应数量的评估卡
          this.makeCards();
          Toast.success("支付成功", 1);
        } else {
          // 支付遇到错误
          Toast.info("支付失败", 1);
          this.returnPage();
        }
      })
      .catch(() => {
        this.returnPage();
      });
  }

  // 离开页面时销毁授权code,订单信息
  returnPage() {
    sessionStorage.removeItem("wx_code");
    sessionStorage.removeItem("pay-info");
    this.props.history.push("/my/order");
  }

  // 成功跳转
  successReturn() {
    sessionStorage.removeItem("wx_code");
    sessionStorage.removeItem("pay-info");
    setTimeout(() => this.props.history.replace("/shop/payresult"), 16);
  }

  // 重新发起支付
  onReturn() {
    if (!this.s3data) {
      Toast.info("下单失败，请重试", 1);
      setTimeout(() => {
        this.returnPage();
      }, 800);
    }
    console.log("重新 发起支付：", this.s3data);
    this.onPay(this.s3data);
  }

  // 支付成功后生成评估卡
  makeCards() {
    this.props.actions
      .mallCardCreate({ orderId: this.state.pay_info.id })
      .then(res => {
        if (res.status === 200) {
          // 支付成功展示页所需信息保存
          console.log(
            "保存支付结果页所需信息：",
            res.data,
            this.state.pay_info
          );
          this.props.actions.payResultNeed(res.data, this.state.pay_info);
          setTimeout(() => {
            this.successReturn();
          }, 16);
        } else {
          Toast.info("生成卡片失败，请联系客服", 1);
          this.returnPage();
        }
      });
  }

  render() {
    const d = this.state.pay_info;
    console.log("当前订单是什么:", d);
    return (
      <div className="flex-auto page-box page-pay">
        {/* List */}
        <List>
          <Item extra={d.id}>订单号</Item>
          <Item extra={d.count}>购买数量</Item>
          <Item extra={`￥ ${d.fee}`}>合计</Item>
        </List>
        <div className="detail-box">
          {d && d.detailImg ? <img src={d.detailImg} /> : null}
        </div>
        <div id="testdiv" />
        <div className="play">
          <Button type="primary" onClick={() => this.onReturn()}>
            支付
          </Button>
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
    actions: bindActionCreators(
      { wxPay, wxInit, mallCardCreate, payResultNeed },
      dispatch
    )
  })
)(HomePageContainer);
