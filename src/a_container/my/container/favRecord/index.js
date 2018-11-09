/* 我的优惠卡 - 详情 */

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
import { Toast } from "antd-mobile";
import ImgTest from "../../../../assets/test/new.png";
// ==================
// 本页面所需action
// ==================

import { getLifeCycle } from "../../../../a_action/shop-action";
// ==================
// Definition
// ==================

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPay: false,
      ticketNo: "",
      ticketStatus: 0, // 卡的最终状态 0数据还没查出来 1未使用，2已使用，3已禁用，4已过期
      data: [] // status: 1领取、2支付、3使用
    };
  }

  componentWillUnmount() {
    Toast.hide();
  }

  componentDidMount() {
    document.title = "赠送记录";
    const ticketNo = this.props.location.pathname.split("/").slice(-1)[0];
    this.setState({
      ticketNo
    });
    this.getData(ticketNo);
  }

  // 获取数据
  getData(ticketNo) {
    const u = this.props.userinfo;
    Toast.loading("请稍后...", 0);
    this.props.actions
      .getLifeCycle({ id: u.id, ticketNo })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            isPay: res.data.isPay,
            ticketStatus: res.data.ticketStatus,
            data: res.data.resultList
          });
          Toast.hide();
        } else {
          Toast.info(res.message, 1);
        }
      })
      .catch(() => {
        Toast.hide();
      });
  }

  // 返回标签状态咯
  makeType(status, index) {
    if (index === 0) {
      // 第1步，就显示个点
      return <div className="type-card pink">获得</div>;
    }
    switch (String(status)) {
      case "1":
        return <div className="type-card red">领取</div>;
      case "2":
        return <div className="type-card yellow">支付</div>;
      case "3":
        return <div className="type-card black">使用</div>;
      default:
        return null;
    }
  }

  // 返回最终状态咯
  cardTypeDown() {
    if (!this.state.isPay) {
      return <div className="foot blue">卡待支付</div>;
    }
    switch (this.state.ticketStatus) {
      case 1:
        return <div className="foot blue">卡待使用</div>;
      case 2:
        return <div className="foot geer">卡已使用</div>;
      case 3:
        return <div className="foot geer">卡待支付</div>; // 原已禁用
      case 4:
        return <div className="foot geer">卡已过期</div>;
      default:
        return null;
    }
  }
  render() {
    return (
      <div className="page-fav-record">
        <div className="title">
          卡号：
          {tools.cardFormart(this.state.ticketNo)}
        </div>
        {this.state.data.map((item, index) => {
          return (
            <div className={index % 2 === 0 ? "left" : "right"} key={index}>
              <div className="t-box">
                <div className="t-info">
                  <div className="t-info-1">{item.time}</div>
                  <div className="t-info-2">
                    <img src={item.headImg} />
                    <div className="soming">
                      <div>{item.nickName}</div>
                      <div>e家号: {item.id}</div>
                    </div>
                  </div>
                </div>
                {this.makeType(item.status, index)}
              </div>
            </div>
          );
        })}
        {this.cardTypeDown()}
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
    actions: bindActionCreators({ getLifeCycle }, dispatch)
  })
)(Register);
