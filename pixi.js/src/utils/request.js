import fetch from 'dva/fetch';
import { notification ,Modal} from 'antd';
import { stringify } from 'qs';
import {AppTools} from '../utils/utils';
import { error } from 'util';


const confirm = Modal.confirm;
let modalShow=false;
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
    mode:"cors",
    headers:{}
    //widthCredentials:true,
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      // Accept: 'application/json',
      // 'Content-Type': 'application/json; charset=utf-8',
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      //"Access-Control-Allow-Origin":"*",
      ...newOptions.headers,
    };
    newOptions.body = stringify(newOptions.body);
  }
  var token=AppTools.AccessToken();
  if(token){
    newOptions.headers.Authorization="Bearer "+token;
    //newOptions.widthCredentials=true;
  }
  return fetch(url, newOptions)
    //.then(checkStatus)
    .then(response => {
      try{
        if (response.status < 200 || response.status >= 300) {
          notification.error({
            message: `服务器错误`,
            description: response.message,
          });          
        }
        return response.json();
      }catch(err){
        return response;
      }
    }).then(response=>{
      if(response.code==="error"){
        notification.error({
          message: `错误`,
          description: response.message,
        });  
      }      
      return response;
    })
    .catch(err=>{
        if (err.code) {
          notification.error({
            message: err.name,
            description: err.message,
          });
        }
        if ('stack' in err && 'message' in err) {
          notification.error({
            message: `请求错误: ${url}`,
            description: err.message,
          });
          err.code="error";
          if(!modalShow){
            modalShow=true;
            confirm({
              title: '操作失败',
              content: '登录超时或无此权限，是否重新登录?',
              onOk() {
                AppTools.RemoveToken();   
                modalShow=false;
                window.location.hash="/user/login";
              },
              onCancel() {
                modalShow=false;
              },
            });   
          }
        }
        return err;
    });

    
}
