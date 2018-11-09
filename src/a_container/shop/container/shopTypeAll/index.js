/* 我的e家 - 商城主页 - 某一个分类的页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import Img404 from "../../../../assets/not-found.png";
import P from "prop-types";
import "./index.scss";
import tools from "../../../../util/all";
import FlyBall from "../../../../a_component/FlyBall";
import _ from "lodash";
// ==================
// 所需的所有组件
// ==================

import { Tabs, Carousel, Toast ,Modal} from "antd-mobile";
import ImgCar from "../../../../assets/shop/jrgwc@3x.png";
// ==================
// 本页面所需action
// ==================

import {
  getProDuctList,
  listProductType,
  mallApList,
  pushCarInterface
} from "../../../../a_action/shop-action";
import { shopCartCount, getRecommend } from "../../../../a_action/new-action";
// ==================
// Definition
// ==================
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      barId: Number(this.props.location.pathname.split("/").slice(-1)) || 0, // 当前选择的大分类id,用于渲染不同的barTab页
      hotData: {
        id: 0,
        code: 0,
        name: "热销产品",
        productList: [],
        productTagList: null
      }, // 热销产品数据
      ballData: null
    };
  }

  componentDidMount() {
    document.title = "分类";
    // 如果state中没有所有的产品信息，就重新获取
    if (!this.props.allProducts.length) {
      this.props.actions.getProDuctList();
    }
    // 获取热销产品
    if (!this.props.homeRecommend || !this.props.homeRecommend.length) {
      this.getRecommend();
    } else {
      const d = _.cloneDeep(this.state.hotData);
      d.productList = this.props.homeRecommend;
      this.setState({
        hotData: d
      });
    }

    this.props.actions.shopCartCount(); // 获取一下购物车数量咯，因为这个页面有加入购物车操作
  }

  UNSAFE_componentWillReceiveProps(nextP) {
    if (nextP.homeRecommend !== this.props.homeRecommend) {
      const d = _.cloneDeep(this.state.hotData);
      d.productList = this.props.homeRecommend;
      this.setState({
        hotData: d
      });
    }
  }
  // 工具 - 通过型号ID查型号名称
  getTypeNameById(id) {
    const result = this.props.allProductTypes.find(
      item => Number(item.id) === Number(id)
    );
    return result ? result.name : "";
  }

  // 获取热销产品
  getRecommend() {
    this.props.actions.getRecommend();
  }

  // 点击一个商品，进入商品详情页
  onProClick(id) {
    this.props.history.push(`/shop/gooddetail/${id}`);
  }

  // 将商品添加进购物车
  onPushCar(e, id ,activityType) {
    console.log('打印了什么啊',id,activityType)
    if(activityType == 0){
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
    e.stopPropagation();
    if (this.props.shoppingCarNum >= 200) {
      Toast.info("您购物车内的商品数量过多，清理后方可加入购物车", 2);
      return;
    }
    if(!activityType == 0){
      // 小球动画
      const win = document.getElementById("window_flod");
      this.setState({
        ballData: [e.clientX, e.clientY, win.offsetLeft + 10, win.offsetTop]
      });
      this.props.actions
        .pushCarInterface({ productId: id, number: 1 })
        .then(res => {
          if (res.status === 200) {
            this.props.actions.shopCartCount();
          } else {
            Toast.info(res.message);
          }
        });
    }
  }

  // 切换bar的Tab页
  barTabChange(id) {
    this.setState({
      barId: Number(id)
    });
  }

  // 点击一个商品，进入商品详情页
  onProClick(id) {
    this.props.history.push(`/shop/gooddetail/${id}`);
  }

  render() {
    const d = [...this.props.allProducts].sort((a, b) => a - b); // 原始分类的数据
    // 根据左侧的选择，某一类分类数据
    const tabData =
      this.state.barId === 0
        ? this.state.hotData
        : d.find(item => item.id === this.state.barId) || { productList: [] };
    console.log("TABDATA:", tabData, this.state.barId, d);
    // 当前选择的这一分类的二级分类标签
    const tabTags = tabData.productTagList
      ? [...tabData.productTagList].sort((a, b) => a - b)
      : [];

    if (tabTags.length) {
      tabTags.unshift({ id: 0, sorts: 0, tagCode: 0, tagName: "全部" });
    }
    // console.log("热销产品有没有：", this.state.hotData);
    return (
      <div className="shop-type-all">
        <div className={"l-box"}>
          <div
            key={0}
            className={this.state.barId === 0 ? "check" : ""}
            onClick={() => this.barTabChange(0)}
          >
            <div>热销产品</div>
          </div>
          {d.map((item, index) => {
            return (
              <div
                key={index}
                className={this.state.barId === item.id ? "check" : ""}
                onClick={() => this.barTabChange(item.id)}
              >
                <div>{item.name}</div>
              </div>
            );
          })}
        </div>
        <div className={"r-box"}>
          {/** 有分类时，加载Tabs组件，没有时就直接显示一个页面好了 **/
          tabTags.length ? (
            <Tabs
              tabs={tabTags.map(item => ({
                title: item.tagName,
                code: item.tagCode
              }))}
              swipeable={false}
              renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} />}
              onChange={(tab, index) => {}}
            >
              {(() => {
                const arr = [];
                arr.push(
                  ...tabTags.map((v, i) => {
                    const tData =
                      v.tagCode === 0
                        ? tabData.productList
                        : tabData.productList.filter(tItem => {
                            const types = tItem.productTag
                              ? tItem.productTag.split(",")
                              : [];
                            return types.includes(String(v.tagCode));
                          });
                    return tData.length ? (
                      <div key={i} className="tab-box">
                        {tData.map((vvv, iii) => {
                          console.log('又是啥vvv',vvv)
                          return (
                            <div
                              className="one"
                              key={iii}
                              onClick={() => this.onProClick(vvv.id)}
                            >
                              <div className="pic">
                                <img
                                  src={
                                    vvv.detailImg && vvv.detailImg.split(",")[0]
                                  }
                                />
                              </div>
                              <div className="infos">
                                <div className="t all_warp">{vvv.name}</div>
                                <div
                                  className="num"
                                >
                                  <span className="money">
                                    ￥
                                    {vvv.productModel &&
                                      tools.point2(
                                        vvv.productModel.price +
                                          vvv.productModel.openAccountFee
                                      )}
                                  </span>
                                  <img src={ImgCar} onClick={e => this.onPushCar(e, vvv.id ,vvv.activityType)} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div key={i} className="tab-box">
                        <div
                          className="data-nothing"
                          style={{ margin: "20px auto" }}
                        >
                          <img src={Img404} />
                          <div>亲，这里什么也没有哦~</div>
                        </div>
                      </div>
                    );
                  })
                );
                return arr;
              })()}
            </Tabs>
          ) : tabData.productList.length ? (
            <div key={0} className="tab-box only-tab-box">
              {tabData.productList.map((vvv, iii) => {
                return (
                  <div
                    className="one"
                    key={iii}
                    onClick={() => this.onProClick(vvv.id)}
                  >
                    <div className="pic">
                      <img src={vvv.detailImg && vvv.detailImg.split(",")[0]} />
                    </div>
                    <div className="infos">
                      <div className="t all_warp">{vvv.name}</div>
                      <div
                        className="num"
                      >
                        <span className="money">
                          ￥
                          {vvv.productModel &&
                            tools.point2(
                              vvv.productModel.price +
                                vvv.productModel.openAccountFee
                            )}
                        </span>
                        <img src={ImgCar} onClick={e => this.onPushCar(e, vvv.id ,vvv.activityType)}/>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div key={0} className="tab-box">
              <div className="data-nothing" style={{ margin: "20px auto" }}>
                <img src={Img404} />
                <div>亲，这里什么也没有哦~</div>
              </div>
            </div>
          )}
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
  allProducts: P.array,
  allProductTypes: P.array,
  userinfo: P.any,
  shoppingCarNum: P.any,
  homeRecommend: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    allProducts: state.shop.allProducts,
    allProductTypes: state.shop.allProductTypes,
    userinfo: state.app.userinfo,
    shoppingCarNum: state.shop.shoppingCarNum,
    homeRecommend: state.n.homeRecommend
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        getProDuctList,
        listProductType,
        mallApList,
        pushCarInterface,
        shopCartCount,
        getRecommend
      },
      dispatch
    )
  })
)(HomePageContainer);
