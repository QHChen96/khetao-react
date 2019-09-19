import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent, query as queryUsers } from '@/services/user';
import { uploadImage } from '@/pages/account/settings/service';

export interface CurrentUser {
  id?: string | number;
  avatar?: string;
  nickName?: string;
  username?: string;
  email?: string;
  realName?: string;
  mobile?: string;
  mobileCode?: string;
  sex?: number;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    uploadAvatar: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    updateAvatar: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },
    *uploadAvatar({ payload }, { call, put }) {
      const response = yield call(uploadImage, payload);
      yield put({
        type: 'updateAvatar',
        payload: response.data,
      });
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    updateAvatar(state={
      currentUser:{}
    }, action) {
      console.log(action);
      return {
        ...state,
        currentUser: {
          ...state.currentUser, avatar: action.payload
        }
      }
    }
  },
};

export default UserModel;
