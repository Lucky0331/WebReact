/* 我的e家 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";
// ==================
// 所需的所有组件
// ==================

import Main from "./container/main/index";
import UserInfo from "./container/userInfo";
import PerInfo from "./container/perInfo";

import Authentication from "./container/authentication";
import Order from "./container/order";
import OrderDetail from "./container/orderdetail";
import OrderCardDetail from "./container/orderCardDetail";
import PaySuccess from "./container/paySuccess";
import UseOfKnow from "./container/useOfKnow";
import HealthyAmb from "./container/healthyAmb";
import AtCat from "./container/atCat";
import MyDaiYan from "./container/myDaiYan";
import BindDealer from "./container/bindDealer";
import BindPhone from "./container/bindPhone";
import JDBindPhone from "./container/JDbindPhone";
import SetPassword from "./container/setPassword";
import CheckPwd from "./container/checkPwd";
import MyCustomer from "./container/mycustomer";
import Primary from "./container/mycustomer/primary";
import PrimaryIn from "./container/mycustomer/primaryIn";
import SonIn from "./container/mycustomer/sonIn";
import FavCardsDetail from "./container/favCardsDetail";
import MyFavCards from "./container/myFavCards";
import Addr from "./container/addr";
import NewAddr from "./container/newAddr";
import UpAddr from "./container/addr/upAddr";
import DaiYan from "./container/myDaiYan/daiyan";
import OrderCustomer from "./container/orderCustomer";
import OrderCustomerDetail from "./container/ordercustomerdetail";
import CustomerNex from "./container/customerNex";
import Kf from "./container/kf";
import DaiYanH5 from "./container/myDaiYan/daiyanh5";
import DaiYanH5Del from "./container/myDaiYan/daiyanh5del";
import FavRecord from "./container/favRecord";
import FavOne from "./container/myFavCards/favone";
// ==================
// 本页面所需action
// ==================

// ==================
// Definition
// ==================
class My extends React.Component {
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
            path={`${this.props.match.url}/order`}
            component={Order}
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
            path={`${this.props.match.url}/myfavcards`}
            component={MyFavCards}
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
          {/* 这个不能加exact,因为有两个地方要用，一个不传ID,一个传ID */}
          <CacheRoute
            exact
            path={`${this.props.match.url}/ordercustomer`}
            component={OrderCustomer}
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
            path={`${this.props.match.url}/userinfo`}
            component={UserInfo}
          />
          <Route
            exact
            path={`${this.props.match.url}/perinfo`}
            component={PerInfo}
          />
          <Route
            exact
            path={`${this.props.match.url}/authentication`}
            component={Authentication}
          />
          <Route
            exact
            path={`${this.props.match.url}/orderdetail`}
            component={OrderDetail}
          />
          <Route
            exact
            path={`${this.props.match.url}/ordercarddetail/:id`}
            component={OrderCardDetail}
          />
          <Route
            exact
            path={`${this.props.match.url}/paysuccess/:id`}
            component={PaySuccess}
          />
          <Route
            exact
            path={`${this.props.match.url}/useofknow`}
            component={UseOfKnow}
          />
          <Route
            exact
            path={`${this.props.match.url}/healthyamb`}
            component={HealthyAmb}
          />
          <Route
            exact
            path={`${this.props.match.url}/atCat`}
            component={AtCat}
          />
          <Route
            exact
            path={`${this.props.match.url}/mydaiyan/:id`}
            component={MyDaiYan}
          />
          <Route
            exact
            path={`${this.props.match.url}/daiyanh5del/:id`}
            component={DaiYanH5Del}
          />
          <Route
            exact
            path={`${this.props.match.url}/binddealer`}
            component={BindDealer}
          />
          <Route
            exact
            path={`${this.props.match.url}/bindphone`}
            component={BindPhone}
          />
          <Route
            exact
            path={`${this.props.match.url}/JDbindphone`}
            component={JDBindPhone}
          />
          <Route
            exact
            path={`${this.props.match.url}/setpassword`}
            component={SetPassword}
          />
          <Route
            exact
            path={`${this.props.match.url}/checkpwd`}
            component={CheckPwd}
          />
          <Route
            exact
            path={`${this.props.match.url}/mycustomer/:id/:type`}
            component={MyCustomer}
          />
          <Route
            exact
            path={`${this.props.match.url}/primary`}
            component={Primary}
          />
          <Route
            exact
            path={`${this.props.match.url}/primaryin`}
            component={PrimaryIn}
          />
          <Route
            exact
            path={`${this.props.match.url}/sonin`}
            component={SonIn}
          />
          <Route
            exact
            path={`${this.props.match.url}/favcardsdetail`}
            component={FavCardsDetail}
          />
          <Route
            exact
            path={`${this.props.match.url}/addr/:id`}
            component={Addr}
          />
          <Route
            exact
            path={`${this.props.match.url}/newaddr`}
            component={NewAddr}
          />
          <Route
            exact
            path={`${this.props.match.url}/upaddr`}
            component={UpAddr}
          />
          <Route
            exact
            path={`${this.props.match.url}/daiyan`}
            component={DaiYan}
          />
          <Route
            exact
            path={`${this.props.match.url}/daiyanh5`}
            component={DaiYanH5}
          />

          <Route
            exact
            path={`${this.props.match.url}/ordercustomerdetail`}
            component={OrderCustomerDetail}
          />
          <Route
            exact
            path={`${this.props.match.url}/customernex`}
            component={CustomerNex}
          />
          <Route
            exact
            path={`${this.props.match.url}/favone/:id`}
            component={FavOne}
          />
          <Route exact path={`${this.props.match.url}/kf`} component={Kf} />
          <Route
            exact
            path={`${this.props.match.url}/favrecord/:id`}
            component={FavRecord}
          />
        </Switch>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

My.propTypes = {
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
)(My);
