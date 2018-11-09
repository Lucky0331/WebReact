/* 健康管理 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";
import tools from "../../util/all";
// ==================
// 所需的所有组件
// ==================

import { Switch, Route } from "react-router-dom";
import Main from "./container/main";
import MyCard from "./container/myCard";
import PreCheck from "./container/precheck";
import PreInfo from "./container/preInfo";
import MyPre from "./container/myPre";
import MyReport from "./container/myreport";
import AddReport from "./container/addreport";
import ChoseService from "./container/choseservice";
import ChoseStation from "./container/choseStation";
import ChoseCard from "./container/choseCard";
import ChoseCard2 from "./container/choseCard2";
import CardVoucher from "./container/cardVoucher";
import Wei from "./container/wei";
import Iframe from "./container/iframe";
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

  UNSAFE_componentWillMount() {}

  render() {
    return (
      <div>
        <Switch>
          <Route exact path={`${this.props.match.url}/`} component={Main} />
          <Route
            exact
            path={`${this.props.match.url}/mycard`}
            component={MyCard}
          />
          <Route
            exact
            path={`${this.props.match.url}/precheck`}
            component={PreCheck}
          />
          <Route
            exact
            path={`${this.props.match.url}/preinfo`}
            component={PreInfo}
          />
          <Route
            exact
            path={`${this.props.match.url}/mypre`}
            component={MyPre}
          />
          <Route
            exact
            path={`${this.props.match.url}/myreport`}
            component={MyReport}
          />
          <Route
            exact
            path={`${this.props.match.url}/addreport`}
            component={AddReport}
          />
          <Route
            exact
            path={`${this.props.match.url}/choseservice`}
            component={ChoseService}
          />
          <Route
            exact
            path={`${this.props.match.url}/choseStation`}
            component={ChoseStation}
          />
          <Route
            exact
            path={`${this.props.match.url}/chosecard`}
            component={ChoseCard}
          />
          <Route
            exact
            path={`${this.props.match.url}/chosecard2`}
            component={ChoseCard2}
          />
          <Route
            exact
            path={`${this.props.match.url}/cardvoucher/:id`}
            component={CardVoucher}
          />
          <Route
            exact
            path={`${this.props.match.url}/wei/:id`}
            component={Wei}
          />
          <Route
            exact
            path={`${this.props.match.url}/iframe/:id`}
            component={Iframe}
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
