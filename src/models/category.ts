import { Effect } from './connect.d';
import { Reducer } from 'redux';
import { queryCategory, saveCategory, delCategory } from '@/services/custom-category';
import { findIndex } from 'lodash';


export interface Category {
  id: number | string;
  cateName: string;
  icon?: string;
  i18n?: string;
  level: number;
  parentId: number | string;
  parentIds?: string;
  priority: number;
  children?: Category[];
  parents?: Category[];
}

export interface CategoryListParams {}

export interface CategoryModelState {
  list: Category[];
}


export interface CategoryModelType {
  namespace: string;

  state: CategoryModelState;
  effects: {
    fetch: Effect;
    save: Effect;
    delete: Effect;
  };
  reducers: {
    list: Reducer<CategoryModelState>;
    insert: Reducer<CategoryModelState>;
    update: Reducer<CategoryModelState>;
    remove: Reducer<CategoryModelState>;
  };
}

const CategoryModel: CategoryModelType = {
  namespace: 'categorySettings',
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
    *save({ payload, callback }, { call, put }) {
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
    },
  },
  reducers: {
    list(
      state = {
        list: [],
      },
      action,
    ) {
      return {
        ...state,
        list: [...action.payload],
      };
    },
    insert(state={list:[]}, action) {
      const {
        list=[],
      } = state;
      return {
        ...state,
        list: [...list, action.payload],
      };
    },
    update(state={list:[]}, action) {
      const {
        list
      } = state;
      if (list) {
        const index = findIndex(list, (ele:any) => ele.id === action.payload.id);
        if (index > -1) {
          list.splice(index, 1, action.payload);
          return {
            ...state,
            list: [...list],
          };
        }
      }
      return state;
    },
    remove(
      state = {
        list: [],
      },
      action,
    ) {
      const {
        list
      } = state;
      if (list) {
        const newList = list.filter(e => e.id !== action.payload);
        return {
          ...state,
          list: [...newList],
        };
      }
      return state;
    },
  },
};

export default CategoryModel;
