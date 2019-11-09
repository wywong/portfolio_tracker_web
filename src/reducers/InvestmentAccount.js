import {
  SELECT_INVESTMENT_ACCOUNT,
  INVESTMENT_ACCOUNT_REQUEST_PENDING,
  INVESTMENT_ACCOUNT_REQUEST_FAILED,
  ADD_INVESTMENT_ACCOUNT_SUCCESS,
  DELETE_INVESTMENT_ACCOUNT_SUCCESS,
  GET_ALL_INVESTMENT_ACCOUNTS_SUCCESS,
  GET_INVESTMENT_ACCOUNT_STATS_SUCCESS,
} from "../actions/InvestmentAccount";
import { REQUEST_STATUS } from "../models/RequestStatus";

const DEFAULT_ACCOUNTS = [
  {
    id: null,
    name: "Unassigned Transactions",
    taxable: true
  }
];

const investmentAccountInitialState = {
  selectedAccountId: null,
  accounts: DEFAULT_ACCOUNTS.slice(),
  request_status: REQUEST_STATUS.INACTIVE,
  stats: {},
};

export const investmentAccountReducer = (state = investmentAccountInitialState, action) => {
  switch (action.type) {
    case SELECT_INVESTMENT_ACCOUNT:
      return Object.assign({}, state, {
        selectedAccountId: action.id,
        stats: {},
      });
    case INVESTMENT_ACCOUNT_REQUEST_PENDING:
      return Object.assign(
        {}, state, {
          request_status: REQUEST_STATUS.PENDING
        }
      );
    case INVESTMENT_ACCOUNT_REQUEST_FAILED:
      return Object.assign(
        {}, state, {
          request_status: REQUEST_STATUS.FAILED
        }
      );
    case ADD_INVESTMENT_ACCOUNT_SUCCESS:
      return Object.assign(
        {}, state, {
          accounts: [...state.accounts, action.INVESTMENT_ACCOUNT],
          request_status: REQUEST_STATUS.SUCCESS,
        }
      );
    case GET_ALL_INVESTMENT_ACCOUNTS_SUCCESS:
      return Object.assign(
        {}, state, {
          accounts: DEFAULT_ACCOUNTS.concat(action.accounts),
          request_status: REQUEST_STATUS.SUCCESS,
        }
      );
    case DELETE_INVESTMENT_ACCOUNT_SUCCESS:
      return Object.assign(
        {}, state, {
          selectedAccountId: null,
          accounts: state.accounts.filter(account => account.id !== action.id),
          request_status: REQUEST_STATUS.SUCCESS,
        }
      );
    case GET_INVESTMENT_ACCOUNT_STATS_SUCCESS:
      return Object.assign(
        {}, state, {
          stats: action.stats
        }
      );
    default:
      return state;
  }
}

