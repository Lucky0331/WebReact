/* 收益管理 - 收益明细 - 详情 */

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
import { List, Toast } from "antd-mobile";
import ImgRight from "../../../../assets/xiangyou@3x.png";
import ImgDefault from "../../../../assets/default-head.jpg";
// ==================
// 本页面所需action
// ==================

// ==================
// Definition
// ==================
const Item = List.Item;
const Brief = Item.Brief;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(), // 当前选中的年月
      userType: null // 当前收益明细对应的帐号的用户类型
    };
  }

  componentDidMount() {
    document.title = "收益详情";
    if (!this.props.proDetail) {
      Toast.info("未获取到收益详情信息", 1);
    }
    const p = this.props.location.pathname.split("/");
    const userType = p[p.length - 1];
    this.setState({
      userType
    });
  }

  render() {
    const data = this.props.proDetail;
    const u = this.props.userinfo || {};
    return (
      <div className="page-details">
        <List>
          <Item
            extra={
              <span style={{ color: "#FF0303" }}>￥{data.income || "--"}</span>
            }
          >
            收益
          </Item>
        </List>
        {u.userType === 5 ? (
          <List className={"mt"}>
            <Item extra={data.resourceName}>收益来源账户</Item>
          </List>
        ) : null}
        <List className="mt">
          <Item>下单信息：</Item>
          <Item
            thumb={<img src={data.headImg || ImgDefault} />}
            className={"who"}
          >
            <div style={{ textAlign: "right" }}>
              {data.nickName}
              <Brief>
                e家号：
                {data.userId}
              </Brief>
            </div>
          </Item>
        </List>
        <div className="info-box">
          <div className="page-flex-row flex-jc-sb">
            <div>类型</div>
            <div>{data.productTypeName}</div>
          </div>
          <div className="page-flex-row flex-jc-sb">
            <div>时间</div>
            <div>{data.balanceTime}</div>
          </div>
          <div className="page-flex-row flex-jc-sb">
            <div>交易单号</div>
            <div>{data.orderId}</div>
          </div>
        </div>
        {[1, 2, 5, 6].includes(Number(this.state.userType)) &&
        data.userSaleMoney ? (
          <List className="mt">
            <Item>分销商信息：</Item>
            <Item
              thumb={<img src={data.userSaleHeadImg || ImgDefault} />}
              className={"who"}
            >
              <div style={{ textAlign: "right" }}>
                {data.userSaleNickName}
                <Brief>
                  e家号：
                  {data.userSaleId}
                </Brief>
              </div>
            </Item>
            <Item extra={`￥${data.userSaleMoney || 0}`}>归属于分销商收益</Item>
          </List>
        ) : null}
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
  proDetail: P.any,
  userinfo: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    proDetail: state.shop.proDetail,
    userinfo: state.app.userinfo
  }),
  dispatch => ({
    actions: bindActionCreators({}, dispatch)
  })
)(HomePageContainer);
