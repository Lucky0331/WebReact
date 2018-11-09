/* 健康管理 - 查看体检服务中心 - 用于我在翼猫，查看所有体验店（包括未上线的）*/

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
import { Picker, List, Toast, Icon, Carousel } from "antd-mobile";
import ImgAddr from "../../../../assets/dizhi@3x.png";
import ImgPhone from "../../../../assets/dianhua@3x.png";
import Img404 from "../../../../assets/not-found.png";
import ImgDaoHang from "../../../../assets/daohang_blue@3x.png";
import Img1 from "./assets/infos1@3x.png";
import Img2 from "./assets/infos2@3x.png";
import Img3 from "./assets/infos3@3x.png";
import Img4 from "./assets/infos4@3x.png";
import ImgStar1 from "../../../../assets/home/star_1@3x.png";
import ImgStar0 from "../../../../assets/home/star_0@3x.png";
import $ from "jquery";
// ==================
// 本页面所需action
// ==================
import {
  mallStationListAll,
  saveServiceInfo,
  saveMapAddr,
  stationNearBy,
  mallApList,
} from "../../../../a_action/shop-action";
import { getAreaList, saveUserLngLat } from "../../../../a_action/app-action";
import { inputStation,getGoodServiceStations } from "../../../../a_action/new-action";
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
      pageNum: 1,
      pageSize: 10,
      fail: false,
      search: undefined, // 搜索条件
      formProvide: '', // 是否提供hra
      refreshing: false, // 加载更多搜索中
      userLng: null, // 用户坐标X
      userLat: null, // 用户坐标Y
      resType: 1, // 0查询的是最近的，1普通的查询
      downNow: false, // 当前查询是否已全部加载完毕
      
      barPics: [], // 头部轮播图
      imgHeight: "178px"
    };
    this.map = null; // 地图实例
    this.geolocation = null; // 定位插件实例
    this.loading = false; // 是否在搜索中
  }
  
  componentDidMount() {
    this.getPics();
    document.title = "线下门店";
    this.mapInit(); // 开始初始化地图
    if (!this.props.areaData.length) {
      this.getArea();
    } else {
      this.makeAreaData(this.props.areaData);
    }
    $(window).on("scroll",() => this.scrollEvent());
  }
  
  componentWillUnmount() {
    $(window).off("scroll");
    this.map = null;
    this.geolocation = null;
    Toast.hide();
  }
  
  UNSAFE_componentWillReceiveProps(nextP) {
    if (nextP.areaData !== this.props.areaData) {
      this.makeAreaData(nextP.areaData);
    }
  }
  
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
  
  // 获取头部轮播图
  getPics() {
    this.props.actions.mallApList({typeCode: "ticket"}).then(res => {
      if (res.status === 200) {
        this.setState({
          barPics: res.data
        });
      }
    });
  }
  
  /** 第1阶段 地图初始化，各种插件 **/
  mapInit() {
    if (this.props.userXY) {
      // 已经定位过就不用重新定位了
      this.getData2(this.props.userXY[0],this.props.userXY[1]);
      return;
    }
    Toast.loading("定位中...",0);
    setTimeout(()=>{
      this.map = new AMap.Map("container",{});
      // 加载定位插件
      this.map.plugin("AMap.Geolocation",() => {
        this.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: false, //显示定位按钮，默认：true
          showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: false //定位成功后用圆圈表示定位精度范围，默认：true
        });
        // 开始定位
        this.geolocation.getCurrentPosition((status,result) => {
          if (status === "complete") {
            this.props.actions.saveUserLngLat([
              result.position.lng,
              result.position.lat
            ]);
            this.getData2(result.position.lng,result.position.lat);
          } else {
            Toast.info("定位失败",1);
            this.getDataRecommend(1,this.state.pageSize,this.state.search,this.state.formProvide,"flash"); // 定位失败就执行普通的查询好了
            this.setState({
              fail: true
            });
          }
        });
      });
    },200)
  }
  
  //搜索的时候  需要拿到所有的区域
  getData(pageNum,pageSize,search,formProvide,flash = "flash") {
    const me = this;
    console.log(search,formProvide,11111)
    const params = {
      pageNum,
      pageSize,
      province: search && search[0],
      city: search && search[1],
      region: search && search[2],
      hraIsOnline: formProvide && formProvide[0],
    };
    console.log("开始发请求：",params.city);
    console.log("到底有没有提供啊：",params.hraIsOnline);
    Toast.loading("搜索中...",0);
    this.loading = true;
    this.props.actions
        .mallStationListAll(tools.clearNull(params))
        .then(res => {
          if (res.status === 200) {
            me.setState({
              data:
                  flash === "flash"
                      ? res.data.result || []
                      : [...this.state.data,...(res.data.result || [])],
              pageNum,
              pageSize,
              resType: 1
            });
            if (
                flash === "update" &&
                (!res.data.result || !res.data.result.length)
            ) {
              // 没有更多数据
              this.setState({
                downNow: true
              });
            }
            Toast.hide();
          } else {
            Toast.info("查询失败，请重试",1);
          }
        })
        .catch(() => {
          Toast.info("查询失败，请重试",1);
        })
        .finally(() => {
          this.loading = false;
        });
  }
  
  //定位失败  查询推荐的服务站
  getDataRecommend(pageNum,pageSize,search,formProvide,flash = "flash") {
    const me = this;
    const params = {
      pageNum,
      pageSize,
      province: search && search[0],
      city: search && search[1],
      region: search && search[2],
      hraIsOnline: formProvide && formProvide[0],
    };
    console.log("开始发请求：",params.city);
    Toast.loading("搜索中...",0);
    this.loading = true;
    this.props.actions
        .getGoodServiceStations(tools.clearNull(params))
        .then(res => {
          if (res.status === 200) {
            me.setState({
              data:
                  flash === "flash"
                      ? res.data.result || []
                      : [...this.state.data,...(res.data.result || [])],
              pageNum,
              pageSize,
              resType: 0
            });
            if (
                flash === "update" &&
                (!res.data.result || !res.data.result.length)
            ) {
              // 没有更多数据
              this.setState({
                downNow: true
              });
            }
            Toast.hide();
          } else {
            Toast.info("查询失败，请重试",1);
          }
        })
        .catch(() => {
          Toast.info("查询失败，请重试",1);
        })
        .finally(() => {
          this.loading = false;
        });
  }
  
  getData2(lng,lat) {
    const me = this;
    const params = {
      lng,
      lat
    };
    Toast.loading("搜索中...",0);
    this.loading = true;
    this.props.actions
        .stationNearBy(tools.clearNull(params))
        .then(res => {
          if (res.status === 200) {
            res.data.sort((a,b) => a.distance - b.distance);
            me.setState({
              data: res.data,
              resType: 0
            });
            this.setState({
              downNow: true
            });
            Toast.hide();
          } else {
            Toast.info("查询失败，请重试",1);
          }
        })
        .catch(() => {
          Toast.info("查询失败，请重试",1);
        })
        .finally(() => {
          this.loading = false;
        });
  }
  
  // 获取所有省市区
  getArea() {
    this.props.actions.getAreaList();
  }
  
  // 滚动到底部，需要加载更多
  onScrollDown() {
  }
  
  // 下拉刷新
  onDown() {
    if (this.state.resType) {
      // 非0执行普通搜索
      this.getData(1,this.state.pageSize,this.state.search,this.state.formProvide,"flash");
    } else {
      // 0执行最近搜索
      // this.getData2(this.props.userXY[0], this.props.userXY[1]);
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
          this.state.formProvide,
          "update"
      );
    } else {
      // 0执行最近搜索
      // this.getData2(this.props.userXY[0], this.props.userXY[1]);
    }
  }
  
  // 通过区域原始数据组装Picker所需数据
  makeAreaData(d) {
    const data = d.map((item,index) => {
      return {
        label: item.areaName,
        value: item.areaName,
        parentId: item.parentId,
        id: item.id,
        level: item.level
      };
    });
    // 每一个市下面加一个“全部”
    const temp = data.filter((item,index) => item.level === 1);
    console.log("TEMP:",temp);
    temp.forEach((item,index) => {
      data.unshift({
        label: "全部",
        value: "",
        parentId: item.id,
        id: null,
        level: item.level + 1
      });
    });
    const areaData = this.recursionAreaData(null,data);
    this.setState({
      sourceData: areaData || []
    });
  }
  
  // 工具 - 递归生成区域层级数据
  recursionAreaData(one,data) {
    let kids;
    if (!one) {
      // 第1次递归
      kids = data.filter(item => item.level === 0);
    } else {
      kids = data.filter(item => item.parentId === one.id);
    }
    kids.forEach(item => (item.children = this.recursionAreaData(item,data)));
    return kids;
  }
  
  // 城市选择
  onCityChose(data) {
    console.log("Area:",data);
    this.setState({
      search: data,
      downNow: false
    });
    $('.page-expr-shop .am-list .am-list-body .am-list-item .am-list-extra').eq(0).css('color','#6e7bc7')
    console.log(this.state.formProvide,data,2)
    this.getData(1,this.state.pageSize,data,this.state.formProvide,"flash");
  }
  
  //是否提供hra
  onProvideChose(v) {
    this.setState({
      formProvide: v,
      downNow: false,
    });
    $('.page-expr-shop .am-list .am-list-body .am-list-item .am-list-extra').eq(1).css('color','#6e7bc7')
    this.getData(1,this.state.pageSize,this.state.search,v,"flash");
    console.log('v是什么',v)
  }
  
  // 根据满意度算星星
  howManyStars(n) {
    const num = Number(n) || 0;
    const m = [];
    for (let i = 0; i < 5; i++) {
      if (i <= (num / 100) * 5) {
        m.push(<img key={i} src={ImgStar1}/>);
      } else {
        m.push(<img key={i} src={ImgStar0}/>);
      }
    }
    return m;
  }
  
  // 去导航，把所有信息都TMD的传过去
  onGoMap(item) {
    this.props.actions.saveMapAddr(item);
    setTimeout(() => this.props.history.push("/downline/map"));
  }
  
  // 前往详情页
  onGoDetail(data) {
    //this.props.actions.inputStation(data);
    this.props.history.push(`/shop/exprdetail/${data.id}`);
  }
  
  render() {
    console.log('轮播图++',this.state.barPics)
    const d = this.state.data || {};
    return (
        <div className="page-expr-shop">
          <div id="container" className="hideMap"/>
          {/* 顶部轮播 */}
          {this.state.barPics.length ? (
              <Carousel
                  className="my-carousel"
                  autoplay={true}
                  infinite={true}
                  swipeSpeed={35}
              >
                {this.state.barPics.map((item,index) => (
                    <a
                        key={index}
                        href={item.url}
                        style={{
                          display: "inline-block",
                          width: "100%",
                          height: this.state.imgHeight
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                      <img
                          src={item.adImg}
                          style={{width: "100%",verticalAlign: "top"}}
                          onLoad={() => {
                            // fire window resize event to change height
                            window.dispatchEvent(new Event("resize"));
                            this.setState({imgHeight: "auto"});
                          }}
                      />
                    </a>
                ))}
              </Carousel>
          ) : (
              <div style={{height: this.state.imgHeight}}/>
          )}
          <ul className="infos">
            <li>
              <img src={Img1}/>
              <span>服务工程责任制，一对一定制终身服务</span>
            </li>
            <li>
              <img src={Img2}/>
              <span>近3000家体验服务中心精准覆盖至各省、市及区县</span>
            </li>
            <li>
              <img src={Img3}/>
              <span>全方位立体式服务网络，24h*7d的无死角服务</span>
            </li>
            <li>
              <img src={Img4}/>
              <span>斥资百万投建健康风险评估设备</span>
            </li>
          </ul>
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
                    <Icon type="search" style={{color: "#888888",marginLeft: '-0.2rem'}} size={"sm"}/>
                  }
                  style={{width: '3.44rem',marginRight: '10px'}}
              >&#12288;</Item>
            </Picker>
            <Picker
                extra={"HRA健康评估服务"}
                value={this.state.formProvide}
                data={[{value: "",label: "不限"},{value: 1,label: "提供HRA健康服务"},{value: 2,label: "不提供HRA健康服务"}]}
                onOk={v => this.onProvideChose(v)}
                cols={1}
            >
              <Item
                  thumb={
                    <Icon type="search" style={{color: "#888888",marginLeft: '-0.2rem'}} size={"sm"}/>
                  }
                  style={{width: '3.44rem'}}
              >&#12288;</Item>
            </Picker>
          </List>
          {!this.state.fail == true ?
              <div className="fujin">
                <span>附近的门店</span>
              </div>
              : <div className="fujin">
                <span>推荐的门店</span>
              </div>
          }
          <div>
            <ul>
              {this.state.data.length ? (
                  this.state.data.map((item,index) => {
                    const station = item;
                    return (
                        <li key={index}>
                          <div className="card-box page-flex-row">
                            <div className={!item.coverImage ? "pageImg moren" : "pageImg"}>
                              <img src={item.coverImage}/>
                            </div>
                            <div className="l flex-auto">
                              <div
                                  className="title"
                                  onClick={() => this.onGoDetail(station)}
                              >
                                {station.name}
                              </div>
                              {station.distance ? (
                                  <div className="lang">{`${station.distance.toFixed(
                                      2
                                  )}km`}</div>
                              ) : null}
                              <div
                                  className="info page-flex-row flex-ai-center"
                                  onClick={() => this.onGoDetail(station)}
                              >
                                <span>{station.address}</span>
                              </div>
                              <div className="star-row">
                                <div>{this.howManyStars(station.satisfaction)}</div>
                                <div className="word">
                                  满意度：
                                  {station.satisfaction ? `${station.satisfaction}%` : "0.00%"}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="info page-flex-row flex-ai-center" style={{
                            backgroundColor: '#fff',
                            marginBottom: '13px',
                            paddingBottom: '8px',
                            paddingLeft: '57%',
                            paddingTop: '8px'
                          }}>
                            <div className="store">
                              <a href={`tel:${station.phone || ""}`} style={{color: '#353535'}}>联系门店</a>
                            </div>
                            <div className="addr" onClick={() => this.onGoMap(station)}>
                              <div>导航</div>
                            </div>
                          </div>
                        </li>
                    );
                  })
              ) : (
                  <li key={0} className="data-nothing">
                    <img src={Img404}/>
                    <div>亲，这里什么也没有哦~</div>
                  </li>
              )}
            </ul>
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
        mallStationListAll,
        saveServiceInfo,
        getAreaList,
        saveMapAddr,
        stationNearBy,
        saveUserLngLat,
        inputStation,
        mallApList,
        getGoodServiceStations
      },
      dispatch
    )
  })
)(HomePageContainer);
