import {
  ADD_INVESTMENT_ACCOUNT_PENDING,
  ADD_INVESTMENT_ACCOUNT_SUCCESS,
  ADD_INVESTMENT_ACCOUNT_FAILED,
} from "../actions/InvestmentAccount";
import { REQUEST_STATUS } from "../models/RequestStatus";

const investmentAccountInitialState = {
  accounts: [],
  request_status: REQUEST_STATUS.INACTIVE
};

export const investmentAccountReducer = (state = investmentAccountInitialState, action) => {
  switch (action.type) {
    case ADD_INVESTMENT_ACCOUNT_PENDING:
      return Object.assign(
        {}, state, {
          request_status: REQUEST_STATUS.PENDING
        }
      );
    case ADD_INVESTMENT_ACCOUNT_FAILED:
      return Object.assign(
        {}, state, {
          request_status: REQUEST_STATUS.FAILED
        }
      );
    case ADD_INVESTMENT_ACCOUNT_SUCCESS:
      state.accounts.push(action.INVESTMENT_ACCOUNT);
      return Object.assign(
        {}, state, {
          request_status: REQUEST_STATUS.SUCCESS,
        }
      );
    default:
      return state;
  }
}

