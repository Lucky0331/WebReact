/* 健康管理 - 主页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.less";

// ==================
// 所需的所有组件
// ==================

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ""
    };
  }

  componentDidMount() {
    console.log(
      this.props.location.pathname,
      this.props.location.pathname.split("/"),
      this.props.location.pathname.split("/").slice(-1)
    );
    const p = this.props.location.pathname
      .split("/")
      .slice(-1)[0]
      .split("_");
    document.title = decodeURIComponent(p[0]) || "";
    this.setState({
      url: decodeURIComponent(p[1])
    });
  }

  render() {
    return (
      <div className="iframe-box">
        {this.state.url ? <iframe src={this.state.url} /> : null}
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
