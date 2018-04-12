import { routerRedux } from 'dva/router';
import { oauthToken,logout } from '../services/platformApi';
import { notification } from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *accountSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(oauthToken, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
      
      if(response.access_token){
        yield put(routerRedux.push('/'));
      }else{
        notification.error({
          message: `登录失败`,
          description: response.error_description,
        });
      }

    },

    *logout(_, { call,put }) {
      const response = yield call(logout);
      if(response.code==="success"){
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
