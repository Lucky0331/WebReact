/* 我的e家 - 商城主页 */

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

import { Tabs, Carousel, Toast ,Modal} from "antd-mobile";
import ImgCar from "../../../../assets/shop/jrgwc@3x.png";
import FlyBall from "../../../../a_component/FlyBall";
import ImgFenLei from "../../../../assets/one_yikatong@3x.png";
import ImgJD from "../../../../assets/home/JD-banner.png"
// ==================
// 本页面所需action
// ==================

import {
  getProDuctList,
  listProductType,
  mallApList,
  pushCarInterface,
  getExchangeList,
  getProDuctListOther,
} from "../../../../a_action/shop-action";
import {
  shopCartCount,
  getRecommend,
  getActivityList
} from "../../../../a_action/new-action";
// ==================
// Definition
// ==================
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      barPics: [], // 顶部轮播图
      ballData: null,
      exchange:[],//京东兑换活动列表
      barId: Number(this.props.location.pathname.split("/").slice(-1)),
      check: false,//默认没被点击
      position:"sticky",
      height:"auto",
      visibility:'visibile',
      top:'auto',
      marginTop:'',
      overflowY:'auto',
    };
    this.show = 0;
  }

  componentDidMount() {
    // 获取顶部轮播图
    this.getPics();
    document.title = "健康商城";
    this.props.actions.listProductType(() => this.getShowTypes());
    // 如果state中没有所有的产品信息，就重新获取
    if (!this.props.allProductsNew.length) {
      this.props.actions.getProDuctListOther().finally(() => this.getShow());
    } else {
      this.getShow();
    }
    this.props.actions.shopCartCount();

    // 获取热销产品
    if (!this.props.homeRecommend || !this.props.homeRecommend.length) {
      this.getRecommend();
    }

    // 获取热门活动
    if (!this.props.activityList || !this.props.activityList.length) {
      this.getActivityList();
    }
    // this.getExchangeListData()
  }

  // 获取热销产品
  getRecommend() {
    this.props.actions.getRecommend();
  }

  // 获取热门活动
  getActivityList() {
    this.props.actions.getActivityList();
  }

  // 京东活动列表
  getExchangeListData() {
    this.props.actions.getExchangeList({ pageNum: 1, pageSize: 10 })
      .then(res => {
        if (res && res.status === 200) {
          this.setState({
            exchange: res.data.result || []
          });
        }
        console.log('有么',res.data.result)
      });
  }

  // 获取顶部轮播
  getPics() {
    this.props.actions.mallApList({ typeCode: "shop" }).then(res => {
        if (res.status === 200) {
          this.setState({
            barPics: res.data,
            imgHeight: "3.225rem"
          });
        }
      }).finally(() => this.getShow());
  }

  getShow() {
    this.show++;
    if (this.show >= 2) {
      this.setState({
        show: true
      });
    }
  }

  // 点击一个商品，进入商品详情页
  onProClick(id) {
    this.props.history.push(`/shop/gooddetail/${id}`);
  }

  // 将商品添加进购物车
  onPushCar(e, id ,activityType) {
    if(activityType == 0){
      const alertInstance = alert("温馨提示", `亲，此商品暂不支持在线购买，请您前往线下门店进行体验、购买哦~`, [
        { text: "取消", onPress: () => console.log("cancel")},
        {
          text: "查看线下门店",
          onPress: () =>
              new Promise(resolve => {
                this.props.history.push("/exprshop2");
                resolve();
              })
        }
      ]);
      window.addEventListener("popstate", function(e) {
        alertInstance.close()
      }, false);
    }
    e.stopPropagation();
    if (this.props.shoppingCarNum >= 200) {
      Toast.info("您购物车内的商品数量过多，清理后方可加入购物车", 2);
      return;
    }
    if(activityType !== 0){
      const win = document.getElementById("window_flod");
      this.setState({
        ballData: [e.clientX, e.clientY, win.offsetLeft + 10, win.offsetTop]
      });
      this.props.actions
          .pushCarInterface({ productId: id, number: 1 })
          .then(res => {
            if (res.status === 200) {
              this.props.actions.shopCartCount();
            } else {
              Toast.info(res.message, 1);
            }
          });
    }
    
  }

  // 点击进入分类
  barClick(id) {
    this.props.history.push(`/shop/shoptypeall/${id}`);
  }

  //点击京东兑换页面
  JDGo(item){
      const u = this.props.userinfo;
      if (!tools.checkPhone(u)) {
          if(!u || !u.mobile){
            this.props.history.push({pathname:'/my/JDbindphone',search:`datas=${item.backImg+'&&&'+item.backColor}`});
          }else{
            sessionStorage.channel=item.channel;
            sessionStorage.side = item.side;
            this.props.history.push({pathname:'/shop/JDCOM',search:`datas=${item.backImg+'&&&'+item.backColor}`});
          }
          console.log('')
      }
  }

  // 点击进行筛选
  barClickScreen(id) {
    console.log("id"+id);
    if(id===this.state.barId){
      this.setState({
        barId: null,
        position:"sticky",
        height:'auto',
        visibility:'visible',
        marginTop:'0px',
        top:'auto'
      });
      console.log('重复')
    }else{
      this.setState({
        barId: Number(id),
        position: "absolute",
        height: 0,
        visibility: "hidden",
        marginTop:'0px',
        top:'0px'
      })
      console.log('点击的是什么',id)
    }
}

  goIn(item) {
    const u = this.props.userinfo;
    if (item.url && item.url.includes("cms/c")) {
      // 是CMS的活动URL
      this.props.history.push(
        `/shop/activity/s_${encodeURIComponent(
          item.title
        )}_${encodeURIComponent(item.url)}_${encodeURIComponent(item.adImg)}`
      );
    } else if (item.url && item.url.include("#/")) {
      // 是自己的URL
      window.location.href = item.url;
    } else {
      // 是别人的URL
      if (u) {
        window.location.href = `${item.url}&e=${u.id}`;
      } else {
        window.location.href = item.url;
      }
    }
  }

  render() {
    const t = this.props.allProductTypes; // 原始分类的数据
    const d = [...this.props.allProductsNew].sort((a, b) => a - b); // 原始分类的数据
    //某一类分类数据
    const u = this.props.userinfo;
    const res = []; // 全部
    d.forEach((item) => {
      if (item.productList) {
        res.push(...item.productList);
      }
    });

    const tabData = res.filter(item => item.typeId === this.state.barId);
    const JDdata = this.props.activityList.filter(item => item.layoutType == 1);//大图
    const Othdata = this.props.activityList.filter(item => item.layoutType == 2); //小图
    const alldata = this.props.activityList; //小图
    // const alldata = _.cloneDeep(this.props.activityList).sort(
    //     (a, b) => a.sorts - b.sorts
    // );
    return (
      <div className={this.state.show ? "shop-main show" : "shop-main"}>
        {/* 顶部轮播 */}
        {this.state.barPics.length ? (
          <Carousel
            className="my-carousel"
            autoplay={true}
            infinite={true}
            swipeSpeed={35}
            // style={{height:this.state.height,visibility:this.state.visibility}}
          >
            {this.state.barPics.map((item, index) => (
              <div
                key={index}
                onClick={() => this.goIn(item)}
                style={{
                  display: "inline-block",
                  width: "100%",
                  height: this.state.imgHeight
                }}
              >
                <img
                  src={item.adImg}
                  style={{ width: "100%", verticalAlign: "top" }}
                  onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event("resize"));
                    this.setState({ imgHeight: "auto" });
                  }}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <div style={{ height: this.state.imgHeight }} />
        )}
        <div className="home-content-one">
          <div className={"title"} >合作平台</div>
          <ul
            className="active-list"
            style={{
              display: this.props.activityList.length ? "flex" : "none",
              margin:'0px 5px',
            }}
          >
            {alldata.map((item, index) => {
              if(item.layoutType == 1){
                const haveJD = item.acUrl.indexOf('shop/JDCOM');
                if(haveJD > -1){
                  return <div
                      key={index}
                      onClick={()=>{this.JDGo(item)}}
                  >
                    <img className="all_radius" src={item.acImg} style={{width:'100%'}} />
                  </div>
                }else{
                  return <Link
                      to={`/shop/activity/${item.id}_${encodeURIComponent(
                          item.acUrl
                      )}`}
                  >
                    <img className="all_radius" src={item.acImg} style={{width:'100%'}}/>
                  </Link>
                }
              }else if(item.layoutType == 2){
                let w = "calc(49% - 5px)";
                const haveJD = item.acUrl.indexOf('shop/JDCOM');
                if(haveJD > -1){
                  return (
                      <li key={index} style={{ width: w ,margin:'5px 2px 3px 2px'}}  onClick={()=>{this.JDGo(item)}}>
                        <img className="all_radius" src={item.acImg} style={{width:'100%'}} />
                      </li>
                  );
                }else{
                  return (
                      <li key={index} style={{ width: w ,margin:'5px 2px 3px 2px'}}>
                        <Link
                            to={`/shop/activity/${item.id}_${encodeURIComponent(
                                item.acImg
                            )}`}
                        >
                          <img className="all_radius" style={{width:'100%'}} src={item.acImg} />
                        </Link>
                      </li>
                  );
                }
              }
            })}
          </ul>
        </div>
        <div>
        <div className="type-bar">
          {t.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => this.barClickScreen(item.id)}
                className={this.state.barId === item.id ? "check" : ""}
              >
                <img src={item.typeIcon}/>
                <div>{item.detail}</div>
              </div>
            );
          })}
          <div onClick={() => this.barClick(0)}>
            <img src={ImgFenLei} />
            <div>分类</div>
          </div>
        </div>
        <div className={this.state.barId === 1 || this.state.barId === 2 || this.state.barId === 3 || this.state.barId === 5? "body-box hide" :"body-box" } style={{marginTop:this.state.marginTop}}>
          <div key={0} className="tab-box">
            <div>
              {res.filter((vv, ii) => !(ii % 2)).map((vvv, iii) => {
                return(
                  <div
                    className="a-product"
                    key={iii}
                    onClick={() => this.onProClick(vvv.id)}
                  >
                    <img src={vvv.detailImg && vvv.detailImg.split(",")[0]}/>
                    <div className="p-t all_nowarp2">{vvv.name}</div>
                    <div className="p-m">
                      ￥
                      {vvv.productModel &&
                        tools.point2(
                          vvv.productModel.price +
                            vvv.productModel.openAccountFee
                      )}
                    </div>
                    <div
                      className="p-i"
                    >
                      <span>
                        已售：
                        {vvv.buyCount || 0}
                      </span>
                      <img src={ImgCar} onClick={e => this.onPushCar(e, vvv.id,vvv.activityType)}/>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              {res.filter((vv, ii) => ii % 2).map((vvv, iii) => {
                return (
                  <div
                    className="a-product"
                    key={iii}
                    onClick={() => this.onProClick(vvv.id)}
                  >
                    <img src={vvv.detailImg && vvv.detailImg.split(",")[0]} />
                    <div className="p-t all_nowarp2">{vvv.name}</div>
                    <div className="p-m">
                      ￥
                      {vvv.productModel &&
                        tools.point2(
                          vvv.productModel.price +
                            vvv.productModel.openAccountFee
                        )}
                    </div>
                    <div
                      className="p-i"
                    >
                      <span>
                        已售：
                        {vvv.buyCount || 0}
                      </span>
                      <img src={ImgCar} onClick={e => this.onPushCar(e, vvv.id,vvv.activityType)}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className={this.state.barId === 1 || this.state.barId === 2 || this.state.barId === 3 || this.state.barId === 5? "body-box" :"body-box hide" } style={{marginTop:this.state.marginTop}}>
          <div key={0} className="tab-box">
            <div>
              {tabData.filter((vv, ii) => !(ii % 2)).map((vvv, iii) => {
                return(
                    <div
                      className="a-product"
                      key={iii}
                      onClick={() => this.onProClick(vvv.id)}
                    >
                      <img src={vvv.detailImg && vvv.detailImg.split(",")[0]}/>
                      <div className="p-t all_nowarp2">{vvv.name}</div>
                      <div className="p-m">
                        ￥
                        {vvv.productModel &&
                        tools.point2(
                          vvv.productModel.price +
                          vvv.productModel.openAccountFee
                        )}
                      </div>
                      <div
                          className="p-i"
                      >
                      <span>
                        已售：
                        {vvv.buyCount || 0}
                      </span>
                        <img src={ImgCar} onClick={e => this.onPushCar(e, vvv.id,vvv.activityType)}/>
                      </div>
                    </div>
                );
              })}
            </div>
            <div>
              {tabData.filter((vv, ii) => (ii % 2)).map((vvv, iii) => {
                return(
                    <div
                      className="a-product"
                      key={iii}
                      onClick={() => this.onProClick(vvv.id)}
                    >
                      <img src={vvv.detailImg && vvv.detailImg.split(",")[0]}/>
                      <div className="p-t all_nowarp2">{vvv.name}</div>
                      <div className="p-m">
                        ￥
                        {vvv.productModel &&
                        tools.point2(
                          vvv.productModel.price +
                          vvv.productModel.openAccountFee
                        )}
                      </div>
                      <div
                          className="p-i"
                      >
                      <span>
                        已售：
                        {vvv.buyCount || 0}
                      </span>
                        <img src={ImgCar} onClick={e => this.onPushCar(e, vvv.id,vvv.activityType)}/>
                      </div>
                    </div>
                );
              })}
            </div>
          </div>
        </div>
        </div>
        <FlyBall data={this.state.ballData} />
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
  allProductsNew: P.array,
  allProductTypes: P.array,
  userinfo: P.any,
  shoppingCarNum: P.any,
  activityList: P.any,
  allActivityList: P.any,
  homeRecommend: P.any,
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    allProductsNew: state.shop.allProductsNew,
    allProductTypes: state.shop.allProductTypes,
    userinfo: state.app.userinfo,
    shoppingCarNum: state.shop.shoppingCarNum,
    allActivityList: state.shop.allActivityList,
    homeRecommend: state.shop.homeRecommend,
    activityList: state.n.activityList,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        getProDuctList,
        listProductType,
        mallApList,
        pushCarInterface,
        shopCartCount,
        getExchangeList,
        getRecommend,
        getProDuctListOther,
        getActivityList
      },
      dispatch
    )
  })
)(HomePageContainer);
