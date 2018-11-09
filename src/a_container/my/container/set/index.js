/* 我的e家 - 设置 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================
import { Button, List } from "antd-mobile";

// ==================
// 本页面所需action
// ==================

import {} from "../../../../a_action/app-action";

// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  //
  onLogOut() {
    localStorage.removeItem("userinfo");
    this.props.history.replace("/login");
  }

  render() {
    return (
      <div className="userinfo-main">
        <List>
          <Item arrow="horizontal">消息推送设置</Item>
          <Item extra={"微信昵称"} arrow="horizontal">
            情景模式
          </Item>
          <Item arrow="horizontal">清楚缓存</Item>
          <Item arrow="horizontal">反馈建议</Item>
          <Item arrow="horizontal">关于我们</Item>
        </List>
        <Button
          type="warning"
          style={{ marginTop: ".5rem" }}
          onClick={() => this.onLogOut()}
        >
          退出登录
        </Button>
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
