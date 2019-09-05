import { Effect } from 'dva';
import { Reducer } from "redux";


import { find } from "lodash";
import { query,queryCurrent } from '@/services/shop';

export interface CurrentShop {
  id?: string|number;
  avatar?: string;
  name?: string;
  title?: string;
  signature?: string;
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
  };
  reducers: {
    save: Reducer<ShopModelState>;
    changeCurrentShop: Reducer<ShopModelState>;
  };
}

const ShopModel: ShopModelType = {
  namespace: 'shop',

  state: {
    currentShop: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(query);
      yield put({
        type: 'save',
        payload: response,
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
    }
  },

  reducers: {
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
      const { shopList } = state;
      const currentShop = find(shopList, shop => shop.id == action.payload);
      return {
        ...state,
        currentShop: currentShop || {},
      };
    },
  },
};

export default ShopModel;
