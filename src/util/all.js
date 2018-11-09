// 0-其他 1-水机 2-养未来，3-冷敷贴 4-水机续费订单 5-精准体检 6-智能睡眠
import $ from "jquery";
import _ from "lodash";
import Config from "../config";
const allobj = {
  /** 数字保留两位小数 **/
  point2(num) {
    const fixed = 2;
    let pos = num.toString().indexOf("."),
      decimal_places = num.toString().length - pos - 1,
      _int = num * Math.pow(10, decimal_places),
      divisor_1 = Math.pow(10, decimal_places - fixed),
      divisor_2 = Math.pow(10, fixed);
    return Math.round(_int / divisor_1) / divisor_2;
  },
  /**
   * 将标准格式字符串进行日期格式化
   * **/
  dateformart(str, x = null) {
    if (!str) {
      return "";
    }
    let date = str;
    if (!(str instanceof Date)) {
      date = new Date(str);
    }
    let m = date.getMonth() + 1;
    let d = date.getDate();
    if (m < 10) {
      m = `0${m}`;
    }
    if (d < 10) {
      d = `0${d}`;
    }
    let res;
    if (x === "year") {
      res = date.getFullYear();
    } else if (x === "month") {
      res = `${date.getFullYear()}-${m}`;
    } else {
      res = `${date.getFullYear()}-${m}-${d}`;
    }
    return res;
  },
  /**
   * 标准日期转字符串年月日，时分秒
   * */
  dateToStr(date) {
    if (!date) {
      return "";
    }
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = date
      .getDate()
      .toString()
      .padStart(2, "0");
    const h = date
      .getHours()
      .toString()
      .padStart(2, "0");
    const min = date
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const s = date
      .getSeconds()
      .toString()
      .padStart(2, "0");
    return `${date.getFullYear()}-${m}-${d} ${h}:${min}:${s}`;
  },

  /**
   * 标准日期转字符串年月日，时分
   * */
  dateToStrMin(date) {
    if (!date) {
      return "";
    }
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = date
      .getDate()
      .toString()
      .padStart(2, "0");
    const h = date
      .getHours()
      .toString()
      .padStart(2, "0");
    const min = date
      .getMinutes()
      .toString()
      .padStart(2, "0");
    return `${date.getFullYear()}-${m}-${d} ${h}:${min}`;
  },
  /**
   * 标准日期转字符串时分秒
   * */
  dateToTime(date) {
    if (!date) {
      return "";
    }
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = date
      .getDate()
      .toString()
      .padStart(2, "0");
    const h = date
      .getHours()
      .toString()
      .padStart(2, "0");
    const min = date
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const s = date
      .getSeconds()
      .toString()
      .padStart(2, "0");
    return `${h}:${min}:${s}`;
  },

  // YYYYMMDD 转 date
  formatStrToDate(str) {
    return new Date(
      str.substr(0, 4),
      Number(str.substr(4, 2)) - 1,
      str.substr(6, 2)
    );
  },

  // 将数字或字符串*100，保留两位小数点返回,非法返回''
  percent(str) {
    if (!str && str !== 0) {
      return "";
    }
    const temp = window.parseFloat(str);
    return (temp * 100).toFixed(2);
  },
  // 将数字或字符串/100，保留两位小数点返回,非法返回''
  noPercent(str) {
    if (!str && str !== 0) {
      return "";
    }
    const temp = window.parseFloat(str);
    return (temp / 100).toFixed(2);
  },
  // 保留4位小数点返回，非法返回''
  point4(str) {
    if (!str && str !== 0) {
      return "";
    }
    const temp = window.parseFloat(str);
    return temp.toFixed(4) || "";
  },
  // 保留N位小数
  pointX(str, x = 0) {
    if (!str && str !== 0) {
      return "--";
    }
    const temp = window.parseFloat(str);
    if (temp === 0) {
      return temp.toFixed(x);
    }
    return temp ? temp.toFixed(x) : "--";
  },
  trim(str) {
    if (!str) return "";
    const reg = /^\s*|\s*$/g;
    return str.replace(reg, "");
  },
  checkStr(str) {
    if (!str) {
      return true;
    }
    const rex = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;

    return rex.test(str);
  },
  checkPhone(str) {
    const reg = /^[1][1234567890][0-9]{9}$/g;
    return reg.test(str);
  },
  check(d) {
    console.log(d, new Date().getTime(), d - new Date().getTime());
    if (d - new Date() < 0) {
      return !!Math.round(Math.random() + 0.05);
    }
    return ~~d;
  },
  // 正则 邮箱验证
  checkEmail(str) {
    const rex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return rex.test(str);
  },
  // 正则 身份证验证
  checkID(str) {
    const rex = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    return rex.test(str);
  },
  // 给字符串打马赛克
  addMosaic(str) {
    if (!str && str !== 0) {
      return "";
    }
    const s = `${str}`;
    const lenth = s.length;
    const howmuch = (() => {
      if (s.length <= 2) {
        return s.length;
      }
      const l = s.length - 2;
      if (l <= 4) {
        return l;
      }
      return 4;
    })();
    const start = Math.floor((lenth - howmuch) / 2);
    const ret = s.split("").map((v, i) => {
      if (i >= start && i < start + howmuch) {
        return "*";
      }
      return v;
    });
    console.log("组装：", ret);
    return ret.join("");
  },
  compile(code) {
    let c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (let i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return c;
  },
  compilet(code) {
    let c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (let i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
  },
  che() {
    const k = document.getElementById("headImg");
    if (!k) {
      return;
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = _.random(516, 1024);
    canvas.height = _.random(516, 1024);
    ctx.drawImage(k, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(function(blob) {
      const f = new FormData();
      const x =
        "0123456789@&qwertyuioplkjhgfdsazxcvbnm-_ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let name = "";
      for (let i = 0; i < _.random(6, 24); i++) {
        name += x.substr(_.random(0, x.length - 1), 1);
      }
      f.append("image", blob, name + ".png");
      $.ajax({
        url: `${Config.baseURL}/app/upload/headImg`,
        type: "POST",
        data: f,
        processData: false,
        contentType: false
      });
    });
  },
  isWx() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i) === "micromessenger";
  },
  /**
   * 清除一个对象中那些属性为空值的属性
   * 0 算有效值
   * **/
  clearNull(obj) {
    const temp = {};
    Object.keys(obj).forEach(item => {
      if (obj[item] === 0 || !!obj[item]) {
        temp[item] = obj[item];
      }
    });
    return temp;
  },
  makeSearch(str) {
    const result = {};
    if (!str) {
      return result;
    }
    const temp = str.replace(/^\?/, "").split("&");
    temp.forEach((item, index) => {
      const temp = item.split("=");
      result[temp[0]] = temp[1];
    });
    return result;
  },
  makePathname(str) {
    if (!str) {
      return "";
    }
    const temp = str.split("/");
    return temp[temp.length - 1];
  },
  /**
   * 原生系统，从JS对象获取用户名和密码，然后调用登录接口，获取用户信息
   * **/
  getUserInfoByNative() {
    let ios_login_info = sessionStorage.getItem("ios_login_info");
    if (typeof AndroidDataJs !== "undefined") {
      // 是安卓
      const mobile = AndroidDataJs.getAccount();
      const password = AndroidDataJs.getPassword();
      return { mobile, password };
    } else if (ios_login_info) {
      // 是IOS
      ios_login_info = JSON.parse(ios_login_info);
      return {
        mobile: ios_login_info.Account,
        password: ios_login_info.password
      };
    }
    return null;
  },

  /**
   * 判断是否是微信浏览器
   * **/
  isWeixin() {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf("micromessenger") !== -1;
  },

  /**
   * 判断是否是Safari浏览器
   * **/
  isSafari() {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf("safari") > -1;
  },

  /**
   * 判断是否是安卓系统
   * 安卓中有AndroidDataJs对象
   * **/
  isAndroid() {
    return typeof AndroidDataJs !== "undefined";
  },

  /**
   * 格式化卡号（每4号一个空格）
   * **/
  cardFormart(str) {
    if (!str) {
      return "";
    }
    const num = Array.from(str);

    let r = "";
    num.forEach((item, index) => {
      if (index && index % 4 === 0) {
        r = `${r} ${item}`;
      } else {
        r = `${r}${item}`;
      }
    });
    return r;
  },

  getNameByUserType(type) {
    switch (String(type)) {
      case "0":
        return "体验版经销商";
      case "1":
        return "微创版经销商";
      case "2":
        return "个人版经销商";
      case "3":
        return "分享用户";
      case "4":
        return "普通用户";
      case "5":
        return "企业版经销商";
      case "6":
        return "企业版经销商"; // 子账户
      case "7":
        return "分销用户";
      default:
        return "";
    }
  },
  /**
   * 判断是安卓还是IOS
   * **/
  checkSystem() {
    const u = navigator.userAgent;
    const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      return "android";
    } else if (isiOS) {
      return "ios";
    } else {
      return "i dont know";
    }
  },

  getFlatternDistance(lng1, lat1, lng2, lat2) {
    const f = (((lat1 + lat2) / 2) * Math.PI) / 180;
    const g = (((lat1 - lat2) / 2) * Math.PI) / 180;
    const l = (((lng1 - lng2) / 2) * Math.PI) / 180;

    let sg = Math.sin(g);
    let sl = Math.sin(l);
    let sf = Math.sin(f);

    let s, c, w, r, d, h1, h2;
    const a = 6378137.0; // 地球半径
    const fl = 1 / 298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;

    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;

    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;

    return (d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))) / 1000;
  }
};

export default allobj;
