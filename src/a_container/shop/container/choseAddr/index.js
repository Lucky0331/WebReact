/* 选择收货地址 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import Luo from "iscroll-luo";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================
import { Icon, WingBlank, Toast, Modal, Button } from "antd-mobile";
import Img404 from "../../../../assets/not-found.png";
// ==================
// 本页面所需action
// ==================

import { getAddrList, saveShopAddr } from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================

const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pageNum: 1,
      pageSize: 10
    };
  }

  componentDidMount() {
    document.title = "选择收货地址";
    this.getData();
  }

  getData(pageNum = 1, pageSize = 10, type = "flash") {
    Toast.loading("请稍后…");
    const params = {
      pageNum,
      pageSize
    };
    this.props.actions
      .getAddrList(params)
      .then(res => {
        if (res.status === 200) {
          // 查询成功
          if (res.data && res.data.result) {
            // 查询成功并且有数据
            this.setState({
              data:
                type === "flash"
                  ? res.data.result
                  : [...this.state.data, ...res.data.result],
              pageNum,
              pageSize
            });
          } else {
            // 查询成功但没有数据
            this.setState({
              data: this.state.data
            });
            if (type === "update") {
              Toast.info("没有更多数据了", 1);
            }
          }
        } else {
          // 查询失败
          this.setState({
            data: this.state.data
          });
        }
        Toast.hide();
      })
      .catch(() => {
        this.setState({
          data: this.state.data
        });
        Toast.hide();
      });
  }

  // 下拉刷新
  onDown() {
    this.getData(1, this.state.pageSize, "flash");
  }
  // 上拉加载
  onUp() {
    this.getData(this.state.pageNum + 1, this.state.pageSize, "update");
  }

  // 选择这一个
  onChoseThis(item) {
    // 把所选择的地址存入购买数据
    this.props.actions.saveShopAddr(item);
    setTimeout(() => this.props.history.go(-1));
  }
  getSex(sex) {
    switch (Number(sex)) {
      case 1:
        return "男";
      case 2:
        return "女";
      default:
        return "";
    }
  }
  render() {
    return (
      <div className="page-choseaddr">
        <div className="luo-box">
          <Luo
            id="luo1"
            className="touch-none"
            onPullDownRefresh={() => this.onDown()}
            onPullUpLoadMore={() => this.onUp()}
            iscrollOptions={{
              disableMouse: true
            }}
          >
            <ul className="list">
              {this.state.data.length ? (
                this.state.data.map((item, index) => {
                  return (
                    <li key={index} onClick={() => this.onChoseThis(item)}>
                      <WingBlank>
                        <div className="name">
                          {item.contact}
                          <kbd style={{ marginLeft: "5px" }}>
                            {this.getSex(item.sex)}
                          </kbd>
                          <span>{item.mobile}</span>
                        </div>
                        <div className="addr">{`${item.province ||
                          ""}${item.city || ""}${item.region || ""}${
                          item.street
                        }`}</div>
                        <div className="page-flex-row controls">
                          {item.defaultAddress ? (
                            <div className="page-flex-row flex-ai-center">
                              <Icon
                                className={"icon check"}
                                type="check-circle"
                              />{" "}
                              默认地址
                            </div>
                          ) : null}
                        </div>
                      </WingBlank>
                    </li>
                  );
                })
              ) : (
                <li key={0} className="data-nothing">
                  <img src={Img404} />
                  <div>亲，这里什么也没有哦~</div>
                </li>
              )}
            </ul>
          </Luo>
        </div>
        <div className="page-footer">
          <Button
            type="primary"
            onClick={() => this.props.history.push("/my/addr")}
          >
            管理收货地址
          </Button>
        </div>
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
  actions: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({ getAddrList, saveShopAddr }, dispatch)
  })
)(HomePageContainer);
