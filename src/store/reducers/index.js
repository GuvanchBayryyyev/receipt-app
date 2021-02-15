import {
  SET_USER_AUTH,
  SET_USER_INFO,
  SET_SUPPLIERS,
  SET_BONS,
  SET_ADDED_NEW_BON,
} from '../types';

const initialState = {
  authToken: null,
  userInfo: null,
  suppliers: null,
  bons: null,
  addedNewBon: false,
};
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_AUTH:
      return {
        ...state,
        authToken: action.payload,
      };
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case SET_BONS:
      return {
        ...state,
        bons: action.payload,
      };
    case SET_ADDED_NEW_BON:
      return {
        ...state,
        addedNewBon: action.payload,
      };
    case SET_SUPPLIERS:
      return {
        ...state,
        suppliers: action.payload,
      };
    default:
      return state;
  }
};
export default appReducer;
