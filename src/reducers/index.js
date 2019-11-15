import { combineReducers } from 'redux';
import {
  FETCH_USER_DETAILS_SUCCESS,
  FETCH_USER_DETAILS_FAILED,
} from '../actions/index';
import { REQUEST_STATUS } from "../models/RequestStatus";
import { statsReducer } from "./Stats";
import { stockTransactionReducer } from "./StockTransaction";
import { investmentAccountReducer } from "./InvestmentAccount";


const userDetailsState = {
  email: "",
  requestState: null
}

export const userDetailReducer = (state = userDetailsState, action) => {
  switch (action.type) {
    case FETCH_USER_DETAILS_SUCCESS:
      return Object.assign(
        {}, state, {
          email: action.email,
          requestState: REQUEST_STATUS.SUCCESS
        }
      );
    case FETCH_USER_DETAILS_FAILED:
      return Object.assign(
        {}, state, {
          requestState: REQUEST_STATUS.FAILED
        }
      );
    default:
      return state;
  }
}

export default combineReducers({
  userDetailReducer,
  statsReducer,
  stockTransactionReducer,
  investmentAccountReducer,
});
