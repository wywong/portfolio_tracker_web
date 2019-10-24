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

export const UPDATE_TRANSACTION_SUCCESS = "UPDATE_TRANSACTION_SUCCESS";

export const updateTransaction = transactionDetail => {
  return dispatch => {
    dispatch({
        type: TRANSACTION_REQUEST_PENDING
    });
    axios.put('/api/v1/transaction/' + transactionDetail.id, transactionDetail)
      .then((response) => {
        dispatch({
          type: UPDATE_TRANSACTION_SUCCESS,
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

export const IMPORT_TRANSACTIONS_SUCCESS = 'IMPORT_TRANSACTIONS_SUCCESS';

export const importTransactions = (file, accountId) => {
  return dispatch => {
    dispatch({
        type: TRANSACTION_REQUEST_PENDING
    });
    let formData = new FormData();
    if (accountId !== null) formData.append('account_id', accountId);
    formData.append('file', file);
    axios.post('/api/v1/transaction/batch', formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }).then((response) => {
        dispatch({
          type: IMPORT_TRANSACTIONS_SUCCESS
        })
        dispatch(getAccountTransactions(accountId));
      })
      .catch(() => {
        dispatch({
          type: TRANSACTION_REQUEST_FAILED
        });
      });
  };
};

export const MOVE_TRANSACTIONS_SUCCESS = 'MOVE_TRANSACTIONS_SUCCESS';

export const moveTransactions = (new_account_id, transactionIds) => {
  return dispatch => {
    dispatch({
        type: TRANSACTION_REQUEST_PENDING
    });
    axios.put('/api/v1/transaction/batch', {
      new_account_id: new_account_id,
      transaction_ids: transactionIds,
    }).then((response) => {
        dispatch({
          type: MOVE_TRANSACTIONS_SUCCESS,
          transactionIds: transactionIds,
        })
      })
      .catch(() => {
        dispatch({
          type: TRANSACTION_REQUEST_FAILED
        });
      });
  };
};

