/* 视频直播 - 主页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";
import Luo from "iscroll-luo";
import config from "../../../../config";
// ==================
// 所需的所有组件
// ==================
import { Toast, Tabs } from "antd-mobile";
import Img404 from "../../../../assets/not-found.png";
import _ from "lodash";
// ==================
// 本页面所需action
// ==================

import { getLiveTypes, getLiveList } from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================

class LiveContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allData: [], // 所有的分类的数据及参数
      tabNow: 0, //  当前Tab选中哪一页
      pageSize: 10 // 每页10个
    };
  }

  componentDidMount() {
    document.title = "视频中心";
    if (!this.props.liveTypes.length) {
      this.getLiveTypes();
    } else {
      this.initAllScroll(this.props.liveTypes);
    }
  }

  /**
   * 改变时
   * */
  UNSAFE_componentWillReceiveProps(nextP) {
    if (nextP.liveTypes !== this.props.liveTypes && nextP.liveTypes.length) {
      // 更新的types
      this.initAllScroll(nextP.liveTypes);
    }
  }
  /**
   * 退出时
   * */
  componentWillUnmount() {
    Toast.hide();
  }
  /**
   * 获取直播分类
   * **/
  getLiveTypes() {
    Toast.loading("请稍后...", 0);
    this.props.actions.getLiveTypes().finally(() => {
      Toast.hide();
    });
  }

  /**
   * 初始化分类所有参数信息
   * **/
  initAllScroll(data) {
    const useingData = data.filter(item => !item.deleteFlag); // 排除被禁用的分类
    const allData = [];
    useingData.forEach((item, index) => {
      if (!item.deleteFlag) {
        allData.push(item);
      }
      if (item.subList && item.subList.length) {
        // 如果有子级把子级也弄出来
        item.subList.forEach((v, i) => {
          if (!v.deleteFlag) {
            allData.push(v);
          }
        });
      }
    });

    const res = allData.map((item, index) => {
      return {
        id: item.id,
        parentId: item.parentId,
        level: item.level,
        pageNum: 1,
        data: [],
        childNow: null
      };
    });
    const tabNow = sessionStorage.getItem("live-tabnow")
      ? Number(sessionStorage.getItem("live-tabnow"))
      : 0;
    this.setState({
      allData: res,
      tabNow
    });
    setTimeout(() => {
      const theId = useingData.sort((a, b) => a.sorts - b.sorts)[tabNow].id;
      this.getData(theId, ~~!theId, 1, "flash");
    });
  }
  /**
   * 处理分类
   * */
  makeTypesLv1(data) {
    return data
      .filter((item, index) => item.level === 1 && !item.deleteFlag)
      .sort((a, b) => a.sorts - b.sorts)
      .map((item, index) => {
        return {
          id: item.id || 0,
          title: item.name,
          sub: index,
          children: item.subList
        };
      });
  }

  /**
   * 工具 - 根据liveTypeId获取对应的allData中的信息，因为要获得pageSize,才知道加载当前分类的哪一页
   * 推荐分类后台返回的id为null，但在页面中统一处理为0
   * **/
  getAllDataByTypeId(id) {
    let ind = null;
    const d = this.state.allData.find((item, index) => {
      if (Number(item.id) === Number(id)) {
        ind = index;
      }
      return Number(item.id) === Number(id);
    });
    return { d, ind };
  }

  /**
   * 根据分类ID获取对应的分类的视频列表
   * @param liveTypeId 视频分类ID
   * @param recommend 是否是推荐视频 0/1 查推荐视频的时候设为1
   * @param pageNum   当前分类查到哪一页了
   * @param type   flash下拉刷新 update上拉加载更多2
   */
  getData(liveTypeId, recommend, pageNum, type) {
    const temp = this.getAllDataByTypeId(liveTypeId);
    const allDataOne = _.cloneDeep(temp.d);
    if (!allDataOne) {
      Toast.info("未找到该分类信息", 1);
    }
    const params = {
      liveTypeId,
      recommend,
      pageNum,
      pageSize: this.state.pageSize
    };
    Toast.loading("请稍后...", 0);
    this.props.actions
      .getLiveList(params)
      .then(res => {
        if (res.status === 200) {
          if (res.data && res.data.result && res.data.result.length) {
            // 有数据
            if (type === "flash") {
              // 下拉刷新
              allDataOne.data = res.data.result;
            } else if (type === "update") {
              // 上拉加载
              allDataOne.data = [...allDataOne.data, ...res.data.result];
            }
            allDataOne.pageNum = pageNum;
            Toast.hide();
          } else {
            // 没有数据
            if (type === "flash") {
              allDataOne.data = [];
              allDataOne.pageNum = pageNum;
              Toast.hide();
            } else {
              Toast.info("已全部加载完毕", 1);
            }
          }
        } else {
          Toast.info(res.message, 1);
        }

        const t = _.cloneDeep(this.state.allData);
        t.splice(temp.ind, 1, allDataOne);

        this.setState({
          allData: t
        });
      })
      .catch(() => {
        Toast.hide();
        this.setState({
          allData: this.state.allData
        });
      });
  }

  /**
   * 选择不同1级分类时触发(tab页切换)3
   * **/
  onTabChange(tab, index) {
    const id = tab.id || null;
    const d = this.getAllDataByTypeId(id);
    if (!d.d) {
      Toast.info("未获取到该分类信息", 1);
      return;
    }
    sessionStorage.setItem("live-tabnow", index);
    this.setState({
      tabNow: index
    });
    if (!d.d.data || !d.d.data.length) {
      this.getData(id, ~~!id, 1, "flash");
    }
  }

  /**
   * 2级目录被点击
   * @param fatherId 父级ID
   * @param id ID
   */
  clickLv2(fatherId, id) {
    const fd = this.getAllDataByTypeId(fatherId);
    const allData = _.cloneDeep(this.state.allData);
    if (allData[fd.ind].childNow === id) {
      allData[fd.ind].childNow = null;
    } else {
      allData[fd.ind].childNow = id;
    }
    this.setState({
      allData
    });
    console.log('打印什么',fatherId,id)
  }

  /**
   * 根据状态返回对应的文字，颜色
   * **/
  getWordsByType(type) {
    switch (type) {
      case 1:
        return { w1: "直播中", w2: "观看", color: "#EA4159" };
      case 2:
        return { w1: "回放", w2: "看过", color: "#3AB0F1" };
      case 3:
        return { w1: "视频", w2: "看过", color: "#232323" };
      case 4:
        return { w1: "预约", w2: "预约", color: "#F58337" };
      default:
        return { w1: "视频", w2: "看过", color: "#232323" };
    }
  }

  /**
   * 下拉刷新
   * **/
  onDown(id) {
    this.getData(id, ~~!id, 1, "flash");
  }

  /**
   * 上拉加载
   * **/
  onUp(id) {
    const s = this.getAllDataByTypeId(id).d.pageNum;
    this.getData(id, ~~!id, s + 1, "update");
  }

  /**
   * 跳转第3方播放平台
   * **/
  onGoPlay(id) {
    // 跳转前保存所有allData到sessionStorage
    sessionStorage.setItem("live-tabnow", JSON.stringify(this.state.tabNow));
    window.location.href = `${config.baseURL}/mall/live/show?liveId=${id}`;
  }

  render() {
    const tabs = this.makeTypesLv1(this.props.liveTypes);
    return (
      <div className={"live-main show"}>
        {this.props.liveTypes.length ? (
          <Tabs
            tabs={tabs}
            renderTabBar={props => <Tabs.DefaultTabBar {...props} page={5} />}
            page={this.state.tabNow}
            swipeable={false}
            onChange={(tab, index) => this.onTabChange(tab, index)}
            onTabClick={(tab, index) => {
              console.log("onTabClick", index, tab);
            }}
          >
            {tabs.map((item, index) => {
              return (
                <div key={index} className="live-tab-box">
                  {item.children && item.children.length ? (
                    <div
                      className="lv2box"
                      id={`lv2-${item.id}`}
                      onTouchStart={e => e.stopPropagation()}
                      onTouchMove={e => e.stopPropagation()}
                    >
                      <ul
                        className="swiper"
                        style={{ width: `${68 * item.children.length}px` }}
                      >
                        {item.children.map((v, i) => {
                          const dtemp =
                            this.getAllDataByTypeId(item.id).d || {};
                          return (
                            <li
                              key={i}
                              onClick={() => this.clickLv2(item.id, v.id)}
                              className={dtemp.childNow === v.id ? "check" : ""}
                            >
                              <img className="logo" src={v.image} />
                              <div className="name all_nowarp">{v.name}</div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                  <div
                    className={
                      item.children && item.children.length
                        ? "body-box shot"
                        : "body-box"
                    }
                  >
                    <Luo
                      id={`luo-${index}`}
                      className="touch-none backColor"
                      onPullDownRefresh={() => this.onDown(item.id)}
                      onPullUpLoadMore={() => this.onUp(item.id)}
                      iscrollOptions={{
                        disableMouse: true
                      }}
                    >
                      <ul className="live-box-ul">
                        {(() => {
                          const t = this.getAllDataByTypeId(item.id).d;
                          if (!t || !t.data.length) {
                            return (
                              <li key={0} className="data-nothing">
                                <img src={Img404} />
                                <div>亲，这里什么也没有哦~</div>
                              </li>
                            );
                          } else {
                            return t.data
                              .filter(v => {
                                return (
                                  !t.childNow || v.liveTypeSubId === t.childNow
                                );
                              })
                              .map((v, i) => {
                                const litInfo = this.getWordsByType(
                                  v.liveStatus
                                );
                                return (
                                  <li
                                    className="live-one-box"
                                    key={i}
                                    style={{
                                      backgroundImage: `url(${v.coverImage})`
                                    }}
                                    onClick={() => this.onGoPlay(v.liveId)}
                                  >
                                    <div className="time">{v.createTime}</div>
                                    <div className="zw" />
                                    <div className="title">{v.name}</div>
                                    <div className="info">
                                      <div
                                        className="s"
                                        style={{
                                          backgroundColor: litInfo.color
                                        }}
                                      >
                                        <div className="before" />
                                        <div>{litInfo.w1}</div>
                                      </div>
                                      <div className="p">
                                        <span>{v.watchTimes}</span>
                                        <span>{litInfo.w2}</span>
                                      </div>
                                    </div>
                                  </li>
                                );
                              });
                          }
                        })()}
                      </ul>
                    </Luo>
                  </div>
                </div>
              );
            })}
          </Tabs>
        ) : (
          <div key={0} className="data-nothing">
            <img src={Img404} />
            <div>亲，这里什么也没有哦~</div>
          </div>
        )}
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

LiveContainer.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any,
  userinfo: P.any,
  liveTypes: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    userinfo: state.app.userinfo,
    liveTypes: state.shop.liveTypes
  }),
  dispatch => ({
    actions: bindActionCreators({ getLiveTypes, getLiveList }, dispatch)
  })
)(LiveContainer);
