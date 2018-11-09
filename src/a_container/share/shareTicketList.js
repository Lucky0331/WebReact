/* 健康管理 - 分享 - 从评估卡点击查看5张体检券页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./shareTicketList.scss";
import tools from "../../util/all";
// ==================
// 所需的所有组件
// ==================

import ImgFenXiang from "../../assets/fenxiang@3x.png";

// ==================
// 本页面所需action
// ==================

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 所有的体检券信息
      date: "" // 有效期
    };
  }

  componentDidMount() {
    document.title = "体检券";
    this.getData();
  }

  // 获取评估卡列表
  getData() {
    const path = this.props.location.pathname.split("/");
    const pathLast = path[path.length - 1];
    const splitStr = pathLast.includes("_fff_") ? "_fff_" : "_";
    let info = path[path.length - 1];
    info = info.split(splitStr);
    const date = info[0];

    let list = info[1].split("+");
    list = list.map((item, index) => item.split("@"));
    console.log("list是什么：", list);
    this.setState({
      date,
      data: list
    });
  }

  render() {
    const ticket = this.state.data;
    return (
      <div className="page-shareticketlist">
        <ul>
          {ticket.map((item, index) => {
            return (
              <li key={index} className="cardbox page-flex-col flex-jc-sb">
                <div className="row1 flex-none page-flex-row flex-jc-sb" />
                <div className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end">
                  <div>
                    <div className="t">
                      卡号
                      <span>{tools.cardFormart(item[0])}</span>
                    </div>
                    <div className="i">
                      有效期至：
                      {this.state.date}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
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
  cardInfo: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({}, dispatch)
  })
)(HomePageContainer);
