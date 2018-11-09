/*  我的优惠卡 - 从订单进 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./favOne.scss";
import tools from "../../../../util/all";

// ==================
// 所需的所有组件
// ==================
import Luo from "iscroll-luo";
import ImgRight from "../../../../assets/xiangyou2@3x.png";
import Img404 from "../../../../assets/not-found.png";
import ImgGuoQi from "../../../../assets/favcards/guoqi@3x.png";
import ImgShiYong from "../../../../assets/favcards/shiyong@3x.png";
import { Toast } from "antd-mobile";

// ==================
// 本页面所需action
// ==================

import {
  wxInit,
  queryListFree,
  saveFreeCardInfo,
  ticketHandsel,
  createMcardList,
  wxPay,
  getSendCount,
  batchShare,
  mallCardDel
} from "../../../../a_action/shop-action";
// ==================
// Definition
// ==================

class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pageSize: 10,
      pageNum: 1,
      total: 0
    };
  }

  componentDidMount() {
    document.title = "优惠卡";
    let p = this.props.location.pathname.split("/");
    const search = p[p.length - 1];
    this.setState({
      search
    });
    this.getData(1, this.state.pageSize, "flash", search, 1);
  }

  componentWillUnmount() {
    Toast.hide();
  }

  /**
   * 获取数据
   * @param pageNum
   * @param pageSize
   * @param type flash刷新，update加载更多
   * @param search 来自我的订单优惠卡查询，会有值
   */
  getData(pageNum = 1, pageSize = 10, type = "flash", search = null) {
    const u = this.props.userinfo || {};
    const params = {
      userId: u.id,
      pageNum,
      pageSize,
      orderId: search
      // ticketStatus: 1
    };

    this.props.actions
      .queryListFree(tools.clearNull(params))
      .then(res => {
        console.log("得到了什么：", res);
        if (res.status === 200) {
          if (
            !res.data ||
            !res.data.ticketList ||
            !res.data.ticketList.result ||
            res.data.ticketList.result.length === 0
          ) {
            if (type === "update") {
              Toast.info("没有更多数据了", 1);
            } else {
              Toast.hide();
            }
          } else {
            this.setState({
              data:
                type === "flash"
                  ? res.data.ticketList.result
                  : [...data, ...res.data.ticketList.result]
            });
            Toast.hide();
          }
        } else {
          Toast.info(res.message || "数据加载失败", 1);
          this.setState({
            data: this.state.data
          });
        }
      })
      .catch(() => {
        Toast.hide();
      });
  }

  // 下拉刷新
  onDown() {
    this.getData(1, this.state.pageSize, "flash", this.state.search);
  }
  // 上拉加载
  onUp() {
    // 先得到该第几页了
    this.getData(
      this.state.pageNum + 1,
      this.state.pageSize,
      "update",
      this.state.search
    );
  }

  // 工具 - 判断当前评估卡状态（正常(待支付、待使用)1、过期2、已使用3、已赠送5）
  checkCardStatus(item) {
    try {
      if (item.ticketStatus === 4) {
        // 已过期
        return 2;
      } else if (item.ticketStatus === 2) {
        // 已使用
        return 3;
      } else if (item.ticketStatus === 5) {
        // 已赠送
        return 5;
      }
      return 1;
    } catch (e) {
      return 1;
    }
  }

  // 点击一张评估卡
  onCardClick(item_son) {
    if ([5].includes(item_son.ticketStatus)) {
      // 已赠送的进入卡的流转记录
      this.props.history.push(`/my/favrecord/${item_son.ticketNo}`);
    } else if ([2, 4].includes(item_son.ticketStatus)) {
      // 已使用已过期分类的不能进入详情页
    } else {
      this.props.actions.saveFreeCardInfo(item_son); // 保存该张卡信息，下个页面要用
      setTimeout(() => this.props.history.push(`/my/favcardsdetail`), 16);
    }
  }

  render() {
    const d = this.state.data;
    return (
      <div className="page-favone">
        <div className="tabs-div">
          {/*<Luo*/}
          {/*id={`luo`}*/}
          {/*className="touch-none"*/}
          {/*onDown={() => this.onDown()}*/}
          {/*onUp={() => this.onUp()}*/}
          {/*iscrollOptions={{*/}
          {/*disableMouse: true*/}
          {/*}}*/}
          {/*>*/}
          <div className="the-ul">
            {(() => {
              if (d.length === 0) {
                return (
                  <div key={0} className="data-nothing">
                    <img src={Img404} />
                    <div>亲，这里什么也没有哦~</div>
                  </div>
                );
              } else {
                return d.map((item_son, index_son) => {
                  return (
                    <div
                      key={index_son}
                      className={(() => {
                        const classNames = [
                          "cardbox",
                          "page-flex-col",
                          "flex-jc-sb"
                        ];
                        if (
                          [1, 2, 3, 4].includes(item_son.ticketStatus) &&
                          this.checkCardStatus(item_son) !== 1
                        ) {
                          // 已赠送的不变灰色
                          // 只有已使用、已过期才灰色，其他即使过期也不灰
                          switch (item_son.ticketStyle) {
                            case 1:
                              classNames.push("abnormal1");
                              break;
                            case 2:
                              classNames.push("abnormal2");
                              break;
                            default:
                              classNames.push("abnormal3");
                          }
                        }
                        switch (item_son.ticketStyle) {
                          case 1:
                            classNames.push("a");
                            break;
                          case 2:
                            classNames.push("b");
                            break;
                        }
                        return classNames.join(" ");
                      })()}
                      style={(() => {
                        if (
                          this.checkCardStatus(item_son) !== 1 &&
                          item_son.imageUsed
                        ) {
                          return {
                            backgroundImage: `url(${item_son.imageUsed})`
                          };
                        } else if (item_son.image) {
                          return { backgroundImage: `url(${item_son.image})` };
                        }
                        return null;
                      })()}
                      onClick={() => this.onCardClick(item_son)}
                    >
                      <div className="row1 flex-none page-flex-row flex-jc-sb">
                        <div>
                          <div className="t" />
                        </div>
                        {(() => {
                          switch (item_son.ticketStatus) {
                            case 4:
                              return <img className="tip" src={ImgGuoQi} />; // 已过期
                            case 2:
                              return <img className="tip" src={ImgShiYong} />; // 已使用
                            case 5:
                              return (
                                <div className="flex-none">
                                  赠送记录 <img src={ImgRight} />
                                </div>
                              ); // 已赠送
                            default:
                              return (
                                <div className="flex-none">
                                  {item_son.handselStatus === 1
                                    ? "赠送中 "
                                    : null}
                                  <img src={ImgRight} />
                                </div>
                              );
                          }
                        })()}
                      </div>
                      <div className="row-center all_nowarp">
                        {(() => {
                          switch (item_son.ticketStyle) {
                            case 1:
                              return item_son.ticketContent;
                            case 2:
                              return "";
                            case 3:
                              return "";
                            default:
                              return "";
                          }
                        })()}
                      </div>
                      <div className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end">
                        <div>
                          <div className="t">
                            卡号：
                            {tools.cardFormart(item_son.ticketNo)}
                          </div>
                          <div className="i">
                            有效期至：
                            {item_son.validEndTime
                              ? item_son.validEndTime.split(" ")[0]
                              : ""}
                          </div>
                        </div>
                        <div>
                          <div className="money">￥1000</div>
                        </div>
                      </div>
                    </div>
                  );
                });
              }
            })()}
          </div>
          {/*</Luo>*/}
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
    actions: bindActionCreators(
      {
        wxInit,
        queryListFree,
        saveFreeCardInfo,
        ticketHandsel,
        createMcardList,
        wxPay,
        getSendCount,
        batchShare,
        mallCardDel
      },
      dispatch
    )
  })
)(HomePageContainer);
