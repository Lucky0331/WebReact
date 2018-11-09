/* 健康管理 - 添加报告 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";
import tools from "../../../../util/all";
// ==================
// 所需的所有组件
// ==================
import { Button, Modal, Toast } from "antd-mobile";
import ImgCard from "../../../../assets/xuanzeka@3x.png";
// ==================
// 本页面所需action
// ==================

import {
  addReportList,
  saveReportInfo
} from "../../../../a_action/shop-action";
// ==================
// Definition
// ==================
const prompt = Modal.prompt;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: this.props.reportInfo.phone
    };
  }

  componentDidMount() {
    document.title = "添加检查报告";
  }
  // phone改变时触发
  onPhoneInput(e) {
    const v = tools.trim(e.target.value);
    if (v.length <= 11) {
      this.setState({
        phone: e.target.value
      });
    }
  }

  // 提交
  onSubmit() {
    if (
      !this.props.reportInfo.ticketNo ||
      this.props.reportInfo.ticketNo.length !== 16
    ) {
      Toast.info("请填写有效评估卡号", 1);
      return false;
    } else if (!tools.checkPhone(this.state.phone)) {
      Toast.info("请输入正确的手机号", 1);
      return false;
    }
    const params = {
      phone: this.state.phone,
      ticketNo: this.props.reportInfo.ticketNo
    };
    this.props.actions
      .addReportList(params)
      .then(res => {
        if (res.status === 200) {
          Toast.success("添加成功");
          this.props.actions.saveReportInfo({ ticketNo: "" });
          setTimeout(() => this.props.history.replace("/healthy/myreport"), 16);
        } else {
          Toast.info(res.message);
        }
      })
      .catch(() => {
        Toast.info(res.message);
      });
  }

  onTicketNoInput(e) {
    const v = tools.trim(e.target.value);
    this.props.actions.saveReportInfo({ ticketNo: v });
  }
  render() {
    return (
      <div className="page-add-report">
        <div className="bar-list">
          <div className="item page-flex-row all_active">
            <div className="title2">评估卡号:</div>
            <div className="info2">
              <input
                maxLength="16"
                type="text"
                value={this.props.reportInfo.ticketNo}
                onInput={e => this.onTicketNoInput(e)}
              />
            </div>
            <div
              className="arrow2"
              onClick={() => this.props.history.push("/healthy/chosecard2")}
            >
              <img src={ImgCard} />
            </div>
            <div className="line" />
          </div>
          <div className="item page-flex-row all_active">
            <div className="title2">手机号:</div>
            <div className="info2">
              <input
                maxLength="11"
                type="tel"
                value={this.state.phone}
                onInput={e => this.onPhoneInput(e)}
              />
            </div>
            <div className="line" />
          </div>
        </div>
        <div className="thefooter">
          <Button type="primary" onClick={() => this.onSubmit()}>
            确认添加
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
  reportInfo: P.any,
  actions: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    reportInfo: state.shop.reportInfo
  }),
  dispatch => ({
    actions: bindActionCreators({ addReportList, saveReportInfo }, dispatch)
  })
)(HomePageContainer);
