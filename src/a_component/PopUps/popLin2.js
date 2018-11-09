/* 恭喜您 弹窗 */
import React from "react";
import "./popLin2.scss";
import ImgTitle from "./assets/img3@3x.jpg";
import ImgClose from "./assets/close@3x.png";
import P from "prop-types";

class Pop extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 关闭
  onClose() {
    this.props.onClose && this.props.onClose();
  }

  // 提交
  onSubmit() {
    this.props.onSubmit && this.props.onSubmit();
  }
  render() {
    return (
      <div
        className="pop-lin1-page"
        style={{ display: this.props.show ? "flex" : "none" }}
      >
        <div className="pop-body">
          <img className="img-title" src={ImgTitle} />
          <div className="title">绑定手机号码</div>
          <ul className="info-ul">
            <li>
              翼猫老客户绑定下单时的手机号，可以领取价值1000元/张HRA健康风险评估优惠卡
            </li>
            <li>净水用户还可以升级为“分销用户”，拥有商城所有产品的分销权</li>
          </ul>
          <div className="btn-box">
            <button className="close" onClick={() => this.onClose()}>
              暂不绑定
            </button>
            <button className="ok" onClick={() => this.onSubmit()}>
              立即绑定
            </button>
          </div>

          <div className="pop-close">
            <div className="line" />
            <img src={ImgClose} onClick={() => this.onClose()} />
          </div>
        </div>
      </div>
    );
  }
}

Pop.propTypes = {
  show: P.bool, // 是否出现
  onClose: P.any, // 关闭
  onSubmit: P.any // 提交按钮被点击
};

export default Pop;
