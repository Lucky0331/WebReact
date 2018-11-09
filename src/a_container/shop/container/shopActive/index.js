/* 商城 - 体验活动主页 */

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
import $ from "jquery";
import _ from "lodash";
import { Carousel, Icon } from "antd-mobile";
import imgDefalut from "../../../../assets/logo-img.png";

// ==================
// 本页面所需action
// ==================

import {
  getProDuctListActive,
  getOrdersCount
} from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {}

  componentDidMount() {
    document.title = "体验活动";
    if (
      !this.props.allProductsActive ||
      this.props.allProductsActive.length === 0
    ) {
      this.props.actions.getProDuctListActive();
    }
    this.getOrdersCount();
  }

  // 获取活动有多少人参加
  getOrdersCount() {
    this.props.actions.getOrdersCount().then(res => {
      if (res.status === 200) {
        this.setState({
          activeCount: res.data
        });
      }
    });
  }

  render() {
    const u = this.props.userinfo;
    const allProducts = _.cloneDeep(this.props.allProductsActive).sort(
      (a, b) => a.sorts - b.sorts
    );
    return (
      <div className="flex-auto page-box shop-active-page">
        {/* 顶部图片 */}
        <div className="top-bar">
          <div>
            已有
            <span>{this.state.activeCount}</span>
            人参与
          </div>
        </div>
        {/* 所有产品列表 */}
        <div className="the-list">
          <ul className="list">
            {allProducts.map((theType, i) => {
              return theType.productList
                .filter(item => item.onShelf)
                .map((item, index) => {
                  return (
                    <li key={`${i}_${index}`}>
                      <Link to={`/shop/gooddetail/${item.id}`}>
                        <div className="pic flex-none page-flex-row flex-jc-center flex-ai-center">
                          {item.detailImg ? (
                            <img src={item.detailImg.split(",")[0]} />
                          ) : (
                            <img className="default" src={imgDefalut} />
                          )}
                        </div>
                        <div className="detail flex-auto page-flex-col">
                          <div className="t flex-none">{item.name}</div>
                          <div className="i flex-auto">
                            <div className="all_nowarp2">
                              180元享60天超值体验
                            </div>
                          </div>
                          <div className="k flex-none">
                            <div>
                              {item.buyCount || 0}
                              人申请
                            </div>
                            <div className="btn">立即申请</div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                });
            })}
          </ul>
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
  allProductsActive: P.array, // 所有的活动产品
  homePics: P.array, // 首页顶部轮播图
  userinfo: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    allProductsActive: state.shop.allProductsActive, // 所有的产品  数组
    homePics: state.shop.homePics, // 首页顶部轮播图
    userinfo: state.app.userinfo
  }),
  dispatch => ({
    actions: bindActionCreators(
      { getProDuctListActive, getOrdersCount },
      dispatch
    )
  })
)(HomePageContainer);
