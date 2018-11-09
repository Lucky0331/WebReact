/* 确认支付页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import tools from "../../../../util/all";
import P from "prop-types";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================
import { List, Toast, DatePicker, Picker } from "antd-mobile";
import ImgDiZhi from "../../../../assets/dizhi@3x.png";
// ==================
// 本页面所需action
// ==================

import {
  shopStartPayOrder,
  placeAndOrder,
  placeAndOrderMany,
  queryCustomerList,
  saveOrderInfo
} from "../../../../a_action/shop-action";
import { getStationInfoById } from "../../../../a_action/app-action";

// ==================
// Definition
// ==================
const Item = List.Item;
const Brief = Item.Brief;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serverList: [], // 当前区域下的安装工列表
      station: null, // 用户的经销商的推荐人的服务站

      data: this.props.willPayObjs // 选择的商品数据副本
    };
  }

  componentWillUnmount() {
    Toast.hide();
  }

  componentDidMount() {
    document.title = "订单确认";
    sessionStorage.removeItem("pay-start");
    this.queryCustomerList();
    setTimeout(() => {
      if (this.props.userinfo) {
        this.getAllStations(this.state.data, this.props.userinfo.id);
      }
    });
  }

  UNSAFE_componentWillReceiveProps(nextP) {
    if (nextP.willPayObjs !== this.props.willPayObjs) {
      this.setState({
        data: nextP.willPayObjs
      });
    }
  }

  // 2、5遍历获取需要查服务站的，查出来再存到数据里，艹
  getAllStations(data, userId) {
    Promise.all(
      data
        .filter((item, index) => [2, 3, 5].includes(item.typeId))
        .map((item, index) => {
          return new Promise((resolve, rej) => {
            this.props.actions
              .getStationInfoById(
                tools.clearNull({ userId, productId: item.id })
              )
              .then(res => {
                if (res.status === 200) {
                  resolve({ name: res.data, id: item.id });
                } else {
                  rej(res.data);
                }
              });
          });
        })
    ).then(res => {
      console.log("来啊，看都有什么：", res);
      const d = [...data];
      d.forEach((item, index) => {
        for (let i = 0; i < res.length; i++) {
          if (item.id === res[i].id) {
            item.shopCart.station = res[i].name;
          }
        }
      });
      this.setState({
        data: d
      });
    });
  }

  // 获取安装工信息
  queryCustomerList() {
    const addr = this.props.orderParams.addr;
    console.log("收货地址信息：", addr);
    if (!addr) {
      return;
    }

    const params = {
      province: addr.province,
      city: addr.city,
      region: addr.region
    };
    this.props.actions.queryCustomerList(params).then(res => {
      console.log("查安装工列表返回：", res);
      if (res.status === 200) {
        this.setState({
          serverList: res.data
        });
      }
    });
  }

  // 获取用户的经销商的推荐人的服务站,服了
  getStationInfoById() {
    if (!this.props.userinfo) {
      return;
    }
    const d = this.props.orderParams.nowProduct || { productModel: {} }; // 当前商品对象

    this.props.actions
      .getStationInfoById(
        tools.clearNull({ userId: this.props.userinfo.id, productId: d.id })
      )
      .then(res => {
        if (res.status === 200) {
          this.setState({
            station: res.data
          });
        }
      });
  }
  // form 购买数量被改变
  onCountChange(v) {
    this.setState({
      formCount: v
    });
  }
  // 确认支付被点击，生成订单
  onSubmit() {
    console.log("收集的信息：", this.props.orderParams); // 这个里面现在只有收货地址了
    const data = this.state.data;

    if (data.find(item => item.typeId !== 5) && !this.props.orderParams.addr) {
      // 除评估卡以外的产品需要收货地址
      Toast.info("请选择收货地址", 1);
      return;
    }
    if (data.find(item => item.typeId === 1 && !item.shopCart.feeType)) {
      // 水机需要选择计费方式
      Toast.info("请选择计费方式", 1);
      return;
    }

    if (
      data.find(
        item =>
          Number(item.shopCart.formPaiDan) === 2 && !item.shopCart.formServerMan
      )
    ) {
      Toast.info("请选择为您服务的安装工", 1);
      return;
    }

    /**
     * 价格公式
     * 单个产品： （单价+开户费）* 数量 + 运费
     * 多个产品： (单价+开户费)*数量 + （单价+开户费）* 数量 + ... + 最高运费
     * **/
    /**
     * 只有1个商品（可能是从商城来的，也可能是从购物车只选择了一个商品来的
     * 走单一接口
     * **/
    console.log("开始支付了：", data);
    const type = Number(this.props.location.pathname.split("/").slice(-1));
    if (type === 1) {
      // 单独下单进来的，调用单独下单接口
      const d = data[0];
      // 获取安装工信息，如果有的话，没有返回null
      let serverMan = null;
      if (Number(d.shopCart.formPaiDan) === 2) {
        serverMan = this.getInfoByServerManId(d.shopCart.formServerMan[0]);
      }
      const params = {
        productId: d.id, // ID
        number: d.shopCart.number, // 购买数量
        // 订单价格
        orderAmountTotal: tools.point2(
          (d.productModel.price + d.productModel.openAccountFee) *
            d.shopCart.number +
            d.productModel.shipFee
        ),
        payType: 1, // 1微信支付 2支付宝，3其他，我怎么知道他用什么支付，直接填1好了
        orderFrom: 2, // 订单来源 1APP，2公众号 3经销商App 这里是公众号所以填2
        addrId:
          d.typeId !== 5 && this.props.orderParams.addr
            ? this.props.orderParams.addr.id
            : null, // 除评估卡，其他的商品需要收货地址ID
        // 是水机才需要安装时间
        serviceTime:
          d.typeId === 1
            ? tools.dateToStr(
                d.shopCart.formServiceTime ||
                  new Date(new Date().getTime() + 86400000)
              )
            : null, // 安装时间
        feeType: Number(d.shopCart.feeType), // 计费方式
        customerId: serverMan && serverMan.id, // 安装工ID
        customerName: serverMan && serverMan.name, // 安装工名字
        customerPhone: serverMan && serverMan.phone, // 安装工电话
        remark: null, // 备注？ UI上没设计这个
        logisticsFee: d.productModel.shipFee // 物流运费
      };

      // 开始下单
      Toast.loading("请稍后...", 0);
      this.props.actions
        .placeAndOrder(tools.clearNull(params))
        .then(res => {
          if (res.status === 200) {
            Toast.hide();
            sessionStorage.setItem("pay-info", JSON.stringify(res.data)); // 将返回的订单信息存入sessionStorage
            sessionStorage.setItem("pay-obj", JSON.stringify(data)); // 将当前所选择的商品信息存入session
            this.props.history.replace("/shop/payChose/1"); // 跳转到支付页
          } else {
            Toast.info(res.message, 2);
          }
        })
        .catch(() => {
          Toast.hide();
        });
    } else if (type === 2) {
      // 是从购物车来的，选择了多个商品或1个商品，但所有商品都跟购物车有关联，购买后将从购物车消失
      // 所有商品Set信息
      const shopCartSet = data.map((item, index) => {
        let serverMan = null;
        if (Number(item.shopCart.formPaiDan) === 2) {
          serverMan = this.getInfoByServerManId(item.shopCart.formServerMan[0]);
        }
        return tools.clearNull({
          id: item.shopCart.id,
          productId: item.id,
          number: item.shopCart.number,
          serviceTime:
            item.typeId === 1
              ? tools.dateToStr(
                  item.shopCart.formServiceTime ||
                    new Date(new Date().getTime() + 86400000)
                )
              : null,
          feeType: Number(item.shopCart.feeType) || null,
          customerId: serverMan && serverMan.id, // 安装工ID
          customerName: serverMan && serverMan.name, // 安装工名字
          customerPhone: serverMan && serverMan.phone // 安装工电话
        });
      });
      // 商品总价格
      const orderAmountTotal_temp = data.reduce((res, item) => {
        // 上次结果 + 当前商品单价*数量+开户费
        return (
          res +
          (item.productModel.price + item.productModel.openAccountFee) *
            item.shopCart.number
        );
      }, 0);

      // 最高运费
      const logisticsFee = data.reduce((res, item) => {
        return Math.max(res, item.productModel.shipFee);
      }, 0);

      // 构建参数
      const params = {
        shopCartSet,
        orderAmountTotal: tools.point2(orderAmountTotal_temp + logisticsFee),
        payType: 1,
        orderFrom: 2,
        addrId:
          data.find(item => item.typeId !== 5) && this.props.orderParams.addr
            ? this.props.orderParams.addr.id
            : null,
        remark: null,
        logisticsFee
      };

      // 开始下单
      Toast.loading("请稍后...", 0);
      this.props.actions
        .placeAndOrderMany(tools.clearNull(params))
        .then(res => {
          if (res.status === 200) {
            Toast.hide();
            sessionStorage.setItem("pay-info", JSON.stringify(res.data)); // 将返回的订单信息存入sessionStorage
            sessionStorage.setItem("pay-obj", JSON.stringify(data)); // 将当前所选择的商品信息存入session
            this.props.history.replace("/shop/payChose/1"); // 跳转到支付页
          } else {
            Toast.info(res.message, 2); // 这里需要2秒，因为提示信息比较长，那些XX看不完
          }
        })
        .catch(() => {
          Toast.hide();
        });
    }

    return true;
  }

  getAllNeedPay(data) {
    try {
      // 商品总价格
      const orderAmountTotal_temp = data.reduce((res, item) => {
        // 上次结果 + 当前商品单价*数量+开户费
        return (
          res +
          (item.productModel.price + item.productModel.openAccountFee) *
            item.shopCart.number
        );
      }, 0);
      // 最高运费
      const logisticsFee = data.reduce((res, item) => {
        return Math.max(res, item.productModel.shipFee);
      }, 0);
      return orderAmountTotal_temp + logisticsFee;
    } catch (e) {
      return 0;
    }
  }

  // 根据ID查询完整的安装工信息
  getInfoByServerManId(id) {
    const t = this.state.serverList.find(item => item.id === id);
    return t || null;
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

  // 服务时间被选择
  onDateChange(v, d) {
    const arr = _.cloneDeep(this.state.data);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === d.id) {
        arr[i].shopCart.formServiceTime = v;
      }
    }
    this.setState({
      data: arr
    });
  }

  // 计费方式选择
  onJiFeiChose(v, d) {
    const arr = _.cloneDeep(this.state.data);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === d.id) {
        arr[i].shopCart.feeType = v;
      }
    }
    this.setState({
      data: arr
    });
  }

  // 派单方式选择
  onPaiDanChose(v, d) {
    const arr = _.cloneDeep(this.state.data);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === d.id) {
        arr[i].shopCart.formPaiDan = v;
      }
    }
    this.setState({
      data: arr
    });
    if (Number(v) === 2) {
      this.queryCustomerList();
    }
  }
  // 服务人员选择
  onServeChose(v, d) {
    const arr = _.cloneDeep(this.state.data);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === d.id) {
        arr[i].shopCart.formServerMan = v;
      }
    }
    this.setState({
      data: arr
    });
  }

  // 选择这一个
  onChoseThis(item) {
    // 把所选择的地址存入购买数据
    this.props.actions.saveShopAddr(item);
    setTimeout(() => this.props.history.go(-1));
  }

  // 允许购买的最大数量
  canBuyHowMany(type) {
    // 0-其他 1-水机 2-养未来，3-冷敷贴 4-水机续费订单 5-精准体检 6-智能睡眠
    switch (Number(type)) {
      case 0:
        return 5;
      case 1:
        return 1;
      case 2:
        return 3;
      case 3:
        return 2;
      case 4:
        return 1;
      case 5:
        return 5;
      case 6:
        return 5;
      default:
        return 5;
    }
  }
  getSex(sex) {
    switch (Number(sex)) {
      case 1:
        return "男";
      case 2:
        return "女";
      default:
        return "";
    }
  }
  render() {
    const addr = this.props.orderParams.addr;
    const data = this.state.data;
    return (
      <div className="flex-auto page-box confirm-pay">
        {/** 只要有非体检卡的商品，都需要收货地址 **/
        data.find(item => item.typeId !== 5) ? (
          <List className="mb">
            <Item
              thumb={<img src={ImgDiZhi} />}
              extra={addr ? null : "请选择收货地址"}
              className={"normal-item"}
              multipleLine
              arrow={"horizontal"}
              onClick={() => this.props.history.push("/my/addr/2")}
            >
              {addr
                ? `收货人：${addr.contact}  ${this.getSex(addr.sex)}`
                : null}
              {addr ? (
                <Brief>
                  <div>
                    电话：
                    {addr.mobile || ""}
                  </div>
                  <div className="all_warp">
                    收货地址：
                    {`${addr.province || ""}${addr.city || ""}${addr.region ||
                      ""}${addr.street}`}
                  </div>
                </Brief>
              ) : null}
            </Item>
          </List>
        ) : null}
        <div className="body-list">
          {data.map((d, index) => {
            return (
              <div key={index} className="obj-box">
                <div className="one">
                  <div className="pic">
                    <img src={d.detailImg && d.detailImg.split(",")[0]} />
                  </div>
                  <div className="infos">
                    <div className="t all_warp">{d.name}</div>
                    <div className="num">
                      <span className="money">
                        ￥
                        {d.productModel.price +
                          (d.productModel.openAccountFee || 0)}
                      </span>
                      <span>x{d.shopCart.number}</span>
                    </div>
                  </div>
                </div>
                <List>
                  {/** 只有水机有计费方式选择(typeId === 1) **/
                  d && d.typeId === 1 ? (
                    <Picker
                      data={this.makeJiFeiData(d)}
                      extra={""}
                      value={
                        d.shopCart.feeType
                          ? Array.isArray(d.shopCart.feeType)
                            ? d.shopCart.feeType
                            : [d.shopCart.feeType]
                          : undefined
                      }
                      cols={1}
                      onOk={v => this.onJiFeiChose(v, d)}
                    >
                      <Item arrow="horizontal" className="special-item">
                        计费方式
                      </Item>
                    </Picker>
                  ) : null}
                  {/** 只有水机有服务时间(typeId === 1) **/
                  d && d.typeId === 1 ? (
                    <DatePicker
                      mode="date"
                      title="安装时间"
                      extra="Optional"
                      value={
                        d.shopCart.formServiceTime ||
                        new Date(new Date().getTime() + 86400000)
                      }
                      minDate={new Date(new Date().getTime() + 86400000)}
                      onChange={date => this.onDateChange(date, d)}
                    >
                      <Item
                        extra={`￥${d.productModel.openAccountFee}`}
                        arrow={"horizontal"}
                      >
                        安装时间
                      </Item>
                    </DatePicker>
                  ) : null}
                  {/**
                   * 只有水机有派单方式(typeId === 1)
                   * 只有选择了地址才会出现派单方式
                   * **/
                  d && d.typeId === 1 ? (
                    <Picker
                      data={[
                        { label: "自动派单", value: 1 },
                        { label: "手动指派", value: 2 }
                      ]}
                      extra={""}
                      value={
                        d.shopCart.formPaiDan ? d.shopCart.formPaiDan : [1]
                      }
                      cols={1}
                      onOk={v => this.onPaiDanChose(v, d)}
                    >
                      <Item arrow="horizontal" className="special-item">
                        派单方式
                      </Item>
                    </Picker>
                  ) : null}
                  {/**
                   * 安装工
                   * 只有派单方式选择手动才会出现
                   * **/
                  Number(d.shopCart.formPaiDan) === 2 ? (
                    <Picker
                      data={this.state.serverList.map(item => ({
                        label: `${item.name || item.realName} ${tools.addMosaic(
                          item.phone
                        )}`,
                        value: item.id
                      }))}
                      value={d.shopCart.formServerMan}
                      cols={1}
                      onOk={v => this.onServeChose(v, d)}
                    >
                      <div className="am-list-item special-item am-list-item-middle hoho">
                        <div className="am-list-line">
                          <div className="am-list-content">服务人员</div>
                          <div className="am-list-extra">
                            {d.shopCart.formServerMan
                              ? (() => {
                                  const worker = this.getInfoByServerManId(
                                    d.shopCart.formServerMan[0]
                                  );
                                  return (
                                    worker && `${worker.name} ${worker.phone}`
                                  );
                                })()
                              : "请选择"}
                          </div>
                          <div
                            className="am-list-arrow am-list-arrow-horizontal"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </Picker>
                  ) : null}
                  {// d.productModel.openAccountFee
                  d && d.typeId === 1
                    ? [
                        <Item
                          key="0"
                          extra={`￥${tools.point2(this.getAllNeedPay(data))}`}
                          align={"top"}
                          className={"this-speacl-item"}
                        >
                          首年度预缴
                        </Item>,
                        <div className={"year-info-box"} key="1">
                          <div className="year-info mb">
                            采用流量计费方式：额外免费享受180元的净水服务费额度；
                          </div>
                          <div className="year-info">
                            采用包年计费方式：额外享受2个月的免费净水服务费，即首次预缴净水服务费后，首个净水服务周期为14个月。
                          </div>
                        </div>
                      ]
                    : null}
                  {/** 水机和评估卡没有运费(typeId === 1，5) **/
                  d && ![1, 5].includes(d.typeId) ? (
                    <Item
                      extra={`￥${
                        d.productModel ? d.productModel.shipFee : "0"
                      }`}
                    >
                      运费
                    </Item>
                  ) : null}
                </List>
                {/** 2养未来、3冷敷贴，5体检卡，要查经销商的服务站 **/
                d && [2, 3, 5].includes(d.typeId) ? (
                  <div className="station-box">
                    {(() => {
                      switch (d.typeId) {
                        case 2:
                        case 3:
                          return (
                            <div className="shit-station">
                              <div className="ti">
                                (此款项是代
                                {d.shopCart.station}
                                收取)
                              </div>
                            </div>
                          );
                        case 5:
                          return (
                            <div className="shit-station">
                              <div className="ti">
                                (此款项是代
                                {d.shopCart.station}
                                收取)
                              </div>
                              <div className="station-info">
                                <div>如需开票，请联系</div>
                                <div>
                                  {d.shopCart.station}:{" "}
                                  <a href="tel:4001519999">联系门店</a>
                                </div>
                                <div>
                                  客服热线:{" "}
                                  <a href="tel:4001519999">4001519999</a>
                                </div>
                              </div>
                            </div>
                          );
                        default:
                          return null;
                      }
                    })()}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="zw46" />
        <div className="thefooter page-flex-row">
          <div className="flex-auto" style={{ padding: "0 .2rem" }}>
            合计：￥ {tools.point2(this.getAllNeedPay(data))}
          </div>
          <div className="flex-none submit-btn" onClick={() => this.onSubmit()}>
            提交订单
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
  orderParams: P.any,
  willPayObjs: P.any,
  userinfo: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    userinfo: state.app.userinfo,
    orderParams: state.shop.orderParams,
    willPayObjs: state.shop.willPayObjs
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        shopStartPayOrder,
        placeAndOrder,
        placeAndOrderMany,
        queryCustomerList,
        saveOrderInfo,
        getStationInfoById
      },
      dispatch
    )
  })
)(HomePageContainer);

// {
//     // 健康食品、生物科技有这个提示 1-水机 2-养未来，3-冷敷贴，5-体检
//     d && [2, 3].includes(d.typeId) && this.state.station ? (
//         <div className="other-info">(此款项是代{ this.state.station }收取)</div>
//     ) : null
// }
// {
//     // 健康食品、生物科技有这个提示 1-水机 2-养未来，3-冷敷贴，5-体检
//     d && [5].includes(d.typeId) && this.state.station ? (
//         [
//             <div className="other-info" key={1}>(此款项是代{ this.state.station }收取)</div>,
//             <ul className="other-info-ul" key={2}>
//                 <li>如需开票，请联系：</li>
//                 <li>{ this.state.station }：<a href="tel:4001519999" target="_blank" rel="nofollow noopener noreferrer">联系门店</a></li>
//                 <li>客服热线：<a href="tel:4001519999" target="_blank" rel="nofollow noopener noreferrer">4001519999</a></li>
//             </ul>
//         ]
//     ) : null
// }
