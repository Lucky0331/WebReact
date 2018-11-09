/* 健康资讯 */

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

import { Tabs } from "antd-mobile";
import { StickyContainer, Sticky } from "react-sticky";
import ImgIcon1 from "../../assets/fenxiang_three@3x.png";
// ==================
// 本页面所需action
// ==================

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="flex-auto page-box new-page">
        <StickyContainer>
          <Tabs
            tabs={[
              { title: "翼猫新闻" },
              { title: "健康资讯" },
              { title: "行业动态" }
            ]}
          >
            {/* 翼猫新闻 */}
            <div className="the-list">
              <ul className="list">
                <li>
                  <Link to="/">
                    <div className="pic flex-none">
                      <img src={ImgIcon1} />
                    </div>
                    <div className="detail flex-auto page-flex-col">
                      <div className="t flex-none">经营智慧</div>
                      <div className="i flex-auto">
                        <div>主讲人：刘军老师</div>
                        <div>2017-09-09 14:20:00</div>
                      </div>
                      <div className="k page-flex-row flex-none">
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <div className="pic flex-none">
                      <img src={ImgIcon1} />
                    </div>
                    <div className="detail flex-auto page-flex-col">
                      <div className="t flex-none">经营智慧</div>
                      <div className="i flex-auto">
                        <div>主讲人：刘军老师</div>
                        <div>2017-09-09 14:20:00</div>
                      </div>
                      <div className="k page-flex-row flex-none">
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <div className="pic flex-none">
                      <img src={ImgIcon1} />
                    </div>
                    <div className="detail flex-auto page-flex-col">
                      <div className="t flex-none">经营智慧</div>
                      <div className="i flex-auto">
                        <div>主讲人：刘军老师</div>
                        <div>2017-09-09 14:20:00</div>
                      </div>
                      <div className="k page-flex-row flex-none">
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            {/* 健康资讯 */}
            <div className="the-list">
              <ul className="list">
                <li>
                  <Link to="/">
                    <div className="pic flex-none">
                      <img src={ImgIcon1} />
                    </div>
                    <div className="detail flex-auto page-flex-col">
                      <div className="t flex-none">经营智慧</div>
                      <div className="i flex-auto">
                        <div>主讲人：刘军老师</div>
                        <div>2017-09-09 14:20:00</div>
                      </div>
                      <div className="k page-flex-row flex-none">
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <div className="pic flex-none">
                      <img src={ImgIcon1} />
                    </div>
                    <div className="detail flex-auto page-flex-col">
                      <div className="t flex-none">经营智慧</div>
                      <div className="i flex-auto">
                        <div>主讲人：刘军老师</div>
                        <div>2017-09-09 14:20:00</div>
                      </div>
                      <div className="k page-flex-row flex-none">
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            {/* 行业动态 */}
            <div className="the-list">
              <ul className="list">
                <li>
                  <Link to="/">
                    <div className="pic flex-none">
                      <img src={ImgIcon1} />
                    </div>
                    <div className="detail flex-auto page-flex-col">
                      <div className="t flex-none">经营智慧</div>
                      <div className="i flex-auto">
                        <div>主讲人：刘军老师</div>
                        <div>2017-09-09 14:20:00</div>
                      </div>
                      <div className="k page-flex-row flex-none">
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                        <span>
                          <img src={ImgIcon1} />
                          222
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </Tabs>
        </StickyContainer>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

HomePageContainer.propTypes = {
  location: P.any,
  history: P.any
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
