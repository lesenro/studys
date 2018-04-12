import { menusList,saveMenuSort,operateFindAll,findMenu,menuSave,menuUpdate,menuDelete } from '../services/platformApi';

export default {
  namespace: 'menus',

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
      const response = yield call(menusList, payload);
      yield put({
        type: 'save',
        payload: {
          list:response.data.page,
          operateAuthorities:response.data.operateAuthorities,
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *operateFindAll({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      var response = yield call(operateFindAll, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback(response);
    }, 
   *getInfo({ payload,callback}, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(findMenu, payload);
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
      let response = yield call(menuSave, payload);

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback(response);
    },
    *saveMenuSort({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      let response = yield call(saveMenuSort, payload);
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
      var response = yield call(menuUpdate, payload);

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
      const response = yield call(menuDelete, payload);

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
