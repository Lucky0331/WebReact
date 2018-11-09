/* 健康管理 - 体检预约 */

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
import { DatePicker, Button, Toast, Picker } from "antd-mobile";
import ImgRight from "../../../../assets/xiangyou@3x.png";
import ImgDh from "../../../../assets/daohang@3x.png";
import ImgRen from "../../../../assets/ren@3x.png";
import ImgAddr from "../../../../assets/dizhi@3x.png";
import ImgPhone from "../../../../assets/dianhua@3x.png";
import ImgCard from "../../../../assets/xuanzeka@3x.png";

// ==================
// 本页面所需action
// ==================

import {
  mallReserveSave,
  savePreInfo,
  saveServiceInfo
} from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.title = "预约检查";
  }

  // 日期选择
  onDateChange(date) {
    this.props.actions.savePreInfo({
      reserveTime: `${tools.dateformart(date)} ${this.props.preInfo
        .reserveTime_Time || tools.dateToTime(new Date())}`,
      reserveTime_Date: date
    });
  }

  // 时间选择
  onTimeChange(time) {
    this.props.actions.savePreInfo({
      reserveTime: `${tools.dateformart(this.props.preInfo.reserveTime_Date)} ${
        time[0]
      }`,
      reserveTime_Time: time[0]
    });
  }

  onSubmit() {
    const p = _.cloneDeep(this.props.preInfo);
    // 检查各必要的信息
    if (!p.ticketNo) {
      Toast.info("请选择评估卡", 1);
      return false;
    } else if (!p.userName || !p.phone) {
      Toast.info("请填写被评估者信息", 1);
      return false;
    } else if (!p.stationId) {
      Toast.info("请选择体检服务中心", 1);
      return false;
    } else if (!p.reserveTime_Date) {
      Toast.info("请选择体检日期", 1);
      return false;
    }
    delete p.reserveTime_Date;
    delete p.reserveTime_Time;

    // 调用预约接口
    this.props.actions
      .mallReserveSave(tools.clearNull(p))
      .then(res => {
        if (res.status === 200) {
          Toast.success("预约成功", 1);
          this.props.actions.savePreInfo({
            // 预约检查，用户输入的信息，最终接口所需数据
            userName: undefined, // 名字 必填
            phone: undefined, // 手机号 必填
            stationId: undefined, // 服务站ID 必填
            stationName: "", // 服务站名称 必填
            reserveTime: "", // 预约时间 必填
            sex: 1, // 性别，1男0女 必填
            ticketNo: "", // 评估卡编号 必填
            height: undefined, // 身高
            weight: undefined, // 体重
            reserveFrom: 2, // 用户来源 1APP， 2公众号，3后台添加
            reserveTime_Date: undefined, // 临时 - 日期
            reserveTime_Time: undefined // 临时 - 时间
          });
          this.props.actions.saveServiceInfo({});
          setTimeout(() => {
            this.props.history.push("/healthy/mypre");
          }, 16);
        } else {
          Toast.info(res.message || "网络错误，请重试", 1);
        }
      })
      .catch(() => {
        Toast.info("网络错误，请重试", 1);
      });
  }

  render() {
    return (
      <div className="page-pre-check">
        {/* 下方各横块 */}
        <div className="bar-list">
          <div
            className="item page-flex-row all_active"
            onClick={() => this.props.history.push("/healthy/chosecard")}
          >
            <div className="title">评估卡号</div>
            <div className="info">{this.props.preInfo.ticketNo}</div>
            <div className="arrow2">
              <img src={ImgCard} />
            </div>
            <div className="line" />
          </div>
          <div
            className="item page-flex-row all_active"
            onClick={() => this.props.history.push("/healthy/preinfo")}
          >
            <div className="title">被评估者信息</div>
            <div className="info">{this.props.preInfo.userName || ""}</div>
            <div className="arrow">
              <img src={ImgRight} />
            </div>
            <div className="line" />
          </div>
          <div
            className="item page-flex-row all_active"
            onClick={() => this.props.history.push("/healthy/choseservice")}
          >
            <div className="title">选择翼猫体验服务中心</div>
            <div className="arrow">
              <img src={ImgRight} />
            </div>
            <div className="line" />
          </div>
        </div>
        <ul className="card-ul">
          {this.props.stationInfo.id ? (
            <li className="card-box page-flex-row">
              <div className="l flex-auto">
                <div className="title">{this.props.stationInfo.name}</div>
                {/*<div className="info page-flex-row flex-ai-center"><img src={ImgRen} /><span>{this.props.stationInfo.name}</span></div>*/}
                <div className="info page-flex-row flex-ai-center">
                  <img src={ImgPhone} />
                  <span>{this.props.stationInfo.phone}</span>
                </div>
                <div className="info page-flex-row flex-ai-center">
                  <img src={ImgAddr} />
                  <span>{this.props.stationInfo.address}</span>
                </div>
              </div>
            </li>
          ) : null}
        </ul>
        <div className="bar-list">
          {this.props.stationInfo.id ? (
            <DatePicker
              mode="date"
              title="体检日期"
              extra="Optional"
              value={this.props.preInfo.reserveTime_Date}
              minDate={new Date()}
              onChange={date => this.onDateChange(date)}
            >
              <div className="item page-flex-row all_active">
                <div className="title">选择体检日期</div>
                <div className="info">
                  {tools.dateformart(this.props.preInfo.reserveTime_Date)}
                </div>
                <div className="arrow">
                  <img src={ImgRight} />
                </div>
                <div className="line" />
              </div>
            </DatePicker>
          ) : null}
        </div>
        {/*<div className="bar-list">*/}
        {/*{*/}
        {/*(this.props.stationInfo.id && this.props.stationInfo.reserveTime) ? (*/}
        {/*<Picker*/}
        {/*data={this.props.stationInfo.reserveTime ? this.props.stationInfo.reserveTime.map((item, index) => {*/}
        {/*return { label: item, value: item };*/}
        {/*}) : []}*/}
        {/*cols={1}*/}
        {/*onOk={time => this.onTimeChange(time)}*/}
        {/*>*/}
        {/*<div className="item page-flex-row all_active" >*/}
        {/*<div className="title">选择体检时间</div>*/}
        {/*<div className="info">{this.props.preInfo.reserveTime_Time}</div>*/}
        {/*<div className="arrow"><img src={ImgRight} /></div>*/}
        {/*<div className="line"/>*/}
        {/*</div>*/}
        {/*</Picker>*/}
        {/*) : null*/}
        {/*}*/}
        {/*</div>*/}
        <div className="thefooter">
          <Button type="primary" onClick={() => this.onSubmit()}>
            立即预约
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
  actions: P.any,
  preInfo: P.any,
  stationInfo: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    preInfo: state.shop.preInfo,
    stationInfo: state.shop.stationInfo
  }),
  dispatch => ({
    actions: bindActionCreators(
      { mallReserveSave, savePreInfo, saveServiceInfo },
      dispatch
    )
  })
)(HomePageContainer);
