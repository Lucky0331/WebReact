/* 健康管理 - 我的预约 */

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
import { Toast, Modal } from "antd-mobile";
import Img404 from "../../../../assets/not-found.png";
import ImgRen from "../../../../assets/ren@3x.png";
import ImgAddr from "../../../../assets/dizhi@3x.png";
import ImgPhone from "../../../../assets/dianhua@3x.png";
// ==================
// 本页面所需action
// ==================
import Luo from "iscroll-luo";
import {
  mecReserveList,
  cancelReserve
} from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pageNum: 1,
      pageSize: 10
    };
  }

  componentDidMount() {
    document.title = "我的评估预约";
    this.getData(this.state.pageNum, this.state.pageSize, "flash");
  }

  // 下拉刷新
  onDown() {
    this.getData(1, this.state.pageSize, "flash");
  }
  // 上拉加载
  onUp() {
    this.getData(this.state.pageNum + 1, this.state.pageSize, "update");
  }

  // 获取本页面所需数据
  getData(pageNum = 1, pageSize = 10, type = "flash") {
    Toast.loading("搜索中...", 0);
    this.props.actions
      .mecReserveList({ pageNum, pageSize })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            data:
              type === "flash"
                ? res.data.result || []
                : [...this.state.data, ...(res.data.result || [])],
            pageNum,
            pageSize
          });
          Toast.hide();
        } else {
          this.setState({
            data: type === "flash" ? [] : this.state.data
          });
          if (type === "update") {
            Toast.info("没有更多数据了", 1);
          } else {
            Toast.hide();
          }
        }
      })
      .catch(() => {
        this.setState({
          data: type === "flash" ? [] : this.state.data
        });
        Toast.info("网络错误，请重试", 1);
      });
  }

  // 工具 - 获取状态
  getType(type) {
    switch (type) {
      case 1:
        return "已预约";
      case 2:
        return "已完成";
      case 4:
        return "已过期";
      case 5:
        return "预约过期";
      default:
        return "已预约";
    }
  }

  // 取消预约
  onCancel(item) {
    alert("确认取消预约？", "确认后将为您取消预约", [
      { text: "取消", onPress: () => console.log("cancel") },
      {
        text: "确认",
        onPress: () =>
          new Promise((resolve, rej) => {
            this.props.actions
              .cancelReserve({ ticketId: item.id })
              .then(res => {
                if (res.status === 200) {
                  Toast.success("删除成功", 1);
                  this.onDown();
                } else {
                  Toast.info(res.message);
                }
                resolve();
              })
              .catch(() => {
                rej();
              });
          })
      }
    ]);
  }

  render() {
    return (
      <div className="page-my-pre">
        <Luo
          id="luo4"
          className="touch-none"
          onPullDownRefresh={() => this.onDown()}
          onPullUpLoadMore={() => this.onUp()}
          iscrollOptions={{
            disableMouse: true
          }}
        >
          <ul className="the-ul">
            {(() => {
              if (this.state.data.length === 0) {
                return (
                  <li key={0} className="data-nothing">
                    <img src={Img404} />
                    <div>亲，这里什么也没有哦~</div>
                  </li>
                );
              } else {
                return this.state.data.map((item, index) => {
                  return (
                    <li className="one-box" key={index}>
                      <div className="pre-box page-flex-row">
                        <div className="l flex-auto">
                          <div>
                            体检人：
                            {item.hraCustomer ? item.hraCustomer.username : ""}
                          </div>
                          <div>
                            评估卡号：
                            {tools.cardFormart(item.ticketNo)}
                          </div>
                          <div>
                            预约时间：
                            {item.reserveTime}
                          </div>
                        </div>
                        <div className="r flex-none">
                          <div className="down">
                            {this.getType(item.ticketStatus)}
                          </div>
                        </div>
                      </div>
                      <div className="card-box page-flex-row">
                        <div className="l flex-auto">
                          <div className="title">
                            {item.station ? item.station.name : "-"}
                          </div>
                          <div className="info page-flex-row flex-ai-center">
                            <img src={ImgPhone} />
                            <a
                              href={`tel:${
                                item.station ? item.station.masterPhone : ""
                              }`}
                            >
                              {item.station ? item.station.masterPhone : ""}
                            </a>
                          </div>
                          <div className="info page-flex-row flex-ai-center">
                            <img src={ImgAddr} />
                            <span>
                              {item.station ? item.station.address : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      {!item.ticketStatus == 2 || !item.ticketStatus == 4  ? (
                         null
                      ) :<div className={"controls"}>
                        <div onClick={() => this.onCancel(item)}>
                          取消预约
                        </div>
                      </div>}
                    </li>
                  );
                });
              }
            })()}
          </ul>
        </Luo>
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
    actions: bindActionCreators({ mecReserveList, cancelReserve }, dispatch)
  })
)(HomePageContainer);
