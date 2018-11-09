/* 提现记录列表 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./tiXianRecord.scss";
import tools from "../../../../util/all";
// ==================
// ==================
// 所需的所有组件
// ==================
import { List, Toast } from "antd-mobile";
import Luo from "iscroll-luo";
import Img404 from "../../../../assets/not-found.png";
import ImgR from "../../../../assets/xiangyou@3x.png";
// ==================
// 本页面所需action
// ==================

import {
  getCashRecordList,
  saveTiXianDetailInfo
} from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 所有数据
      sourceData: [], // 所有省市数据（层级）
      loading: false, // 搜索中
      pageNum: 1,
      pageSize: 10,
      search: undefined,
      refreshing: false // 加载更多搜索中
    };
  }

  componentDidMount() {
    document.title = "提现记录";
    this.getData(this.state.pageNum, this.state.pageSize, "flash");
  }

  UNSAFE_componentWillReceiveProps(nextP) {}

  getData(pageNum, pageSize, flash = "flash") {
    const me = this;
    const params = {
      pageNum,
      pageSize
    };
    Toast.loading("搜索中...", 0);
    this.props.actions
      .getCashRecordList(tools.clearNull(params))
      .then(res => {
        if (res.status === 200) {
          me.setState({
            data:
              flash === "flash"
                ? res.data.result || []
                : [...this.state.data, ...(res.data.result || [])],
            pageNum,
            pageSize
          });
          Toast.hide();
        } else {
          if (flash === "update") {
            Toast.info("没有更多数据了", 1);
          } else {
            Toast.hide();
          }
          me.setState({
            data: this.state.data
          });
        }
      })
      .catch(() => {
        me.setState({
          data: this.state.data
        });
        Toast.info("查询失败，请重试", 1);
      });
  }

  // 下拉刷新
  onDown() {
    this.getData(1, this.state.pageSize, "flash");
  }
  // 上拉加载
  onUp() {
    this.getData(this.state.pageNum + 1, this.state.pageSize, "update");
  }

  // 点击提现
  onCLickThis(partnerTradeNo) {
    // 将信息存入store
    // this.props.actions.saveTiXianDetailInfo(item);
    // setTimeout(() => this.props.history.push('/profit/tixiandetail'));
    this.props.history.push(`/profit/tixiandetail/${partnerTradeNo}`);
  }

  // 当前状态
  takeType(item) {
    if (item.status === 3) {
      return <span style={{ color: "rgb(50, 123, 244)" }}>审核中</span>;
    }
    if (item.flag === 2) {
      return <span>提现失败</span>;
    } else if (item.flag === 1) {
      return <span>提现成功</span>;
    }
  }

  render() {
    return (
      <div className="page-tixianrecord">
        <div className="iscroll-box">
          <Luo
            id="luo2"
            className="touch-none"
            onPullDownRefresh={() => this.onDown()}
            onPullUpLoadMore={() => this.onUp()}
          >
            <ul>
              {this.state.data.length ? (
                this.state.data.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className="card-box page-flex-row"
                      onClick={() => this.onCLickThis(item.partnerTradeNo)}
                    >
                      <div className="l flex-auto">
                        <div className="title">
                          <span>
                            提现到
                            {item.destCash}
                          </span>
                          <span>
                            ￥
                            {Number(item.amount)
                              ? Number(item.amount).toFixed(2)
                              : "--"}
                          </span>
                        </div>
                        <div className="info">
                          <span>{item.applyTime}</span>
                          <span className="type">{this.takeType(item)}</span>
                        </div>
                      </div>
                      <div className="r">
                        <img src={ImgR} />
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
  actions: P.any,
  areaData: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    areaData: state.app.areaData
  }),
  dispatch => ({
    actions: bindActionCreators(
      { getCashRecordList, saveTiXianDetailInfo },
      dispatch
    )
  })
)(HomePageContainer);
