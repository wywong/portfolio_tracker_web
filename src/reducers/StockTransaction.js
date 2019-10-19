import {
  TRANSACTION_REQUEST_PENDING,
  TRANSACTION_REQUEST_FAILED,
  ADD_TRANSACTION_SUCCESS,
  DELETE_TRANSACTION_SUCCESS,
  GET_ACCOUNT_TRANSACTIONS_SUCCESS,
} from "../actions/StockTransaction";
import { REQUEST_STATUS } from "../models/RequestStatus";

const stockTransactionInitialState = {
  transactions: [],
  request_status: REQUEST_STATUS.INACTIVE
};

export const stockTransactionReducer = (state = stockTransactionInitialState, action) => {
  switch (action.type) {
    case TRANSACTION_REQUEST_PENDING:
      return Object.assign(
        {}, state, {
          request_status: REQUEST_STATUS.PENDING
        }
      );
    case TRANSACTION_REQUEST_FAILED:
      return Object.assign(
        {}, state, {
          request_status: REQUEST_STATUS.FAILED
        }
      );
    case ADD_TRANSACTION_SUCCESS:
      return Object.assign(
        {}, state, {
          transactions: [...state.transactions, action.transaction],
          request_status: REQUEST_STATUS.SUCCESS,
        }
      );
    case DELETE_TRANSACTION_SUCCESS:
      return Object.assign(
        {}, state, {
          transactions: state.transactions.filter(transaction => transaction.id !== action.transactionId),
          request_status: REQUEST_STATUS.SUCCESS,
        }
      );
    case GET_ACCOUNT_TRANSACTIONS_SUCCESS:
      return Object.assign(
        {}, state, {
          transactions: action.transactions,
          request_status: REQUEST_STATUS.SUCCESS,
        }
      );
    default:
      return state;
  }
}
