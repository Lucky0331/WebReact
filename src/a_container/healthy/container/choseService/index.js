/* 健康管理 - 选择体检服务中心（只显示已上线的） */

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
import _ from "lodash";
// ==================
// 所需的所有组件
// ==================
import { List, Toast, Icon, Picker } from "antd-mobile";
import Luo from "iscroll-luo";
import ImgAddr from "../../../../assets/dizhi@3x.png";
import ImgPhone from "../../../../assets/dianhua@3x.png";
import Img404 from "../../../../assets/not-found.png";
import ImgDaoHang from "../../../../assets/daohang_blue@3x.png";
import ImgR from "../../../../assets/to-r@3x.png";
import ImgL from "../../../../assets/to-l@3x.png";
import ImgRight from "../../../../assets/xiangyou@3x.png";
// ==================
// 本页面所需action
// ==================

import {
  mallStationList,
  saveServiceInfo,
  saveMapAddr,
  stationNearBy
} from "../../../../a_action/shop-action";
import { getAreaList, saveUserLngLat } from "../../../../a_action/app-action";

// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 所有数据
      sourceData: [], // 所有省市数据（层级）
      loading: false, // 搜索中
      pageNum: 1,
      pageSize: 10,
      search: undefined,
      refreshing: false, // 加载更多搜索中
      userLng: null, // 用户坐标X
      userLat: null, // 用户坐标Y
      resType: 1, // 0查询的是最近的，1普通的查询
      fail:false,
    };
    this.map = null; // 地图实例
    this.geolocation = null; // 定位插件实例
  }

  componentDidMount() {
    document.title = "选择服务站";
    this.mapInit(); // 开始初始化地图
    if (!this.props.areaData.length) {
      this.getArea();
    } else {
      this.makeAreaData(this.props.areaData);
    }
  }

  componentWillUnmount() {
    this.map = null;
    this.geolocation = null;
    Toast.hide();
  }

  UNSAFE_componentWillReceiveProps(nextP) {
    if (nextP.areaData !== this.props.areaData) {
      this.makeAreaData(nextP.areaData);
    }
  }

  mapInit() {
    if (this.props.userXY) {
      // 已经定位过就不用重新定位了
      this.getData(
        1,
        10,
        undefined,
        this.props.userXY[0],
        this.props.userXY[1],
        "flash"
      );
      return;
    }
    Toast.loading("定位中...", 0);
    this.map = new AMap.Map("container", {});
    // 加载定位插件
    this.map.plugin("AMap.Geolocation", () => {
      this.geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: false, //显示定位按钮，默认：true
        showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: false //定位成功后用圆圈表示定位精度范围，默认：true
      });
      // 开始定位
      this.geolocation.getCurrentPosition((status, result) => {
        console.log("定位用户当前坐标：", status, result);
        if (status === "complete") {
          this.props.actions.saveUserLngLat([
            result.position.lng,
            result.position.lat
          ]);
          this.getData(
            1,
            this.state.pageSize,
            this.state.search,
            result.position.lng,
            result.position.lat,
            "flash"
          );
        } else {
          Toast.info("定位失败", 1);
          this.getData(
            1,
            this.state.pageSize,
            this.state.search,
            null,
            null,
            "flash"
          );
          this.setState({
            fail:true
          })
          // 定位失败就执行普通的查询好了
        }
      });
    });
  }

  getData(pageNum, pageSize, search, lng = null, lat = null, flash = "flash") {
    const me = this;
    const params = {
      pageNum,
      pageSize,
      province: search && search[0],
      city: search && search[1],
      region: search && search[2],
      lng,
      lat
    };
    Toast.loading("搜索中...", 0);
    this.props.actions
      .mallStationList(tools.clearNull(params))
      .then(res => {
        if (res.status === 200) {
          const d = Array.isArray(res.data) ? res.data : res.data.result;
          me.setState({
            data:
              flash === "flash" ? d || [] : [...this.state.data, ...(d || [])],
            pageNum,
            pageSize,
            search,
            resType: search && search[0] ? 1 : 0 // 选了省市区就不显示最近的
          });
          Toast.hide();
        } else {
          let s = false; // f没变，t变了
          const old = this.state.search || [];
          const now = search || [];
          if (old[0] === now[0] && old[1] === now[1] && old[2] === now[2]) {
            s = false;
          } else {
            s = true;
          }
          me.setState({
            data: s ? [] : this.state.data,
            search,
            resType: search && search[0] ? 1 : 0 // 选了省市区就不显示最近的
          });
          Toast.info(res.message, 1);
        }
      })
      .catch(() => {
        Toast.info("查询失败，请重试", 1);
      });
  }

  // 获取所有省市区
  getArea() {
    this.props.actions.getAreaList();
  }

  // 开始搜索
  onSearch(e) {
    this.getData(
      1,
      this.state.pageSize,
      e,
      this.props.userXY && this.props.userXY[0],
      this.props.userXY && this.props.userXY[1],
      "flash"
    );
  }

  // 下拉刷新
  // onDown() {
  //   if (this.state.resType) {
  //     // 非0执行普通搜索
  //     this.getData(
  //       1,
  //       this.state.pageSize,
  //       this.state.search,
  //       this.props.userXY && this.props.userXY[0],
  //       this.props.userXY && this.props.userXY[1],
  //       "flash"
  //     );
  //   } else {
  //     // 0执行最近搜索
  //     // this.getData2(this.props.userXY[0], this.props.userXY[1]);
  //   }
  // }
  // 上拉加载
  // onUp() {
  //   if (this.state.resType) {
  //     // 非0执行普通搜索
  //     this.getData(
  //         this.state.pageNum + 1,
  //         this.state.pageSize,
  //         this.state.search,
  //         this.props.userXY && this.props.userXY[0],
  //         this.props.userXY && this.props.userXY[1],
  //         "update"
  //     );
  //   } else {
  //     // 0执行最近搜索
  //     // this.getData2(this.props.userXY[0], this.props.userXY[1]);
  //   }
  // }

  // 通过区域原始数据组装Picker所需数据
  makeAreaData(d) {
    const data = d.map((item, index) => {
      return {
        label: item.areaName,
        value: item.areaName,
        parentId: item.parentId,
        id: item.id,
        level: item.level
      };
    });
    // 每一个市下面加一个“全部”
    const temp = data.filter((item, index) => item.level === 1);
    temp.forEach((item, index) => {
      data.unshift({
        label: "全部",
        value: "",
        parentId: item.id,
        id: null,
        level: item.level + 1
      });
    });
    const areaData = this.recursionAreaData(null, data);

    this.setState({
      sourceData: areaData
    });
  }
  // 工具 - 递归生成区域层级数据
  recursionAreaData(one, data) {
    let kids;
    if (!one) {
      // 第1次递归
      kids = data.filter(item => item.level === 0);
    } else {
      kids = data.filter(item => item.parentId === one.id);
    }
    kids.forEach(item => (item.children = this.recursionAreaData(item, data)));
    return kids;
  }

  // 城市选择
  onCityChose(data) {
    console.log("Area:", data);
    this.getData(
      1,
      this.state.pageSize,
      data,
      this.props.userXY && this.props.userXY[0],
      this.props.userXY && this.props.userXY[1],
      "flash"
    );
  }

  // 选择
  onChose(item) {
    console.log("选择了：", item);
    this.props.actions.saveServiceInfo(item);
    setTimeout(() => this.props.history.go(-1));
  }

  // 去导航，把所有信息都TMD的传过去
  onGoMap(e, item) {
    e.stopPropagation();
    this.props.actions.saveMapAddr(item);
    setTimeout(() => this.props.history.push("/downline/map"));
  }

  render() {
    console.log("当前数据：", this.state.sourceData);
    return (
      <div className="page-chose-service">
        <List>
          <Picker
            data={this.state.sourceData}
            extra={"区域搜索"}
            value={this.state.search}
            format={v => v.join(">")}
            cols={3}
            onOk={v => this.onCityChose(v)}
          >
            <Item
              thumb={
                <Icon type="search" style={{ color: "#888888" }} size={"sm"} />
              }
            >
              &#12288;
            </Item>
          </Picker>
        </List>
        {/*{this.state.resType ? null : (*/}
          {/*<div className="fujin">*/}
            {/*<img src={ImgR} />*/}
            {/*<span>附近的体验店</span>*/}
            {/*<img src={ImgL} />*/}
          {/*</div>*/}
        {/*)}*/}
        {!this.state.fail == true ?
            <div className="fujin">
              <img src={ImgR} />
              <span>附近的体验店</span>
              <img src={ImgL} />
            </div>
            : <div className="fujin">
              <img src={ImgR} />
              <span>推荐的体验店</span>
              <img src={ImgL} />
            </div>
        }
        <div className={this.state.resType ? "iscroll-box" : "iscroll-box min"}>
          <Luo
            id="luo2"
            className="touch-none"
            // onPullDownRefresh={() => this.onDown()}
            // onPullUpLoadMore={() => this.onUp()}
            iscrollOptions={{
              disableMouse: true
            }}
          >
            <ul>
              {this.state.data.length ? (
                this.state.data.map((item, index) => {
                  const station = _.cloneDeep(item);
                  /**
                   * 知道为什么要这么干吗，
                   * 因为这里有两个接口字段完全不一样
                   * 现在已经好了一些了，之前连数据结构也不一样
                   * **/
                  if (!station.name) {
                    station.name = station.stationName;
                  }
                  if (!station.address) {
                    station.address = station.stationAddress;
                  }
                  if (!station.phone) {
                    station.phone = station.stationTel;
                  }
                  return (
                    <li key={index} className="card-box">
                      <div
                        className={"title"}
                        onClick={() =>
                          this.props.history.push(
                            `/shop/exprdetail/${station.id}`
                          )
                        }
                      >
                        <div>{station.name}</div>
                        <img src={ImgRight} />
                      </div>
                      <div
                        className="infos"
                        onClick={() => this.onChose(station)}
                      >
                        <div className="l flex-auto"
                           // onClick={() =>
                           //   this.props.history.push(
                           //     `/shop/exprdetail/${station.id}`
                           //   )
                           // }
                        >
                          <div className="info page-flex-row flex-ai-center">
                            <img src={ImgAddr} />
                            <span>{station.address}</span>
                          </div>
                          <div className="info page-flex-row flex-ai-center">
                            <img src={ImgPhone} />
                            <span>
                              <a
                                onClick={e => e.stopPropagation()}
                                href={`tel:${station.phone || ""}`}
                              >
                                联系门店
                              </a>
                            </span>
                          </div>
                        </div>
                        <div
                          className="r flex-none"
                          onClick={e => this.onGoMap(e, station)}
                        >
                          {this.props.userXY && station.lng && station.lat ? (
                            <div className="lang">{`${tools
                              .getFlatternDistance(
                                this.props.userXY[0],
                                this.props.userXY[1],
                                station.lng,
                                station.lat
                              )
                              .toFixed(2)}km`}</div>
                          ) : null}
                          <div className="addr">
                            <img src={ImgDaoHang} />
                            <div>导航</div>
                          </div>
                        </div>
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
  areaData: P.any,
  userXY: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    areaData: state.app.areaData,
    userXY: state.app.userXY
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        mallStationList,
        saveServiceInfo,
        getAreaList,
        saveMapAddr,
        stationNearBy,
        saveUserLngLat
      },
      dispatch
    )
  })
)(HomePageContainer);
