/* 健康管理 - 查看体检服务中心 - 用于商品详情页查看适用的体验店（已上线的） */

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
import { Picker, List, Toast, Icon } from "antd-mobile";
import Luo from "iscroll-luo";
import ImgRen from "../../../../assets/ren@3x.png";
import ImgAddr from "../../../../assets/dizhi@3x.png";
import ImgPhone from "../../../../assets/dianhua@3x.png";
import Img404 from "../../../../assets/not-found.png";
import ImgDaoHang from "../../../../assets/daohang_blue@3x.png";
import ImgR from "../../../../assets/to-r@3x.png";
import ImgL from "../../../../assets/to-l@3x.png";
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
      resType: 1 // 0查询的是最近的，1普通的查询
    };
    this.map = null; // 地图实例
    this.geolocation = null; // 定位插件实例
  }

  componentDidMount() {
    document.title = "体验服务中心";
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

  /** 第1阶段 地图初始化，各种插件 **/
  mapInit() {
    if (this.props.userXY) {
      // 已经定位过就不用重新定位了
      this.getData2(this.props.userXY[0], this.props.userXY[1]);
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
          this.getData2(result.position.lng, result.position.lat);
        } else {
          Toast.info("定位失败", 1);
          this.getData(1, this.state.pageSize, this.state.search, "flash"); // 定位失败就执行普通的查询好了
        }
      });
    });
  }

  getData(pageNum, pageSize, search, flash = "flash") {
    const me = this;
    const params = {
      pageNum,
      pageSize,
      province: search && search[0],
      city: search && search[1],
      region: search && search[2]
    };
    Toast.loading("搜索中...", 0);
    this.props.actions
      .mallStationList(tools.clearNull(params))
      .then(res => {
        console.log("得到了什么：", res);
        if (res.status === 200) {
          me.setState({
            data:
              flash === "flash"
                ? res.data.result || []
                : [...this.state.data, ...(res.data.result || [])],
            pageNum,
            pageSize,
            search,
            resType: 1
          });
          Toast.hide();
        } else {
          Toast.info("查询失败，请重试", 1);
        }
      })
      .catch(() => {
        Toast.info("查询失败，请重试", 1);
      });
  }

  getData2(lng, lat) {
    const me = this;
    const params = {
      lng,
      lat
    };
    Toast.loading("搜索中...", 0);
    this.props.actions
      .stationNearBy(tools.clearNull(params))
      .then(res => {
        if (res.status === 200) {
          res.data.sort((a, b) => a.distance - b.distance);
          me.setState({
            data: res.data,
            resType: 0
          });
          Toast.hide();
        } else {
          Toast.info("查询失败，请重试", 1);
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
    this.getData(1, this.state.pageSize, e, "flash");
  }

  // 下拉刷新
  onDown() {
    if (this.state.resType) {
      // 非0执行普通搜索
      this.getData(1, this.state.pageSize, this.state.search, "flash");
    } else {
      // 0执行最近搜索
      this.getData2(this.props.userXY[0], this.props.userXY[1]);
    }
  }
  // 上拉加载
  onUp() {
    if (this.state.resType) {
      // 非0执行普通搜索
      this.getData(
        this.state.pageNum + 1,
        this.state.pageSize,
        this.state.search,
        "update"
      );
    } else {
      // 0执行最近搜索
      this.getData2(this.props.userXY[0], this.props.userXY[1]);
    }
  }

  // 去导航，把所有信息都TMD的传过去
  onGoMap(item) {
    this.props.actions.saveMapAddr(item);
    setTimeout(() => this.props.history.push("/downline/map"));
  }

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
    console.log("变成什么了", areaData);
    this.setState({
      sourceData: areaData || []
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
    this.getData(1, this.state.pageSize, data, "flash");
  }

  render() {
    console.log("此时sourceData:", this.state.sourceData);
    return (
      <div className="page-expr-shop">
        <List  >
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
              style={{width:'7rem'}}
            >
              &#12288;
            </Item>
          </Picker>
        </List>
        {this.state.resType ? null : (
          <div className="fujin">
            <img src={ImgR} />
            <span>附近的体验店</span>
            <img src={ImgL} />
          </div>
        )}
        <div className={this.state.resType ? "iscroll-box" : "iscroll-box min"}>
          <Luo
            id="luo2"
            className="touch-none"
            onPullDownRefresh={() => this.onDown()}
            onPullUpLoadMore={() => this.onUp()}
          >
            <ul>
              {this.state.data.length ? (
                this.state.data.map((item, index) => {
                  const station = this.state.resType
                    ? item.station || {}
                    : item;
                  return (
                    <li key={index} className="card-box page-flex-row">
                      <div className="l flex-auto">
                        <div className="title">{station.name}</div>
                        {/*<div className="info page-flex-row flex-ai-center"><img src={ImgRen} /><span>{station.person}</span></div>*/}
                        <div className="info page-flex-row flex-ai-center">
                          <img src={ImgPhone} />
                          <span>
                            <a href={`tel:${station.phone || ""}`}>
                              {tools.addMosaic(station.phone)}
                            </a>
                          </span>
                        </div>
                        <div className="info page-flex-row flex-ai-center">
                          <img src={ImgAddr} />
                          <span>{station.address}</span>
                        </div>
                      </div>
                      <div
                        className="r flex-none"
                        onClick={() => this.onGoMap(station)}
                      >
                        {station.distance ? (
                          <div className="lang">{`${station.distance.toFixed(
                            2
                          )}km`}</div>
                        ) : null}
                        <div className="addr">
                          <img src={ImgDaoHang} />
                          <div>导航</div>
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
