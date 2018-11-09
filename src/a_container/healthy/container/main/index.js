/* 健康管理 - 主页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.less";
import { Toast } from "antd-mobile";
// ==================
// 所需的所有组件
// ==================

import ImgRight from "../../../../assets/xiangyou@3x.png";
import ImgBar1 from "../../../../assets/tijianka@3x.png";
import ImgBar2 from "../../../../assets/yuyue@3x.png";
import ImgBar3 from "../../../../assets/wodeyuyue@3x.png";
import ImgBar4 from "../../../../assets/baogao@3x.png";
import ImgBar7 from "../../../../assets/HRA@3x.png";
import ImgWei from "../../../../assets/wei@3x.png";
import ImgA1 from "./assets/a1.png";
import ImgA2 from "./assets/a2.png";
import ImgA3 from "./assets/a3.png";
import WaterWave from "water-wave";
// ==================
// 本页面所需action
// ==================

import { shareBuild } from "../../../../a_action/app-action";

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  componentDidMount() {
    document.title = "健康服务";
    this.setState({
      show: true
    });
  }

  // 健康知识库点击
  onHraClick() {
    const u = this.props.userinfo;
    /**
     * 还要带头像和昵称
     * 正式： http://e.yimaokeji.com/index.php?m=page&f=view&t=mhtml&pageID=1${str}
     * 测试：http://www.huiyuzixun.cn/index.php?m=page&f=view&t=mhtml&pageID=21${str}
     * **/
    let str = "";
    if (u && u.id) {
      // 有用户信息
      str = `&e=${u.id}`;
    }
    window.location.href = `http://e.yimaokeji.com/index.php?m=page&f=view&t=mhtml&pageID=1${str}`;
  }

  // 健康资讯点击
  onZiXunClick() {
    const u = this.props.userinfo;
    let str = "";
    if (u && u.id) {
      // 有用户信息
      str = `&e=${u.id}`;
    }
    window.location.href = `http://e.yimaokeji.com/index.php?m=article&f=browse&t=mhtml&categoryID=3&pageID=1${str}`;
  }

  // 健康新闻
  onNewsClick() {
    const u = this.props.userinfo;
    let str = "";
    if (u && u.id) {
      // 有用户信息
      str = `&e=${u.id}`;
    }
    window.location.href = `http://e.yimaokeji.com/index.php?m=article&f=browse&t=mhtml&categoryID=11&pageID=1&${str}`;
  }

  onClickA(title, url) {
    let u = this.props.userinfo;
    if (!u || !u.id) {
      let temp = sessionStorage.getItem("u");
      if (temp) {
        u = JSON.parse(temp);
      }
    }
    if (!u) {
      Toast.info("尚未登录，请刷新页面");
    }

    if (!u.mobile) {
      this.props.history.push("/my/bindphone");
      return;
    }
    sessionStorage.setItem("u", JSON.stringify(u));
    window.location.href = url + u.mobile;
    // this.props.history.push(`/healthy/iframe/${encodeURIComponent(title)}_${encodeURIComponent(url+u.mobile)}`);
  }
  render() {
    const u = this.props.userinfo || {};
    return (
      <div className={this.state.show ? "healthy-main show" : "healthy-main"}>
        <div className="bar-list">
          <div className="bar-title">翼猫健康风险评估服务</div>
          <div
            className="item page-flex-row"
            onClick={() => this.props.history.push("/healthy/mycard")}
          >
            <img className="icon" src={ImgBar1} />
            <div className="title">我的评估卡</div>
            <img className="arrow" src={ImgRight} />
            <div className="line" />
            <WaterWave color="#cccccc" press="down" />
          </div>
          <div
            className="item page-flex-row"
            onClick={() => this.props.history.push("/healthy/precheck")}
          >
            <img className="icon" src={ImgBar2} />
            <div className="title">预约检查</div>
            <img className="arrow" src={ImgRight} />
            <div className="line" />
            <WaterWave color="#cccccc" press="down" />
          </div>
          <div
            className="item page-flex-row"
            onClick={() => this.props.history.push("/healthy/mypre")}
          >
            <img className="icon" src={ImgBar3} />
            <div className="title">我的预约</div>
            <img className="arrow" src={ImgRight} />
            <div className="line" />
            <WaterWave color="#cccccc" press="down" />
          </div>
          <div
            className="item page-flex-row"
            onClick={() => this.props.history.push("/healthy/myreport")}
          >
            <img className="icon" src={ImgBar4} />
            <div className="title">评估报告</div>
            <img className="arrow" src={ImgRight} />
            <div className="line" />
            <WaterWave color="#cccccc" press="down" />
          </div>
          <div
            className="item page-flex-row"
            onClick={() => this.props.history.push(`/healthy/wei/${u.id}`)}
          >
            <img className="icon" src={ImgWei} />
            <div className="title">评估报告(小程序)</div>
            <img className="arrow" src={ImgRight} />
            <div className="line" />
            <WaterWave color="#cccccc" press="down" />
          </div>
        </div>
        <div className="bar-list" style={{ marginTop: ".28rem" }}>
          <div className="bar-title">翼猫智能净水服务</div>
          <div
            className="item page-flex-row"
            onClick={() =>
              this.onClickA(
                "我的合同",
                "http://yimaokeji.ibestservice.com/service/contractList?phone="
              )
            } // contractList
          >
            <img className="icon" src={ImgA1} />
            <div className="title">我的合同</div>
            <img className="arrow" src={ImgRight} />
            <div className="line" />
            <WaterWave color="#cccccc" press="down" />
          </div>
          <div
            className="item page-flex-row"
            onClick={() =>
              this.onClickA(
                "我的发票",
                "http://yimaokeji.ibestservice.com/service/openBillList?phone="
              )
            }
          >
            <img className="icon" src={ImgA2} />
            <div className="title">我的发票</div>
            <img className="arrow" src={ImgRight} />
            <div className="line" />
            <WaterWave color="#cccccc" press="down" />
          </div>
          <div
            className="item page-flex-row"
            onClick={() =>
              this.onClickA(
                "我的评价",
                "http://yimaokeji.ibestservice.com/service/evaluateList?phone="
              )
            }
          >
            <img className="icon" src={ImgA3} />
            <div className="title">我的评价</div>
            <img className="arrow" src={ImgRight} />
            <div className="line" />
            <WaterWave color="#cccccc" press="down" />
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
  userinfo: P.any,
  actions: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    userinfo: state.app.userinfo
  }),
  dispatch => ({
    actions: bindActionCreators({ shareBuild }, dispatch)
  })
)(HomePageContainer);
