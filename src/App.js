import React from 'react';
import './App.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUserDetails } from './reducers/index';

const axios = require('axios');

const mapToStateProps = function(state) {
  return {
    detailState: state.userDetailReducer.requestState
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({
    fetchUserDetails: fetchUserDetails
  }, dispatch);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.props.fetchUserDetails();
  }

  componentDidUpdate(prevProps) {
    if (this.props.detailState === 'FAILED') {
        window.location.href = '/auth/login';
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Test
        </header>
          <button className="ui button"
                  onClick={this.logout}>
          Logout
        </button>
      </div>
    );
  }

  logout() {
    axios.post('/auth/logout', {})
      .then(() => {
        window.location.href = '/auth/login';
      })
      .catch(() => {
        // todo-ww decide how to handle this error
      });
  }
}

export default connect(mapToStateProps, mapDispatchToProps)(App);
