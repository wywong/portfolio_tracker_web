const axios = require('axios');

export const ADD_TRANSACTION_PENDING = "ADD_TRANSACTION_PENDING";
export const ADD_TRANSACTION_SUCCESS = "ADD_TRANSACTION_SUCCESS";
export const ADD_TRANSACTION_FAILED = "ADD_TRANSACTION_FAILED";

export const addTransaction = transactionDetail => {
  return dispatch => {
    dispatch({
        type: ADD_TRANSACTION_PENDING
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
          type: ADD_TRANSACTION_FAILED
        });
      });
  };
};
