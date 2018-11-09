/* 客户关系展示页 */

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
import Img from "../../../../assets/kehu.png";
// ==================
// 本页面所需action
// ==================

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.title = "我的客户关系说明";
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
    actions: bindActionCreators({}, dispatch)
  })
)(HomePageContainer);
