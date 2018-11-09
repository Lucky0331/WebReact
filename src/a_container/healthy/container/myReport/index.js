/* 健康管理 - 检查报告 */

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

import { Button, Toast } from "antd-mobile";
import Luo from "iscroll-luo";
import ImgRight from "../../../../assets/xiangyou@3x.png";
import Img404 from "../../../../assets/not-found.png";
import ImgDiZhi from "./assets/dizhi@3x.png";
import ImgGeRen from "./assets/geren@3x.png";
import ImgGroup from "./assets/Group 8@3x.png";
// ==================
// 本页面所需action
// ==================

import { queryReportList } from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================

class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pageNum: 1,
      pageSize: 10,
      noDown: false
    };
  }

  componentDidMount() {
    document.title = "评估报告";
    this.getData();
  }

  getData(pageNum = 1, pageSize = 10, type = "flash") {
    Toast.loading("搜索中...", 0);
    this.props.actions
      .queryReportList({ pageNum, pageSize })
      .then(res => {
        if (res.status === 200 && res.data.result) {
          this.setState({
            data:
              type === "flash"
                ? res.data.result
                : [...this.state.data, ...res.data.result],
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
            this.setState({
              noDown: true
            });
          } else {
            Toast.hide();
            this.setState({
              noDown: false
            });
          }
        }
      })
      .catch(() => {
        this.setState({
          data: type === "flash" ? [] : this.state.data
        });
        Toast.info(res.message, 1);
      });
  }

  // 打开PDF
  onPdf(url) {
    window.open(url);
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
      <div className="page-report">
        <div className="luo-box">
          <Luo
            id="luo1"
            className="touch-none"
            onDown={() => this.onDown()}
            onUp={() => this.onUp()}
            noUp={this.state.noDown}
            noUpStr={"已全部加载完毕"}
            iscrollOptions={{
              disableMouse: true
            }}
          >
            <ul>
              {this.state.data.length ? (
                this.state.data.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className="card-box page-flex-row"
                      onClick={() => this.onPdf(item.reportPDF)}
                    >
                      <div className="l flex-auto">
                        <div>
                          <img className="l-icon" src={ImgGeRen} />
                          <span>{item.username}</span>
                          <span>
                            {["男", 1].includes(item.sex) ? "男" : "女"}
                          </span>
                          <span style={{ float: "right", marginRight: "0" }}>
                            {item.examDate}
                          </span>
                        </div>
                        <div>
                          <img className="l-icon" src={ImgGroup} />
                          <span>{item.ticketNo}</span>
                        </div>
                        <div>
                          <img className="l-icon" src={ImgGeRen} />
                          <span>{item.stationName || "--"}</span>
                        </div>
                      </div>
                      <div className="r flex-none page-flex-col flex-ai-center flex-jc-center">
                        <img src={ImgRight} />
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
        <div className="thefooter">
          <Button
            type="primary"
            onClick={() => this.props.history.push("/healthy/addreport")}
          >
            添加报告
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
  actions: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({ queryReportList }, dispatch)
  })
)(HomePageContainer);
