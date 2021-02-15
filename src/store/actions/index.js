import {
  SET_USER_AUTH,
  SET_USER_INFO,
  SET_BONS,
  SET_SUPPLIERS,
  SET_ADDED_NEW_BON,
} from '../types';

export const setUserAuth = (payload) => ({
  type: SET_USER_AUTH,
  payload: payload,
});

export const setUserInfo = (payload) => ({
  type: SET_USER_INFO,
  payload: payload,
});
export const setBons = (payload) => ({
  type: SET_BONS,
  payload: payload,
});
export const setAddedNewBon = (payload) => ({
  type: SET_ADDED_NEW_BON,
  payload: payload,
});
export const setSuppliers = (payload) => ({
  type: SET_SUPPLIERS,
  payload: payload,
});
