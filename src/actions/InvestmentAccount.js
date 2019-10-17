const axios = require('axios');

export const ADD_INVESTMENT_ACCOUNT_PENDING = "ADD_INVESTMENT_ACCOUNT_PENDING";
export const ADD_INVESTMENT_ACCOUNT_SUCCESS = "ADD_INVESTMENT_ACCOUNT_SUCCESS";
export const ADD_INVESTMENT_ACCOUNT_FAILED = "ADD_INVESTMENT_ACCOUNT_FAILED";

export const addInvestmentAccount = investmentAccountDetail => {
  return dispatch => {
    dispatch({
        type: ADD_INVESTMENT_ACCOUNT_PENDING
    });
    axios.post('/api/v1/investment_account', investmentAccountDetail)
      .then((response) => {
        dispatch({
          type: ADD_INVESTMENT_ACCOUNT_SUCCESS,
          INVESTMENT_ACCOUNT: response.data
        })
      })
      .catch(() => {
        dispatch({
          type: ADD_INVESTMENT_ACCOUNT_FAILED
        });
      });
  };
};
