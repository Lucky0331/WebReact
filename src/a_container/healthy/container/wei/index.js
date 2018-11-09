/* 健康管理 - 评估报告（小程序）页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================

import ImgShareArr from "../../../../assets/share-arr.png";
// ==================
// 本页面所需action
// ==================
import { Toast } from "antd-mobile";
import { getWxacode } from "../../../../a_action/app-action";

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codeImg: null,
      shareShow: false // 分享提示框是否显示
    };
  }

  componentDidMount() {
    document.title = "评估报告";
    this.getData();
  }

  getData() {
    const uid = Number(this.props.location.pathname.split("/").slice(-1));
    if (uid) {
      this.props.actions.getWxacode({ userId: uid }).then(res => {
        if (res.status === 200) {
          this.setState({
            codeImg: res.data
          });
        } else {
          Toast.info(res.message, 1);
        }
      });
    } else {
      Toast.info("未获取到用户信息", 1);
    }
  }

  // 点击分享按钮，需判断是否是原生系统
  onStartShare(e) {
    e.stopPropagation();
    this.setState({
      shareShow: true
    });
  }

  render() {
    return (
      <div className={"pinggu-page"}>
        <div className="body1">
          <img className="code" src={this.state.codeImg} />
          <div className="share-btn" onClick={e => this.onStartShare(e)}>
            邀请好友
          </div>
        </div>
        <div
          className={this.state.shareShow ? "share-modal" : "share-modal hide"}
          onClick={() => this.setState({ shareShow: false })}
        >
          <img className="share" src={ImgShareArr} />
          <div className="title">点击右上角进行分享</div>
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
    actions: bindActionCreators({ getWxacode }, dispatch)
  })
)(HomePageContainer);
