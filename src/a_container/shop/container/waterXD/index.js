/* 水机下单，方式选择（原价、成为经销商） */

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

// ==================
// 本页面所需action
// ==================

import { Button, WingBlank } from "antd-mobile";

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  // 原价使用被点击
  onSubmit1() {
    this.props.history.push("/shop/confirmPay");
  }

  // 立即成为体验版经销商
  onSubmit2() {
    this.props.history.push("/shop/becomedealer");
  }

  render() {
    return (
      <div className="flex-auto page-box waterxd">
        <WingBlank>
          <div className="page-flex-col" style={{ minHeight: "100vh" }}>
            <div className="flex-auto page-flex-row flex-ai-center">
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={() => this.onSubmit1()}
              >
                原价使用
              </Button>
            </div>
            <div className="flex-auto">
              <div className="title">超值优惠</div>
              <div className="info">1.您可以得到3台智能净水设备的赠送权限</div>
              <div className="info">
                2.每台设备每次消费的40%将作为您的收益，即时到账
              </div>
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={() => this.onSubmit2()}
              >
                立即成为翼猫体验版经销商
              </Button>
            </div>
          </div>
        </WingBlank>
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
