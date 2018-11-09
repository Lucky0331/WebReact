/* 我的e家 - 主页 - 个人主页 可以修改个人信息 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import Config from "../../../../config";
import P from "prop-types";
import tools from "../../../../util/all";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================
import { Button, Toast, Modal, Picker } from "antd-mobile";
import { Upload } from "antd";
import ImgRight from "../../../../assets/xiangyou@3x.png";
import defaultPic from "../../../../assets/default-head.jpg";
// ==================
// 本页面所需action
// ==================

import { getUserInfo, updateUserInfo } from "../../../../a_action/app-action";

// ==================
// Definition
// ==================
const prompt = Modal.prompt;
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.title = "基本信息";
    if (!this.props.userinfo) {
      this.getUserInfo();
    }
  }

  // 获取当前登录用户的相关信息
  getUserInfo() {
    const openId = sessionStorage.getItem("openId");
    if (openId) {
      this.props.actions.getUserInfo({ openId });
    }
  }

  // 上传头像状态
  onUploadChange(obj) {
    if (obj.file.status === "done") {
      // 上传成功后更新用户信息
      // this.updateUserInfo({headImg: obj.file.response.data.imageUrl});
      Toast.loading("上传成功", 1);
      this.getUserInfo();
    } else if (obj.file.status === "uploading") {
      Toast.loading("上传中...", 0);
    } else {
      Toast.info("上传失败", 1);
    }
  }

  // 修改昵称出现
  onUpName() {
    prompt("输入新昵称", "", [
      { text: "取消" },
      {
        text: "确定",
        onPress: value => {
          const v = tools.trim(value);
          if (!v) {
            Toast.info("昵称不能为空", 1);
            return false;
          }
          if (!tools.checkStr(v)) {
            Toast.info("只能输入汉字/字母/数字", 1);
            return false;
          }
          this.updateUserInfo({ nickName: v });
        }
      }
    ]);
  }

  // 修改性别
  onUpSex(v) {
    this.updateUserInfo({ sex: Number(v) });
  }

  // 修改用户信息
  updateUserInfo(obj) {
    const u = this.props.userinfo;
    if (!u) {
      Toast.info("未获取到用户信息", 1);
      return false;
    }

    Toast.loading("修改中...", 0);
    const params = Object.assign({}, u, obj);
    this.props.actions
      .updateUserInfo(params)
      .then(res => {
        Toast.info("修改成功", 1);
        if (res.status === 200) {
          this.getUserInfo();
        }
      })
      .catch(() => {
        Toast.hide();
      });
  }

  render() {
    const u = this.props.userinfo;
    const openId = sessionStorage.getItem("openId");
    return (
      <div className="page-per-info">
        {/* 下方各横块 */}
        <div className="bar-list">
          <Upload
            name="image"
            withCredentials
            showUploadList={false}
            data={openId ? { openId } : null}
            action={`${Config.baseURL}/app/upload/headImg`}
            style={{ width: "100vw", display: "block" }}
            beforeUpload={(file, fileList) => {
              console.log("都有些什么：", file, fileList);
            }}
            onChange={obj => this.onUploadChange(obj)}
          >
            <div className="item page-flex-row all_active">
              <div className="title">头像</div>
              <div className="photo">
                <img src={u && u.headImg ? u.headImg : defaultPic} />
              </div>
              <div className="line" />
            </div>
          </Upload>
          <div
            className="item page-flex-row all_active"
            onClick={() => this.onUpName()}
          >
            <div className="title">昵称</div>
            <div className="info">{u ? u.nickName : " "}</div>
            <div className="arrow">
              <img src={ImgRight} />
            </div>
            <div className="line" />
          </div>
          <Picker
            data={[{ label: "男", value: "1" }, { label: "女", value: "0" }]}
            cols={1}
            onOk={v => this.onUpSex(v)}
          >
            <div className="item page-flex-row all_active">
              <div className="title">性别</div>
              <div className="info">
                {u ? (String(u.sex) === "1" ? "男" : "女") : " "}
              </div>
              <div className="arrow">
                <img src={ImgRight} />
              </div>
            </div>
          </Picker>
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
  actions: P.any,
  userinfo: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    userinfo: state.app.userinfo
  }),
  dispatch => ({
    actions: bindActionCreators({ getUserInfo, updateUserInfo }, dispatch)
  })
)(HomePageContainer);
