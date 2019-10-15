import React from 'react';
import './App.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUserDetails } from './actions/index';
import { REQUEST_STATUS } from "./models/RequestStatus";
import StockTransactionsContainer from './components/StockTransactionsContainer';
import {
  Container,
  Dimmer,
  Dropdown,
  Loader,
  Tab,
} from 'semantic-ui-react';

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

class UserDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  render() {
    return (
      <Dropdown icon="settings"
                className="settings-dropdown"
                pointing="top right"
      >
        <Dropdown.Menu>
          <Dropdown.Item text="Logout"
                         onClick={this.logout} />
        </Dropdown.Menu>
      </Dropdown>
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

const panes = [
  {
    menuItem: 'Stock Transactions',
    render: () => {
      return (
        <Tab.Pane>
          <StockTransactionsContainer />
        </Tab.Pane>
      );
    }
  },
]

class App extends React.Component {

  componentDidMount() {
    this.props.fetchUserDetails();
  }

  componentDidUpdate(prevProps) {
    if (this.props.detailState === REQUEST_STATUS.FAILED) {
      window.location.href = '/auth/login';
    }
  }

  get isLoading() {
    return !this.props.detailState;
  }

  render() {
    return (
      <Container fluid={true}>
        { this.isLoading ?
          <Dimmer active>
            <Loader />
          </Dimmer> : null
        }
        <UserDropdown>
        </UserDropdown>
        <Tab panes={panes} />
      </Container>
    );
  }

}

export default connect(mapToStateProps, mapDispatchToProps)(App);
