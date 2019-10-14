import { combineReducers } from 'redux';
import {
  fetchUserDetailsSuccess,
  FETCH_USER_DETAILS_SUCCESS,
  fetchUserDetailsFailed,
  FETCH_USER_DETAILS_FAILED,
} from '../actions/index';

const axios = require('axios');

const userDetailsState = {
  email: "",
  requestState: null
}

export const userDetailReducer = (state = userDetailsState, action) => {
  switch (action.type) {
    case FETCH_USER_DETAILS_SUCCESS:
      return Object.assign(
        {}, state, {
          email: action.email,
          requestState: 'SUCCESS'
        }
      );
    case FETCH_USER_DETAILS_FAILED:
      return Object.assign(
        {}, state, {
          requestState: 'FAILED'
        }
      );
    default:
      return state;
  }
}

export const fetchUserDetails = () => {
  return dispatch => {
    axios.get('/auth/details')
      .then((res) => {
        dispatch(fetchUserDetailsSuccess(res.data));
      })
      .catch(() => {
        dispatch(fetchUserDetailsFailed());
      })
  };
}

export default combineReducers({
  userDetailReducer
});
