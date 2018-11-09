import Fetchapi from "../util/fetch-api";
import { Toast } from "antd-mobile";

// 检测手机号是否被注册
export const checkMobile = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost("app/user/checkMobile", params);
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 登录
export const login = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost("app/user/login", params, "post", true);
    if (res.status === 200) {
      dispatch({
        type: "APP::getUserInfo",
        payload: res.data
      });
    } else {
      Toast.info(res.message, 1);
    }
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 退出登录
export const logout = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost("app/user/logout", params, "post", true);
    if (res.status === 200) {
      dispatch({
        type: "APP::getUserInfo",
        payload: null
      });
    }
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 注册时获取验证码
export const getVerifyCode = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost("app/sms/getVerifyCode", params);
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 提现时获取验证码
export const getVerifyCode2 = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost(
      "app/sms/withdraw/getVerifyCode",
      params
    );
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 注册
export const register = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost(
      "app/user/register",
      params,
      "post",
      true
    );
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 获取用户信息
export const getUserInfo = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost("app/user/get", params, "post", true);
    if (res.status === 200) {
      dispatch({
        type: "APP::getUserInfo",
        payload: res.data
      });
    }
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 修改用户信息
export const updateUserInfo = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost("app/user/update", params, "post", true);
    if (res.status === 200) {
      dispatch({
        type: "APP::getUserInfo",
        payload: res.data
      });
    }
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 修改客户信息
export const updateUserInfo2 = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost(
      "app/user/asterisk",
      params,
      "post",
      true
    );
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 重置密码
export const resetPwd = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost(
      "app/user/resetPwd",
      params,
      "post",
      true
    );
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 设置密码（未设置过密码的用户可以设置密码）
export const setPwd = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost("app/user/setPwd", params, "post", true);
    if (res.status === 200) {
      dispatch({
        type: "APP::getUserInfo",
        payload: res.data
      });
    }
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 验证经销商密码
export const bindPhonePwd = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost(
      "app/user/bind/phone/pwd",
      params,
      "post",
      true
    );
    if (res.status === 200) {
      dispatch({
        type: "APP::getUserInfo",
        payload: res.data
      });
    }
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 绑定手机号
export const bindPhone = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost(
      "app/user/bind/phone",
      params,
      "post",
      true
    );
    if (res.status === 200) {
      dispatch({
        type: "APP::getUserInfo",
        payload: res.data
      });
    }
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 解除绑定微信
export const unBindWx = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost(
      "app/user/unbind/wx",
      params,
      "post",
      true
    );
    if (res.status === 200) {
      dispatch({
        type: "APP::getUserInfo",
        payload: res.data
      });
    }
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 获取分享链接中二维码地址和体检券
export const shareBuild = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost("app/user/share/build", params);
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 我的 - 查询我的健康大使信息
export const myAmbassador = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost("app/user/my/ambassador", params);
    if (res.status === 200) {
      dispatch({
        type: "APP::getMyAmbassador",
        payload: res.data
      });
    }
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 查询所有省市区
export const getAreaList = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost("mall/area/areaList", params);
    if (res.status === 200) {
      dispatch({
        type: "APP::getAreaList",
        payload: res.data
      });
    }
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 根据用户id查询用户信息
export const getUserInfoById = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost(
      "app/user/nickAndHead",
      params,
      "post",
      true
    );
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 根据用户id查询用户的经销商的推荐人的所在服务站
export const getStationInfoById = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost("mall/station/referrerStation", params);
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 获取微信小程序专属二维码
export const getWxacode = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.newPost("app/user/wxacode/build", params);
    return res;
  } catch (err) {
    Toast.info("网络错误，请重试", 1);
  }
};

// 微信网页授权 - 保存code
export function saveWxCode(code) {
  return {
    type: "APP::saveWxCode",
    payload: code
  };
}

// 保存用户当前位置
export function saveUserLngLat(xy) {
  return {
    type: "APP::saveUserLngLat",
    payload: xy
  };
}

export function numtest(xy) {
  return {
    type: "APP::test",
    payload: xy
  };
}
