/* 我的e家 - 个人主页 - 收货地址/现在商品中选择收货地址也是这个 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../../../util/all";
import Luo from "iscroll-luo";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================
import { Button, Icon, WingBlank, Toast, Modal } from "antd-mobile";
import ImgDel from "../../../../assets/shanchu@3x.png";
import ImgUp from "../../../../assets/bianji@3x.png";
import Img404 from "../../../../assets/not-found.png";
// ==================
// 本页面所需action
// ==================

import {
  getAddrList,
  delAddr,
  onSaveUpAddrNow,
  setDefaultAddr,
  saveShopAddr
} from "../../../../a_action/shop-action";

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
      pageSize: 10,
      type: 1 // 1正常的管理地址，2从商品进来的选择收货地址
    };
  }

  componentDidMount() {
    document.title = "收货地址";
    this.getData();
    const p = this.props.location.pathname.split("/").pop();
    this.setState({
      type: Number(p) || 1
    });
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
            if (type === "update") {
              this.setState({
                data: this.state.data
              });
              Toast.info("没有更多数据了", 1);
            } else {
              this.setState({
                data: []
              });
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

  // 删除
  onDel(e, item) {
    e.stopPropagation();
    alert("删除地址", "确定删除该地址吗？", [
      { text: "取消", onPress: () => console.log("cancel") },
      {
        text: "确定",
        onPress: () =>
          new Promise((resolve, rej) => {
            Toast.loading("请稍后…");
            this.props.actions
              .delAddr({ id: item.id })
              .then(res => {
                if (res.status === 200) {
                  Toast.info("删除成功", 1);
                  this.onDown();
                } else {
                  Toast.info(res.message || "删除失败");
                }
                resolve();
              })
              .catch(() => {
                Toast.hide();
                rej();
              });
          })
      }
    ]);
  }

  // 修改
  onUpDate(e, item) {
    e.stopPropagation();
    this.props.actions.onSaveUpAddrNow(item);
    setTimeout(() => this.props.history.push("/my/upaddr"));
  }

  // 设置默认地址
  onSetDefault(e, item) {
    e.stopPropagation();
    if (item.defaultAddress) {
      return;
    }
    alert("设置默认地址", "确定设置该地址为默认吗？", [
      { text: "取消", onPress: () => console.log("cancel") },
      {
        text: "确定",
        onPress: () =>
          new Promise((resolve, rej) => {
            Toast.loading("请稍后…");
            this.props.actions
              .setDefaultAddr({ addressId: item.id })
              .then(res => {
                if (res.status === 200) {
                  Toast.info("设置成功", 1);
                  this.onDown();
                } else {
                  Toast.info(res.message || "设置失败");
                }
                resolve();
              })
              .catch(() => {
                Toast.hide();
                rej();
              });
          })
      }
    ]);
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

  // 选择这一个
  onChoseThis(item) {
    if (this.state.type === 2) {
      // 把所选择的地址存入购买数据
      this.props.actions.saveShopAddr(item);
      setTimeout(() => this.props.history.go(-1));
    }
  }

  render() {
    return (
      <div className="addr-page">
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
                          <div
                            className="page-flex-row flex-ai-center"
                            onClick={e => this.onSetDefault(e, item)}
                          >
                            <Icon
                              className={
                                item.defaultAddress
                                  ? "icon check"
                                  : "icon no-check"
                              }
                              type="check-circle"
                            />{" "}
                            默认地址
                          </div>
                          <div className="flex-auto btns page-flex-row flex-jc-end">
                            <div
                              className="page-flex-row flex-ai-center"
                              onClick={e => this.onUpDate(e, item)}
                            >
                              <img src={ImgUp} />
                              编辑
                            </div>
                            <div
                              className="page-flex-row flex-ai-center"
                              onClick={e => this.onDel(e, item)}
                            >
                              <img src={ImgDel} />
                              删除
                            </div>
                          </div>
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
            onClick={() => this.props.history.push("/my/newaddr")}
          >
            添加收货地址
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
    actions: bindActionCreators(
      { getAddrList, delAddr, onSaveUpAddrNow, setDefaultAddr, saveShopAddr },
      dispatch
    )
  })
)(HomePageContainer);
