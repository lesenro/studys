import { userList,findUser,userSave,userUpdate,updatePassword,userDelete,userMenus,findCurrentPrincipal } from '../services/platformApi';
import {AppTools} from '../utils/utils';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'users',

  state: {
    data: {
      list: [],
      pagination: {},
      operateAuthorities:[],
    },
    loading: true,
    currentUser: {},
  },

  effects: {
    *getList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(userList, payload);
      yield put({
        type: 'save',
        payload: {
          list:response.data.page.list,
          pagination:AppTools.getPageInfo(response.data.page),
          operateAuthorities:response.data.operateAuthorities
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *getInfo({ payload,callback}, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(findUser, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      if (callback) callback(response);      
    },
    *addSave({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      let response = yield call(userSave, payload);

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      var response = yield call(userUpdate, payload);

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback(response);
    },   
 
    *remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(userDelete, payload);

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback(response);
    },
    *updatePassword({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(updatePassword, payload);

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback(response);
    },    
    *getUserMenus({callback}, { call, put }) {
      const response = yield call(userMenus);
      if (callback) callback(response.data);
    },  
    *fetchCurrent(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });      
      const response = yield call(findCurrentPrincipal);
      if(response.code!=="error"){
        yield put({
          type: 'saveCurrentUser',
          payload: response.data||{},
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });      
    },    
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
