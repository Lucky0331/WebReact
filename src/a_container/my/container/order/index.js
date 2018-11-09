/* 我的e家 - 订单 */

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
import { Tabs, Modal, Toast, Badge, DatePicker } from "antd-mobile";
import Img404 from "../../../../assets/not-found.png";
import ImgChose from "../../../../assets/chose@3x.png";
// ==================
// 本页面所需action
// ==================

import {
  mallOrderList,
  mallOrderDel,
  shopStartPayOrder,
  mallOrderHraCard,
  saveOrderInfo,
  getShipOrderCount,
  gotoOrderType
} from "../../../../a_action/shop-action";
import { getUserInfo } from "../../../../a_action/app-action";

// ==================
// Definition
// ==================
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props, ...args) {
    super(props, ...args);
    props.cacheLifecycles.didCache(this.componentDidCache);
    props.cacheLifecycles.didRecover(this.componentDidRecover);
    this.state = {
      data: [], // 所有的订单数据
      choseShow: false, // 筛选框是否打开
      pageSize: 10,
      tabsIndex: 0,
      fuckNum: {
        fCount: 0, // 待发货
        sCount: 0 // 待收货
      },
      searchBeginTime: undefined,
      searchEndTime: undefined,
      searchKeys: "",
      searchOrderId: "",
      searchBeginTimeT: undefined,
      searchEndTimeT: undefined,
      searchKeysT: "",
      searchOrderIdT: "",
      all: [
        /** Tab标题，当前页，数据，分类号，是否需要刷新（删除订单会影响到其他分类的数据） **/
        {
          title: "全部",
          pageNum: 1,
          data: [],
          conditions: null,
          needUp: false,
          total: 0
        },
        {
          title: "待付款",
          pageNum: 1,
          data: [],
          conditions: 0,
          needUp: false,
          total: 0
        },
        {
          title: "待发货",
          pageNum: 1,
          data: [],
          conditions: 2,
          badge: true,
          needUp: false,
          total: 0
        },
        {
          title: "待收货",
          pageNum: 1,
          data: [],
          conditions: 3,
          badge: true,
          needUp: false,
          total: 0
        },
        {
          title: "已完成",
          pageNum: 1,
          data: [],
          conditions: 4,
          needUp: false,
          total: 0
        }
      ]
    };
  }

  componentDidCache = () => {
    console.log("缓存List cached");
  };

  componentDidRecover = () => {
    window.location.reload();
    document.title = "我的订单";
    console.log("缓存List recovered");
  };

  componentDidMount() {
    document.title = "我的订单";
    sessionStorage.removeItem("pay-obj");
    sessionStorage.removeItem("pay-info");
    sessionStorage.removeItem("pay-start");
    const tabsIndex = this.props.orderPageNum;
    console.log("我的订单哪一页：", tabsIndex);
    let conditions = null;
    switch (tabsIndex) {
      case 0:
        conditions = null;
        break;
      case 1:
        conditions = 0;
        break;
      case 2:
        conditions = 2;
        break;
      case 3:
        conditions = 3;
        break;
      case 4:
        conditions = 4;
        break;
    }
    this.setState({
      tabsIndex
    });
    this.getUserInfo(conditions);

  }

  // 获取当前登录用户的相关信息
  getUserInfo(conditions) {
      const openId = sessionStorage.getItem("openId");
      console.log('======openid===',openId);
      if (openId) {
        this.props.actions.getUserInfo({openId}).then(res => {
          console.log('======res===',res);
          this.getData(conditions, 1, "flash");
        });
      } else {
        console.log("未获取到openId");
      }
  }

  // // 获取当前登录用户的相关信息
  // getUserInfo() {
  //   const openId = sessionStorage.getItem("openId");
  //   if (openId) {
  //     this.props.actions.getUserInfo({ openId }).then(res => {
  //       if (res.status === 200) {
  //         this.getMyAmbassador();
  //         this.getMyCustomers();
  //       }
  //     });
  //   }
  // }

  componentWillUnmount() {
    Toast.hide();
  }

  /**
   * 获取待发货代收货数量
   * **/
  getShipOrderCount() {
    this.props.actions.getShipOrderCount().then(res => {
      if (res.status === 200) {
        this.setState({
          fuckNum: res.data
        });
      }
    });
  }

  /**
   * 获取列表数据
   * @param conditions 什么状态
   * @param pageNum 哪一页
   * @param type flash刷新，update加载更多
   */
  getData(conditions = null, pageNum = 1, type = "flash") {
    const params = {
      conditions,
      pageNum,
      pageSize: this.state.pageSize,
      beginTime:
        this.state.searchBeginTimeT &&
        `${tools.dateformart(this.state.searchBeginTimeT)} 00:00:00`,
      endTime:
        this.state.searchEndTimeT &&
        `${tools.dateformart(this.state.searchEndTimeT)} 23:59:59`,
      keys: this.state.searchKeysT,
      orderId: this.state.searchOrderIdT
    };
    const all = _.cloneDeep(this.state.all);
    const ind = this.getItemByConditions(conditions, true);
    Toast.loading("查询中...", 0);

    new Promise(function(resolve){
      resolve();
    }).then(()=>{
      this.props.actions
          .mallOrderList(tools.clearNull(params))
          .then(res => {
            if (res.status === 200) {
              if (res.data && res.data.result && res.data.result.length) {
                if (type === "flash") {
                  all[ind].data = res.data.result;
                } else if (type === "update") {
                  all[ind].data = [...all[ind].data, ...res.data.result];
                }
                all[ind].pageNum = pageNum;
                all[ind].total = res.data.total;
                Toast.hide();
              } else {
                if (type === "flash") {
                  all[ind].data = [];
                  all[ind].pageNum = 1;
                  all[ind].total = 0;
                  Toast.hide();
                } else if (type === "update") {
                  Toast.info("没有更多数据了", 1);
                }
              }
            } else {
              Toast.info(res.message, 1);
            }
            all[ind].needUp = false;
            this.setState({
              all
            });

          })
          .catch(() => {
            this.setState({
              all: this.state.all
            });
            Toast.info("网络错误，请重试", 1);
          });
    }).then(()=>{
      setTimeout(()=>this.getShipOrderCount(),400)
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
      case "0":
        return "待付款";
      case "1":
        return "待审核";
      case "2":
        return "待发货";
      case "3":
        return "已发货";
      case "4":
        return "已完成";
      case "-1":
        return "审核中";
      case "-2":
        return "未通过";
      case "-3":
        return "已取消";
      default:
        return "未知状态";
    }
  }
  // 删除订单
  onDelOrder(id, father) {
    const alertInstance = alert("确认删除订单？", "删除之后将无法再查看订单", [
      { text: "取消", onPress: () => console.log("cancel") },
      {
        text: "确定",
        onPress: () =>
          new Promise((resolve, rej) => {
            this.props.actions
              .mallOrderDel({ orderId: id })
              .then(res => {
                if (res.status === 200) {
                  const all = _.cloneDeep(this.state.all);
                  all.forEach(item => (item.needUp = true));
                  this.setState({
                    all
                  });
                  Toast.success("订单已取消", 1);
                  setTimeout(() => this.getData(father.conditions, 1, "flash"));
                } else {
                  Toast.info(res.message || "订单取消失败", 1);
                }
                resolve();
              })
              .catch(() => {
                rej();
              });
          })
      }
    ]);
    window.addEventListener("popstate", function(e) {
        alertInstance.close()
    }, false);
  }

  // 待付款的订单点击付款
  onPay(obj, father) {
    // 付款页只需要总价格和订单号
    sessionStorage.setItem(
      "pay-info",
      JSON.stringify({
        orderAmountTotal: obj.fee,
        mainOrderId: obj.mainOrderId
      })
    );
    this.props.history.push("/shop/payChose/1");
  }

  // 查看订单详情
  onSeeDetail(obj) {
    console.log("你查看详情传递的是个什么：", obj);
    this.props.actions.saveOrderInfo(obj);
    this.props.history.push(`/my/orderdetail`);
  }

  // 查看评估卡详情
  onLook(item) {
    if (item.modelType === "M") {
      // 优惠卡
      this.props.history.push(`/my/favone/${item.id}`);
    } else {
      // 普通卡
      this.props.history.push(`/my/ordercarddetail/${item.id}`);
    }
  }

  // 返回当前订单的各状态
  makeType(item, father) {
    // 先判断当时是什么类型的产品
    const type = item.product.typeId;
    switch (String(item.conditions)) {
      // 待付款
      case "0":
        return [
          <a key="0" onClick={() => this.onDelOrder(item.id, father)}>
            删除订单
          </a>,
          <a key="1" className="blue" onClick={() => this.onPay(item, father)}>
            付款
          </a>
        ];
      case "1":
        return null; // 待审核
      case "2":
        return null; // 待发货
      case "3":
        return null; // 待收货
      // 已完成
      case "4":
        const map = [
          <a key="0" onClick={() => this.onDelOrder(item.id, father)}>
            删除订单
          </a>
        ];
        if (type === 5) {
          // 精准体检，有查看卡的连接
          map.push(
            <a key="1" className="blue" onClick={() => this.onLook(item)}>
              {item.modelType === "M" ? "查看优惠卡" : "查看评估卡"}
            </a>
          );
        }
        return map;
      case "-1":
        return null;
      case "-2":
        return null;
      case "-3":
        return null;
      default:
        return null;
    }
  }

  // 工具 - 根据状态，查找all中对应哪一个
  getItemByConditions(conditions, num) {
    let ind = 0;
    if (!conditions && conditions !== 0) {
      if (num) {
        return ind;
      }
      return this.state.all[0];
    }

    const res = this.state.all.find((item, index) => {
      ind = index;
      return item.conditions === conditions;
    });
    if (num) {
      return ind;
    }
    return this.state.all.find(item => item.conditions === conditions);
  }

  // TAB页面改变时触发
  onTabChange(tab, index) {
    const t = this.getItemByConditions(tab.conditions);
    if (!t) {
      return;
    }
    this.props.actions.gotoOrderType(index);

    // 在更新tabsIndex前判断是否有筛选，如果有则把当前tab设为needUp
    const {
      searchKeysT,
      searchOrderIdT,
      searchEndTimeT,
      searchBeginTimeT,
      all
    } = this.state;
    if (searchKeysT || searchOrderIdT || searchEndTimeT || searchBeginTimeT) {
      this.setState(
        {
          searchKeys: "",
          searchOrderId: "",
          searchEndTime: undefined,
          searchBeginTime: undefined,
          searchKeysT: "",
          searchOrderIdT: "",
          searchEndTimeT: undefined,
          searchBeginTimeT: undefined
        });
      all[this.state.tabsIndex].needUp = true;
      this.setState({
        all
      });
    }

    this.setState({
      tabsIndex: index
    });

    if (!t.data.length || t.needUp) {
      // 如果这一页没有数据，或其他Tab之前有删除订单操作,或者有筛选条件，就自动重新请求一次
      // 重置筛选条件并重新请求

      this.setState(
        {
          searchKeys: "",
          searchOrderId: "",
          searchEndTime: undefined,
          searchBeginTime: undefined,
          searchKeysT: "",
          searchOrderIdT: "",
          searchEndTimeT: undefined,
          searchBeginTimeT: undefined
        },
        () => {
          this.getData(t.conditions, 1, "flash");
        }
      );
    }
  }

  onDown(item) {
    this.getData(item.conditions, 1, "flash");
  }

  onUp(item) {
    this.getData(item.conditions, item.pageNum + 1, "update");
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

      searchKeysT: "",
      searchOrderIdT: "",
      searchEndTimeT: undefined,
      searchBeginTimeT: undefined
    });
  }

  // 确认筛选条件
  onChoseSubmit() {
    this.setState(
      {
        searchKeysT: this.state.searchKeys,
        searchOrderIdT: this.state.searchOrderId,
        searchEndTimeT: this.state.searchEndTime,
        searchBeginTimeT: this.state.searchBeginTime
      },
      () => {
        this.getData(
          this.state.all[this.state.tabsIndex].conditions,
          1,
          "flash"
        );
      }
    );
    this.onChoseClose();
  }
  render() {
    const { allHave}=this.state;
    return (
      <div className="page-order" style={{ minHeight: "100vh" }}>
        <Tabs
          swipeable={false}
          initialPage={Number(
            this.props.location.pathname.split("/").slice(-1)
          )}
          page={this.state.tabsIndex}
          tabs={this.state.all.map(item => {
            let title = item.title;
            if (item.badge) {
              // 需要显示小徽标
              let num = 0;
              if (item.title === "待发货") {
                num = this.state.fuckNum.fCount;
              } else if (item.title === "待收货") {
                num = this.state.fuckNum.sCount;
              }
              title = <Badge text={num}>{item.title}</Badge>;
            }
            return {
              title,
              conditions: item.conditions
            };
          })}
          onChange={(tab, index) => this.onTabChange(tab, index)}
        >
                {this.state.all.map((item, index) => (
                    <div key={index} className="tabs-div">
                      <div className="luo-title">
                        <div>共计: {item.total}单</div>
                        <div className="chose-btn" onClick={() => this.onChoseClick()}>
                          <img src={ImgChose} />
                          筛选
                        </div>
                      </div>
                      <div className="luo-box">
                        <Luo
                            id={`luo-${index}`}
                            onUp={() => this.onUp(item)}
                            onDown={() => this.onDown(item)}
                            iscrollOptions={{
                              disableMouse: true
                            }}
                        >
                          <ul>
                            {item.data.length ? (
                                item.data.map((v, i) => {
                                  return (
                                      <li className="card-box" key={i}>
                                        <div className="title page-flex-row flex-jc-sb">
                              <span className="num">
                                订单号：
                                {v.id}
                              </span>
                                          <span className="type">
                                {this.getNameByConditions(
                                    v.conditions,
                                    v.activityStatus
                                )}
                              </span>
                                        </div>
                                        <div
                                            className="info page-flex-row"
                                            onClick={() => this.onSeeDetail(v)}
                                        >
                                          <div className="pic flex-none">
                                            {v.product && v.product.detailImg ? (
                                                <img
                                                    src={v.product.detailImg.split(",")[0]}
                                                />
                                            ) : null}
                                          </div>
                                          <div className="goods flex-auto">
                                            <div className="t">
                                              {v.product ? v.product.name : ""}
                                            </div>
                                            <div className="i">
                                              价格：￥
                                              {v.product
                                                  ? tools.point2(
                                                      v.product.productModel.price +
                                                      (v.product.productModel
                                                          .openAccountFee || 0)
                                                  )
                                                  : ""}
                                            </div>
                                            <div className="i">
                                              数量：
                                              {v.count}
                                            </div>
                                            <div className="i">
                                              总计：￥
                                              {v.product
                                                  ? tools.point2(
                                                      (v.product.productModel.price +
                                                          (v.product.productModel
                                                              .openAccountFee || 0)) *
                                                      v.count +
                                                      (v.product.productModel.shipFee || 0)
                                                  )
                                                  : ""}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="controls page-flex-row flex-jc-end">
                                          {this.makeType(v, item)}
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
                        </Luo>
                      </div>
                    </div>
                ))}
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
  userinfo: P.any,
  orderPageNum: P.number,
  cacheLifecycles: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    userinfo: state.app.userinfo,
    orderPageNum: state.shop.orderPageNum
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        mallOrderList,
        mallOrderDel,
        shopStartPayOrder,
        mallOrderHraCard,
        saveOrderInfo,
        getShipOrderCount,
        gotoOrderType,
        getUserInfo
      },
      dispatch
    )
  })
)(HomePageContainer);
