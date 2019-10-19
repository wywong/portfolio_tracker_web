const axios = require('axios');

export const TRANSACTION_REQUEST_PENDING = "TRANSACTION_REQUEST_PENDING";
export const TRANSACTION_REQUEST_FAILED = "TRANSACTION_REQUEST_FAILED";

export const ADD_TRANSACTION_SUCCESS = "ADD_TRANSACTION_SUCCESS";

export const addTransaction = transactionDetail => {
  return dispatch => {
    dispatch({
        type: TRANSACTION_REQUEST_PENDING
    });
    axios.post('/api/v1/transaction', transactionDetail)
      .then((response) => {
        dispatch({
          type: ADD_TRANSACTION_SUCCESS,
          transaction: response.data
        })
      })
      .catch(() => {
        dispatch({
          type: TRANSACTION_REQUEST_FAILED
        });
      });
  };
};

export const DELETE_TRANSACTION_SUCCESS = "DELETE_TRANSACTION_SUCCESS";

export const deleteTransaction = id => {
  return dispatch => {
    dispatch({
        type: TRANSACTION_REQUEST_PENDING
    });
    axios.delete('/api/v1/transaction/' + id)
      .then((response) => {
        dispatch({
          type: DELETE_TRANSACTION_SUCCESS,
          transactionId: id
        })
      })
      .catch(() => {
        dispatch({
          type: TRANSACTION_REQUEST_FAILED
        });
      });
  };
};

export const GET_ACCOUNT_TRANSACTIONS_SUCCESS = "GET_ACCOUNT_TRANSACTIONS_SUCCESS";

export const getAccountTransactions = accountId => {
  return dispatch => {
    dispatch({
        type: TRANSACTION_REQUEST_PENDING
    });
    axios.get('/api/v1/investment_account/transactions', {
      params: {
        account_id: accountId
      }
    }).then((response) => {
        dispatch({
          type: GET_ACCOUNT_TRANSACTIONS_SUCCESS,
          transactions: response.data
        })
      })
      .catch(() => {
        dispatch({
          type: TRANSACTION_REQUEST_FAILED
        });
      });
  };
};


