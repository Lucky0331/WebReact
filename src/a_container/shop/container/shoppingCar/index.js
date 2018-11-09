/* 商城 - 购物车 */

// ==================
// 所需的各种插件
// ==================
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import _ from "lodash";
import "./index.scss";
import tools from "../../../../util/all";
// ==================
// 所需的所有组件
// ==================

import { Checkbox, SwipeAction, Toast, Modal } from "antd-mobile";
import StepLuo from "../../../../a_component/StepperLuo";
import Img404 from "../../../../assets/not-found.png";

// ==================
// 本页面所需action
// ==================

import {
  getCarInterface,
  pushDingDan,
  getDefaultAttr,
  deleteShopCar,
  updateShopCarCount
} from "../../../../a_action/shop-action";
import { shopCartCount } from "../../../../a_action/new-action";
// ==================
// Definition
// ==================
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 有效的产品
      downData: [], // 已失效的产品
      checkedAll: false, // 全选按钮是否被选中
      edit: false // 是否是编辑状态
    };
  }

  componentDidMount() {
    document.title = "购物车";
    this.getData();
    this.props.actions.shopCartCount().then(res => {
      if (res.status === 200 && res.data === 200) {
        Toast.info("您购物车内的商品数量过多 ，请及时处理", 2);
      }
    });
  }

  getData() {
    this.props.actions.getCarInterface().then(res => {
      if (res.status === 200) {
        const data = res.data.productTypes.map(item => {
          const newItem = Object.assign({}, item, { checked: false });
          newItem.productList.forEach(listItem => {
            listItem.checked = false;
          });
          return newItem;
        });
        const resData = _.cloneDeep(data);
        /**
         * 遍历，多个分成单个，服了
         * **/
        data.forEach(item => {
          const productList = [];
          item.productList.forEach(item2 => {
            item2.shopCart.forEach(item3 => {
              const temp2 = _.cloneDeep(item2);
              temp2.shopCart = item3;
              productList.push(temp2);
            });
          });
          item.productList = productList;
        });
        console.log("这变成了啥：", data);
        this.setState({
          data,
          downData: res.data.expiryList || [],
          checkedAll: false
        });
      } else {
        Toast.info(res.message, 1);
      }
    });
  }
  
  // 单独商品的删除
  deleteShopCar(ids) {
    let allId;
    console.log("allID:", ids);
    if ( !ids && !ids.length) {
      Toast.info("请选择需删除的商品", 1);
      return;
    }
    if (Array.isArray(ids)) {
      // 多个
      allId = ids.join(",");
    } else {
      allId = ids;
    }
    alert("确认删除？", "删除后不可恢复", [
      { text: "取消", onPress: () => console.log("cancel") },
      {
        text: "确认",
        onPress: () =>
            new Promise((resolve, rej) => {
              this.props.actions
                  .deleteShopCar({ shopCartIds: allId })
                  .then(res => {
                    if (res.status === 200) {
                      Toast.success("删除成功", 1);
                      this.props.actions.shopCartCount();
                      this.getData();
                    } else {
                      Toast.info(res.message);
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

  // 失效商品的删除
  deleteShopCar2(ids) {
    let allId;
    if (!ids && !ids.length) {
      return;
    }
    if (Array.isArray(ids)) {
      // 多个
      allId = ids.join(",");
    } else {
      allId = ids;
    }

    alert("确认清空？", "清空后不可恢复", [
      { text: "取消", onPress: () => console.log("cancel") },
      {
        text: "确认",
        onPress: () =>
          new Promise((resolve, rej) => {
            this.props.actions
              .deleteShopCar({ shopCartIds: allId })
              .then(res => {
                if (res.status === 200) {
                  Toast.success("删除成功", 1);
                  this.props.actions.shopCartCount();
                  this.getData();
                } else {
                  Toast.info(res.message);
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
  /**
   * 点选了复选框
   * @id: 被点选对象的ID
   * @lv: 被点选对象的层级，0 - 类别被点击， 1 - 具体的产品被点击, -1 全选按钮被点击
   * */
  onCheckbox(id, lv) {
    const d = _.cloneDeep(this.state.data);
    let checkedAll = this.state.checkedAll;
    if (lv === 0) {
      d.forEach(item => {
        if (item.id === id) {
          item.checked = !item.checked;
          item.productList.forEach(listItem => {
            listItem.checked = item.checked;
          });
        }
      });
    } else if (lv === 1) {
      outer: for (let i = 0; i < d.length; i++) {
        for (let j = 0; j < d[i].productList.length; j++) {
          if (d[i].productList[j].id === id) {
            d[i].productList[j].checked = !d[i].productList[j].checked;
            // 判断父级分类checkbox是否需要勾选
            const num = d[i].productList.filter(item => item.checked);
            console.log("你在逗我吗：", num, d[i].productList);
            if (num.length === d[i].productList.length) {
              d[i].checked = true;
            } else {
              d[i].checked = false;
            }
            break outer;
          }
        }
      }
    } else if (lv === -1) {
      checkedAll = !this.state.checkedAll;

      d.forEach(item => {
        item.checked = checkedAll;
        item.productList.forEach(listItem => {
          listItem.checked = checkedAll;
        });
      });
    }

    if (lv !== -1) {
      // 非全选按钮被点击时，需要最终判断是否需要勾选全选按钮
      const obj1 = d.filter(item => item.checked); // 所有父级被勾选的
      if (obj1.length < d.length) {
        checkedAll = false;
      } else {
        checkedAll = true;
      }
    }
    this.setState({
      checkedAll,
      data: d
    });
  }

  // 价格脏检查
  /**
   * 价格公式
   * 单个产品： （单价+开户费）* 数量 + 运费
   * 多个产品： (单价+开户费)*数量 + （单价+开户费）* 数量 + ... + 最高运费
   * **/
  checkPay(data) {
    let pay = 0;
    let shipFee = 0;
    data.forEach(item => {
      item.productList.filter(item => item.checked).forEach(listItem => {
        // 数量*单价+开户费
        pay +=
          (listItem.productModel.price + listItem.productModel.openAccountFee) *
          listItem.shopCart.number;
        shipFee = Math.max(shipFee, listItem.productModel.shipFee);
      });
    });
    return pay + shipFee;
  }

  // 修改商品的数量
  changeNum(num, id) {
    const d = _.cloneDeep(this.state.data);
    outer: for (let i = 0; i < d.length; i++) {
      for (let j = 0; j < d[i].productList.length; j++) {
        if (d[i].productList[j].id === id) {
          d[i].productList[j].shopCart.number = num;
          this.props.actions
            .updateShopCarCount({
              shopCartId: d[i].productList[j].shopCart.id,
              addCount: num
            })
            .then(res => {
              if (res.status === 200) {
                this.setState({
                  data: d
                });
              } else if (res.status !== 0) {
                Toast.info(res.message, 1);
              }
            });
          break outer;
        }
      }
    }
  }

  // 结算
  onSubmit() {
    // 筛选出勾选的商品
    const arr = [];
    for (let i = 0; i < this.state.data.length; i++) {
      const obj = this.state.data[i].productList.filter(item => item.checked);
      arr.push(...obj);
    }
    if (!arr.length) {
      Toast.info("您还没有选择商品哦", 1);
      return;
    }
    if (this.checkPay(this.state.data) > 10000) {
      Toast.info("单笔单日金额不可超过1万，请重新选择商品", 2);
      return;
    }
    this.props.actions.getDefaultAttr(); // 查默认收货地址
    this.props.actions.pushDingDan(arr); // 所选商品放进待结算数组
    this.props.history.push("/shop/confirmpay/2");
  }

  // 根据ID查对应的计费方式名字
  getFeeTypeName(id, arr) {
    if (!id || !arr) {
      return null;
    }
    const obj = arr.find(item => item.id === id);
    return obj ? obj.chargeName : null;
  }

  onEdit() {
    this.setState({
      edit: !this.state.edit
    });
  }

  // 批量删除
  onDeleteMany() {
    let arr = [];
    this.state.data.forEach(item => {
      if (item && item.productList) {
        arr = [
          ...arr,
          ...item.productList
            .filter(item2 => item2.checked)
            .map(item2 => (item2.shopCart ? item2.shopCart.id : 0))
        ];
      }
    });
    arr = Array.from(new Set(arr));
    this.deleteShopCar(arr);
  }

  render() {
    return (
      <div className="shopping-car">
        <div className="page-title">
          <div className="l">
            共计:
            {this.state.data.reduce((res, item) => {
              return (
                res +
                item.productList
                  .reduce((res2, item2) => {
                    return res2 + item2.shopCart.number || 0;
                  }, 0)
              );
            }, 0)}
            件
          </div>
          <div className="r" onClick={() => this.onEdit()}>
            {this.state.edit ? (
              <span className={"ok"}>完成</span>
            ) : (
              <span className="edit">编辑商品</span>
            )}
          </div>
        </div>
        <div className={"bodys"}>
          {this.state.data.length ? (
            this.state.data.map((item, index) => {
              return (
                <div key={index} className="type-box">
                  <div className="title">
                    <Checkbox
                      checked={item.checked}
                      onChange={() => this.onCheckbox(item.id, 0)}
                    >
                      <img className="icon" src={item.typeIcon} />
                      <span className="word">{item.name}</span>
                    </Checkbox>
                  </div>
                  <div className="list">
                    {item.productList &&
                      item.productList.map((listItem, listIndex) => {
                        return (
                          <SwipeAction
                            key={listIndex}
                            autoClose
                            right={[
                              {
                                text: "删除",
                                onPress: () =>
                                  this.deleteShopCar(
                                    listItem.shopCart ? listItem.shopCart.id : 0
                                  ),
                                style: { color: "white", padding: "10px" }
                              }
                            ]}
                          >
                            <div className="one">
                              <Checkbox
                                checked={listItem.checked}
                                onChange={() => this.onCheckbox(listItem.id, 1)}
                              />
                              <div
                                className="pic"
                                onClick={() =>
                                  this.props.history.push(
                                    `/shop/gooddetail/${listItem.id}`
                                  )
                                }
                              >
                                <img
                                  src={
                                    listItem.detailImg
                                      ? listItem.detailImg.split(",")[0]
                                      : null
                                  }
                                />
                              </div>
                              <div className="infos" onClick={() =>
                                this.props.history.push(
                                  `/shop/gooddetail/${listItem.id}`
                                )
                              }>
                                <div
                                  className="t all_warp"
                                >
                                  {listItem.name}
                                </div>
                                <div
                                  className="i all_warp"
                                >
                                  {this.getFeeTypeName(
                                    listItem.shopCart.feeType,
                                    listItem.productModel.chargeTypes
                                  )}
                                </div>
                                <div className="num">
                                  <span className="money">
                                    ￥
                                    {listItem.productModel
                                      ? listItem.productModel.price +
                                        listItem.productModel.openAccountFee
                                      : 0}
                                  </span>
                                  <StepLuo
                                    min={1}
                                    max={200}
                                    value={Math.min(
                                      listItem.shopCart
                                        ? listItem.shopCart.number
                                        : 1,
                                      200
                                    )}
                                    onChange={num =>
                                      this.changeNum(num, listItem.id)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </SwipeAction>
                        );
                      })}
                  </div>
                </div>
              );
            })
          ) : this.state.downData && this.state.downData.length ? null : (
            <div className="data-nothing">
              <img src={Img404} />
              <div>亲，这里什么也没有哦~</div>
            </div>
          )}
          {/** 下面是已失效的商品 **/}
          {this.state.downData && this.state.downData.length ? (
            <div className={"downs-t"}>
              <span className="t">失效商品</span>
              <span
                onClick={() =>
                  this.deleteShopCar2(this.state.downData.map(item => item.id))
                }
              >
                清空失效商品
              </span>
            </div>
          ) : null}
          {this.state.downData.map((item, index) => {
            return (
              <div key={index} className="type-box">
                <div className="list">
                  <div className="one">
                    <div className="downed">失效</div>
                    <div className="pic">
                      <img
                        src={
                          item.product.detailImg &&
                          item.product.detailImg.split(",")[0]
                        }
                      />
                    </div>
                    <div className="infos">
                      <div className="t all_warp">{item.product.name}</div>
                      <div className="num">
                        <span className="money">
                          ￥
                          {item.product.productModel
                            ? item.product.productModel.price +
                              item.product.productModel.openAccountFee
                            : 0}
                        </span>
                      </div>
                      <div className={"foot-info"}>{item.expiryReason}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={"footer-control"}>
          <Checkbox
            checked={this.state.checkedAll}
            onChange={() => this.onCheckbox(null, -1)}
          >
            <span style={{ paddingLeft: "10px" }}>全选</span>
          </Checkbox>
          <div style={{ flex: "auto" }} />
          {this.state.edit ? (
            <div className="delete" onClick={() => this.onDeleteMany()}>
              删除({this.state.data.reduce((res, item) => {
              return (
                res +
                item.productList
                  .filter(v => v.checked)
                  .reduce((res2, item2) => {
                    return res2 + item2.shopCart.number || 0;
                  }, 0)
              );
            }, 0)})
            </div>
          ) : (
            [
              <div className="all" key={"0"}>
                合计：
                <span>￥ {tools.point2(this.checkPay(this.state.data))}</span>
              </div>,
              <div className="all2" key={"1"} onClick={() => this.onSubmit()}>
                结算(
                {this.state.data.reduce((res, item) => {
                  return (
                    res +
                    item.productList
                      .filter(v => v.checked)
                      .reduce((res2, item2) => {
                        return res2 + item2.shopCart.number || 0;
                      }, 0)
                  );
                }, 0)}
                )
              </div>
            ]
          )}
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
        getCarInterface,
        pushDingDan,
        getDefaultAttr,
        deleteShopCar,
        shopCartCount,
        updateShopCarCount
      },
      dispatch
    )
  })
)(HomePageContainer);
