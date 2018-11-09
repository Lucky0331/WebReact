/* 商城 - 体验活动主页 */

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
import $ from "jquery";
import _ from "lodash";
import { Button ,Toast,Modal,Icon} from "antd-mobile";
import tools from "../../../../util/all";
import Question from "../../../../assets/home/Question.png";

// ==================
// 本页面所需action
// ==================

import {
  getProDuctListActive,
  gethraExchange,
} from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formCode:"",//兑换码
    };
  }

  UNSAFE_componentWillMount() {}
  componentDidMount() {
    document.title = "活动详情";
    if (
      !this.props.allProductsActive ||
      this.props.allProductsActive.length === 0
    ) {
      this.props.actions.getProDuctListActive();
    }
  }

  //Input输入框事件
  onFormCode(e) {
    this.setState({
      formCode: tools.trim(e.target.value)
    });
    console.log('兑换码是：',e)
  }
  showAlert = (res) => {
        const alertInstance = alert("兑换成功", `恭喜您成功领取HRA健康风险评估优惠卡【${res.data}】`, [
            { text: "取消", onPress: () => console.log("cancel")},
            {
                text: "查看",
                onPress: () =>
                    new Promise(resolve => {
                        this.props.history.push("/my/myfavcards");
                        resolve();
                    })
            }
        ]);
      window.addEventListener("popstate", function(e) {
          alertInstance.close()
      }, false);
  };

  //点击兑换按钮所触发事件
  onButtonClick(){
    if (!this.state.formCode) {
      Toast.info("请输入兑换码", 2);
      return;
    }
    this.props.actions.gethraExchange({
      exchangeCode: this.state.formCode,
      exchangeFrom: sessionStorage.side,
      channel: sessionStorage.channel,
    }).then(res => {
      if(res && res.status === 200) {
        this.showAlert(res);
      }else if(res && res.status === 400) {
        Toast.info(res.message, 3);
      }else if(res && res.status === 500 ) {
        Toast.info(res.message, 3);
      }
    });
  }

  render() {
    const u = this.props.userinfo;
    const allProducts = _.cloneDeep(this.props.allProductsActive).sort(
      (a, b) => a.sorts - b.sorts
    );
    if(location.href.split('datas=').length <= 1){
      window.location.href='https://hratest.yimaokeji.com/gzh';
      return;
    }
    const datas=location.href.split('datas=').length>1?location.href.split('datas=')[1]:'';
    const backs=datas?datas.split('&&&'):'';

    return (
      <div className="flex-auto page-box shop-active-page" style={{backgroundImage:`url(${backs[0]})`}}>
        <div className="top-code " style={{border:'none',margin:'0px',padding:'0px',position:'absolute'}}>
          <div className="aboutHRA">
            <Link to={"/shop/gooddetail/1"} className={'aClass'}>
              <div>
                <img src={Question} /><span >关于HRA</span>
              </div>
            </Link>
          </div>
          <div className="HraInput" style={{marginTop:'77%',}}>
            <input
              type="text"
              maxLength="16"
              placeholder={"长按粘贴或输入兑换码"}
              value={this.state.formCode}
              onInput={e => this.onFormCode(e)}
            />
            <Button
              onClick={()=>this.onButtonClick()}
              style={{
                width:'26%',height:'0.95rem',
                lineHeight:'0.95rem',fontSize:'0.25rem',
                backgroundColor:`${backs[1]}`,
                color:'#fff',border:'none',boxShadow: `3px 5px 10px ${backs[1]}`
              }}>
              兑换
            </Button>
          </div>
          <div className="foot">
            <Link to={"/healthy/choseStation"}><span style={{color:'#fff'}}>查看适用体验店</span><Icon type="right" style={{color:'#fff',width:'0.32rem',height:'100%',marginBottom:'-4px'}}/></Link>
          </div>
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
  allProductsActive: P.array, // 所有的活动产品
  homePics: P.array, // 首页顶部轮播图
  userinfo: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    allProductsActive: state.shop.allProductsActive, // 所有的产品  数组
    homePics: state.shop.homePics, // 首页顶部轮播图
    userinfo: state.app.userinfo
  }),
  dispatch => ({
    actions: bindActionCreators(
      { getProDuctListActive, gethraExchange},
      dispatch
    )
  })
)(HomePageContainer);
