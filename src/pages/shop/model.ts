import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { CustomCategoryListData } from './data';
import { queryCategory, saveCategory, delCategory } from './service';
import { findIndex } from 'lodash';


export interface StateType {
  customCategoryData: CustomCategoryListData
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
  namespace: 'customCategory',
  state: {
    customCategoryData: {
      list: [],
    }
   
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCategory, payload);
      yield put({
        type: 'list',
        payload: response.data,
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
      
      yield put({
        type: 'remove',
        payload: response.data,
      });
      
    }
  },
  reducers: {
    list(state={
      customCategoryData: {
        list: []
      }
    }, action) {
      console.log(action)
      return {
        ...state,
        customCategoryData: {
          ...state.customCategoryData,
          list: [...action.payload]
        }
      };
    },
    insert(state={
      customCategoryData: {
        list: []
      }
    }, action) {
      const { customCategoryData:{list} } = state;
      return {
        ...state,
        customCategoryData: {
          list: [...list, action.payload]
        }  
      }
    },
    update(state={
      customCategoryData: {
        list: []
      }
    }, action) {
      const { customCategoryData:{list} } = state;
      if (list) {
        const index = findIndex(list, ele => ele.id === action.payload.id);
        if (index > -1) {
          list.splice(index, 1, action.payload)
          return {
            ...state,
            customCategoryData: {
              list: [...list]
            }
          }
        }
      }
      return state as StateType;
    },
    remove(state={
      customCategoryData: {
        list: []
      }
    }, action) {
      const { customCategoryData:{list} } = state;
      if (list) {
        const newList = list.filter(e => e.id !== action.payload);
        return {
          ...state,
          customCategoryData: {
            list: [...newList]
          }
        }
      }
      return state;
    }
  },
}

export default Model;