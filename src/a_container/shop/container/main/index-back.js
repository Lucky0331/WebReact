/* 我的e家 - 商城主页 */

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

import { Tabs, Carousel, Toast } from "antd-mobile";
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
import { shopCartCount } from "../../../../a_action/new-action";
// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      barPics: [] // 顶部轮播图
    };
    this.show = 0;
  }

  componentDidMount() {
    document.title = "健康商城";
    // 如果state中没有所有的产品信息，就重新获取
    if (!this.props.allProducts.length) {
      this.props.actions.getProDuctList().finally(() => this.getShow());
    } else {
      this.getShow();
    }
    this.props.actions.shopCartCount();
    this.getPics(); // 获取顶部轮播图
  }

  // 获取顶部轮播
  getPics() {
    this.props.actions
      .mallApList({ typeCode: "shop" })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            barPics: res.data,
            imgHeight: "178px"
          });
        }
      })
      .finally(() => this.getShow());
  }

  getShow() {
    this.show++;
    if (this.show >= 2) {
      this.setState({
        show: true
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

  // 点击一个商品，进入商品详情页
  onProClick(id) {
    this.props.history.push(`/shop/gooddetail/${id}`);
  }

  // 将商品添加进购物车
  onPushCar(e, id) {
    e.stopPropagation();
    if (this.props.shoppingCarNum >= 200) {
      Toast.info("您购物车内的商品数量过多，清理后方可加入购物车", 2);
      return;
    }
    this.props.actions
      .pushCarInterface({ productId: id, number: 1 })
      .then(res => {
        if (res.status === 200) {
          Toast.success("加入购物车成功", 1);
          this.props.actions.shopCartCount();
        } else {
          Toast.info(res.message);
        }
      });
  }
  render() {
    const d = [...this.props.allProducts].sort((a, b) => a - b);
    const u = this.props.userinfo;
    return (
      <div className={this.state.show ? "shop-main show" : "shop-main"}>
        {/* 顶部轮播 */}
        {this.state.barPics.length ? (
          <Carousel
            className="my-carousel"
            autoplay={true}
            infinite={true}
            swipeSpeed={35}
          >
            {this.state.barPics.map((item, index) => (
              <a
                key={index}
                href={u ? `${item.url}&e=${u.id}` : item.url}
                style={{
                  display: "inline-block",
                  width: "100%",
                  height: this.state.imgHeight
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={item.adImg}
                  style={{ width: "100%", verticalAlign: "top" }}
                  onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event("resize"));
                    this.setState({ imgHeight: "auto" });
                  }}
                />
              </a>
            ))}
          </Carousel>
        ) : (
          <div style={{ height: this.state.imgHeight }} />
        )}
        <div className="body-box">
          <Tabs
            tabs={[
              { title: "全部", id: 0 },
              ...d.map((item, index) => {
                return { title: item.name, id: item.id };
              })
            ]}
            swipeable={false}
            renderTabBar={props => <Tabs.DefaultTabBar {...props} page={5} />}
            onChange={(tab, index) => {}}
          >
            {(() => {
              const res = [];
              d.forEach((item, index) => {
                if (item.productList) {
                  res.push(...item.productList);
                }
              });

              const arr = [];
              arr.push(
                <div key={0} className="tab-box">
                  <div>
                    {res.filter((vv, ii) => !(ii % 2)).map((vvv, iii) => {
                      return (
                        <div
                          className="a-product"
                          key={iii}
                          onClick={() => this.onProClick(vvv.id)}
                        >
                          <img
                            src={vvv.detailImg && vvv.detailImg.split(",")[0]}
                          />
                          <div className="p-t all_nowarp2">{vvv.name}</div>
                          <div className="p-m">
                            ￥
                            {vvv.productModel &&
                              tools.point2(
                                vvv.productModel.price +
                                  vvv.productModel.openAccountFee
                              )}
                          </div>
                          <div
                            className="p-i"
                            onClick={e => this.onPushCar(e, vvv.id)}
                          >
                            <span>
                              已售：
                              {vvv.buyCount || 0}
                            </span>
                            <img src={ImgCar} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    {res.filter((vv, ii) => ii % 2).map((vvv, iii) => {
                      return (
                        <div
                          className="a-product"
                          key={iii}
                          onClick={() => this.onProClick(vvv.id)}
                        >
                          <img
                            src={vvv.detailImg && vvv.detailImg.split(",")[0]}
                          />
                          <div className="p-t all_nowarp2">{vvv.name}</div>
                          <div className="p-m">
                            ￥
                            {vvv.productModel &&
                              tools.point2(
                                vvv.productModel.price +
                                  vvv.productModel.openAccountFee
                              )}
                          </div>
                          <div
                            className="p-i"
                            onClick={e => this.onPushCar(e, vvv.id)}
                          >
                            <span>
                              已售：
                              {vvv.buyCount || 0}
                            </span>
                            <img src={ImgCar} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );

              arr.push(
                ...d.map((v, i) => {
                  return (
                    <div key={i} className="tab-box">
                      <div>
                        {v.productList
                          .filter((vv, ii) => !(ii % 2))
                          .map((vvv, iii) => {
                            return (
                              <div
                                className="a-product"
                                key={iii}
                                onClick={() => this.onProClick(vvv.id)}
                              >
                                <img
                                  src={
                                    vvv.detailImg && vvv.detailImg.split(",")[0]
                                  }
                                />
                                <div className="p-t all_nowarp2">
                                  {vvv.name}
                                </div>
                                <div className="p-m">
                                  ￥
                                  {vvv.productModel &&
                                    tools.point2(
                                      vvv.productModel.price +
                                        vvv.productModel.openAccountFee
                                    )}
                                </div>
                                <div
                                  className="p-i"
                                  onClick={e => this.onPushCar(e, vvv.id)}
                                >
                                  <span>
                                    已售：
                                    {vvv.buyCount || 0}
                                  </span>
                                  <img src={ImgCar} />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      <div>
                        {v.productList
                          .filter((vv, ii) => ii % 2)
                          .map((vvv, iii) => {
                            return (
                              <div
                                className="a-product"
                                key={iii}
                                onClick={() => this.onProClick(vvv.id)}
                              >
                                <img
                                  src={
                                    vvv.detailImg && vvv.detailImg.split(",")[0]
                                  }
                                />
                                <div className="p-t all_nowarp2">
                                  {vvv.name}
                                </div>
                                <div className="p-m">
                                  ￥
                                  {vvv.productModel &&
                                    tools.point2(
                                      vvv.productModel.price +
                                        vvv.productModel.openAccountFee
                                    )}
                                </div>
                                <div
                                  className="p-i"
                                  onClick={e => this.onPushCar(e, vvv.id)}
                                >
                                  <span>
                                    已售：
                                    {vvv.buyCount || 0}
                                  </span>
                                  <img src={ImgCar} />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })
              );
              return arr;
            })()}
          </Tabs>
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
  allProducts: P.array,
  allProductTypes: P.array,
  userinfo: P.any,
  shoppingCarNum: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    allProducts: state.shop.allProducts,
    allProductTypes: state.shop.allProductTypes,
    userinfo: state.app.userinfo,
    shoppingCarNum: state.shop.shoppingCarNum
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        getProDuctList,
        listProductType,
        mallApList,
        pushCarInterface,
        shopCartCount
      },
      dispatch
    )
  })
)(HomePageContainer);
