/* 我的e家 - 主页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import $ from "jquery";
import P from "prop-types";
import _ from "lodash";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================

import { SearchBar } from "antd-mobile";

// ==================
// 本页面所需action
// ==================

import {} from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="flex-auto page-box down-line">
        <SearchBar placeholder="Search" maxLength={18} />
        <ul className="list">
          <li className="page-flex-row">
            <div className="flex-auto l">
              <div className="title">上海嘉定区体验服务中心</div>
              <div className="name">姓名</div>
              <div className="phone">13600000000</div>
              <div className="addr">
                地址地址地址地址地址地址地址地址地址地址地址地址
              </div>
            </div>
            <div className="flex-none r page-flex-col flex-jc-center flex-ai-center">
              <div>导航</div>
            </div>
          </li>
          <li className="page-flex-row">
            <div className="flex-auto l">
              <div className="title">上海嘉定区体验服务中心</div>
              <div className="name">姓名</div>
              <div className="phone">13600000000</div>
              <div className="addr">
                地址地址地址地址地址地址地址地址地址地址地址地址
              </div>
            </div>
            <div className="flex-none r page-flex-col flex-jc-center flex-ai-center">
              <div>导航</div>
            </div>
          </li>
        </ul>
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
