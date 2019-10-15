import {
  ADD_TRANSACTION_PENDING,
  ADD_TRANSACTION_SUCCESS,
  ADD_TRANSACTION_FAILED,
} from "../actions/StockTransaction";
import { REQUEST_STATUS } from "../models/RequestStatus";

const stockTransactionInitialState = {
  transactions: [],
  request_status: REQUEST_STATUS.INACTIVE
};

export const stockTransactionReducer = (state = stockTransactionInitialState, action) => {
  switch (action.type) {
    case ADD_TRANSACTION_PENDING:
      return Object.assign(
        {}, state, {
          request_status: REQUEST_STATUS.PENDING
        }
      );
    case ADD_TRANSACTION_FAILED:
      return Object.assign(
        {}, state, {
          request_status: REQUEST_STATUS.FAILED
        }
      );
    case ADD_TRANSACTION_SUCCESS:
      state.transactions.push(action.transaction);
      return Object.assign(
        {}, state, {
          request_status: REQUEST_STATUS.SUCCESS,
        }
      );
    default:
      return state;
  }
}
