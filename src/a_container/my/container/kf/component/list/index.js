/** list **/
import React from "react";
import P from "prop-types";
import "./index.scss";
import ImgRobot from "../../assets/robot@3x.png";
import tools from "../../../../../../util/all";
import ImgDefaultHead from "../../../../../../assets/default-head.jpg";
class StepperLuo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  // 工具 - 根据qId找出对应的data数据
  getDataByQid(id) {
    return this.props.source.find(item => Number(item.id) === Number(id)) || {};
  }

  // 点击某个问题，获得答案
  getAnswers(q, a) {
    this.props.q2a && this.props.q2a(q, a);
  }
  // 构造不同类型的
  makeBody(d) {
    if (d.type === 1) {
      // 返回当前时间
      return <div className="type1">{tools.dateToTime(d.date)}</div>;
    } else if (d.type === 2) {
      return <div className="type2">机器人助手为您服务</div>;
    } else if (d.type === 3) {
      return (
        <div className="type3">
          <div className="head-pic">
            <img className="head" src={ImgRobot} />
          </div>
          <div className="word-box-l all_warp">
            您好，我是您的机器人助手，请问有什么可以帮助您的吗？先来看看热门问题吧，也可以试试下方的人工咨询
          </div>
        </div>
      );
    } else if (d.type === 4) {
      // 问题，输出指定分类的问题

      const nowq = this.getDataByQid(d.qid);

      return (
        <div className="type4">
          <div className="head-pic">
            <img className="head" src={ImgRobot} />
          </div>
          <div className="word-box-l all_warp">
            <div className="t">{nowq.typeName || "问题分类"}</div>
            <ul className="qs">
              {nowq.customerAssistantList &&
                nowq.customerAssistantList.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className="q"
                      onClick={() =>
                        this.getAnswers(item.questions, item.answers)
                      }
                    >
                      {item.questions}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      );
    } else if (d.type === 5) {
      // 用户提出问题
      return (
        <div className={"type5"}>
          <div className="word-box-r all_warp">{d.q}</div>
          <div className="head-pic">
            <img
              className="head"
              src={this.props.u.headImg || ImgDefaultHead}
            />
          </div>
        </div>
      );
    } else if (d.type === 6) {
      // 机器人回答
      return (
        <div className={"type6"}>
          <div className="head-pic">
            <img className="head" src={ImgRobot} />
          </div>
          <div
            className="word-box-l all_warp"
            dangerouslySetInnerHTML={{ __html: d.a }}
          />
        </div>
      );
    }
  }

  render() {
    const d = this.props.listOne;
    return (
      <div className="list-one" style={this.props.style}>
        {this.makeBody(d)}
      </div>
    );
  }
}

StepperLuo.propTypes = {
  listOne: P.any, // 当前tempData
  style: P.any, // 用于动画效果的，不用管
  source: P.array, // 所有的原始数据
  q2a: P.func, // 用户点击了一个问题
  u: P.any // 用户信息
};

export default StepperLuo;
