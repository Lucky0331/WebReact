/* 收益管理 - 收益明细 */

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
import { List, Toast, Picker } from "antd-mobile";
import Luo from "iscroll-luo";
import ImgRight from "../../../../assets/xiangyou@3x.png";
// ==================
// 本页面所需action
// ==================

import {
  userIncomeDetails,
  saveProDetail,
  listProductType
} from "../../../../a_action/shop-action";
// ==================
// Definition
// ==================
const Item = List.Item;
const Brief = Item.Brief;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 数据
      allAccount: [], // 所有的子账号
      pageNum: 1,
      pageSize: 10,
      date: [String(new Date().getFullYear()), "全年"], // 当前选中的年月
      searchAccount: ["all"], // 选中的子账号
      productType: ["all"], // 选中的产品类型
      totalIncome: 0 // 合计
    };
  }

  componentDidMount() {
    document.title = "收益明细";
    this.getData(this.state.date);
    if (!this.props.allProductTypes.length) {
      this.getlistProductType();
    }
  }

  // 获取所有产品类型
  getlistProductType() {
    this.props.actions.listProductType();
  }

  // 收益来源选择变化
  onAccountChange(obj) {
    this.setState({
      searchAccount: obj
    });
    this.getData(
      this.state.date,
      obj,
      this.state.productType,
      1,
      this.state.pageSize,
      "flash"
    );
  }

  // 日期选择变化时触发
  onDateChange(date) {
    this.setState({
      date
    });
    this.getData(
      date,
      this.state.searchAccount,
      this.state.productType,
      1,
      this.state.pageSize,
      "flash"
    );
  }

  // 产品类型选择变化
  onProductTypeChange(obj) {
    console.log("返回的什么2：", obj);
    this.setState({
      productType: obj
    });
    this.getData(
      this.state.date,
      this.state.searchAccount,
      obj,
      1,
      this.state.pageSize,
      "flash"
    );
  }

  /**
   *
   * @param date 选择的时间
   * @param account 选择的子账户
   * @param productType 选择的产品类型
   * @param pageNum 当前页码
   * @param pageSize 每页大小
   * @param type 是刷新还是加载更多 flash/update
   */
  getData(
    date = null,
    account = null,
    productType = null,
    pageNum = 1,
    pageSize = 10,
    type = "flash"
  ) {
    const u = this.props.userinfo;
    if (!u) {
      return;
    }
    // 处理是否选择了收益来源
    let userId;
    let userType; // 后台分了两个接口，查自己用1，查子账户用2
    if (account && account[0] !== "all") {
      userId = account[0];
      userType = 2;
    } else {
      userId = u.id;
      userType = 1;
    }
    console.log("DATE:", date);
    const params = {
      userId,
      year: date ? (date[0] === "全部" ? "" : date[0]) : null,
      month: date && date[1] && date[1] !== "全年" ? date[1] : null,
      pageNum,
      pageSize,
      productType:
        productType && productType[0] !== "all" ? productType[0] : null
    };
    Toast.loading("搜索中...", 0);
    this.props.actions
      .userIncomeDetails(tools.clearNull(params), userType)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            allAccount:
              userType === 1 ? res.data.sonDistributor : this.state.allAccount
          });
          if (
            res.data &&
            res.data.basePage &&
            res.data.basePage.result &&
            res.data.basePage.result.length
          ) {
            this.setState({
              totalIncome: res.data.totalIncome,
              data:
                type === "flash"
                  ? res.data.basePage.result
                  : [...this.state.data, ...res.data.basePage.result],
              pageNum,
              pageSize
            });
            Toast.hide();
          } else {
            // 没有数据后台返回的是null
            if (type === "update") {
              this.setState({
                data: this.state.data
              });
              Toast.info("暂没有收益数据", 1);
            } else {
              this.setState({
                totalIncome: 0,
                data: []
              });
              Toast.hide();
            }
          }
        } else {
          if (type === "flash") {
            console.log("传了一个");
            this.setState({
              data: [],
              totalIncome: 0
            });
          } else {
            this.setState({
              data: this.state.data
            });
          }
          Toast.info(res.message || "获取数据失败", 1);
        }
      })
      .catch(() => {
        this.setState({
          data: this.state.data
        });
        Toast.info("网络错误，请稍后重试", 1);
      });
  }

  // 工具 - 根据子账号ID查子账号userType;
  getTypeByUserId(id) {
    const t = this.state.allAccount.find(item => {
      return item.id === Number(id);
    });
    return t && t.userType;
  }

  // 点击一条数据，进入该数据的详情页
  onItemClick(d) {
    let userType = this.props.userinfo.userType;
    if (this.state.searchAccount[0] !== "all") {
      // 选的子账号，用子账号的userType
      userType = this.getTypeByUserId(this.state.searchAccount[0]);
    }
    console.log("userType是：", userType);
    this.props.actions.saveProDetail(d); // 将当前选中的这条数据保存到store
    setTimeout(
      () => this.props.history.push(`/profit/prodetails/${userType}`),
      16
    );
  }

  onDown() {
    this.getData(
      this.state.date,
      this.state.searchAccount,
      this.state.productType,
      1,
      this.state.pageSize,
      "flash"
    );
  }

  onUp() {
    this.getData(
      this.state.date,
      this.state.searchAccount,
      this.state.productType,
      this.state.pageNum + 1,
      this.state.pageSize,
      "update"
    );
  }

  render() {
    const u = this.props.userinfo || {};
    return (
      <div className="profit-main">
        <List>
          {u && u.userType === 5 ? (
            <Picker
              extra={"请选择"}
              cols={1}
              data={[
                [
                  { label: "全部", value: "all" },
                  ...this.state.allAccount.map(item => ({
                    label: item.realName || item.nickName,
                    value: item.id
                  }))
                ]
              ]}
              cascade={false}
              value={this.state.searchAccount}
              onOk={obj => this.onAccountChange(obj)}
            >
              <Item>收益来源账户</Item>
            </Picker>
          ) : null}
          {this.props.allProductTypes.length ? (
            <Picker
              extra={"请选择："}
              cols={1}
              data={[
                [
                  { label: "全部", value: "all" },
                  ...this.props.allProductTypes.map(item => ({
                    label: item.name,
                    value: item.id
                  }))
                ]
              ]}
              cascade={false}
              value={this.state.productType}
              onOk={obj => this.onProductTypeChange(obj)}
            >
              <Item>选择产品类型</Item>
            </Picker>
          ) : null}
        </List>
        <Picker
          data={(() => {
            const nowYear = new Date().getFullYear();
            const y = [];
            for (let i = nowYear - 10; i <= nowYear; i++) {
              y.push({
                label: i,
                value: `${i}`,
                children: [
                  { label: "全年", value: "全年" },
                  { label: "1月", value: "01" },
                  { label: "2月", value: "02" },
                  { label: "3月", value: "03" },
                  { label: "4月", value: "04" },
                  { label: "5月", value: "05" },
                  { label: "6月", value: "06" },
                  { label: "7月", value: "07" },
                  { label: "8月", value: "08" },
                  { label: "9月", value: "09" },
                  { label: "10月", value: "10" },
                  { label: "11月", value: "11" },
                  { label: "12月", value: "12" }
                ]
              });
            }
            y.push({ label: "全部", value: "全部", children: [] });
            return y;
          })()}
          cascade={true}
          cols={2}
          value={this.state.date}
          onOk={obj => this.onDateChange(obj)}
        >
          <div className="head-chose page-flex-row flex-jc-sb">
            <div className="date-chose">
              <span>
                {this.state.date
                  ? (() => {
                      const d = this.state.date;
                      if (d && d.length > 1 && d[1] === "全年") {
                        return d[0];
                      }
                      return d.join("-");
                    })()
                  : "选择时间"}
              </span>
              <img src={ImgRight} />
            </div>
            <div>￥{this.state.totalIncome}</div>
          </div>
        </Picker>
        <div
          className="list-box"
          style={{
            height:
              u.userType === 5 ? "calc(100vh - 132px)" : "calc(100vh - 88px)"
          }}
        >
          <Luo
            id="luo1"
            className="touch-none"
            onPullDownRefresh={() => this.onDown()}
            onPullUpLoadMore={() => this.onUp()}
            iscrollOptions={{
              disableMouse: true
            }}
          >
            <List>
              {this.state.data.map((item, index) => {
                return (
                  <Item
                    key={index}
                    onClick={() => this.onItemClick(item)}
                    extra={<span>￥{item.income}</span>}
                    arrow={"horizontal"}
                  >
                    {item.productTypeName}
                    <Brief>{item.balanceTime}</Brief>
                  </Item>
                );
              })}
            </List>
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
  userinfo: P.any,
  allProductTypes: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    userinfo: state.app.userinfo,
    allProductTypes: state.shop.allProductTypes
  }),
  dispatch => ({
    actions: bindActionCreators(
      { userIncomeDetails, saveProDetail, listProductType },
      dispatch
    )
  })
)(HomePageContainer);
