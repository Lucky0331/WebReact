import React from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";
import Main from "./container/main";
import GoodDetail from "./container/goodDetail";
import WaterXD from "./container/waterXD";
import ConfirmPay from "./container/confirmPay";
import PayChose from "./container/payChose";
import BecomeDealer from "./container/becomeDealer";
import Pay from "./container/pay";
import PayResult from "./container/payresult";
import ChoseAddr from "./container/choseAddr";
import ShopActive from "./container/shopActive";
import JDCOM from "./container/JDCOM";
import Activity from "./container/activity";
import ExprDetail from "./container/exprShop2Detail";
import ExprShop from "./container/exprShop";
import UnderStore from "./container/UnderStore";
import Eva from "./container/eva";
import ShoppingCar from "./container/shoppingCar";
import ShopType from "./container/shopType";
import ShopTypeAll from "./container/shopTypeAll";

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path={`${this.props.match.url}/`} component={Main} />
          <Route
            exact
            path={`${this.props.match.url}/gooddetail/:id`}
            component={GoodDetail}
          />
          <Route
            exact
            path={`${this.props.match.url}/waterxd`}
            component={WaterXD}
          />
          <Route
            exact
            path={`${this.props.match.url}/UnderStore`}
            component={UnderStore}
          />
          <Route
            exact
            path={`${this.props.match.url}/exprShop`}
            component={ExprShop}
          />
          <Route
            exact
            path={`${this.props.match.url}/confirmpay/:id`}
            component={ConfirmPay}
          />
          <Route
            exact
            path={`${this.props.match.url}/paychose/:type`}
            component={PayChose}
          />
          <Route exact path={`${this.props.match.url}/pay`} component={Pay} />
          <Route
            exact
            path={`${this.props.match.url}/payresult/:id`}
            component={PayResult}
          />
          <Route
            exact
            path={`${this.props.match.url}/becomedealer`}
            component={BecomeDealer}
          />
          <Route
            exact
            path={`${this.props.match.url}/choseaddr`}
            component={ChoseAddr}
          />
          <Route
            exact
            path={`${this.props.match.url}/shopactive`}
            component={ShopActive}
          />
          <Route
            exact
            path={`${this.props.match.url}/JDCOM`}
            component={JDCOM}
          />
          <Route
            exact
            path={`${this.props.match.url}/activity/:id`}
            component={Activity}
          />
          <Route
            exact
            path={`${this.props.match.url}/exprdetail/:id`}
            component={ExprDetail}
          />
          <Route exact path={`${this.props.match.url}/eva`} component={Eva} />
          <Route
            exact
            path={`${this.props.match.url}/shoppingCar`}
            component={ShoppingCar}
          />
          <Route
            exact
            path={`${this.props.match.url}/shoptype/:id`}
            component={ShopType}
          />
          <Route
            exact
            path={`${this.props.match.url}/shoptypeall/:id`}
            component={ShopTypeAll}
          />
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
