import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { CustomCategory } from './data';
import { queryCategory, saveCategory, delCategory } from './service';
import { findIndex } from 'lodash';


export interface CustomCategoryModel {
  list: CustomCategory[]
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: CustomCategoryModel) => T) => T },
) => void;


export interface ModelType {
  namespace: string;

  state: CustomCategoryModel;
  effects: {
    fetch: Effect;
    save: Effect;
    delete: Effect;
  };
  reducers: {
    list: Reducer<CustomCategoryModel>;
    insert: Reducer<CustomCategoryModel>;
    update: Reducer<CustomCategoryModel>;
    remove: Reducer<CustomCategoryModel>;
  };
}

const Model: ModelType = {
  namespace: 'customCategorySettings',
  state: {
    list: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCategory, payload);
      yield put({
        type: 'list',
        payload: response.data,
      });
    },
    *save({ payload, callback }, { call, put } ) {
      const response = yield call(saveCategory, payload);
      if (payload.id) {
        yield put({
          type: 'update',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'insert',
          payload: response.data,
        });
      }
      callback();
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(delCategory, payload);
      
      yield put({
        type: 'remove',
        payload: response.data,
      });
      
    }
  },
  reducers: {
    list(state={ list: []}, action) {
      console.log(action)
      return {
        ...state,
        list: [...action.payload]
      };
    },
    insert(state={
      list: []
    }, action) {
      const { list } = state;
      return {
        ...state,
        list: [...list, action.payload]
      }
    },
    update(state={
      list: []
    }, action) {
      const { list } = state;
      if (list) {
        const index = findIndex(list, ele => ele.id === action.payload.id);
        if (index > -1) {
          list.splice(index, 1, action.payload)
          return {
            ...state,
            list: [...list]
          }
        }
      }
      return state;
    },
    remove(state={
      list: []
    }, action) {
      const { list } = state;
      if (list) {
        const newList = list.filter(e => e.id !== action.payload);
        return {
          ...state,
          list: [...newList]
        }
      }
      return state;
    }
  },
}

export default Model;