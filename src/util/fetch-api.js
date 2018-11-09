import $ from "jquery";
import Config from "../config";
import { Toast } from "antd-mobile";
import _ from "lodash";
export default class ApiService {
  static newPost(url, bodyObj = {}, type = "post", isJson) {
    const openId = sessionStorage.getItem("openId") || null;
    const params = _.cloneDeep(bodyObj);
    if (url === "app/user/get" && bodyObj && bodyObj.userId) {
    } else {
      params.openId = openId;
    }

    if (isJson) {
      return new Promise((res, rej) => {
        $.ajax({
          url: `${Config.baseURL}/${url}`,
          type: type,
          contentType: "application/json;charset=UTF-8",
          crossOrigin: true,
          withCredentials: true,
          data: JSON.stringify(params),
          dataType: "json",
          success: msg => {
            res(msg);
          },
          error: err => {
            rej(err);
          }
        });
      }).then(res => {
        if (res.status === 401) {
          sessionStorage.clear();
          Toast.info(res.message, 1);
        }
        return res;
      });
    } else {
      return new Promise((res, rej) => {
        $.ajax({
          url: `${Config.baseURL}/${url}`,
          type: type,
          contentType: "application/x-www-form-urlencoded;charset=UTF-8",
          crossOrigin: true,
          withCredentials: true,
          data: params,
          success: msg => {
            res(msg);
          },
          error: err => {
            rej(err);
          }
        });
      }).then(res => {
        if (res.status === 401) {
          sessionStorage.clear();
          Toast.info(res.message, 1);
        }
        return res;
      });
    }
  }
}
