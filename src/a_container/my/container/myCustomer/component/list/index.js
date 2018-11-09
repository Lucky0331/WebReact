/**列表li的样式
 * 目前分为：
 * 分销用户： distribution 有分销权按钮提示等
 * 未绑定用户： unbind 只显示手机号等
 * 其他用户： normal 无分销权按钮
 * */
import React from "react";
import P from "prop-types";
import "./index.scss";
import tools from "../../../../../../util/all";
import ImgDefault from "../../../../../../assets/default-head.jpg";
import ImgA1 from "../../../../../../assets/one_yikatong@3x.png";
import ImgA2 from "../../../../../../assets/two_yikatong@3x.png";
import ImgB1 from "../../../../../../assets/one_jingshui@3x.png";
import ImgB2 from "../../../../../../assets/two_jingshui@3x.png";
import ImgC1 from "../../../../../../assets/one_shipin@3x.png";
import ImgC2 from "../../../../../../assets/two_shipin@3x.png";
import ImgD1 from "../../../../../../assets/one_liliao@3x.png";
import ImgD2 from "../../../../../../assets/two_liliao@3x.png";
import ImgE1 from "../../../../../../assets/one_pingguka@3x.png";
import ImgE2 from "../../../../../../assets/two_pingguka@3x.png";
import ImgR from "../../../../../../assets/xiangyou@3x.png";
import IconUp from "../../../../../../assets/pen@3x.png";
import IcomStar1 from "../../../../../../assets/home/star_1@3x.png";
import IcomStar05 from "../../../../../../assets/home/star_0.5@3x.png";
import IcomStar0 from "../../../../../../assets/home/star_0@3x.png";
import { Picker, Modal } from "antd-mobile";
const prompt = Modal.prompt;
class List extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 主账号子账号点击要查下一层
  onCallBack() {
    this.props.onCallBack && this.props.onCallBack(this.props.data);
  }

  // 问号被点击
  onQue(d) {
    this.props.onQueClick && this.props.onQueClick(d);
  }

  //  1-智能净水,2-健康食品,3-生物科技,4-健康睡眠,5-健康体检
  makePower(str) {
    const res = [];
    const s = str ? str.split(",") : [];
    res.push(
      s.includes("1") ? (
        <img key={0} src={ImgB1} />
      ) : (
        <img key={0} src={ImgB2} />
      )
    );
    res.push(
      s.includes("2") ? (
        <img key={1} src={ImgC1} />
      ) : (
        <img key={1} src={ImgC2} />
      )
    );
    res.push(
      s.includes("3") ? (
        <img key={2} src={ImgD1} />
      ) : (
        <img key={2} src={ImgD2} />
      )
    );
    res.push(
      s.includes("5") ? (
        <img key={3} src={ImgE1} />
      ) : (
        <img key={3} src={ImgE2} />
      )
    );
    return res;
  }

  onBeizhu(str) {
    prompt(
      "输入新备注",
      "",
      [
        { text: "取消" },
        {
          text: "确定",
          onPress: value => {
            const v = tools.trim(value);
            if (!v) {
              Toast.info("备注不能为空", 1);
              return false;
            }
            if (!tools.checkStr(v)) {
              Toast.info("只能输入汉字/字母/数字", 1);
              return false;
            }
            this.props.onChangeBeiZhu &&
              this.props.onChangeBeiZhu(this.props.data, v);
          }
        }
      ],
      null,
      str
    );
  }

  onChangeStar(e) {
    console.log("传来了个什么啊：", e);
    this.props.onChangeStar && this.props.onChangeStar(this.props.data, e[0]);
  }

  makeDom(u, type) {
    if (!u || u.id === undefined) {
      return null;
    }
    switch (type) {
      // 分销客户
      case "share":
        return (
          <li
            className="customer-li page-flex-row"
            onClick={() => this.onCallBack()}
          >
            <div className="photo flex-none">
              <img src={u.headImg || ImgDefault} />
            </div>
            <div className="name flex-auto">
              <div className="title all_nowarp">
                {u.nickName}
                <span>{u.ambassadorTime}</span>
              </div>
              <div
                className="lit black"
                onClick={() =>
                  this.onBeizhu(u.userAsterisk && u.userAsterisk.aliasName)
                }
              >
                备注：
                <span>
                  {u.userAsterisk && u.userAsterisk.aliasName
                    ? u.userAsterisk.aliasName
                    : "添加"}
                </span>
                <img className="up" src={IconUp} />
              </div>
              <div className="lit black">
                e家号：
                {u.id}
              </div>
              <div className="lit black">
                联系方式：
                <a href={`tel:${u.mobile || ""}`}>{u.mobile || ""}</a>
              </div>
              <Picker
                data={[
                  { label: "0星", value: 0 },
                  { label: "1星", value: 1 },
                  { label: "2星", value: 2 },
                  { label: "3星", value: 3 },
                  { label: "4星", value: 4 },
                  { label: "5星", value: 5 }
                ]}
                cols={1}
                onChange={e => this.onChangeStar(e)}
              >
                <div className="lit black star">
                  星级标注：
                  {(() => {
                    const m = [];
                    for (let i = 0; i < 5; i++) {
                      if (
                        i <
                        (u.userAsterisk && u.userAsterisk.asteriskLevel
                          ? u.userAsterisk.asteriskLevel
                          : 0)
                      ) {
                        m.push(<img key={i} src={IcomStar1} />);
                      } else {
                        m.push(<img key={i} src={IcomStar0} />);
                      }
                    }
                    return m;
                  })()}
                  <img src={IconUp} />
                </div>
              </Picker>
            </div>
          </li>
        );
      case "distribution":
        return (
          <li
            className="customer-li page-flex-row"
            onClick={() => this.onCallBack()}
          >
            <div className="photo flex-none">
              <img src={u.headImg || ImgDefault} />
            </div>
            <div className="name flex-auto">
              <div className="title all_nowarp">
                {u.nickName}
                <span>{u.ambassadorTime}</span>
              </div>
              <div
                className="lit black"
                onClick={() =>
                  this.onBeizhu(u.userAsterisk && u.userAsterisk.aliasName)
                }
              >
                备注：
                <span>
                  {u.userAsterisk && u.userAsterisk.aliasName
                    ? u.userAsterisk.aliasName
                    : "添加"}
                </span>
                <img className="up" src={IconUp} />
              </div>
              <div className="lit black">
                e家号：
                {u.id}
              </div>
              <div className="lit black">
                联系方式：
                <a href={`tel:${u.mobile || ""}`}>{u.mobile || ""}</a>
              </div>
              <Picker
                data={[
                  { label: "0星", value: 0 },
                  { label: "1星", value: 1 },
                  { label: "2星", value: 2 },
                  { label: "3星", value: 3 },
                  { label: "4星", value: 4 },
                  { label: "5星", value: 5 }
                ]}
                cols={1}
                onChange={e => this.onChangeStar(e)}
              >
                <div className="lit black star">
                  星级标注：
                  {(() => {
                    const m = [];
                    for (let i = 0; i < 5; i++) {
                      if (
                        i <
                        (u.userAsterisk && u.userAsterisk.asteriskLevel
                          ? u.userAsterisk.asteriskLevel
                          : 0)
                      ) {
                        m.push(<img key={i} src={IcomStar1} />);
                      } else {
                        m.push(<img key={i} src={IcomStar0} />);
                      }
                    }
                    return m;
                  })()}
                  <img src={IconUp} />
                </div>
              </Picker>
              <div className="lit fxq">
                <span className="que" onClick={() => this.onQue(u)}>
                  ?
                </span>
                分销权：
                <div>{this.makePower(u.incomePermission)}</div>
              </div>
            </div>
          </li>
        );
      case "unbind":
        return (
          <li
            className="customer-li page-flex-row"
            onClick={() => this.onCallBack()}
          >
            <div className="photo flex-none">
              <img src={u.headImg || ImgDefault} />
            </div>
            <div className="name flex-auto">
              <div className="title all_nowarp">{u.nickName}</div>
              <div className="lit black">
                联系方式：
                <a href={`tel:${u.mobile || ""}`}>{u.mobile || ""}</a>
              </div>
              <div className="lit">身份：未绑定用户</div>
            </div>
          </li>
        );
      default:
        return (
          <li
            className="customer-li page-flex-row"
            onClick={() => this.onCallBack()}
          >
            <div className="photo flex-none">
              <img src={u.headImg || ImgDefault} />
            </div>
            <div className="name flex-auto">
              <div className="all_nowarp">{u.nickName}</div>
              <div className="lit black">
                e家号：
                {u.id}
              </div>
              <div className="lit">
                身份：
                {tools.getNameByUserType(u.userType)}
                <span style={{ float: "right" }}>{u.ambassadorTime}</span>
              </div>
            </div>
            {this.props.jiantou ? <img className="r" src={ImgR} /> : null}
          </li>
        );
    }
  }

  render() {
    return this.makeDom(this.props.data, this.props.type);
  }
}

List.propTypes = {
  type: P.string,
  data: P.any,
  jiantou: P.bool,
  onCallBack: P.func,
  onQueClick: P.func,
  onChangeStar: P.func, // 星标改变回调
  onChangeBeiZhu: P.func // 修改备注名称
};

export default List;
