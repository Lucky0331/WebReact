/* 线下体验店 */

// ==================
// 所需的各种插件
// ==================
import React from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";

// ==================
// 所需的所有组件
// ==================
import Main from "./container/main";
import Map from "./container/map";

// ==================
// 本页面所需action
// ==================

// ==================
// Definition
// ==================
class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.title = "导航";
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path={`${this.props.match.url}/`} component={Main} />
          <Route exact path={`${this.props.match.url}/map`} component={Map} />
        </Switch>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Shop.propTypes = {
  location: P.any,
  history: P.any,
  match: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({}, dispatch)
  })
)(Shop);
