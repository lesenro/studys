import { roleList,findRole,roleSave,roleUpdate,roleDelete,roleMenuList,roleFindAll } from '../services/platformApi';
import {AppTools} from '../utils/utils';

export default {
  namespace: 'roles',

  state: {
    data: {
      list: [],
      pagination: {},
      operateAuthorities:[],
    },
    loading: true,
  },

  effects: {
    *getList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(roleList, payload);
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
      const response = yield call(findRole, payload);
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
      let response = yield call(roleSave, payload);

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
      var response = yield call(roleUpdate, payload);

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
      const response = yield call(roleDelete, payload);

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback(response);
    },
    *roleFindAll({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(roleFindAll, payload);

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback(response);
    },
    *roleMenuList({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(roleMenuList, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
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
