/* 健康大使 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================
import { List } from "antd-mobile";
import ImgDefault from "../../../../assets/default-head.jpg";

// ==================
// 本页面所需action
// ==================

import { myAmbassador } from "../../../../a_action/app-action";

// ==================
// Definition
// ==================

const Item = List.Item;
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidMount() {
    document.title = "健康大使";
    if (!this.props.ambassador) {
      this.getData();
    }
  }

  // 获取健康大使相关信息
  getData() {
    this.props.actions.myAmbassador({ userId: this.props.userinfo.id });
  }

  render() {
    const u = this.props.userinfo;
    const a = this.props.ambassador;
    return (
      <div
        className="flex-auto page-box page-amb"
        style={{ backgroundColor: "#fff", minHeight: "100vh" }}
      >
        <div className="login-box">
          <div className="logo">
            <img src={a.headImg || ImgDefault} />
          </div>
          <div className="logo-info">{a.nickName || a.realName}</div>
          <List className="this-list">
            <Item extra={a.id || ""}>e家号</Item>
            <Item
              extra={
                <a
                  href={`tel:${a.mobile || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {a.mobile}
                </a>
              }
            >
              手机号
            </Item>
            <Item extra={a.stationName}>体验店</Item>
          </List>
        </div>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Register.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any,
  userinfo: P.any,
  ambassador: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    userinfo: state.app.userinfo,
    ambassador: state.app.ambassador
  }),
  dispatch => ({
    actions: bindActionCreators({ myAmbassador }, dispatch)
  })
)(Register);
