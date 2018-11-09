import React from "react";
import "./index.scss";
import ImgLoading from "./loading.gif";
export default class Footer extends React.PureComponent {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.error || nextProps.timedOut) {
      console.log("自动刷新：", nextProps.error, nextProps.timedOut);
      if (!sessionStorage.getItem("flashCache")) {
        sessionStorage.setItem("flashCache", "t");
        window.location.reload(true);
      }
    }
    return null;
  }
  render() {
    return (
      <div className="loading">
        <img src={ImgLoading} />
      </div>
    );
  }
}
