/* 健康管理 - 检查报告 - 选择已使用过的体检券 */

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
import Luo from "iscroll-luo";
import ImgRight from "../../../../assets/xiangyou2@3x.png";
import Img404 from "../../../../assets/not-found.png";
import { Toast, List } from "antd-mobile";
// ==================
// 本页面所需action
// ==================

import {
  saveReportInfo,
  queryUsedListTicket
} from "../../../../a_action/shop-action";
// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 用户拥有的评估卡
      wxReady: false, // 微信是否已初始化
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  }

  componentDidMount() {
    document.title = "选择评估卡";
    this.getData();
  }

  // 获取评估卡列表
  getData(pageNum = 1, pageSize = 10, type = "flash") {
    Toast.loading("搜索中...", 0);
    this.props.actions
      .queryUsedListTicket({ pageNum, pageSize })
      .then(res => {
        if (res.status === 200) {
          Toast.hide();
          this.setState({
            data:
              type === "flash"
                ? res.data.result || []
                : [...this.state.data, ...(res.data.result || [])],
            pageNum,
            pageSize,
            total: res.data.total
          });
        } else if (res.status === 204) {
          // 未获取到数据
          if (type === "update") {
            Toast.info("没有更多数据了", 1);
          } else {
            Toast.hide();
          }

          this.setState({
            data: type === "flash" ? [] : this.state.data
          });
        }
      })
      .catch(() => {
        Toast.info("网络错误，请重试");
        this.setState({
          data: type === "flash" ? [] : this.state.data
        });
      });
  }

  // 选择某一张卡，将卡信息保存到store的体检预约信息中
  onCardClick(data) {
    this.props.actions.saveReportInfo({ ticketNo: String(data.ticketNo) });
    setTimeout(() => this.props.history.go(-1), 16);
  }

  // 下拉刷新
  onDown() {
    this.getData(1, this.state.pageSize, "flash");
  }
  // 上拉加载
  onUp() {
    this.getData(this.state.pageNum + 1, this.state.pageSize, "update");
  }

  render() {
    return (
      <div className="page-chose-card">
        <List>
          <Item extra={`总计：${this.state.total}张`}>已使用的卡</Item>
        </List>
        <div className="luo-box">
          <Luo
            id="luo3"
            className="touch-none"
            onPullDownRefresh={() => this.onDown()}
            onPullUpLoadMore={() => this.onUp()}
            iscrollOptions={{
              disableMouse: true
            }}
          >
            <ul className="the-ul">
              {(() => {
                let map = [];
                if (this.state.data.length <= 0) {
                  map.push(
                    <li key={0} className="data-nothing">
                      <img src={Img404} />
                      <div>亲，这里什么也没有哦~</div>
                    </li>
                  );
                } else {
                  map = this.state.data.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="cardbox page-flex-col flex-jc-sb"
                        onClick={() => this.onCardClick(item)}
                      >
                        <div className="row1 flex-none page-flex-row flex-jc-sb">
                          <div>
                            <div className="t" />
                          </div>
                        </div>
                        <div className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end">
                          <div>
                            <div className="t">
                              卡号：
                              {tools.cardFormart(item.ticketNo)}
                            </div>
                            <div className="i">
                              有效期至：
                              {item.validEndTime
                                ? item.validEndTime.split(" ")[0]
                                : ""}
                            </div>
                          </div>
                          <div>
                            <div className="money">￥1000</div>
                          </div>
                        </div>
                      </li>
                    );
                  });
                }
                return map;
              })()}
            </ul>
          </Luo>
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
    actions: bindActionCreators(
      { saveReportInfo, queryUsedListTicket },
      dispatch
    )
  })
)(HomePageContainer);
