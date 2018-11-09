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
import { List, Toast, Carousel } from "antd-mobile";
import ImgStar1 from "../../../../assets/home/star_1@3x.png";
import ImgStar0 from "../../../../assets/home/star_0@3x.png";
import ImgAddr from "../../../../assets/dizhi@3x.png";
import IconHeart from "./assets/icon_heart@3x.png";
import IconServer from "./assets/icon_server@3x.png";
import IconHealthy from "./assets/icon_healthy@3x.png";
import ImgTest from "../../../../assets/test/new.png";
import IconPhone from "./assets/icon-phone@3x.png";
import IconRoad from "../../../../assets/daohang@3x.png";
import IconBack from "./assets/icon-background.jpg";
// ==================
// 本页面所需action
// ==================

import {
  saveMapAddr,
  getStationDelForId
} from "../../../../a_action/shop-action";
// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}, // 数据
      sourceData: [], // 所有省市数据（层级）
      pageNum: 1,
      pageSize: 10,
      search: undefined, // 搜索条件
      refreshing: false, // 加载更多搜索中
      userLng: null, // 用户坐标X
      userLat: null, // 用户坐标Y
      resType: 1, // 0查询的是最近的，1普通的查询
      showImgModal: false,
      showImgSrc: null
    };
    this.map = null; // 地图实例
    this.geolocation = null; // 定位插件实例
    this.loading = false; // 是否在搜索中
  }

  componentDidMount() {
    document.title = "体验服务中心详情";
    this.getData();
  }

  componentWillUnmount() {
    Toast.hide();
  }

  UNSAFE_componentWillReceiveProps(nextP) {}

  getData() {
    const id = this.props.location.pathname.split("/").slice(-1);
    this.props.actions.getStationDelForId({ id: Number(id) }).then(res => {
      if (res.status === 200) {
        this.setState({
          data: res.data
        });
      } else {
        Toast.info(res.message, 1);
      }
    });
  }

  // 去导航，把所有信息都TMD的传过去
  onGoMap(item) {
    this.props.actions.saveMapAddr(item);
    setTimeout(() => this.props.history.push("/downline/map"));
  }

  onImgBig(e) {
    console.log({ t: e.target.classList[0] });
    this.setState({
      showImgSrc: e.target.src,
      showImgModal: true
    });
  }

  // 根据满意度算星星
  howManyStars(n) {
    const num = Number(n) || 0;
    const m = [];
    for (let i = 0; i < 5; i++) {
      if (i <= (num / 100) * 5) {
        m.push(<img key={i} src={ImgStar1} />);
      } else {
        m.push(<img key={i} src={ImgStar0} />);
      }
    }
    return m;
  }

  render() {
    const d = this.state.data || {};
    return (
      <div className="page-expr-detail">
        <div className="box1">
          {d.imgs ? (
            <Carousel
              className="my-carousel"
              autoplay={true}
              infinite={true}
              swipeSpeed={35}
            >
              {d.imgs.split(",").map((item, index) => (
                <a
                  key={index}
                  style={{
                    display: "inline-block",
                    width: "100%",
                    height: this.state.imgHeight
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={item}
                    style={{ width: "100%", verticalAlign: "top" }}
                    onLoad={() => {
                      window.dispatchEvent(new Event("resize"));
                      this.setState({ imgHeight: "auto" });
                    }}
                  />
                </a>
              ))}
            </Carousel>
          ) : <div><img className="pageImg" src={IconBack}/></div>}
          <div className="info-box">
            <div className="t">{d.name}</div>
            <div className="star-row">
              <div>{this.howManyStars(d.satisfaction)}</div>
              <div className="word">
                满意度：
                {d.satisfaction ? `${d.satisfaction}%` : "0.00%"}
              </div>
            </div>
            <div className="addr-info">
              <img src={ImgAddr} />
              <span>{d.address}</span>
            </div>
          </div>
          {d.storeArea ? (
            <div className="info-box">
              <div className="t">关于门店</div>
              <div className="about-row">
                <div>
                  <span>成立时间：</span>
                  <span>
                    {d.establishedTime && d.establishedTime.split(" ")[0]}
                  </span>
                </div>
                <div>
                  <span>门店规模：</span>
                  <span>
                    {d.storeArea || 0}m<sup>2</sup>
                  </span>
                </div>
                <div>
                  <span>员工数量：</span>
                  <span>{d.employeeNum || 0}人</span>
                </div>
                <div>
                  <span>营业时间：</span>
                  <span>
                    {d.businessHoursStart} - {d.businessHoursEnd}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
          {d.stationColumnList
            ? d.stationColumnList.map((item, index) => {
                return (
                  <div key={index} className="info-box no-padding">
                    <div className={"t"}>{item.title}</div>
                    <div className={"i"}>{item.textContent}</div>
                    <div className={"pic"}>
                      {item.imgs
                        ? item.imgs.split(",").map((v, i) => {
                            return (
                              <img
                                onClick={e => this.onImgBig(e)}
                                key={i}
                                src={v}
                              />
                            );
                          })
                        : null}
                    </div>
                  </div>
                );
              })
            : null}
        </div>
        <div className="box2">
          <div className="box2-btn a">
            <a href={`tel:${d.phone}`}>
              <img src={IconPhone} />
              <span>联系门店</span>
            </a>
          </div>
          <div className="box2-btn a fn" onClick={() => this.onGoMap(d)}>
            <img src={IconRoad} />
            <span>导航</span>
          </div>
        </div>
        <div
          className={this.state.showImgModal ? "mark show" : "mark"}
          onClick={() => this.setState({ showImgModal: false })}
        >
          <img src={this.state.showImgSrc} />
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
  stationDetail: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    stationDetail: state.n.stationDetail
  }),
  dispatch => ({
    actions: bindActionCreators({ saveMapAddr, getStationDelForId }, dispatch)
  })
)(HomePageContainer);
