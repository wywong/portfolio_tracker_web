const axios = require('axios');

export const FETCH_USER_DETAILS_FAILED =  'FETCH_USER_DETAILS_FAILED';
export const FETCH_USER_DETAILS_SUCCESS =  'FETCH_USER_DETAILS_SUCCESS';

export const fetchUserDetailsSuccess = userDetail => {
  return {
    type: FETCH_USER_DETAILS_SUCCESS,
    email: userDetail ? userDetail.email : ""
  };
}

export const fetchUserDetailsFailed = () => {
  return {
    type: FETCH_USER_DETAILS_FAILED
  };
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

