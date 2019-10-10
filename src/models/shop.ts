import { Effect } from 'dva';
import { Reducer } from "redux";


import { find } from "lodash";
import { query, queryCurrent, saveBasic, saveWebInfo, uploadLogo } from '@/services/shop';

export interface CurrentShop {
  id?: string|number;
  avatar?: string;
  shopName?: string;
  email?: string;
  address?: string;
  servicePhone?: string;
  serviceTime?: string;
  contacts?: string;
  keyword?: string;
  description?: string;
  website?: string;
  title?: string;
}

export interface ShopModelState {
  currentShop?: CurrentShop;
  shopList?: CurrentShop[];
}

export interface ShopModelType {
  namespace: 'shop';
  state: ShopModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    switchShop: Effect;
    saveBasic: Effect;
    saveWebInfo: Effect;
    uploadLogo: Effect;
  };
  reducers: {
    saveCurrent: Reducer<ShopModelState>;
    save: Reducer<ShopModelState>;
    changeCurrentShop: Reducer<ShopModelState>;
    updateLogo: Reducer<ShopModelState>;
  };
}

const ShopModel: ShopModelType = {
  namespace: 'shop',

  state: {
    currentShop: {},
    shopList: []
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(query);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const listResponse = yield call(query);
      const currentResponse = yield call(queryCurrent);
      yield put({
        type: 'save',
        payload: listResponse.data
      });
      yield put({
        type: 'changeCurrentShop',
        payload: currentResponse.data
      });
    },
    *switchShop(_, { call, put }) {
      yield put({
        type: 'changeCurrentShop',
        payload: _.payload,
      });
    },
    *saveBasic({ payload }, { call, put }) {
      const response = yield call(saveBasic, payload);
      yield put({
        type: 'saveCurrent',
        payload: payload,
      });
    },
    *saveWebInfo({ payload }, { call, put }) {
      const response = yield call(saveWebInfo, payload);
      yield put({
        type: 'saveCurrent',
        payload: payload,
      });
    },
    *uploadLogo({ payload }, { call, put }) {
      const response = yield call(uploadLogo, payload.shopId, payload.file);
      yield put({
        type: 'updateLogo',
        payload: response.data,
      });
    }
  },

  reducers: {
    saveCurrent(state={
      currentShop: {}
    }, action) {
      return {
        ...state,
        currentShop: {...state.currentShop, ...action.payload}
      }
    },
    save(state, action) {
      return {
        ...state,
        shopList: action.payload || []
      };
    },
    changeCurrentShop(state = {
      currentShop: {},
      shopList: []
    }, action) {
      const { shopList=[] } = state;
      const currentShop = shopList.length == 1 && shopList[0] || find(shopList, shop => shop.id == action.payload);
      return {
        ...state,
        currentShop: currentShop || {},
      };
    },
    updateLogo(state = {
      currentShop: {}
    }, action) {
      const { currentShop } = state;
      const newCurrentShop = { ...currentShop, avatar: action.payload }
      return {
        ...state,
        currentShop: newCurrentShop
      }
    }
  },
};

export default ShopModel;
