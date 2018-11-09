/* Test */

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./index.scss";
import P from "prop-types";
import ImgTest from "../../assets/test/new.png";
import anime from "animejs";
import tools from "../../util/all";
import ImgCode from "./code.jpg";
import { numtest } from "../../a_action/app-action";
class TestContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.title = "Test";
  }

  componentWillUnmount() {}

  aclick() {
    console.log("点击了2");
  }
  testClick() {
    window.location.href = "http://www.lanrentuku.com/";
  }

  render() {
    return (
      <div className="page-test">
        <span onClick={() => this.aclick()}>{this.props.num}</span>
        <img src={ImgCode} onClick={() => this.testClick()} />
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

TestContainer.propTypes = {
  actions: P.any,
  num: P.number
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    num: state.app.num
  }),
  dispatch => ({
    actions: bindActionCreators({ numtest }, dispatch)
  })
)(TestContainer);
