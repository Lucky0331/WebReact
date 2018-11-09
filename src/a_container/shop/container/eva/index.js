/* 商品评价 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import ImgKiss from "../../../../assets/shop/good@3x.png";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================

// ==================
// 本页面所需action
// ==================

import {} from "antd-mobile";

// ==================
// Definition
// ==================
class EvaPageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabChose: 1
    };
    this.ul1 = null;
    this.ul2 = null;
  }

  componentDidMount() {}
  onChoseClick(id) {
    this.setState({
      tabChose: id
    });
  }

  // 滚动条滚动事件
  scrollEvent() {
    const win = $(window);
    const scrollTop = win.scrollTop(); // 滚动条滚动了的高度
    const scrollHeight = $(document).height(); // 文档区域的高度
    const windowHeight = win.height(); // 窗口总高度
    if (scrollTop + windowHeight > scrollHeight - 20) {
      if (!this.loading && !this.state.downNow) {
        this.onUp();
      }
    }
  }

  onScrollUl1(e) {
    if (
      e.target.clientHeight + e.target.scrollTop >
      e.target.scrollHeight - 20
    ) {
      // 触发加载更多
      console.log("加载更多");
    }
  }
  render() {
    return (
      <div className="eva-page">
        <div className="title">
          <img src={ImgKiss} />
          <span className="num">00.0%</span>
          <span className="word">好评</span>
        </div>
        <div className="chose">
          <div
            className={this.state.tabChose === 1 ? "check" : null}
            onClick={() => this.onChoseClick(1)}
          >
            全部 (10000)
          </div>
          <div
            className={this.state.tabChose === 2 ? "check" : null}
            onClick={() => this.onChoseClick(2)}
          >
            有图 (9999)
          </div>
        </div>
        <div className={"body-box"}>
          <div className={"scroller"}>
            <ul
              className={this.state.tabChose !== 1 ? "check" : null}
              key={1}
              ref={dom => (this.ul1 = dom)}
              onScroll={e => this.onScrollUl1(e)}
            >
              <li>
                <div className={"info-box"}>
                  <img className="pic" src={ImgKiss} />
                  <div className={"info"}>
                    <div className={"name"}>
                      {tools.addMosaic("某某某某某某某")}
                    </div>
                    <div className={"stars"}>
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                    </div>
                  </div>
                </div>
                <div className={"eva"}>
                  这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀
                </div>
                <div className={"pics-box"}>
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                </div>
                <div className="date">2018-01-01</div>
              </li>
              <li>
                <div className={"info-box"}>
                  <img className="pic" src={ImgKiss} />
                  <div className={"info"}>
                    <div className={"name"}>
                      {tools.addMosaic("某某某某某某某")}
                    </div>
                    <div className={"stars"}>
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                    </div>
                  </div>
                </div>
                <div className={"eva"}>
                  这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀
                </div>
                <div className={"pics-box"}>
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                </div>
                <div className="date">2018-01-01</div>
              </li>
              <li>
                <div className={"info-box"}>
                  <img className="pic" src={ImgKiss} />
                  <div className={"info"}>
                    <div className={"name"}>
                      {tools.addMosaic("某某某某某某某")}
                    </div>
                    <div className={"stars"}>
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                    </div>
                  </div>
                </div>
                <div className={"eva"}>
                  这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀
                </div>
                <div className={"pics-box"}>
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                </div>
                <div className="date">2018-01-01</div>
              </li>
              <li>
                <div className={"info-box"}>
                  <img className="pic" src={ImgKiss} />
                  <div className={"info"}>
                    <div className={"name"}>
                      {tools.addMosaic("某某某某某某某")}
                    </div>
                    <div className={"stars"}>
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                    </div>
                  </div>
                </div>
                <div className={"eva"}>
                  这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀
                </div>
                <div className={"pics-box"}>
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                  <img src={ImgKiss} />
                </div>
                <div className="date">2018-01-01</div>
              </li>
            </ul>
            <ul key={2}>
              <li>
                <div>
                  <img src={ImgKiss} />
                  <div>
                    <div>{tools.addMosaic("某某某某某某某")}</div>
                    <div>
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                      <img src={ImgKiss} />
                    </div>
                  </div>
                </div>
                <div>
                  这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀这产品哇塞服了牛逼呀
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

EvaPageContainer.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    userinfo: state.app.userinfo
  }),
  dispatch => ({
    actions: bindActionCreators({}, dispatch)
  })
)(EvaPageContainer);
