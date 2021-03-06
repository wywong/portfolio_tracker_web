const axios = require('axios');

export const SELECT_INVESTMENT_ACCOUNT = "SELECT_INVESTMENT_ACCOUNT";

export const selectInvestmentAccount = accountId => {
  return {
    type: SELECT_INVESTMENT_ACCOUNT,
    id: accountId
  };
};


export const INVESTMENT_ACCOUNT_REQUEST_PENDING = "INVESTMENT_ACCOUNT_REQUEST_PENDING";
export const INVESTMENT_ACCOUNT_REQUEST_FAILED = "INVESTMENT_ACCOUNT_REQUEST_FAILED";
export const ADD_INVESTMENT_ACCOUNT_SUCCESS = "ADD_INVESTMENT_ACCOUNT_SUCCESS";

export const addInvestmentAccount = investmentAccountDetail => {
  return dispatch => {
    dispatch({
        type: INVESTMENT_ACCOUNT_REQUEST_PENDING
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
          type: INVESTMENT_ACCOUNT_REQUEST_FAILED
        });
      });
  };
};

export const GET_ALL_INVESTMENT_ACCOUNTS_SUCCESS = "GET_ALL_INVESTMENT_ACCOUNTS_SUCCESS";

export const getAllInvestmentAccounts = () => {
  return dispatch => {
    dispatch({
        type: INVESTMENT_ACCOUNT_REQUEST_PENDING
    });
    axios.get('/api/v1/investment_account/all')
      .then((response) => {
        dispatch({
          type: GET_ALL_INVESTMENT_ACCOUNTS_SUCCESS,
          accounts: response.data
        })
      })
      .catch(() => {
        dispatch({
          type: INVESTMENT_ACCOUNT_REQUEST_FAILED
        });
      });
  };
};

export const DELETE_INVESTMENT_ACCOUNT_SUCCESS = "DELETE_INVESTMENT_ACCOUNT_SUCCESS";

export const deleteInvestmentAccount = id => {
  return dispatch => {
    dispatch({
        type: INVESTMENT_ACCOUNT_REQUEST_PENDING
    });
    axios.delete('/api/v1/investment_account/' + id)
      .then((response) => {
        dispatch({
          type: DELETE_INVESTMENT_ACCOUNT_SUCCESS,
          id: id,
        })
      })
      .catch(() => {
        dispatch({
          type: INVESTMENT_ACCOUNT_REQUEST_FAILED
        });
      });
  };
};

export const GET_INVESTMENT_ACCOUNT_ADJUST_COST_BASE_SUCCESS = "GET_INVESTMENT_ACCOUNT_ADJUST_COST_BASE_SUCCESS";

export const getInvestmentAccountAdjustCostBase = id => {
  if (id === null) return;
  return dispatch => {
    dispatch({
        type: INVESTMENT_ACCOUNT_REQUEST_PENDING
    });
    axios.get('/api/v1/investment_account/' + id + '/acb')
      .then((response) => {
        dispatch({
          type: GET_INVESTMENT_ACCOUNT_ADJUST_COST_BASE_SUCCESS,
          acb: response.data
        })
      })
      .catch(() => {
        dispatch({
          type: INVESTMENT_ACCOUNT_REQUEST_FAILED
        });
      });
  };
};

