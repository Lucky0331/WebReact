/* 我的e家 - 我的客户 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================
import { Tabs, List, Badge, Modal, Toast } from "antd-mobile";
import ImgDefault from "../../../../assets/default-head.jpg";
import Img404 from "../../../../assets/not-found.png";
import ImgR from "../../../../assets/xiangyou2@3x.png";
import Li from "./component/list";
import ImgA1 from "../../../../assets/one_yikatong@3x.png";
import ImgA2 from "../../../../assets/two_yikatong@3x.png";
import ImgB1 from "../../../../assets/one_jingshui@3x.png";
import ImgB2 from "../../../../assets/two_jingshui@3x.png";
import ImgC1 from "../../../../assets/one_shipin@3x.png";
import ImgC2 from "../../../../assets/two_shipin@3x.png";
import ImgD1 from "../../../../assets/one_liliao@3x.png";
import ImgD2 from "../../../../assets/two_liliao@3x.png";
import ImgE1 from "../../../../assets/one_pingguka@3x.png";
import ImgE2 from "../../../../assets/two_pingguka@3x.png";
import ImgLingDang from "../../../../assets/lingdang@3x.png";
// ==================
// 本页面所需action
// ==================

import { getMyCustomers } from "../../../../a_action/shop-action";
import { updateUserInfo2 } from "../../../../a_action/app-action";
// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      type: 4,
      data: null,
      powerModalShow: false, // 模态说明框是否出现
      nowData: null // 当前选中的
    };
  }

  UNSAFE_componentWillMount() {
    const p = this.props.location.pathname.split("/");
    this.setState({
      id: Number(p[p.length - 2]) || null,
      type: Number(p[p.length - 1]) || 4
    });
  }

  componentDidMount() {
    document.title = "我的客户";
    if (this.state.id) {
      this.getData(this.state.id);
    }
  }

  getData(userId = null) {
    if (userId && Number(userId)) {
      Toast.loading("查询中…");
      this.props.actions
        .getMyCustomers({ userId: Number(userId) })
        .then(res => {
          if (res.status === 200) {
            if (res.data) {
              this.setState({
                data: res.data
              });
            }
          }
          Toast.hide();
        });
    }
  }

  // 构建模态框要显示的 1-智能净水,2-健康食品,3-生物科技,4-健康睡眠,5-健康体检
  makePower(data) {
    const res = [];
    const s =
      data && data.incomePermission ? data.incomePermission.split(",") : [];
    const b = s.includes("1") ? ImgB1 : ImgB2;
    const c = s.includes("2") ? ImgC1 : ImgC2;
    const d = s.includes("3") ? ImgD1 : ImgD2;
    const e = s.includes("5") ? ImgE1 : ImgE2;

    res.push(
      <div key={0} className="que-modal-info">
        <img src={b} />
        <span>净水服务分销权</span>
      </div>
    );
    res.push(
      <div key={1} className="que-modal-info">
        <img src={c} />
        <span>健康食品分销权</span>
      </div>
    );
    res.push(
      <div key={2} className="que-modal-info">
        <img src={d} />
        <span>生物科技分销权</span>
      </div>
    );
    res.push(
      <div key={3} className="que-modal-info">
        <img src={e} />
        <span>健康评估分销权</span>
      </div>
    );
    return res;
  }

  // 问号被点击回调
  onQueClick(d) {
    console.log("触发啊，大哥");
    this.setState({
      nowData: d,
      powerModalShow: true
    });
  }

  // 关闭问号模态框
  onQueClose() {
    this.setState({
      nowData: null,
      powerModalShow: false
    });
  }

  onChangeStar(u, v) {
    const params = {
      asteriskUserId: u.id,
      asteriskLevel: v
    };
    this.props.actions.updateUserInfo2(params).then(res => {
      if (res.status === 200) {
        Toast.success("修改成功", 1);
        this.getData(this.state.id);
      } else {
        Toast.info(res.message, 1);
      }
    });
  }

  onChangeBeiZhu(u, v) {
    const params = {
      asteriskUserId: u.id,
      aliasName: v
    };
    this.props.actions.updateUserInfo2(params).then(res => {
      if (res.status === 200) {
        Toast.success("修改成功", 1);
        this.getData(this.state.id);
      } else {
        Toast.info(res.message, 1);
      }
    });
  }

  render() {
    const t = this.state.type;
    const d = this.state.data || {};
    console.log("D是个什么；", d, d.shareUser);
    const tabs = [];
    if ([0, 1, 2, 5, 6].includes(t)) {
      // 各种经销商用户
      tabs.push(
        {
          title: "分销用户",
          list: d.distributionUser || [],
          type: "distribution"
        },
        { title: "分享用户", list: d.shareUser || [], type: "share" },
        { title: "未绑定客户", list: d.unBindUser || [], type: "unbind" }
      );
    } else if ([3, 7].includes(t)) {
      tabs.push(
        {
          title: "分销用户",
          list: d.distributionUser || [],
          type: "distribution"
        },
        { title: "分享用户", list: d.shareUser || [], type: "share" }
      );
    }

    return (
      <div className="page-customer">
        {tabs.length ? (
          <Tabs
            swipeable={false}
            tabs={tabs.map((item, index) => {
              return {
                title: (
                  <Badge className="tabs-bars-div">
                    <div>{item.title}</div>
                    <div>{item.list.length}</div>
                  </Badge>
                )
              };
            })}
          >
            {tabs.map((obj, index) => (
              <div key={index} className="tabs-div">
                {obj.type === "unbind" ? (
                  <div className="f-info">
                    <div className="icon1">
                      <img src={ImgLingDang} />
                    </div>
                    <div className="info">
                      未绑定客户是指您在“经销商app”中添加的客户，该客户还未关注“翼猫健康e家”公众号，且未绑定客户手机号。如果通知到您的净水客户关注并绑定手机，他可以帮助您分销商城产品。
                    </div>
                  </div>
                ) : null}
                <ul className="data-list">
                  {obj.list && obj.list.length ? (
                    obj.list.map((item, index) => {
                      return (
                        <Li
                          key={index}
                          data={item}
                          type={obj.type}
                          onQueClick={d => this.onQueClick(d)}
                          onChangeStar={(id, v) => this.onChangeStar(id, v)}
                          onChangeBeiZhu={(id, v) => this.onChangeBeiZhu(id, v)}
                        />
                      );
                    })
                  ) : (
                    <li key={0} className="data-nothing">
                      <img src={Img404} />
                      <div>亲，这里什么也没有哦~</div>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </Tabs>
        ) : (
          <ul className="data-list">
            {d.shareUser && d.shareUser.length ? (
              d.shareUser.map((item, index) => {
                return (
                  <Li
                    key={index}
                    data={item}
                    type={"normal"}
                    onQueClick={d => this.onQueClick(d)}
                  />
                );
              })
            ) : (
              <li key={0} className="data-nothing">
                <img src={Img404} />
                <div>亲，这里什么也没有哦~</div>
              </li>
            )}
          </ul>
        )}
        {/*<div className="footer-btn" onClick={() => this.props.history.push('/my/customernex')}>我的客户关系说明<img src={ImgR} /></div>*/}
        <Modal
          visible={this.state.powerModalShow}
          transparent
          onClose={() => this.onQueClose()}
          title="分销权说明"
          footer={[{ text: "Ok", onPress: () => this.onQueClose() }]}
        >
          {this.makePower(this.state.nowData)}
        </Modal>
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
    actions: bindActionCreators({ getMyCustomers, updateUserInfo2 }, dispatch)
  })
)(HomePageContainer);
