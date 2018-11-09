/* 客服助手 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import { Transition } from "react-spring";
import "./index.scss";
import $ from "jquery";
import { Toast } from "antd-mobile";
// ==================
// 所需的所有组件
// ==================
import Talk from "./component/list";
import ImgRobot from "./assets/robot@3x.png";
import ImgFill1 from "./assets/Fill1@3x.png";
import ImgFill2 from "./assets/Fill2@3x.png";

// ==================
// 本页面所需action
// ==================

import {
  getKfList,
  getMobileDistributor
} from "../../../../a_action/new-action";

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 原始数据
      mobile: "4001519999", // 经销商电话
      tempData: [{ type: 1, date: new Date() }, { type: 2 }, { type: 3 }], // 零时数据
      loading: false // 正在回答中
    };
  }

  componentDidMount() {
    document.title = "客服助手";
    this.getData();
    this.getMobileDistributor();
  }
  componentWillUnmount() {
    Toast.hide();
  }
  // 获取数据
  getData() {
    Toast.loading("请稍后...", 0);
    this.props.actions
      .getKfList()
      .then(res => {
        if (res.status === 200) {
          const temp = [...this.state.tempData];
          temp.push({ type: 4, qid: 9999 });
          this.setState({
            data: res.data,
            tempData: temp
          });
          Toast.hide();
        } else {
          Toast.info(res.message, 1);
        }
      })
      .catch(e => {
        Toast.info("客服机器人启动失败", 1);
      });
  }

  // 获取经销商电话
  getMobileDistributor() {
    const u = this.props.userinfo;
    if (!u || !u.id) {
      return;
    }
    this.props.actions.getMobileDistributor({ userId: u.id }).then(res => {
      if (res.status === 200) {
        this.setState({
          mobile: res.data
        });
      }
    });
  }
  // 滑动到最下面
  static scrollToDown() {
    $("#word-body")
      .stop()
      .animate({ scrollTop: $("#word-body")[0].scrollHeight + "px" }, 300);
  }

  onTypeClick(e) {
    const qid = e.target.getAttribute("data-id");
    if (!qid) {
      // 可能点到ul本身了
      return;
    }
    const t = [...this.state.tempData];
    if (t[t.length - 1].qid === qid && t[t.length - 1].type === 4) {
      // 上一个已经是同样类型的回答了
      return;
    }
    t.push({ type: 4, qid });
    console.log("QID", t, qid);
    this.setState(
      {
        tempData: t
      },
      () => {
        HomePageContainer.scrollToDown();
      }
    );
  }

  q2a(q, a) {
    if (this.state.loading) {
      // 正在回答中
      return;
    }
    const tempData = [...this.state.tempData];
    tempData.push({ type: 5, q });
    this.setState(
      {
        tempData,
        loading: true
      },
      () => {
        HomePageContainer.scrollToDown();
      }
    );
    setTimeout(() => {
      tempData.push({ type: 6, a });
      this.setState(
        {
          tempData,
          loading: false
        },
        () => {
          HomePageContainer.scrollToDown();
        }
      );
    }, 500);
  }
  render() {
    return (
      <div className="page-kf">
        <div className="word-body" id="word-body">
          <Transition
            keys={this.state.tempData.map((item, index) => index)}
            from={{ opacity: 0, transform: "translateY(20px)" }}
            enter={{ opacity: 1, transform: "translateY(0)" }}
          >
            {this.state.tempData.map(item => styles => {
              return (
                <Talk
                  style={styles}
                  listOne={item}
                  source={this.state.data}
                  q2a={(q, a) => this.q2a(q, a)}
                  u={this.props.userinfo || {}}
                />
              );
            })}
          </Transition>
        </div>
        <div className="types" onClick={e => this.onTypeClick(e)}>
          {this.state.data.map((item, index) => {
            return (
              <div key={index} data-id={item.id}>
                {item.typeName}
              </div>
            );
          })}
        </div>
        <div className="footer-btn">
          {[3, 7].includes(
            this.props.userinfo && this.props.userinfo.userType
          ) ? (
            <a className="btn btn1" href={`tel:${this.state.mobile}`}>
              <img src={ImgFill1} />
              <span>销售咨询</span>
            </a>
          ) : null}

          <a
            className="btn btn2"
            href={"tel:4001519999"}
          >
            <img src={ImgFill2} />
            <span>客服热线</span>
          </a>
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
    actions: bindActionCreators({ getKfList, getMobileDistributor }, dispatch)
  })
)(HomePageContainer);
