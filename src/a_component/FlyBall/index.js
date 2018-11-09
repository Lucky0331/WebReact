import React from "react";
import P from "prop-types";
import "./index.scss";
import anime from "animejs";
class FlyBall extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillReceiveProps(nextP) {
    if (nextP.data && nextP.data !== this.props.data) {
      this.play(nextP.data);
    }
  }

  play(obj) {
    const cY = Math.min(obj[1], obj[3]) - 250;
    const cX = (obj[0] + obj[2]) / 2;
    const time = Math.max(
      Math.sqrt(Math.pow(obj[0] - obj[2], 2) + Math.pow(obj[1] - obj[3], 2)) *
        2.6,
      600
    );

    const $ball = document.createElement("div");
    $ball.className = "fly-ball";
    document.body.appendChild($ball);

    document
      .getElementById("ball_path")
      .setAttribute(
        "d",
        `M${obj[0]} ${obj[1]} Q${cX} ${cY} ${obj[2]} ${obj[3]}`
      );

    const path = anime.path("#ball_path");

    anime({
      targets: $ball,
      translateX: path("x"),
      translateY: path("y"),
      scale: [{ value: 1 }, { value: 0.5 }],
      easing: "easeOutSine",
      duration: time,
      complete: function(anim) {
        $ball.parentNode.removeChild($ball);
      }
    });
  }

  render() {
    return (
      <svg className="flyball-svg">
        <path id="ball_path" fill="none" strokeWidth={2} stroke="red" />
      </svg>
    );
  }
}

FlyBall.propTypes = {
  data: P.any
};

export default FlyBall;
