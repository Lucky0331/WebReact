/* 我的代言卡 - 选择哪一种 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import "./daiyanh5.scss";
// ==================
// 所需的所有组件
// ==================
import { Tabs } from "antd-mobile";
import Img404 from "../../../../assets/not-found.png";
// ==================
// 本页面所需action
// ==================

import { wxInit } from "../../../../a_action/shop-action";
import { shareBuild } from "../../../../a_action/app-action";
import { speakCardPropList } from "../../../../a_action/new-action";
// ==================
// Definition
// ==================

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount() {}

  componentDidMount() {
    document.title = "我的宣传卡";
    if (!this.props.daiyanh5List.length) {
      this.getData();
    }
  }

  /**
   * 点击一个选项触发
   * @type: 这条数据的ID
   * @type2: 这条数据的类型ID
   * **/
  onChose(type) {
    this.props.history.push(`/my/daiyanh5del/${type}`);
  }

  getData() {
    this.props.actions.speakCardPropList({ cardCategory: 2 });
  }

  makeTabBar(data) {
    return data.map((item, index) => {
      return { title: item.typeName, sub: index };
    });
  }

  toDel(id) {
    this.props.history.push(`/my/daiyanh5del/${id}`);
  }

  makeTabBody(data) {
    return data.map((item, index) => {
      return (
        <div className="tab-box" key={index}>
          {item.productSpeakCards.length ? (
            item.productSpeakCards.map((item2, index2) => {
              return (
                <div
                  className="one"
                  key={index2}
                  onClick={() => this.toDel(item2.id)}
                >
                  <div>
                    <div className="pic">
                      <img src={item2.titleImage} />
                    </div>
                    <div className="name">{item2.name}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div key={0} className="data-nothing">
              <img src={Img404} />
              <div>亲，这里什么也没有哦~</div>
            </div>
          )}
        </div>
      );
    });
  }

  render() {
    const d = this.props.daiyanh5List;
    return (
      <div className="page-daiyanh5">
        {d && d.length ? (
          <Tabs
            swipeable={false}
            tabs={this.makeTabBar(d) || [{ title: "暂无数据", sub: 0 }]}
            renderTabBar={props => <Tabs.DefaultTabBar {...props} page={5} />}
          >
            {this.makeTabBody(d)}
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

Register.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any,
  daiyanh5List: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    daiyanh5List: state.shop.daiyanh5List
  }),
  dispatch => ({
    actions: bindActionCreators(
      { wxInit, shareBuild, speakCardPropList },
      dispatch
    )
  })
)(Register);
