/* 杂七杂八的页面 不知道怎么分类 需求太乱 */

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

// ==================
// 本页面所需action
// ==================

// ==================
// Definition
// ==================
class Za78 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Switch>
          <Route exact path={`${this.props.match.url}/:id`} component={Main} />
        </Switch>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Za78.propTypes = {
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
)(Za78);
