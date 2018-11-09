/* 浮窗 */
import React from "react";
import P from "prop-types";
import ImgGwc from "./assets/gwc1@3x.png";
import ImgKf from "./assets/kf1@3x.png";
import "./index.scss";
class WindowFlod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.touchEndTimer = null;
  }

  componentDidMount() {
    document.body.addEventListener("touchmove", this.onTouchStart, false);
    document.body.addEventListener("touchend", this.onTouchEnd, false);
  }

  componentWillUnmount() {
    document.body.removeEventListener("touchmove", this.onTouchStart, false);
    document.body.removeEventListener("touchend", this.onTouchEnd, false);
    clearTimeout(this.touchEndTimer);
  }

  onTouchStart = e => {
    clearTimeout(this.touchEndTimer);
    if (e.target && ["menu-icon"].includes(e.target.className)) {
      return;
    }
    document.getElementById("window_flod").classList.add("inside");
    this.onTouchEnd();
  };

  onTouchEnd = () => {
    clearTimeout(this.touchEndTimer);
    this.touchEndTimer = setTimeout(() => {
      document.getElementById("window_flod").classList.remove("inside");
    }, 2000);
  };

  shoudBeShow() {
    const pathname = this.props.location.pathname;
    if (
      ["home", "my", "healthy", "shop"].includes(
        this.props.location.pathname.split("/").slice(-1)[0]
      )
    ) {
      return "window-flod show";
    } else if (pathname.includes("shoptypeall")) {
      // 商城分类页也要
      return "window-flod show";
    }
    return "window-flod";
  }

  render() {
    return (
      <div id="window_flod" className={this.shoudBeShow()}>
        <div
          className={"btn"}
          onTouchStart={e => e.stopPropagation()}
          onClick={e => {
            e.stopPropagation();
            this.props.history.push("/shop/shoppingcar");
          }}
        >
          <img src={ImgGwc} style={{ marginLeft: "-3px" }} />
          <div
            className={
              this.props.shoppingCarNum > 0
                ? "shopping-num show"
                : "shopping-num"
            }
          >
            {this.props.shoppingCarNum}
          </div>
        </div>
        <div className={"line"} />
        <div
          className={"btn"}
          onTouchStart={e => e.stopPropagation()}
          onClick={e => {
            e.stopPropagation();
            this.props.history.push("/my/kf");
          }}
        >
          <img src={ImgKf} />
        </div>
      </div>
    );
  }
}

WindowFlod.propTypes = {
  location: P.any,
  history: P.any,
  shoppingCarNum: P.number // 购物车中商品的数量
};

export default WindowFlod;
