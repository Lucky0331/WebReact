/* 收益管理 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";
import tools from "../../util/all";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";
// ==================
// 所需的所有组件
// ==================

import { Switch, Route } from "react-router-dom";
import Main from "./container/main";
import ProDetail from "./container/proDetail";
import ProDetails from "./container/proDetails";
import Tixian from "./container/tiXian";
import TixianNow from "./container/tiXian/tiXianNow";
import TixianDetail from "./container/tiXian/tiXianDetail";
import TixianRecord from "./container/tiXian/tiXianRecord";

// ==================
// 本页面所需action
// ==================

// ==================
// Definition
// ==================
class Healthy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <CacheSwitch>
          <CacheRoute
            exact
            path={`${this.props.match.url}/prodetail`}
            component={ProDetail}
            behavior={cached =>
              cached
                ? {
                    style: {
                      position: "absolute",
                      zIndex: -9999,
                      opacity: 0,
                      visibility: "hidden",
                      pointerEvents: "none",
                      width: "100vw"
                    },
                    className: "__CacheRoute__cached"
                  }
                : {
                    className: "__CacheRoute__uncached"
                  }
            }
          />
          <CacheRoute
            exact
            path={`${this.props.match.url}/tixianrecord`}
            component={TixianRecord}
            behavior={cached =>
              cached
                ? {
                    style: {
                      position: "absolute",
                      zIndex: -9999,
                      opacity: 0,
                      visibility: "hidden",
                      pointerEvents: "none",
                      width: "100vw"
                    },
                    className: "__CacheRoute__cached"
                  }
                : {
                    className: "__CacheRoute__uncached"
                  }
            }
          />
        </CacheSwitch>
        <Switch>
          <Route exact path={`${this.props.match.url}/`} component={Main} />
          <Route
            exact
            path={`${this.props.match.url}/prodetails/:id`}
            component={ProDetails}
          />
          <Route
            exact
            path={`${this.props.match.url}/tixian`}
            component={Tixian}
          />
          <Route
            exact
            path={`${this.props.match.url}/tixiannow/:id`}
            component={TixianNow}
          />
          <Route
            exact
            path={`${this.props.match.url}/tixiandetail/:id`}
            component={TixianDetail}
          />
        </Switch>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Healthy.propTypes = {
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
)(Healthy);
