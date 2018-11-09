// ============================================
// ============================================
// Import modules

const initState = {
  homeRecommend: [], // 首页 - 热销产品
  liveHot: [], // 首页 - 推荐视频
  activityList: [], // 首页 - 活动列表
  stationDetail: {} // 当前服务站详情页数据
};

// ============================================
// action handling function

const actDefault = state => state;

const getRecommend = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    homeRecommend: payload || []
  });
};

const getLiveListCache = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    liveHot: payload || []
  });
};

const getActivityList = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    activityList: payload || []
  });
};

const inputStation = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    stationDetail: payload || []
  });
};

// ============================================
// reducer function

const reducerFn = (state = initState, action) => {
  switch (action.type) {
    // 进入主页时，初始化左边box数据
    case "NEW::recommend":
      return getRecommend(state, action);
    case "NEW::liveHot":
      return getLiveListCache(state, action);
    case "NEW::activityList":
      return getActivityList(state, action);
    case "SHOP::inputStation":
      return inputStation(state, action);
    default:
      return actDefault(state, action);
  }
};

export default reducerFn;
