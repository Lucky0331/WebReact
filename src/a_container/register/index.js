/* 注册页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import tools from "../../util/all";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================
import { Checkbox, Modal, Button, Toast } from "antd-mobile";
import ImgPhone from "../../assets/phone@3x.png";
import ImgMima from "../../assets/mima@3x.png";
import ImgYZ from "./assets/yanzheng@3x.png";
// ==================
// 本页面所需action
// ==================

import {
  getVerifyCode,
  checkMobile,
  register
} from "../../a_action/app-action";

// ==================
// Definition
// ==================
const AgreeItem = Checkbox.AgreeItem;
const operation = Modal.operation;
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formChecked: false, // 表单：协议checkbox是否选中
      modalShow: false, // 模态框是否选中
      phone: "", // 表单phone
      vcode: "", // 表单验证码值
      verifyCode: false, // 获取验证码按钮是否正在冷却
      verifyCodeInfo: "获取验证码", // 获取验证码按钮显示的内容
      password: "", // 表单password
      modalCodeShow: false, // 验证码Modal是否显示
      myVcode: "" // 后台传来的验证码信息
    };
    this.timer = null; // 获取验证码的tiemr
  }

  componentDidMount() {
    document.title = "注册";
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // 协议checkbox被点击
  onFormChecked(e) {
    setTimeout(() => {
      this.setState({
        formChecked: e.target.checked
      });
    }, 16);
  }

  // 协议被点击，模态框出现
  onModalShow() {
    this.setState({
      modalShow: true
    });
  }

  // 协议模态框关闭
  onModalClose() {
    this.setState({
      modalShow: false
    });
  }

  // 验证码模态框关闭
  onModalCodeClose() {
    this.setState({
      modalCodeShow: false
    });
  }

  // 表单phone输入时
  onPhoneInput(e) {
    const v = tools.trim(e.target.value);
    if (v.length <= 11) {
      this.setState({
        phone: v
      });
    }
  }

  // 表单vcode输入时
  onVcodeInput(e) {
    const v = tools.trim(e.target.value);
    if (v.length <= 6) {
      this.setState({
        vcode: v
      });
    }
  }

  // 表单password
  onPasswordInput(e) {
    const v = tools.trim(e.target.value);
    if (v.length <= 20) {
      this.setState({
        password: v
      });
    }
  }

  // 点击获取验证码按钮
  getVerifyCode() {
    const me = this;
    let time = 30;
    me.setState({
      verifyCode: true,
      verifyCodeInfo: `${time}秒后重试`
    });
    me.timer = setInterval(() => {
      time--;
      me.setState({
        // verifyCodeTimer: time,
        verifyCodeInfo: time > 0 ? `${time}秒后重试` : "获取验证码",
        verifyCode: time > 0
      });
      if (time <= 0) {
        clearInterval(me.timer);
      }
    }, 1000);

    me.props.actions
      .getVerifyCode({ mobile: this.state.phone, countryCode: "86" })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            modalCodeShow: true,
            myVcode: res.data.text
          });
        } else {
          Toast.info(res.message || "验证码获取失败", 1);
        }
      });
  }

  // 提交
  onSubmit() {
    if (!tools.checkPhone(this.state.phone)) {
      Toast.info("请输入正确的手机号", 1);
      return;
    } else if (!this.state.password || this.state.password.length < 6) {
      Toast.info("请输入6位以上的密码", 1);
      return;
    } else if (!this.state.formChecked) {
      Toast.info("请勾选翼猫服务条款", 1);
      return;
    }
    this.submiting().then(res => {
      if (res) {
        Toast.success("注册成功", 1);
        this.props.history.push("/login");
      }
    });
  }

  async submiting() {
    const res1 = await this.props.actions.checkMobile({
      mobile: this.state.phone
    });
    console.log("第1阶段返回：", res1);
    if (res1.status === 200) {
      if (!res1.data.register) {
        const params = {
          mobile: this.state.phone,
          password: this.state.password,
          countryCode: "86",
          verifyCode: this.state.vcode,
          loginIp:
            typeof returnCitySN !== "undefined" ? returnCitySN["cip"] : ""
        };
        const res2 = await this.props.actions.register(params);
        if (res2.status === 200) {
          return true;
        } else {
          Toast.info(res2.message || "注册失败", 1);
          return false;
        }
      } else {
        Toast.info("该手机已注册", 1);
        return false;
      }
    } else {
      Toast.info(res1.message || "手机校验失败", 1);
      return false;
    }
  }

  render() {
    return (
      <div className="flex-auto page-box page-register">
        <div className="login-box">
          <div className="input-box">
            <div className="t">
              <img src={ImgPhone} />
              <span>+86</span>
            </div>
            <div className="line" />
            <div className="i">
              <input
                placeholder="请输入手机号码"
                type="tel"
                value={this.state.phone}
                onInput={e => this.onPhoneInput(e)}
              />
            </div>
          </div>
          <div className="input-box">
            <div className="t">
              <img src={ImgYZ} />
            </div>
            <div className="line2" />
            <div className="i">
              <input
                placeholder="请输入您的验证码"
                type="text"
                pattern="[0-9]*"
                value={this.state.vcode}
                onInput={e => this.onVcodeInput(e)}
              />
            </div>
            <div className="btn-box">
              <Button
                type="primary"
                disabled={
                  this.state.verifyCode || !tools.checkPhone(this.state.phone)
                }
                className="btn"
                onClick={() => this.getVerifyCode()}
              >
                {this.state.verifyCodeInfo}
              </Button>
            </div>
          </div>
          <div className="input-box">
            <div className="t">
              <img src={ImgMima} />
            </div>
            <div className="line2" />
            <div className="i">
              <input
                placeholder="请输入您的密码"
                type="password"
                maxLength="20"
                value={this.state.password}
                onInput={e => this.onPasswordInput(e)}
              />
            </div>
          </div>
          <div className="input-box2">
            <AgreeItem
              className="agree-item"
              checked={this.state.formChecked}
              onChange={e => this.onFormChecked(e)}
            >
              我已阅读并接受
              <a href="javascript:void(0)" onClick={() => this.onModalShow()}>
                《翼猫科技服务条款》
              </a>
            </AgreeItem>
          </div>
          <button
            className="this-btn all_trans"
            onClick={() => this.onSubmit()}
          >
            确认
          </button>
        </div>
        <Modal
          visible={this.state.modalShow}
          title="用户注册协议"
          className="all_modal xieyi"
          transparent
          closable
          onClose={() => this.onModalClose()}
        >
          <div>
            <div style={{ padding: "0 15px 15px" }} className="all_warp bodys">
              <span style={{ fontWeight: "bold" }}>
                本协议是您与翼猫健康e家平台（网址：www.yimaokeji.com，微信公众号：翼猫健康e家）（本站）所有者翼猫科技发展（上海）有限公司（以下简称为“翼猫健康e家”）之间就翼猫健康e家平台服务等相关事宜所订立的契约，请您仔细阅读本注册协议，您点击“同意并继续”按钮后，本协议即已经生效，并构成对双方有约束力的法律文件。
              </span>
              <i>一、服务条款的确认和接纳</i>
              <p />
              1.1
              本站的各项电子服务的所有权和运作权归翼猫健康e家所有。您同意所有注册协议条款并完成注册程序，才能成为本站的正式用户。您确认：本协议条款是处理双方权利义务的契约，始终有效，法律另有强制性规定或双方另有特别约定的，依其规定执行。
              <p />
              1.2
              您点击同意本协议的，即视为您确认自己具有享受本站服务、下单购物等相应的权利能力和行为能力，能够独立承担法律责任。
              <p />
              1.3
              如果您在18周岁以下，您只能在父母或监护人的监护参与下才能使用本站。
              <p />
              1.4
              翼猫健康e家保留在中华人民共和国大陆地区相关法律允许的范围内独自决定拒绝提供服务、关闭用户账户、清除或编辑内容或取消订单的权利。
              <i>二、本站服务范围</i>
              <p />
              2.1
              翼猫健康e家通过互联网依法为您提供互联网信息等服务，您在完全同意本协议及本站规定的情况下，方有权使用本站的相关服务。
              <p />
              2.2 您必须自行准备如下设备和承担如下开支：
              <p />
              （1）上网设备，包括并不限于电脑或者其他上网终端、调制解调器及其他必备的上网装置；
              <p />
              （2）上网开支，包括并不限于网络接入费、上网设备租用费、手机流量费等。
              <i>三、用户信息规范</i>
              <p />
              3.1
              您应以诚信、诚实为原则向本站提供注册资料，您应确保提供的注册资料真实、准确、完整、合法有效，您的用户注册资料如有变动的，应及时在本站更新其注册资料。如果您提供的注册资料不合法、不真实、不准确、不详尽的，您需承担因此引起的相应责任及后果，并且翼猫健康e家保留终止您使用本站各项服务的权利。
              <p />
              3.2
              您在本站进行浏览、下单购物等活动时，涉及您真实姓名/名称、通信地址、联系方式、电子邮箱等隐私信息的，本站将予以严格保密，除非得到您的授权或法律另有规定，本站不会向外界披露您的隐私信息。
              <p />
              3.3
              您注册成功后，将产生用户名和密码等账户信息，您可以根据本站规定改变您的密码。您应谨慎合理的保存、使用其用户名和密码。您若发现任何非法使用您的用户账号或存在安全漏洞的情况，请立即通知本站并向公安机关报案。
              <p />
              3.4
              您同意，翼猫健康e家拥有通过邮件、短信电话等形式，向在本站注册用户、购物用户、收货人发送订单信息、促销活动等告知信息的权利。
              <p />
              3.5
              您不得将在本站注册获得的账户借给他人使用，否则您应承担由此产生的全部责任，并与实际使用人承担连带责任。
              <p />
              3.6
              您同意，翼猫健康e家有权使用您的注册信息、用户名、密码等信息，登录进入您的注册账户，进行证据保全等行为，包括但不限于公证、见证等。
              <i>四、用户依法言行义务</i>
              <p />
              本协议依据国家相关法律法规规章制定，您同意严格遵守以下义务：
              <p />
              （1）不得传输或发表反动言论：包括煽动抗拒、破坏宪法和法律、行政法规实施的言论，煽动颠覆国家政权，推翻社会主义制度的言论，煽动分裂国家、破坏国家统一的的言论，煽动民族仇恨、民族歧视、破坏民族团结的言论；
              <p />
              （2）从中国大陆向境外传输资料信息时必须符合中国有关法规；
              <p />
              （3）不得利用本站从事洗钱、窃取商业秘密、窃取个人信息等违法犯罪活动；
              <p />
              （4）不得干扰本站的正常运转，不得侵入本站及国家计算机信息系统；
              <p />
              （5）不得传输或发表任何违法犯罪的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的，淫秽的、不文明的等信息资料；
              <p />
              （6）不得传输或发表损害国家社会公共利益和涉及国家安全的信息资料或言论；
              <p />
              （7）不得教唆他人从事本条所禁止的行为；
              <p />
              （8）不得利用在本站注册的账户进行牟利性经营活动；
              <p />
              （9）不得发布任何侵犯他人著作权、商标权等知识产权或合法权利的内容；
              <p />
              您应密切关注并遵守本站不定期公布或修改的各类合法规则/公告。
              <p />
              本站保有删除站内各类不符合法律政策、本站规则或不真实的信息内容而无须通知您的权利。
              <p />
              若您未遵守以上规定的，本站有权作出独立判断并采取暂停或关闭您的用户帐号等措施。您须对自己在网上的言论和行为承担法律责任。
              <i>五、商品信息</i>
              <p />
              本站上的商品价格、数量、是否有货等商品信息随时都有可能发生变动，本站不作特别通知。由于网站上商品信息的数量极其庞大，虽然本站会尽最大努力保证您所浏览商品信息的准确性，但由于众所周知的互联网技术因素等客观原因存在，本站网页显示的信息可能会有一定的滞后性或差错，对此情形请您知悉并理解；翼猫健康e家欢迎纠错，并会视情况给予纠错者一定的奖励。
              <p />
              为表述便利，商品和服务下方统一简称为“商品”。
              <i>六、订单</i>
              <p />
              6.1
              在您下订单时，请您仔细确认所购商品的名称、价格、数量、型号、规格、尺寸、联系地址、电话、收货人等信息。收货人与您本人不一致的，收货人的行为和意思表示视为您的行为和意思表示，您应对收货人的行为及意思表示的法律后果承担连带责任。
              <p />
              6.2
              除法律另有强制性规定外，本站与您的双方约定如下：本站上所有商家（下文简称：“商家”）展示的商品和价格等信息仅仅是要约邀请，您下单时须填写您希望购买的商品数量、价款及支付方式、收货人、联系方式、收货地址（合同履行地点）、合同履行方式等内容；系统生成的订单信息是计算机信息系统根据您填写的内容自动生成的数据，仅是您向商家发出的合同要约；商家收到您的订单信息后，只有在商家将您在订单中订购的商品从仓库实际直接向您发出时（以商品出库为标志），方视为您与商家之间就实际直接向您发出的商品建立了合同关系；如果您在一份订单里订购了多种商品并且商家只给您发出了部分商品时，您与商家之间仅就实际直接向您发出的商品建立了合同关系；只有在商家实际直接向您发出了订单中订购的其他商品时，您和商家之间就订单中该其他已实际直接向您发出的商品才成立合同关系。您可以随时登录您在本站注册的用户账户，查询您的订单状态。
              <p />
              6.3
              由于市场变化及各种以合理商业变化导致难以控制因素的影响，本站无法保证您提交的订单信息中希望购买的商品都会有货；如您拟购买的商品，发生缺货，您有权取消订单。
              <i>七、配送</i>
              <p />
              7.1
              商家将会把商品送到您所指定的收货地址，所有在本站上列出的送货时间为参考时间，参考时间的计算是根据库存状况、正常的处理过程和送货时间、送货地点的基础上估计得出的。
              <p />
              7.2 因如下情况造成订单延迟或无法配送等，商家不承担延迟配送的责任：
              <p />
              （1）您提供的信息错误、地址不详细等原因导致的；
              <p />
              （2）货物送达后无人签收，导致无法配送或延迟配送的；
              <p />
              （3）情势变更因素导致的；
              <p />
              （4）不可抗力因素导致的，例如：自然灾害、交通戒严、突发战争等。
              <i>八、所有权及知识产权条款</i>
              <p />
              8.1
              您一旦接受本协议，即表明您主动将其在任何时间段在本站发表的任何形式的信息内容（包括但不限于评价、咨询、各类话题文章等信息内容）的财产性权利等任何可转让的权利，如著作权财产权（包括并不限于：复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权以及应当由著作权人享有的其他可转让权利），全部独家且不可撤销地转让给翼猫健康e家所有，您同意翼猫健康e家有权就任何主体侵权而单独提起诉讼。
              <p />
              8.2
              本协议已经构成《中华人民共和国著作权法》第二十五条（条文序号依照2011年版著作权法确定）及相关法律规定的著作财产权等权利转让书面协议，其效力适用于您在翼猫健康e家网站上发布的任何受著作权法保护的作品内容，无论内容形成于本协议订立前还是本协议订立后。
              <p />
              8.3
              您同意并已充分了解本协议的条款，承诺不将已发表于本站的信息，以任何形式发布或授权其它主体以任何方式使用（包括但不限于在各类网站、媒体上使用）。
              <p />
              8.4
              翼猫健康e家是本站的制作者,拥有此网站内容及资源的著作权等合法权利,受国家法律保护,有权不时地对本协议及本站的内容进行修改，并在本站张贴，无须另行通知您。在法律允许的最大限度范围内，翼猫健康e家对本协议及本站内容拥有解释权。
              <p />
              8.5
              除法律另有强制性规定外，未经翼猫健康e家书面明确许可,任何单位或个人不得以任何方式非法地全部或部分复制、转载、引用、链接、抓取或以其他方式使用本站的信息内容，否则，翼猫健康e家有权追究其法律责任。
              <p />
              8.6
              本站所刊登的资料信息（诸如文字、图表、标识、按钮图标、图像、声音文件片段、数字下载、数据编辑和软件），均是翼猫健康e家或其内容提供者的财产，受中国和国际版权法的保护。本站上所有内容的汇编是翼猫健康e家的排他财产，受中国和国际版权法的保护。本站上所有软件都是翼猫健康e家或其关联公司或其软件供应商的财产，受中国和国际版权法的保护。
              <i>九、责任限制及不承诺担保</i>
              <p />
              除非另有明确的书面说明,本站及其所包含的或以其它方式通过本站提供给您的全部信息、内容、材料、产品（包括软件）和服务，均是在“按现状”和“按现有”的基础上提供的。
              <p />
              除非另有明确的书面说明,翼猫健康e家不对本站的运营及其包含在本网站上的信息、内容、材料、产品（包括软件）或服务作任何形式的、明示或默示的声明或担保（根据中华人民共和国法律另有规定的以外）。
              <p />
              翼猫健康e家不担保本站所包含的或以其它方式通过本站提供给您的全部信息、内容、材料、产品（包括软件）和服务、其服务器或从本站发出的电子信件、信息没有病毒或其他有害成分。
              <p />
              如因不可抗力或其它本站无法控制的原因使本站销售系统崩溃或无法正常使用导致网上交易无法完成或丢失有关的信息、记录等，翼猫健康e家不承担任何责任。翼猫健康e家会合理地尽力协助处理善后事宜。
              <i>十、协议更新及用户关注义务</i>
              <p />
              根据国家法律法规变化及网站运营需要，翼猫健康e家有权对本协议条款不时地进行修改，修改后的协议一旦被张贴在本站上即时生效，并代替原来的协议。您可随时登录查阅最新协议；您有义务不时关注并阅读最新版的协议及网站公告。如您不同意更新后的协议，可以且应立即停止接受翼猫健康e家网站依据本协议提供的服务；如您继续使用本网站提供的服务的，即视为同意更新后的协议。翼猫健康e家建议您在使用本站之前阅读本协议及本站的公告。如果本协议中任何一条被视为废止、无效或因任何理由不可执行，该条应视为可分的且并不影响任何其余条款的有效性和可执行性。
              <i>十一、法律管辖和适用</i>
              <p />
              11.1、本协议的订立、执行和解释及争议的解决均应适用中国法律。如双方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，任何一方均可向协议签订地人民法院提起诉讼。本协议签订地为中华人民共和国上海市嘉定区。
              <p />
              11.2、如果本协议中任何一条被视为废止、无效或因任何理由不可执行，该条应视为可分的且并不影响任何其余条款的有效性和可执行性。
              <p />
              11.3、本协议未明示授权的其他权利仍由翼猫健康e家保留，您在行使这些权利时须另外取得翼猫健康e家的书面许可。翼猫健康e家如果未行使前述任何权利，并不构成对该权利的放弃。
              <p />
              11.4、本协议内容中以加粗方式显著标识的条款，请您着重阅读。您点击“同意”按钮即视为您完全接受本协议，在点击之前请您再次确认已知悉并完全理解本协议的全部内容。
              <i>十二、其他</i>
              <p />
              12.1 本站所有者是指在政府部门依法许可或备案的本站经营主体。
              <p />
              12.2
              翼猫健康e家尊重用户和消费者的合法权利，本协议及本网站上发布的各类规则、声明等其他内容，均是为了更好的、更加便利的为您和商家提供服务。本站欢迎您和社会各界提出意见和建议，翼猫健康e家将虚心接受并适时修改本协议及本站上的各类规则。
              <p />
              12.3
              您点击本协议下方的“同意并继续”按钮即视为您完全接受本协议，在点击之前请您再次确认已知悉并完全理解本协议的全部内容。
            </div>
            <div className="modal-footer">
              <div onClick={() => this.onModalClose()}>确定</div>
            </div>
          </div>
        </Modal>
        {/*<Modal*/}
        {/*visible={this.state.modalCodeShow}*/}
        {/*title="验证码"*/}
        {/*className="all_modal"*/}
        {/*transparent*/}
        {/*closable*/}
        {/*onClose={()=> this.onModalCodeClose()}*/}
        {/*>*/}
        {/*<div>*/}
        {/*<p style={{ padding: "0 15px 15px" }}>{this.state.myVcode}</p>*/}
        {/*<div className="modal-footer">*/}
        {/*<div onClick={() => this.onModalCodeClose()}>确定</div>*/}
        {/*</div>*/}
        {/*</div>*/}
        {/*</Modal>*/}
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Register.propTypes = {
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
      { getVerifyCode, checkMobile, register },
      dispatch
    )
  })
)(Register);
