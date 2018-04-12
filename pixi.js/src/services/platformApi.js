import { stringify } from 'qs';
import request from '../utils/request';
import {AppTools} from '../utils/utils';

const client_id=window.AppConfigs.client_id||"client_1";
const client_secret=window.AppConfigs.client_secret||"123456";
const apiUrl=window.AppConfigs.ApiUrl||"";


export async function oauthToken(params) {
    var data=Object.assign({
        client_id:client_id,
        client_secret:client_secret,
        grant_type:"password"
    },params);

    return request(apiUrl+'/oauth/token', {
        method: 'POST',
        body: {
          ...data,
        },
      }).then(resp=>{
        if(resp.access_token){
          AppTools.AccessToken(resp.access_token);
        }
        return resp;
      });
}
export async function logout() {
  return request(apiUrl+'/common/logout', {
      method: 'GET',
    }).then(resp=>{
      if(resp.code==="success"){
        AppTools.RemoveToken();
      }
      return resp;
    });
}
//操作相关
export async function operateList(params) {
    var data=Object.assign({
        pageNum:1,
        searchCondition:'',
        id:''
    },params);

    return request(apiUrl+'/admin/operate/list', {
        method: 'POST',
        body: {
          ...data,
        },
      });
}

export async function findOperate(params) {
    var data=Object.assign({
        id:''
    },params);

    return request(apiUrl+'/admin/operate/findOperate', {
        method: 'POST',
        body: {
          ...data,
        },
      });
}


export async function operateSave(params) {

    return request(apiUrl+'/admin/operate/save', {
        method: 'POST',
        body: {
          ...params,
        },
      });
}

export async function operateUpdate(params) {

    return request(apiUrl+'/admin/operate/update', {
        method: 'POST',
        body: {
          ...params,
        },
      });
}

export async function operateDelete(params) {
    
        return request(apiUrl+'/admin/operate/delete', {
            method: 'POST',
            body: {
              ...params,
            },
          });
}
export async function operateFindAll() {
    return request(apiUrl+'/admin/operate/findAll', {
        method: 'POST',
    });
}
//菜单相关
export async function menusList() {
      return request(apiUrl+'/admin/menu/list', {
          method: 'POST',
        });
}
export async function findMenu(params) {
      return request(apiUrl+'/admin/menu/findMenu', {
          method: 'POST',
          body: {
            ...params,
          },
        });
}
export async function userMenus() {
      return request(apiUrl+'/admin/user/findUserMenu', {
          method: 'POST',
        });
}

export async function saveMenuSort(params) {
  return request(apiUrl+'/admin/menu/saveMenuSort', {
      method: 'POST',
      body: {
        ...params,
      },
    });
}
export async function menuSave(params) {

  return request(apiUrl+'/admin/menu/save', {
      method: 'POST',
      body: {
        ...params,
      },
    });
}


export async function menuUpdate(params) {

  return request(apiUrl+'/admin/menu/update', {
      method: 'POST',
      body: {
        ...params,
      },
    });
}
export async function menuDelete(params) {
   
  return request(apiUrl+'/admin/menu/delete', {
      method: 'POST',
      body: {
        ...params,
      },
    });
}

//角色相关
export async function roleList(params) {
  var data=Object.assign({
      pageNum:1,
      searchCondition:'',
      id:''
  },params);

  return request(apiUrl+'/admin/role/list', {
      method: 'POST',
      body: {
        ...data,
      },
    });
}

export async function findRole(params) {
  var data=Object.assign({
      id:''
  },params);

  return request(apiUrl+'/admin/role/findRole', {
      method: 'POST',
      body: {
        ...data,
      },
    });
}


export async function roleSave(params) {

  return request(apiUrl+'/admin/role/save', {
      method: 'POST',
      body: {
        ...params,
      },
    });
}

export async function roleUpdate(params) {

  return request(apiUrl+'/admin/role/update', {
      method: 'POST',
      body: {
        ...params,
      },
    });
}

export async function roleDelete(params) {
      return request(apiUrl+'/admin/role/delete', {
          method: 'POST',
          body: {
            ...params,
          },
        });
}
//查菜单+操作的组合数据
export async function roleMenuList() {
      return request(apiUrl+'/admin/role/menuList', {
          method: 'POST',
        });
}

export async function roleFindAll() {
  return request(apiUrl+'/admin/role/findAll', {
      method: 'POST',
    });
}


//管理员相关
export async function userList(params) {
  var data=Object.assign({
      pageNum:1,
      searchCondition:'',
      id:''
  },params);

  return request(apiUrl+'/admin/user/list', {
      method: 'POST',
      body: {
        ...data,
      },
    });
}

export async function findUser(params) {
  var data=Object.assign({
      id:''
  },params);

  return request(apiUrl+'/admin/user/findUser', {
      method: 'POST',
      body: {
        ...data,
      },
    });
}


export async function userSave(params) {

  return request(apiUrl+'/admin/user/save', {
      method: 'POST',
      body: {
        ...params,
      },
    });
}

export async function findCurrentPrincipal() {
  return request(apiUrl+'/admin/user/findCurrentPrincipal', {
      method: 'POST',
    });
}

export async function userUpdate(params) {

  return request(apiUrl+'/admin/user/update', {
      method: 'POST',
      body: {
        ...params,
      },
    });
}

export async function userDelete(params) {
      return request(apiUrl+'/admin/user/delete', {
          method: 'POST',
          body: {
            ...params,
          },
        });
}
export async function updatePassword(params) {
      return request(apiUrl+'/admin/user/updatePassword', {
          method: 'POST',
          body: {
            ...params,
          },
        });
}

