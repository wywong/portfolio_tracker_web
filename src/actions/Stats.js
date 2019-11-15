const axios = require('axios');

export const STATS_REQUEST_PENDING = "STATS_REQUEST_PENDING";
export const STATS_REQUEST_FAILED = "STATS_REQUEST_FAILED";

export const GET_STATS_SUCCESS = "GET_STATS_SUCCESS";

export const getInvestmentAccountStats = id => {
  return dispatch => {
    dispatch({
        type: STATS_REQUEST_PENDING
    });
    axios.get(`/api/v1/investment_account/${id}/stats`)
      .then((response) => {
        dispatch({
          type: GET_STATS_SUCCESS,
          stats: response.data
        })
      })
      .catch(() => {
        dispatch({
          type: STATS_REQUEST_FAILED
        });
      });
  };
};

export const getAccountStats = () => {
  return dispatch => {
    dispatch({
        type: STATS_REQUEST_PENDING
    });
    axios.get(`/api/v1/transaction/stats`)
      .then((response) => {
        dispatch({
          type: GET_STATS_SUCCESS,
          stats: response.data
        })
      })
      .catch(() => {
        dispatch({
          type: STATS_REQUEST_FAILED
        });
      });
  };
};
