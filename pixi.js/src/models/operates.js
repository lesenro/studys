import { operateList,findOperate,operateSave,operateUpdate,operateDelete } from '../services/platformApi';
import {AppTools} from '../utils/utils';

export default {
  namespace: 'operates',

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
      const response = yield call(operateList, payload);
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
      const response = yield call(findOperate, payload);
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
      let response = yield call(operateSave, payload);

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
      var response = yield call(operateUpdate, payload);

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
      const response = yield call(operateDelete, payload);

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
