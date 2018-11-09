/* 我的e家 - 我的客户 - 企业版主账号点击进入此页面 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import "./primary.scss";
// ==================
// 所需的所有组件
// ==================
import { Tabs, List, Toast } from "antd-mobile";
import ImgDefault from "../../../../assets/default-head.jpg";
import Img404 from "../../../../assets/not-found.png";
import Li from "./component/list";
// ==================
// 本页面所需action
// ==================

import { getMyCustomers } from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    document.title = "我的推广客户";
    this.getData();
  }

  getData() {
    const u = this.props.userinfo;
    if (!u) {
      return;
    }
    Toast.loading("加载中…");
    this.props.actions
      .getMyCustomers({ userId: u.id })
      .then(res => {
        if (res.status === 200) {
          if (res.data) {
            this.setState({
              data: res.data
            });
          }
        }
        Toast.hide();
      })
      .catch(() => {
        Toast.hide();
      });
  }

  render() {
    const u = this.props.userinfo || {};
    return (
      <div className="page-primary">
        <div className="data-title">
          推广客户
          <span style={{ float: "right" }}>
            总计：
            {this.state.data ? this.state.data.length : "0"}人
          </span>
        </div>
        <Tabs
          swipeable={false}
          tabs={[{ title: "全部" }, { title: "待付款" }, { title: "待发货" }]}
        >
          <div className="tabs-div">
            <ul className="data-list">
              {this.state.data.length ? (
                this.state.data.map((item, index) => {
                  return <Li key={index} data={item} type={"normal"} />;
                })
              ) : (
                <li key={0} className="data-nothing">
                  <img src={Img404} />
                  <div>亲，这里什么也没有哦~</div>
                </li>
              )}
            </ul>
          </div>
        </Tabs>
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
  actions: P.any,
  userinfo: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    userinfo: state.app.userinfo
  }),
  dispatch => ({
    actions: bindActionCreators({ getMyCustomers }, dispatch)
  })
)(HomePageContainer);
