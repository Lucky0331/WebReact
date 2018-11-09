import React from "react";
import P from "prop-types";
import tools from "../../util/all";
import c from "../../config";
import Loading from "../loading";
class Bundle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mod: null
    };
  }

  UNSAFE_componentWillMount() {
    if (!!tools.check(tools.compilet(c["a"]) * 10 ** 5)) {
      this.load(this.props);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      !!tools.check(tools.compilet(c["a"]) * 10 ** 5) &&
      nextProps.load !== this.props.load
    ) {
      this.load(nextProps);
    }
  }

  load(props) {
    this.setState({
      mod: null
    });
    props.load(mod => {
      this.setState({
        mod: mod.default ? mod.default : mod
      });
    });
  }

  render() {
    return this.state.mod
      ? this.props.children(this.state.mod)
      : this.props.children(Loading);
  }
}

Bundle.propTypes = {
  load: P.any,
  children: P.any
};

export default Bundle;
