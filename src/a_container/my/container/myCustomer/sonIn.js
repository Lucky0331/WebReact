/* 我的e家 - 我的客户 - 企业版子账号点击进入此页面 */

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
import { List, Toast } from "antd-mobile";
import ImgDefault from "../../../../assets/default-head.jpg";
import Img404 from "../../../../assets/not-found.png";
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
    const u = this.props.sonInfo;
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

  // 工具 - 通过用户类型type获取对应的称号
  getNameByUserType(type) {
    switch (String(type)) {
      case "0":
        return "体验版经销商";
      case "1":
        return "微创版经销商";
      case "2":
        return "个人版经销商";
      case "3":
        return "分享用户";
      case "4":
        return "普通用户";
      case "5":
        return "企业版经销商";
      case "6":
        return "企业版经销商"; // 子账户
      case "7":
        return "分销用户";
      default:
        return "";
    }
  }

  render() {
    const u = this.props.sonInfo || {};
    return (
      <div className="page-primary">
        {u.id && <div className="data-title">子账号</div>}
        {u.id && (
          <ul className="data-list">
            <li className="page-flex-row flex-ai-center">
              <div className="photo flex-none">
                <img src={u.headImg} />
              </div>
              <div className="name flex-auto">
                <div className="all_nowarp">{u.nickName}</div>
                <div className="lit">
                  e家号：
                  {u.id}
                </div>
                <div className="lit mt">
                  身份：
                  {this.getNameByUserType(u.userType)}
                  <span>{u.ambassadorTime}</span>
                </div>
              </div>
            </li>
          </ul>
        )}
        <div className="data-title">
          推广客户
          <span style={{ float: "right" }}>
            总计：
            {this.state.data ? this.state.data.length : "0"}人
          </span>
        </div>
        <ul className="data-list">
          {this.state.data.length ? (
            this.state.data.map((item, index) => {
              return (
                <li key={index} className="page-flex-row flex-ai-center">
                  <div className="photo flex-none">
                    <img src={item.headImg || ImgDefault} />
                  </div>
                  <div className="name flex-auto">
                    <div className="all_nowarp">{item.nickName}</div>
                    <div className="lit">
                      e家号：
                      {item.id}
                    </div>
                    <div className="lit mt">
                      身份：
                      {this.getNameByUserType(item.userType)}
                      <span>{item.ambassadorTime}</span>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li key={0} className="data-nothing">
              <img src={Img404} />
              <div>亲，这里什么也没有哦~</div>
            </li>
          )}
        </ul>
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
  sonInfo: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    sonInfo: state.shop.sonInfo
  }),
  dispatch => ({
    actions: bindActionCreators({ getMyCustomers }, dispatch)
  })
)(HomePageContainer);
