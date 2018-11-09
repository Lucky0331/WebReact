/* 我的e家 - 地图导航 */

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

import { Toast } from "antd-mobile";

// ==================
// 本页面所需action
// ==================

import { saveUserLngLat } from "../../../../a_action/app-action";

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDown: true,
      userXY: null, // 用户当前位置
      downXY: null // 终点位置
    };
    this.i = 0; // 所有的初始化工作是否已完成
    this.j = 0;
    this.map = null; // 地图实例
    this.geolocation = null; // 定位插件实例
    this.geocoder = null; // 地址转经纬度插件实例
    this.citySearch = null; // 城市查询插件
    this.MWalk = null; // 步行路线规划
    this.transfer = null; // 公交路线规划
    this.driving = null; // 驾车路线规划
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.i = 0; // 所有的初始化工作是否已完成
    this.map = null; // 地图实例
    this.geolocation = null; // 定位插件实例
    this.geocoder = null; // 地址转经纬度插件实例
    this.citySearch = null; // 城市查询插件
    this.MWalk = null; // 步行路线规划
    this.transfer = null; // 公交路线规划
    this.driving = null; // 驾车路线规划
    Toast.hide();
  }
  /** 第1阶段 地图初始化，各种插件 **/
  init() {
    Toast.loading("定位中...");
    this.map = new AMap.Map("container", {
      zoom: 14
    });
    // 加载定位插件
    this.map.plugin("AMap.Geolocation", () => {
      this.geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 10000, //超过10秒后停止定位，默认：无穷大
        maximumAge: 0, //定位结果缓存0毫秒，默认：0
        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, //显示定位按钮，默认：true
        buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });

      this.map.addControl(this.geolocation); // 左下角的定位按钮
      this.down();
    });

    // 加载城市查询插件
    this.map.plugin("AMap.CitySearch", () => {
      this.citySearch = new AMap.CitySearch();
      this.down();
    });

    // 加载地址转坐标插件 用于从详细地址找到经纬度
    AMap.service("AMap.Geocoder", () => {
      this.geocoder = new AMap.Geocoder();
      this.down();
    });
  }

  // 第1阶段初始化工作是否已完成
  down() {
    let now = this.i + 1;
    console.log("now等于几：", now);
    if (now >= 3) {
      this.step2();
      this.setState({
        isDown: true
      });
    } else {
      this.i = now;
    }
  }

  /** 第2阶段 开始接下来的工作 **/
  step2() {
    console.log("mapAddr:", this.props.mapAddr);
    if (!this.props.mapAddr) {
      return;
    }

    // 自动获取用户IP，返回当前城市
    this.citySearch.getLocalCity((status, result) => {
      if (status === "complete" && result.info === "OK") {
        if (result && result.city) {
          var cityinfo = result.city;

          // 初始化路线（步行）
          AMap.service("AMap.Walking", () => {
            //实例化Transfer
            this.MWalk = new AMap.Walking({
              map: this.map // 地图实例
            });
            this.down2();
          });

          // 初始化路线（驾车）
          AMap.service("AMap.Driving", () => {
            //实例化Transfer
            this.driving = new AMap.Driving({
              map: this.map // 地图实例
            });
            this.down2();
          });

          // 初始化路线规划插件（公交）
          AMap.service("AMap.Transfer", () => {
            //实例化Transfer
            this.transfer = new AMap.Transfer({
              city: cityinfo, // 起始城市
              cityd: this.props.mapAddr.city, // 终点城市
              map: this.map // 地图实例
            });
            this.down2();
          });
        }
      } else {
        Toast.info("定位城市失败", 1);
        return false;
      }
    });

    // 定位用户当前坐标
    if (this.props.userXY) {
      this.setState({
        userXY: [this.props.userXY[0], this.props.userXY[1]]
      });
      this.down2();
    } else {
      this.geolocation.getCurrentPosition((status, result) => {
        console.log("定位用户当前坐标：", status, result);
        if (status === "complete") {
          this.setState({
            userXY: [result.position.lng, result.position.lat]
          });
          this.props.actions.saveUserLngLat([
            result.position.lng,
            result.position.lat
          ]);
          this.down2();
        } else {
          Toast.info("定位失败");
        }
      });
    }

    const addr = this.props.mapAddr;
    // 查询终点经纬度
    console.log(
      "查询地址：",
      `${addr.province}${addr.city}${addr.region}${addr.address}`
    );
    this.geocoder.getLocation(
      `${addr.province}${addr.city}${addr.region}${addr.address}`,
      (status, result) => {
        console.log("返回了什么查询地址：", status, result);
        if (
          status === "complete" &&
          result.info === "OK" &&
          result.geocodes.length
        ) {
          //TODO:获得了有效经纬度，可以做一些展示工作
          //比如在获得的经纬度上打上一个Marker
          const XYInfo = result.geocodes[0].location;
          this.setState({
            downXY: [XYInfo.lng, XYInfo.lat]
          });
          this.down2();
        } else {
          //获取经纬度失败
          Toast.info("找不到该服务站", 1);
        }
      }
    );
  }

  down2() {
    let j = this.j + 1;
    if (j >= 4) {
      console.log("第2阶段初始化完毕");
      setTimeout(() => this.step3());
    } else {
      this.j++;
    }
  }

  /** 第3步，开始画路线 **/
  step3() {
    Toast.hide();
    this.transfer.search(
      this.state.userXY,
      this.state.downXY,
      (status, result) => {
        //TODO 解析返回结果，自己生成操作界面和地图展示界面
      }
    );
  }

  render() {
    return <div id="container" className="flex-auto page-box map-page" />;
  }
}

// ==================
// PropTypes
// ==================

HomePageContainer.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any,
  mapAddr: P.any,
  userXY: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    mapAddr: state.shop.mapAddr,
    userXY: state.app.userXY
  }),
  dispatch => ({
    actions: bindActionCreators({ saveUserLngLat }, dispatch)
  })
)(HomePageContainer);
