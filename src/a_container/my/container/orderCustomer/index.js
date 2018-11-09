/* 我的e家 - 客户订单 */

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

import { Tabs, Modal, Toast, Badge, DatePicker } from "antd-mobile";
import Img404 from "../../../../assets/not-found.png";
import ImgChose from "../../../../assets/chose@3x.png";
// ==================
// 本页面所需action
// ==================

import {
  auditList,
  setAuditList,
  saveOrderInfo
} from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 所有的订单数据
      choseShow: false, // 筛选框是否打开
      searchBeginTime: undefined,
      searchEndTime: undefined,
      searchKeys: "",
      searchOrderId: "",
      searchOrderKeys: "",
      searchBeginTimeT: undefined,
      searchEndTimeT: undefined,
      searchKeysT: "",
      searchOrderIdT: "",
      searchOrderKeysT: ""
    };
  }

  componentDidMount() {
    document.title = "我的客户订单";
    this.getData();
  }

  componentWillUnmount() {
    Toast.hide();
  }

  // 获取数据
  getData() {
    const params = {
      beginTime:
      this.state.searchBeginTimeT &&
      `${tools.dateformart(this.state.searchBeginTimeT)} 00:00:00`,
      endTime:
      this.state.searchEndTimeT &&
      `${tools.dateformart(this.state.searchEndTimeT)} 23:59:59`,
      keys: this.state.searchKeysT,
      orderKeys: this.state.searchOrderKeysT,
      orderId: this.state.searchOrderIdT,
      pageNum: 1,
      pageSize: 9999,
    };

    this.props.actions
      .auditList(tools.clearNull(params))
      .then(res => {
        if (res.status === 200 && res.data) {
          this.setState({
            data: res.data.result || []
          });
          console.log("订单信息：", res.data.result);
        }
      })
      .catch(() => {
        Toast.info("网络错误，请重试", 1);
      });
  }

  // 工具 - 根据type值获取是什么状态
  getNameByConditions(type, type1) {
    switch (String(type1)) {
      case "3":
        return "退款中";
      case "4":
        return "已退款";
      default:
    }

    switch (String(type)) {
      case "1":
        return this.props.userinfo && this.props.userinfo.userType === 6
          ? "等待主账号审核"
          : "待审核";
      case "2":
        return "待发货";
      case "3":
        return "已发货";
      case "4":
        return "已完成";
      default:
        return "";
    }
  }

  // 待付款的订单点击付款
  onPay(obj) {
    sessionStorage.setItem("pay-info", JSON.stringify(obj));
    console.log("代入的obj", obj.product);
    sessionStorage.setItem(
      "pay-obj",
      JSON.stringify({ nowProduct: obj.product })
    );
    this.props.history.push("/shop/payChose/1");
  }

  // 查看订单详情
  onSeeDetail(obj) {
    this.props.actions.saveOrderInfo(obj);
    this.props.history.push(`/my/ordercustomerdetail`);
  }

  // 修改客户订单的审核是否通过
  onSetOrder(orderId, activityStatus) {
    alert(
      "审核操作",
      activityStatus === 1 ? "我已了解并同意180的体验政策" : "确认审核不通过?",
      [
        { text: "取消", onPress: () => console.log("cancel") },
        {
          text: "确定",
          onPress: () =>
            new Promise((resolve, rej) => {
              Toast.loading("请稍后...", 0);
              this.props.actions
                .setAuditList({ orderId, activityStatus })
                .then(res => {
                  if (res.status === 200) {
                    this.getData();
                    Toast.success("操作成功", 1);
                  } else {
                    Toast.info(res.message);
                  }
                  resolve();
                })
                .catch(() => {
                  rej();
                })
                .finally(() => {
                  Toast.hide();
                });
            })
        }
      ]
    );
  }

  // 返回当前订单的各状态
  makeType(item) {
    if (
      item.conditions === 1 &&
      [1, 2, 5].includes(this.props.userinfo.userType)
    ) {
      return [
        <a key="0" onClick={() => this.onSetOrder(item.id, 2)}>
          审核不通过
        </a>,
        <a key="0" className="blue" onClick={() => this.onSetOrder(item.id, 1)}>
          审核通过
        </a>
      ];
    }
    return null;
  }

  // 打开筛选
  onChoseClick() {
    console.log("触发：");
    this.setState({
      choseShow: true
    });
  }

  onChoseClose() {
    this.setState({
      choseShow: false
    });
  }

  // 重置
  onChoseReset() {
    console.log("重置");
    this.setState({
      searchKeys: "",
      searchOrderId: "",
      searchEndTime: undefined,
      searchBeginTime: undefined,
      searchOrderKeys: "",

      searchKeysT: "",
      searchOrderIdT: "",
      searchEndTimeT: undefined,
      searchBeginTimeT: undefined,
      searchOrderKeysT: ""
    });
  }

  // 确认筛选条件
  onChoseSubmit() {
    this.setState(
      {
        searchKeysT: this.state.searchKeys,
        searchOrderIdT: this.state.searchOrderId,
        searchEndTimeT: this.state.searchEndTime,
        searchBeginTimeT: this.state.searchBeginTime,
        searchOrderKeysT: this.state.searchOrderKeys
      },
      () => {
        this.getData();
      }
    );
    this.onChoseClose();
  }

  onTabChange(tab, index) {
    const { searchKeysT, searchOrderIdT, searchEndTimeT, searchBeginTimeT, searchOrderKeysT } = this.state;
    if(searchKeysT || searchOrderIdT || searchEndTimeT || searchBeginTimeT || searchOrderKeysT){
      this.setState({
        searchKeys: "",
        searchOrderId: "",
        searchEndTime: undefined,
        searchBeginTime: undefined,
        searchOrderKeys: "",

        searchKeysT: "",
        searchOrderIdT: "",
        searchEndTimeT: undefined,
        searchBeginTimeT: undefined,
        searchOrderKeysT: "",
      }, this.getData);
    }
  }

  render() {
    const data = this.state.data.filter(item =>
      [1, 2, 3, 4].includes(item.conditions)
    ); // 全部数据(只包含待审核、待发货、退款中、已退款、待收货)
    const dataA = data.filter(item => item.conditions === 1); // 待审核
    const dataB = data.filter(item => item.conditions === 2); // 待发货
    const dataC = data.filter(item => item.conditions === 3); // 待收货
    const dataD = data.filter(item => item.conditions === 4); // 已完成
    return (
      <div className="page-order-customer">
        <Tabs
          swipeable={false}
          tabs={[
            { title: "全部" },
            { title: <Badge text={dataA.length}>待审核</Badge> },
            { title: <Badge text={dataB.length}>待发货</Badge> },
            { title: <Badge text={dataC.length}>待收货</Badge> },
            { title: "已完成" }
          ]}
          onChange={(tab, index) => this.onTabChange(tab, index)}
        >
          {/** 全部 **/}
          <div className="tabs-div">
            <div className="luo-title">
              <div>共计: {data.length}单</div>
              <div className="chose-btn" onClick={() => this.onChoseClick()}>
                <img src={ImgChose} />
                筛选
              </div>
            </div>
            <ul>
              {data.length ? (
                data.map((item, index) => {
                  return (
                    <li className="card-box" key={index}>
                      <div className="title page-flex-row flex-jc-sb">
                        <span className="num">
                          订单号：
                          {item.id}
                        </span>
                        <span className="type">
                          {this.getNameByConditions(
                            item.conditions,
                            item.activityStatus
                          )}
                        </span>
                      </div>
                      <div
                        className="info page-flex-row"
                        onClick={() => this.onSeeDetail(item)}
                      >
                        <div className="pic flex-none">
                          {item.product && item.product.detailImg ? (
                            <img src={item.product.detailImg.split(",")[0]} />
                          ) : null}
                        </div>
                        <div className="goods flex-auto">
                          <div className="t">
                            {item.product ? item.product.name : ""}
                          </div>
                          <div className="i">
                            价格：￥
                            {item.product && item.product.productModel
                              ? item.product.productModel.price * item.count +
                                (item.product.productModel.openAccountFee ||
                                  0) +
                                (item.product.productModel.shipFee || 0)
                              : ""}
                          </div>
                          <div className="i">
                            数量：
                            {item.count}
                          </div>
                          <div className="i">
                            总计：￥
                            {item.product && item.product.productModel
                              ? item.product.productModel.price * item.count +
                                (item.product.productModel.openAccountFee ||
                                  0) +
                                (item.product.productModel.shipFee || 0)
                              : ""}
                          </div>
                        </div>
                      </div>
                      <div className="controls page-flex-row flex-jc-end">
                        {this.makeType(item)}
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="data-nothing">
                  <img src={Img404} />
                  <div>亲，这里什么也没有哦~</div>
                </li>
              )}
            </ul>
          </div>
          {/** 待审核 **/}
          <div className="tabs-div">
            <div className="luo-title">
              <div>共计: {dataA.length}单</div>
              <div className="chose-btn" onClick={() => this.onChoseClick()}>
                <img src={ImgChose} />
                筛选
              </div>
            </div>
            <ul>
              {dataA.length ? (
                dataA.map((item, index) => {
                  return (
                    <li className="card-box" key={index}>
                      <div className="title page-flex-row flex-jc-sb">
                        <span className="num">
                          订单号：
                          {item.id}
                        </span>
                        <span className="type">
                          {this.getNameByConditions(
                            item.conditions,
                            item.activityStatus
                          )}
                        </span>
                      </div>
                      <div
                        className="info page-flex-row"
                        onClick={() => this.onSeeDetail(item)}
                      >
                        <div className="pic flex-none">
                          {item.product && item.product.detailImg ? (
                            <img src={item.product.detailImg.split(",")[0]} />
                          ) : null}
                        </div>
                        <div className="goods flex-auto">
                          <div className="t">
                            {item.product ? item.product.name : ""}
                          </div>
                          <div className="i">
                            价格：￥
                            {item.product && item.product.productModel
                              ? item.product.productModel.price * item.count +
                                (item.product.productModel.openAccountFee ||
                                  0) +
                                (item.product.productModel.shipFee || 0)
                              : ""}
                          </div>
                          <div className="i">
                            数量：
                            {item.count}
                          </div>
                          <div className="i">
                            总计：￥
                            {item.product && item.product.productModel
                              ? item.product.productModel.price * item.count +
                                (item.product.productModel.openAccountFee ||
                                  0) +
                                (item.product.productModel.shipFee || 0)
                              : ""}
                          </div>
                        </div>
                      </div>
                      <div className="controls page-flex-row flex-jc-end">
                        {this.makeType(item)}
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="data-nothing">
                  <img src={Img404} />
                  <div>亲，这里什么也没有哦~</div>
                </li>
              )}
            </ul>
          </div>
          {/** 待发货 **/}
          <div className="tabs-div">
            <div className="luo-title">
              <div>共计: {dataB.length}单</div>
              <div className="chose-btn" onClick={() => this.onChoseClick()}>
                <img src={ImgChose} />
                筛选
              </div>
            </div>
            <ul>
              {dataB.length ? (
                dataB.map((item, index) => {
                  return (
                    <li className="card-box" key={index}>
                      <div className="title page-flex-row flex-jc-sb">
                        <span className="num">
                          订单号：
                          {item.id}
                        </span>
                        <span className="type">
                          {this.getNameByConditions(
                            item.conditions,
                            item.activityStatus
                          )}
                        </span>
                      </div>
                      <div
                        className="info page-flex-row"
                        onClick={() => this.onSeeDetail(item)}
                      >
                        <div className="pic flex-none">
                          {item.product && item.product.detailImg ? (
                            <img src={item.product.detailImg.split(",")[0]} />
                          ) : null}
                        </div>
                        <div className="goods flex-auto">
                          <div className="t">
                            {item.product ? item.product.name : ""}
                          </div>
                          <div className="i">
                            价格：￥
                            {item.product && item.product.productModel
                              ? item.product.productModel.price * item.count +
                                (item.product.productModel.openAccountFee ||
                                  0) +
                                (item.product.productModel.shipFee || 0)
                              : ""}
                          </div>
                          <div className="i">
                            数量：
                            {item.count}
                          </div>
                          <div className="i">
                            总计：￥
                            {item.product && item.product.productModel
                              ? item.product.productModel.price * item.count +
                                (item.product.productModel.openAccountFee ||
                                  0) +
                                (item.product.productModel.shipFee || 0)
                              : ""}
                          </div>
                        </div>
                      </div>
                      <div className="controls page-flex-row flex-jc-end">
                        {this.makeType(item)}
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="data-nothing">
                  <img src={Img404} />
                  <div>亲，这里什么也没有哦~</div>
                </li>
              )}
            </ul>
          </div>
          {/** 待收货 **/}
          <div className="tabs-div">
            <div className="luo-title">
              <div>共计: {dataC.length}单</div>
              <div className="chose-btn" onClick={() => this.onChoseClick()}>
                <img src={ImgChose} />
                筛选
              </div>
            </div>
            <ul>
              {dataC.length ? (
                dataC.map((item, index) => {
                  return (
                    <li className="card-box" key={index}>
                      <div className="title page-flex-row flex-jc-sb">
                        <span className="num">
                          订单号：
                          {item.id}
                        </span>
                        <span className="type">
                          {this.getNameByConditions(
                            item.conditions,
                            item.activityStatus
                          )}
                        </span>
                      </div>
                      <div
                        className="info page-flex-row"
                        onClick={() => this.onSeeDetail(item)}
                      >
                        <div className="pic flex-none">
                          {item.product && item.product.detailImg ? (
                            <img src={item.product.detailImg.split(",")[0]} />
                          ) : null}
                        </div>
                        <div className="goods flex-auto">
                          <div className="t">
                            {item.product ? item.product.name : ""}
                          </div>
                          <div className="i">
                            价格：￥
                            {item.product && item.product.productModel
                              ? item.product.productModel.price * item.count +
                                (item.product.productModel.openAccountFee ||
                                  0) +
                                (item.product.productModel.shipFee || 0)
                              : ""}
                          </div>
                          <div className="i">
                            数量：
                            {item.count}
                          </div>
                          <div className="i">
                            总计：￥
                            {item.product && item.product.productModel
                              ? item.product.productModel.price * item.count +
                                (item.product.productModel.openAccountFee ||
                                  0) +
                                (item.product.productModel.shipFee || 0)
                              : ""}
                          </div>
                        </div>
                      </div>
                      <div className="controls page-flex-row flex-jc-end">
                        {this.makeType(item)}
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="data-nothing">
                  <img src={Img404} />
                  <div>亲，这里什么也没有哦~</div>
                </li>
              )}
            </ul>
          </div>
          {/** 已完成 **/}
          <div className="tabs-div">
            <div className="luo-title">
              <div>共计: {dataD.length}单</div>
              <div className="chose-btn" onClick={() => this.onChoseClick()}>
                <img src={ImgChose} />
                筛选
              </div>
            </div>
            <ul>
              {dataD.length ? (
                dataD.map((item, index) => {
                  return (
                    <li className="card-box" key={index}>
                      <div className="title page-flex-row flex-jc-sb">
                        <span className="num">
                          订单号：
                          {item.id}
                        </span>
                        <span className="type">
                          {this.getNameByConditions(
                            item.conditions,
                            item.activityStatus
                          )}
                        </span>
                      </div>
                      <div
                        className="info page-flex-row"
                        onClick={() => this.onSeeDetail(item)}
                      >
                        <div className="pic flex-none">
                          {item.product && item.product.detailImg ? (
                            <img src={item.product.detailImg.split(",")[0]} />
                          ) : null}
                        </div>
                        <div className="goods flex-auto">
                          <div className="t">
                            {item.product ? item.product.name : ""}
                          </div>
                          <div className="i">
                            价格：￥
                            {item.product && item.product.productModel
                              ? item.product.productModel.price * item.count +
                                (item.product.productModel.openAccountFee ||
                                  0) +
                                (item.product.productModel.shipFee || 0)
                              : ""}
                          </div>
                          <div className="i">
                            数量：
                            {item.count}
                          </div>
                          <div className="i">
                            总计：￥
                            {item.product && item.product.productModel
                              ? item.product.productModel.price * item.count +
                                (item.product.productModel.openAccountFee ||
                                  0) +
                                (item.product.productModel.shipFee || 0)
                              : ""}
                          </div>
                        </div>
                      </div>
                      <div className="controls page-flex-row flex-jc-end">
                        {this.makeType(item)}
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="data-nothing">
                  <img src={Img404} />
                  <div>亲，这里什么也没有哦~</div>
                </li>
              )}
            </ul>
          </div>
        </Tabs>

        <div
          onClick={() => this.onChoseClose()}
          className={
            this.state.choseShow ? "chose-modal-box show" : "chose-modal-box"
          }
        >
          <div className="chose-modal" onClick={e => e.stopPropagation()}>
            <ul className="form">
              <li>
                <div>下单时间：</div>
                <div>
                  <DatePicker
                    mode="date"
                    extra="Optional"
                    onChange={date => this.setState({ searchBeginTime: date })}
                  >
                    <input
                      readOnly
                      value={tools.dateformart(this.state.searchBeginTime)}
                    />
                  </DatePicker>
                  <span style={{ padding: "0 4px", flex: "none" }}> -- </span>
                  <DatePicker
                    mode="date"
                    extra="Optional"
                    onChange={date => this.setState({ searchEndTime: date })}
                  >
                    <input
                      readOnly
                      value={tools.dateformart(this.state.searchEndTime)}
                    />
                  </DatePicker>
                </div>
              </li>
              <li>
                <div>收货人：</div>
                <div>
                  <input
                    type="text"
                    maxLength="25"
                    placeholder={"姓名/手机号"}
                    onInput={e =>
                      this.setState({ searchKeys: tools.trim(e.target.value) })
                    }
                    value={this.state.searchKeys}
                  />
                </div>
              </li>
              <li>
                <div>下单人：</div>
                <div>
                  <input
                    type="text"
                    maxLength="25"
                    placeholder={"e家号/手机号"}
                    onInput={e =>
                      this.setState({ searchOrderKeys: tools.trim(e.target.value) })
                    }
                    value={this.state.searchOrderKeys}
                  />
                </div>
              </li>
              <li>
                <div>订单编号：</div>
                <div>
                  <input
                    type="text"
                    maxLength="25"
                    onInput={e =>
                      this.setState({
                        searchOrderId: tools.trim(e.target.value)
                      })
                    }
                    value={this.state.searchOrderId}
                  />
                </div>
              </li>
            </ul>
            <div className="form-foot">
              <div onClick={() => this.onChoseReset()}>重置</div>
              <div onClick={() => this.onChoseSubmit()}>确认</div>
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
      { auditList, setAuditList, saveOrderInfo },
      dispatch
    )
  })
)(HomePageContainer);
