/* 智能物联 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================

import Menu from "../../a_component/menu";
// ==================
// 本页面所需action
// ==================

// ==================
// Definition
// ==================
class Intel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="flex-auto page-box page-flex-col intel-page">
        <div>请下载APP</div>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Intel.propTypes = {
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
)(Intel);
