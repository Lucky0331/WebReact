/* 收益管理 - 提现详情 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./tiXianDetail.scss";
import tools from "../../../../util/all";
// ==================
// 所需的所有组件
// ==================
import { List, Toast, Steps } from "antd-mobile";
import ImgStep0 from "../../../../assets/profit/step0@3x.png";
import ImgStep1 from "../../../../assets/profit/step1@3x.png";
import ImgFail from "../../../../assets/profit/fail@3x.png";
import ImgDown from "../../../../assets/profit/down@3x.png";
// ==================
// 本页面所需action
// ==================

import {
  getCashRecordList,
  getCashRecordDetailByNo
} from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================
const Item = List.Item;
const Brief = Item.Brief;
const Step = Steps.Step;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidMount() {
    document.title = "提现记录详情";
    if (!this.props.userinfo) {
      // 未登录就返回
      this.props.history.go(-1);
    }
    const p = this.props.location.pathname.split("/").pop();
    this.getData(p);
  }

  getData(partnerTradeNo) {
    const me = this;
    const params = {
      partnerTradeNo
    };
    Toast.loading("请稍后...", 0);
    this.props.actions
      .getCashRecordDetailByNo(tools.clearNull(params))
      .then(res => {
        if (res.status === 200) {
          me.setState({
            data: res.data || {}
          });
          Toast.hide();
        } else {
          Toast.info(res.message);
        }
      })
      .catch(() => {
        Toast.info("查询失败，请重试", 1);
      });
  }

  render() {
    const data = this.state.data;
    console.log(data)
    return (
      <div className="page-tixiandetail">
        {/**
                    下面这部分不要了，为了防止以后又要了，所以注释在此
                    果然，现在又要了2018-3-29，what can I say ?
                 **/}
        <ul className="step-box">
          <li className="step">
            <img className="step-icon" src={ImgStep1} />
            <div className="info">
              <div>发起提现</div>
              <div>
              {data.applyTime
                  ? [
                      <div key={0}>{data.applyTime.split(" ")[0]}</div>,
                      <div key={1}>{data.applyTime.split(" ")[1]}</div>
                    ]
                  : null}
              </div>
            </div>
          </li>
          <li className="line2" />
          <li className="step">
            <img
              className="step-icon"
              src={(() => {
                switch (data.status) {
                  case 1:
                    return ImgStep1;
                  case 2:
                    return ImgFail;
                  default:
                    return ImgStep1;
                }
              })()}
            />
            <div className="info">
              <div>
                {(() => {
                  switch (data.status) {
                    case 1:
                      return "审核通过";
                    case 2:
                      return "审核不通过";
                    case 3:
                      return "审核中";
                    default:
                      return "审核中";
                  }
                })()}
              </div>
              <div>
                {data.auditTime
                  ? [
                      <div key={0}>{data.auditTime.split(" ")[0]}</div>,
                      <div key={1}>{data.auditTime.split(" ")[1]}</div>
                    ]
                  :
                  (
                  JSON.stringify(data)!='{}'&&data.status!=1&&data.status!=2?
                  [
                      <div key={0}>{data.applyTime.split(" ")[0]}</div>,
                      <div key={1}>{data.applyTime.split(" ")[1]}</div>
                  ]
                  :null
                  )
                }
              </div>
            </div>
          </li>
          <li className={data.status === 1 ? "line2" : "line1"} />
          <li className="step">
            <img
              className="step-icon"
              src={(() => {
                if (data.flag === 1) {
                  return ImgStep1;
                } else if (data.flag === 2) {
                  return ImgFail;
                } else {
                  return ImgStep0;
                }
              })()}
            />
            <div className="info">
              <div>
                {(() => {
                  if (data.flag === 1) {
                    return "提现成功";
                  } else if (data.flag === 2) {
                    return "提现失败";
                  } else {
                    return "提现";
                  }
                })()}
              </div>
              <div>
                {data.paymentTime
                  ? [
                      <div key={0}>{data.paymentTime.split(" ")[0]}</div>,
                      <div key={1}>{data.paymentTime.split(" ")[1]}</div>
                    ]
                  : null}
              </div>
            </div>
          </li>
        </ul>
        <List>
          <Item
            extra={
              <span style={{ color: "#FF0303" }}>
                ￥{data.amount ? Number(data.amount).toFixed(2) : "--"}
              </span>
            }
          >
            提现
          </Item>
        </List>
        <div className="info-box">
          <div className="page-flex-row flex-jc-sb">
            <div>类型</div>
            <div>
              提现到
              {data.destCash}
            </div>
          </div>
          <div className="page-flex-row flex-jc-sb">
            <div>时间</div>
            <div>{data.applyTime}</div>
          </div>
          <div className="page-flex-row flex-jc-sb">
            <div>交易单号</div>
            <div>{data.partnerTradeNo}</div>
          </div>
          {/*<div className="page-flex-row flex-jc-sb">*/}
          {/*<div>手续费</div>*/}
          {/*<div>￥{Number(data.formalitiesFee).toFixed(2)}</div>*/}
          {/*</div>*/}
        </div>
        <div className="foot-info">
          {data.status === 2 || data.flag !== 1 ? data.auditReason : null}
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
  tiXianDetail: P.any,
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
    actions: bindActionCreators(
      { getCashRecordList, getCashRecordDetailByNo },
      dispatch
    )
  })
)(HomePageContainer);
