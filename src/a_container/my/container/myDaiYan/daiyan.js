/* 我的代言卡 - 选择哪一种 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import Config from "../../../../config";
import "./daiyan.scss";
// ==================
// 所需的所有组件
// ==================

import ImgA1 from "../../../../assets/one_yikatong@3x.png";
import ImgB1 from "../../../../assets/one_jingshui@3x.png";
import ImgC1 from "../../../../assets/one_shipin@3x.png";
import ImgD1 from "../../../../assets/one_liliao@3x.png";
import ImgE1 from "../../../../assets/one_pingguka@3x.png";
import ImgR from "../../../../assets/xiangyou@3x.png";
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
    document.title = "我的代言卡";
    if (!this.props.daiyanList) {
      this.getData();
    }
  }

  /**
   * 点击一个选项触发
   * @type: 这条数据的ID
   * @type2: 这条数据的类型ID
   * **/
  onChose(type) {
    this.props.history.push(`/my/mydaiyan/${type}`);
  }

  getData() {
    this.props.actions.speakCardPropList({ cardCategory: 1 });
  }

  makeData(data) {
    if (!data) {
      return null;
    }
    return data
      .filter(item => item.productSpeakCards && item.productSpeakCards.length)
      .map((item, index) => {
        return (
          <div key={index} className="abox">
            <div className="title">{item.typeName}</div>
            <ul className="the-ul">
              {item.productSpeakCards &&
                item.productSpeakCards.map((v, i) => {
                  return (
                    <li key={i} onClick={() => this.onChose(v.id)}>
                      <img className="pic" src={v.titleImage} />
                      <div className="info">{v.name}</div>
                      <img className="r" src={ImgR} />
                    </li>
                  );
                })}
            </ul>
          </div>
        );
      });
  }

  render() {
    return (
      <div className="flex-auto page-box page-daiyan">
        {this.makeData(this.props.daiyanList)}
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
  daiyanList: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    daiyanList: state.shop.daiyanList
  }),
  dispatch => ({
    actions: bindActionCreators(
      { wxInit, shareBuild, speakCardPropList },
      dispatch
    )
  })
)(Register);
