import {
  GET_STATS_SUCCESS,
} from "../actions/Stats";

const statsInitialState = {
  stats: {}
};

export const statsReducer = (state = statsInitialState, action) => {
  switch (action.type) {
    case GET_STATS_SUCCESS:
      return Object.assign(
        {}, state, {
          stats: action.stats
        }
      );
    default:
      return state;
  }
}
