// ============================================
// ============================================
// Import modules

const initState = {
  num: 0, // 测试 - 初始值0
  fetchvalue: [], // 测试 -
  userinfo: null, // 全局用户信息
  ambassador: null, // 当前用户的健康大使信息
  wxCode: "", // 微信网页授权 - code
  areaData: [], // 所有省市区原始数据
  userXY: null // 用户当前定位，防止重复定位所以全局缓存
};

// ============================================
// action handling function

const actDefault = state => state;

const getUserInfo = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    userinfo: payload
  });
};

const saveWxCode = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    wxCode: payload
  });
};

const getMyAmbassador = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    ambassador: payload
  });
};

const getAreaList = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    areaData: payload
  });
};

const saveUserLngLat = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    userXY: payload
  });
};
const numTest = (state, action) => {
  console.log("ddd来了吗23222：", action);
  const { payload } = action;
  return Object.assign({}, state, {
    num: payload
  });
};
// ============================================
// reducer function

const reducerFn = (state = initState, action) => {
  switch (action.type) {
    // 进入主页时，初始化左边box数据
    case "APP::getUserInfo":
      return getUserInfo(state, action);
    case "APP::saveWxCode":
      return saveWxCode(state, action);
    case "APP::getMyAmbassador":
      return getMyAmbassador(state, action);
    case "APP::getAreaList":
      return getAreaList(state, action);
    case "APP::saveUserLngLat":
      return saveUserLngLat(state, action);
    case "APP::test":
      return numTest2(state, action);
    default:
      return actDefault(state, action);
  }
};

export default reducerFn;
