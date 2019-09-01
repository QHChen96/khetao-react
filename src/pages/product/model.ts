import { AnyAction, Reducer } from "redux";
import { EffectsCommandMap } from "dva";

import { SkuPropName } from './data';

export interface StateType {
  skuPropNames: SkuPropName[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submitProdForm: Effect;
  };
  reducers: {
    addPropName: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'prodForm',

  state: {
    skuPropNames: []
  },

  effects: {
    *submitProdForm({ payload }, { call }) {
      yield call(null, payload);
    },
  },

  reducers: {
    addPropName(state, { payload }) {
      return {
        ...state,
        skuPropNames: (state as StateType).skuPropNames.concat(payload),
      };
    },
    
  },
};

export default Model;