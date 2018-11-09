/* 我的e家 - 付款成功回调页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================
import { Button, List } from "antd-mobile";
import ImgSuccess from "../../../../assets/1@3x.png";
// ==================
// 本页面所需action
// ==================

import {} from "../../../../a_action/app-action";

// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.title = "支付结果";
  }

  //
  onLogOut() {
    localStorage.removeItem("userinfo");
    this.props.history.replace("/login");
  }

  render() {
    return (
      <div className="page-buy-success">
        <div className="card-box">
          <img src={ImgSuccess} />
          <div className="info">购买成功</div>
        </div>
        <List>
          <Item className="long" extra="有效期至：2018-12-22">
            评估卡
          </Item>
          <Item className="long" arrow="horizontal">
            评估卡1: 共5张体检券
          </Item>
          <Item className="long" arrow="horizontal">
            评估卡2: 共5张体检券
          </Item>
        </List>
        <div className="order-info">
          <div>订单号：123234234999999</div>
          <div>下单时间：2017-07-08 16：30：00</div>
          <div>付款时间：2017-07-08 16：30：00</div>
          <div>数量：2</div>
          <div>实付款：￥2000.00</div>
        </div>
        <List>
          <Item arrow="horizontal">使用须知</Item>
        </List>
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
    actions: bindActionCreators({}, dispatch)
  })
)(HomePageContainer);
