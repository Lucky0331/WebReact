/* 我的e家 - 我的客户 - 企业版主账号有这个额外页面 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import "./primary.scss";
// ==================
// 所需的所有组件
// ==================
import { List, Toast } from "antd-mobile";
import ImgDefault from "../../../../assets/default-head.jpg";
import Img404 from "../../../../assets/not-found.png";
import ImgR from "../../../../assets/xiangyou2@3x.png";
import Li from "./component/list";
// ==================
// 本页面所需action
// ==================

import {
  getCustomersCompany,
  saveSonInInfo
} from "../../../../a_action/shop-action";
import { updateUserInfo2 } from "../../../../a_action/app-action";
// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    document.title = "我的推广客户";
    this.getData();
  }

  getData() {
    const u = this.props.userinfo;
    if (!u) {
      return;
    }
    Toast.loading("加载中…");
    this.props.actions
      .getCustomersCompany({ userId: u.id })
      .then(res => {
        if (res.status === 200) {
          if (res.data) {
            this.setState({
              data: res.data
            });
          }
        }
        Toast.hide();
      })
      .catch(() => {
        Toast.hide();
      });
  }

  // 主账号或子帐号被点击
  onPrimaryClick(item) {
    this.props.history.push(`/my/mycustomer/${item.id}/${item.userType}`);
  }

  onChangeStar(u, v) {
    const params = {
      asteriskUserId: u.id,
      asteriskLevel: v
    };
    this.props.actions.updateUserInfo2(params).then(res => {
      if (res.status === 200) {
        Toast.success("修改成功", 1);
        this.getData(this.state.id);
      } else {
        Toast.info(res.message, 1);
      }
    });
  }

  onChangeBeiZhu(u, v) {
    const params = {
      asteriskUserId: u.id,
      aliasName: v
    };
    this.props.actions.updateUserInfo2(params).then(res => {
      if (res.status === 200) {
        Toast.success("修改成功", 1);
        this.getData(this.state.id);
      } else {
        Toast.info(res.message, 1);
      }
    });
  }

  render() {
    const u = this.props.userinfo || {};
    return (
      <div className="page-primary">
        {u.id && <div className="data-title">主账号</div>}
        {u.id && (
          <ul className="data-list">
            <Li
              data={u}
              type={"normal"}
              jiantou={true}
              onCallBack={() => this.onPrimaryClick(u)}
            />
          </ul>
        )}
        <div className="data-title">
          子账号
          <span style={{ float: "right" }}>
            总计：
            {this.state.data
              ? this.state.data.filter(item => item.userType === 6).length
              : "0"}
            人
          </span>
        </div>
        <ul className="data-list">
          {this.state.data.length ? (
            this.state.data
              .filter(item => {
                return item.userType === 6;
              })
              .map((item, index) => {
                return (
                  <Li
                    key={index}
                    data={item}
                    type={"normal"}
                    jiantou={true}
                    onCallBack={obj => this.onPrimaryClick(obj)}
                    onChangeStar={(id, v) => this.onChangeStar(id, v)}
                    onChangeBeiZhu={(id, v) => this.onChangeBeiZhu(id, v)}
                  />
                );
              })
          ) : (
            <li key={0} className="data-nothing">
              <img src={Img404} />
              <div>亲，这里什么也没有哦~</div>
            </li>
          )}
        </ul>
        <div style={{ height: "45px" }} />
        {/*<div className="footer-btn" onClick={() => this.props.history.push('/my/customernex')}>我的客户关系说明<img src={ImgR} /></div>*/}
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
      { getCustomersCompany, saveSonInInfo, updateUserInfo2 },
      dispatch
    )
  })
)(HomePageContainer);
