/* 支付成功展示页面 */

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
import { Toast } from "antd-mobile";
// ==================
// 所需的所有组件
// ==================
import { List, Button } from "antd-mobile";
import ImgIcon from "../../../../assets/1@3x.png";
import ImgFail from "../../../../assets/quxiao@3x.png";
// ==================
// 本页面所需action
// ==================

import {
  mallOrderHraCard,
  mallOrderQuery,
  payOrderQuery
} from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: {}
    };
  }

  UNSAFE_componentWillMount() {}
  componentDidMount() {
    document.title = "支付结果";
    sessionStorage.removeItem("pay-obj");
    sessionStorage.removeItem("pay-info");
    sessionStorage.removeItem("pay-start"); // 清除支付回跳标识

    const id = String(this.props.location.pathname.split("/").slice(-1));
    if (!Number(id)) {
      this.props.history.replace("/my/order");
    }
    this.getOrderData(id);
  }

  componentWillUnmount() {
    Toast.hide();
  }

  /** 获取当前订单最新信息 **/
  getOrderData(id) {
    Toast.loading("请稍后...", 0);
    this.props.actions
      .payOrderQuery({ mainOrderId: id, tradeType: "JSAPI" })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            orderData: res.data
          });
        }
      })
      .finally(() => {
        Toast.hide();
      });
  }

  render() {
    return (
      <div className="flex-auto page-box page-pay-result">
        <div className="head">
          {["SUCCESS"].includes(this.state.orderData.state) ? (
            <img src={ImgIcon} />
          ) : (
            <img src={ImgFail} />
          )}
          <div>
            {(() => {
              switch (String(this.state.orderData.state)) {
                case "SUCCESS":
                  return "支付成功";
                case "REFUND":
                  return "转入退款";
                case "NOTPAY":
                  return "未支付";
                case "CLOSED":
                  return "已关闭";
                case "REVOKED":
                  return "已撤销";
                case "USERPAYING":
                  return "支付处理中";
                case "PAYERROR":
                  return "支付失败";
                default:
                  return "--";
              }
            })()}
          </div>
        </div>
        <div className="pay-info">
          <div>
            订单号：
            {this.state.orderData.mainOrderId || ""}
          </div>
          <div>
            下单时间：
            {this.state.orderData.createTime || ""}
          </div>
          <div>
            付款时间：
            {this.state.orderData.payTime || ""}
          </div>
          <div>
            数量：
            {this.state.orderData.count}
          </div>
          <div>
            实付款：
            {this.state.orderData.fee ? `￥ ${this.state.orderData.fee}` : ""}
          </div>
        </div>
        <div className="thefooter">
          <Button
            type="primary"
            onClick={() => this.props.history.replace("/my/order")}
          >
            返回我的订单
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
      { mallOrderHraCard, mallOrderQuery, payOrderQuery },
      dispatch
    )
  })
)(HomePageContainer);
