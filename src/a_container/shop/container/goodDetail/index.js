/* 商品详情页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";
import WaterWave from "water-wave";
import FlyBall from "../../../../a_component/FlyBall";
// ==================
// 所需的所有组件
// ==================
import tools from "../../../../util/all";
import Config from "../../../../config";
import { List, Modal, Toast, Picker } from "antd-mobile";
import StepperLuo from "../../../../a_component/StepperLuo";
import ImgTest from "../../../../assets/test/new.png";
import ImgKiss from "../../../../assets/shop/good@3x.png";
import VideoLuo from "../../../../a_component/video";
import ImgKf from "./assets/kf@2x.png";
import ImgGwc from "./assets/gwc@2x.png";
// ==================
// 本页面所需action
// ==================

import {
  productById,
  shopStartPreOrder,
  appUserCheckBuy,
  getDefaultAttr,
  wxInit,
  pushCarInterface,
  pushDingDan
} from "../../../../a_action/shop-action";
import { shopCartCount } from "../../../../a_action/new-action";
// ==================
// Definition
// ==================
const Item = List.Item;
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}, // 当前商品数据
      formJifei: undefined, // 当前选择的计费方式
      formCount: 1, // 购买数量
      loading: false, // 是否正在异步请求中
      imgHeight: 200,
      show: false,
      titleChose: 1, // 1视频，2图片
      carNum: 0 // 购物车数量
    };
  }

  componentDidMount() {
    document.title = "商品详情";
    // 通过URL中传来的商品ID获取商品信息
    const id = Number(this.props.location.pathname.split("/").reverse()[0]);
    Toast.loading("加载中…");
    if (!isNaN(id)) {
      this.getData(id);
    }
    this.props.actions.shopCartCount();
  }

  componentWillUnmount() {
    Toast.hide();
  }
  // 获取原始数据
  getData(id) {
    this.props.actions
      .productById({ productId: id })
      .then(res => {
        if (res.status === 200) {
          this.setState(
            {
              data: res.data,
              show: true,
              formJifei:
                res.data &&
                res.data.productModel &&
                res.data.productModel.chargeTypes
                  ? [res.data.productModel.chargeTypes[0].id]
                  : undefined // 默认选择第1个
            },
            () => this.getWx()
          );
          Toast.hide();
        } else {
          Toast.info(res.message, 1);
          // setTimeout(() => this.props.history.go(-1), 1000);
        }
      })
      .catch(() => {
        this.props.history.go(-1);
      });
  }

  // 构建计费方式所需数据
  makeJiFeiData(data) {
    const d =
      data && data.productModel && data.productModel.chargeTypes
        ? data.productModel.chargeTypes
        : [];
    return d.map(item => {
      return { label: item.chargeName, value: item.id };
    });
  }

  // 工具 - 根据Code获取销售方式
  getNameBySaleMode(code) {
    switch (code) {
      case 1:
        return "租赁";
      case 2:
        return "买卖";
      case 3:
        return "服务";
      default:
        return "";
    }
  }

  // 工具 - 根据有效期类型ID获取名称
  getNameByTimeLimitType(id) {
    switch (String(id)) {
      case "0":
        return "长期有效";
      case "1":
        return "天";
      case "2":
        return "月";
      case "3":
        return "年";
      default:
        return "";
    }
  }

  // 计费方式选择确定
  onJiFeiChose(id) {
    this.setState({
      formJifei: id
    });
  }

  // 购买数量改变时触发
  onCountChange(v) {
    this.setState({
      formCount: v
    });
  }

  // 查看当前商品适用的体验店
  onSeeExpreShop() {
    const d = this.state.data;
    if (d && d.typeId === 1) {
      // 水机
      this.props.history.push("/shop/UnderStore");
    } else {
      this.props.history.push("/healthy/choseStation");
    }
  }

  // 请求初始化微信所需参数
  getWx() {
    this.props.actions.wxInit().then(res => {
      if (res.status === 200) {
        this.initWxConfig(res.data);
      }
    });
  }
  // 初始化微信JS-SDK
  initWxConfig(d2) {
    const me = this;
    if (typeof wx === "undefined") {
      console.log("weixin sdk load failed!");
      return false;
    }

    wx.config({
      debug: false,
      appId: Config.appId,
      timestamp: d2.timestamp,
      nonceStr: d2.noncestr,
      signature: d2.signature,
      jsApiList: [
        "onMenuShareTimeline", // 分享到朋友圈
        "onMenuShareAppMessage" // 分享给微信好友
      ]
    });
    wx.ready(() => {
      console.log("微信JS-SDK初始化成功");
      /**
       * 拼接数据
       * userid - 用户ID
       * name - 名字
       * head - 头像
       * t - 当前数据ID
       * **/
      const u = this.props.userinfo;
      wx.onMenuShareAppMessage({
        title: this.state.data.name || "翼猫健康",
        desc: this.state.data.productModel
          ? this.state.data.productModel.modelDetail
          : "来自翼猫微信商城",
        imgUrl: this.state.data.detailImg
          ? this.state.data.detailImg.split(",")[0]
          : null,
        link: window.location.href,
        type: "link",
        success: () => {
          Toast.info("分享成功", 1);
        }
      });
      wx.onMenuShareTimeline({
        title: this.state.data.name || "翼猫健康",
        desc: this.state.data.productModel
          ? this.state.data.productModel.modelDetail
          : "来自翼猫微信商城",
        imgUrl: this.state.data.detailImg
          ? this.state.data.detailImg.split(",")[0]
          : null,
        link: window.location.href,
        success: () => {
          Toast.info("分享成功", 1);
        }
      });
    });
    wx.error(e => {
      console.log("微信JS-SDK初始化失败：", e);
    });
  }

  // 点击立即下单
  onSubmit(e) {
    e.stopPropagation();
    const u = this.props.userinfo;
    if (!u) {
      Toast.info("请先登录", 1);
      this.props.history.push(`/login`);
      return false;
    } else if (!u.mobile) {
      Toast.info("请先绑定手机号", 1);
      this.props.history.replace(`/my/bindphone`);
      return false;
    } else if (!this.state.formCount) {
      Toast.info("请选择购买数量", 1);
      return false;
    }
    
    if (this.state.data.activityType === 0) {
      const alertInstance = alert("温馨提示", `亲，此商品暂不支持在线购买，请您前往线下门店进行体验、购买哦~`, [
        { text: "取消", onPress: () => console.log("cancel")},
        {
          text: "查看线下门店",
          onPress: () =>
              new Promise(resolve => {
                this.props.history.push("/exprshop2");
                resolve();
              })
        }
      ]);
      window.addEventListener("popstate", function(e) {
        alertInstance.close()
      }, false);
    }
  
    if (!this.state.data.activityType == 0) {
      const nowProduct = _.cloneDeep(this.state.data); // 当前商品信息
      nowProduct.shopCart = {
        number: this.state.formCount, // 商品数量
        feeType: this.state.formJifei || undefined // 计费方式 是一个数组
      };
      this.props.actions.pushDingDan([nowProduct]);
      // 实物商品提前查询默认收货地址
      if (this.state.data.typeId !== 5) {
        this.props.actions.getDefaultAttr();
      }
      this.props.history.push("/shop/confirmpay/1");
    }

    // 检查当前用户是否有权限购买当前物品
    // this.props.actions.appUserCheckBuy({ productType: String(this.state.data.productType.code) }).then((res) => {
    //       if (res.status === 200) { // 有权限
    //           //const params = { count: this.state.formCount, feeType: this.state.formJifei ? this.state.formJifei[0] : undefined };
    //           const nowProduct = _.cloneDeep(this.state.data);
    //           nowProduct.shopCart = {
    //               number: this.state.formCount,   // 商品数量
    //               feeType: this.state.formJifei || undefined, // 计费方式 是一个数组
    //           };
    //           // this.props.actions.shopStartPreOrder(params, nowProduct); // 保存当前用户选择的信息（所选数量、计费方式，当前商品完整信息）
    //           this.props.actions.pushDingDan([nowProduct]);
    //           // 实物商品提前查询默认收货地址
    //           if (this.state.data.typeId !== 5) {
    //               this.props.actions.getDefaultAttr();
    //           }
    //           this.props.history.push('/shop/confirmpay/1');
    //       } else {
    //           alert('温馨提示', '您当前还没有购买该产品的权限哦', [
    //               { text: '知道了', onPress: () => console.log('cancel') },
    //               {
    //                   text: '查看权限规则',
    //                   onPress: () => new Promise((resolve, rej) => {
    //                       this.props.history.push('/my/atcat');
    //                       resolve();
    //                   }),
    //               },
    //           ]);
    //       }
    // });
  }

  goEva() {
    this.props.history.push("/shop/eva");
  }

  // 当前商品加入到购物车
  onPushCar(e) {
    e.stopPropagation();

    if (!this.state.data || !this.state.data.id) {
      Toast.info("请先登录", 1);
      return;
    }
    if (this.state.data.activityType === 2) {
      Toast.info("活动产品不能加入购物车", 1);
      return;
    }
    if (this.state.data.activityType === 0) {
      const alertInstance = alert("温馨提示", `亲，此商品暂不支持在线购买，请您前往线下门店进行体验、购买哦~`, [
        { text: "取消", onPress: () => console.log("cancel")},
        {
          text: "查看线下门店",
          onPress: () =>
            new Promise(resolve => {
              this.props.history.push("/exprshop2");
              resolve();
            })
        }
      ]);
      window.addEventListener("popstate", function(e) {
        alertInstance.close()
      }, false);
    }
    if (this.props.shoppingCarNum >= 200) {
      Toast.info("您购物车内的商品数量过多，清理后方可加入购物车", 2);
      return;
    }
  
    if (!this.state.data.activityType == 0) {
      const params = {
        productId: this.state.data.id,
        number: this.state.formCount || 1,
        feeType: this.state.formJifei ? this.state.formJifei[0] : null
      };
      this.props.actions.pushCarInterface(tools.clearNull(params)).then(res => {
        if (res.status === 200) {
          this.props.actions.shopCartCount();
        } else {
          Toast.info(res.message,1);
        }
      });
      const win = document.getElementById("gwc-btn");
      this.setState({
        ballData: [
          e.clientX,
          e.clientY,
          win.offsetLeft + 20,
          document.body.clientHeight - 30
        ]
      });
    }
  }

  render() {
    const d = this.state.data || {};
    return (
      <div
        className={
          this.state.show ? "gooddetail-page show" : "gooddetail-page show"
        }
      >
        <div className="title-pic">
          {/* 顶部画廊 */}
          {d.name ? (
            <VideoLuo
              videoPic={null} // null
              videoSrc={d.coverVideo} // d.coverVideo
              imgList={d.productImg ? d.productImg.split(",") : []}
            />
          ) : null}
        </div>
        {/*<div style={{ height: '1500px' }}>ZW</div>*/}
        {/* 商品信息说明 */}
        <div className="goodinfo">
          <div className="title">{d && d.name}</div>
          <div className="info">
            <div className="cost">
              ￥{" "}
              <span>
                {d && d.productModel
                  ? tools.point2(
                      d.productModel.price + d.productModel.openAccountFee
                    )
                  : "--"}
              </span>
            </div>
          </div>
          <div className="server page-flex-row">
            <div>
              运费：￥
              {d && d.productModel ? d.productModel.shipFee || 0 : 0}
            </div>
            {/** 只有评估卡显示有效期 **/
            d && d.typeId === 5 ? (
              <div>
                有效期：
                {`${
                  d && d.productModel ? d.productModel.timeLimitNum || "" : ""
                }${
                  d && d.productModel
                    ? this.getNameByTimeLimitType(d.productModel.timeLimitType)
                    : ""
                }`}
              </div>
            ) : null}
            <div>
              {(() => {
                if (!d) {
                  return null;
                }
                if (d.activityType === 2) {
                  // 活动产品
                  return `${d.buyCount || 0}人申请`;
                } else if (d.typeId === 1) {
                  // 水机
                  return `已供：${(d && d.buyCount) || 0}`;
                }

                return `已售：${(d && d.buyCount) || 0}`;
              })()}
            </div>
          </div>
        </div>
        {/* List */}
        <List>
          <Item
            extra={
              d && d.typeId === 1 && d.activityType === 2 ? (
                "仅限1台"
              ) : (
                <StepperLuo
                  min={1}
                  max={200}
                  value={this.state.formCount}
                  onChange={v => this.onCountChange(v)}
                />
              )
            }
          >
            购买数量
          </Item>
          {/** 只有水机有计费方式选择(typeId === 1) **/
          d && d.typeId === 1 ? (
            <Picker
              data={this.makeJiFeiData(d)}
              extra={""}
              value={this.state.formJifei}
              cols={1}
              onOk={v => this.onJiFeiChose(v)}
            >
              <Item arrow="horizontal" className="special-item">
                计费方式
              </Item>
            </Picker>
          ) : null}
          {d && [0, 1, 4, 5, 6].includes(d.typeId) ? (
            <Item
              onClick={() => this.onSeeExpreShop()}
              arrow="horizontal"
              multipleLine
            >
              {d && d.typeId === 1
                ? "可安装净水系统的区域查询"
                : "查看适用体验店"}
            </Item>
          ) : null}
          {/*<Item extra={<span style={{ color: '#ff3929' }}>好评 0.00%</span>} arrow="horizontal">评价详情 (888)</Item>*/}
        </List>
        {/*<ul className="pj-ul" onClick={() => this.goEva()}>*/}
        {/*<li>*/}
        {/*<div className="l">*/}
        {/*<div className="l1">*/}
        {/*<img className="pic" src={ImgTest} />*/}
        {/*<div className="info">*/}
        {/*<div className="name all_nowarp">{ tools.addMosaic('某某某某某某某') }</div>*/}
        {/*<div className="time">2018-02-09</div>*/}
        {/*</div>*/}
        {/*</div>*/}
        {/*<div className={"stars"}>*/}
        {/*<img src={ImgKiss} />*/}
        {/*<img src={ImgKiss} />*/}
        {/*<img src={ImgKiss} />*/}
        {/*</div>*/}
        {/*<div className="words all_nowarp2">哎呀这东西就是好它好呀它好呀它好好好好好因为卖家说要返我两毛钱</div>*/}
        {/*</div>*/}
        {/*<div className="r">*/}
        {/*<img src={ImgTest} />*/}
        {/*<img src={ImgTest} />*/}
        {/*</div>*/}
        {/*</li>*/}
        {/*</ul>*/}
        {d && d.productDetail ? (
          <div className="editor-box">
            <div
              dangerouslySetInnerHTML={{
                __html: d.productDetail.replace(
                  /<video/g,
                  "<video playsInline controls"
                )
              }}
            />
          </div>
        ) : null}
        <div className="play">
          <Link className="btn-normal" to="/my/kf">
            <img src={ImgKf} />
            <div>客服</div>
            <WaterWave color="#888888" press="down" />
          </Link>
          <div
            className="btn-normal"
            id={"gwc-btn"}
            onClick={() => this.props.history.push("/shop/shoppingcar")}
          >
            <img src={ImgGwc} />
            <div>购物车</div>
            <div
              className={
                this.props.shoppingCarNum ? "shopping-num show" : "shopping-num"
              }
            >
              {this.props.shoppingCarNum}
            </div>
            <WaterWave color="#888888" press="down" />
          </div>
          <div className="btn-add-gwc" onClick={e => this.onPushCar(e)}>
            加入购物车
          </div>
          <div className="btn-submit" onClick={e => this.onSubmit(e)}>
            {d.activityType === 2 ? "立即申请" : "立即购买"}
            <WaterWave color="#cccccc" press="down" />
          </div>
        </div>
        <FlyBall data={this.state.ballData} />
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
  shoppingCarNum: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    allChargeTypes: state.shop.allChargeTypes, // 所有的收费方式
    userinfo: state.app.userinfo,
    shoppingCarNum: state.shop.shoppingCarNum
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        productById,
        shopStartPreOrder,
        appUserCheckBuy,
        getDefaultAttr,
        wxInit,
        pushCarInterface,
        pushDingDan,
        shopCartCount
      },
      dispatch
    )
  })
)(HomePageContainer);
