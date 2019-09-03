import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { CategoryListData } from './data';
import { queryCategory, saveCategory, delCategory } from './service';
import { findIndex } from 'lodash';

export interface StateType {
  data: CategoryListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;

  state: StateType;
  effects: {
    fetch: Effect;
    save: Effect;
    delete: Effect;
  };
  reducers: {
    list: Reducer<StateType>;
    insert: Reducer<StateType>;
    update: Reducer<StateType>;
    remove: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'categoryList',
  state: {
    data: {
      list: [],
    }
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCategory, payload);
      yield put({
        type: 'list',
        payload: response,
      });
    },
    *save({ payload }, { call, put } ) {
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
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(delCategory, payload);
      if (response.code == 200) {
        yield put({
          type: 'remove',
          payload: payload,
        });
      }
    }
  },
  reducers: {
    list(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    insert(state, action) {
      const { data: { list } } = state as StateType;
      return {
        ...state,
        data: {
          list: [...list, action.payload]
        }
      }
    },
    update(state, action) {
      const { data: { list } } = state as StateType;
      if (list) {
        const index = findIndex(list, ele => ele.id === action.payload.id);
        if (index > -1) {
          list.splice(index, 1, action.payload)
          return {
            ...state,
            data: {
              list: [...list]
            }
          }
        }
      }
      return state as StateType;
    },
    remove(state, action) {
      const { data: { list } } = state as StateType;
      if (list) {
        const newList = list.filter(e => e.id !== action.payload);
        return {
          ...state,
          data: {
            list: [...newList]
          }
        }
      }
      return state as StateType;
    }
  },
}

export default Model;