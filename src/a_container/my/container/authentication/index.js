/* 我的e家 - 个人主页 - 实名认证 */

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
import { Button, List, InputItem, WingBlank, Toast } from "antd-mobile";

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
    this.state = {
      formName: "", // 真实姓名
      formID: "" // 身份证
    };
  }

  componentDidMount() {
    document.title = "实名认证";
  }

  //onSubmit
  onSubmit() {
    if (!this.state.formName) {
      Toast.info("请输入真实姓名", 1);
      return false;
    } else if (this.state.formID.length < 18) {
      Toast.info("请输入有效身份证", 1);
      return false;
    }
  }

  // 名字修改时触发
  onNameChange(v) {
    const formName = tools.trim(v);
    if (formName.length <= 12) {
      this.setState({
        formName
      });
    }
  }

  // 身份证修改时触发
  onIDChange(v) {
    const formID = tools.trim(v);
    if (formID.length <= 18) {
      this.setState({
        formID
      });
    }
  }

  render() {
    return (
      <div className="authent-page">
        <List>
          <InputItem
            clear
            placeholder="请输入姓名"
            value={this.state.formName}
            onChange={v => this.onNameChange(v)}
          >
            姓&#12288;&#12288;名:
          </InputItem>
          <InputItem
            clear
            type="number"
            placeholder="请输入身份证"
            value={this.state.formID}
            onChange={v => this.onIDChange(v)}
          >
            身份证号:
          </InputItem>
        </List>
        <WingBlank>
          <div className="info">
            实名认证成功后，身份信息不可修改。如非本人，请联系客服解决
          </div>
        </WingBlank>
        <div className="thefooter">
          <Button type="primary" onClick={() => this.onSubmit()}>
            完成
          </Button>
        </div>
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
