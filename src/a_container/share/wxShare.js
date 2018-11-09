/* 用于经销商APP页面微信公众号连接 微信公众号分享页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./wxShare.scss";
// ==================
// 所需的所有组件
// ==================
import Img from "../../assets/share/apphome_weixin.png";
// ==================
// 本页面所需action
// ==================

import { saveWxCode } from "../../a_action/app-action";
// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.title = "微信公众号";
  }

  render() {
    return (
      <div className="flex-auto page-box page-wx-share">
        <img src={Img} />
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

HomePageContainer.propTypes = {
  location: P.any,
  history: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({ saveWxCode }, dispatch)
  })
)(HomePageContainer);
