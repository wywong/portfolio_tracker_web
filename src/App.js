import React from 'react';
import './App.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUserDetails } from './actions/index';
import { addInvestmentAccount } from './actions/InvestmentAccount';
import { REQUEST_STATUS } from "./models/RequestStatus";
import StockTransactionsContainer from './components/StockTransactionsContainer';
import AddInvestmentAccountForm from './components/AddInvestmentAccountForm';
import {
  Button,
  Container,
  Dimmer,
  Dropdown,
  Loader,
  Menu,
  Modal,
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
    fetchUserDetails: fetchUserDetails,
    addInvestmentAccount: addInvestmentAccount,
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
  constructor(props) {
    super(props);
    this.state = {
      addAccountOpen: false,
      addAccountFormState: {}
    }
    this.showAddAccount = () => this.setState({ addAccountOpen: true })
    this.closeAddAccount = () => this.setState({ addAccountOpen: false })
    this.onAccountFormChange = this.onAccountFormChange.bind(this);
    this.addAccount = this.addAccount.bind(this);
  }

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
        <Modal size="small"
               open={this.state.addAccountOpen}
               onClose={this.closeAddAccount}>
            <Modal.Header>Add Investment Account</Modal.Header>
            <Modal.Content>
              <AddInvestmentAccountForm onChange={this.onAccountFormChange} />
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.closeAddAccount}>
                Cancel
              </Button>
              <Button positive
                      disabled={!this.state.addAccountFormState.allFieldsValid}
                      onClick={this.addAccount}>
                Create
              </Button>
            </Modal.Actions>
        </Modal>
        <Menu attached="top">
          <Button onClick={this.showAddAccount}>
            Add Investment Account
          </Button>
          <Menu.Menu position="right">
            <UserDropdown>
            </UserDropdown>
          </Menu.Menu>
        </Menu>
        <Tab panes={panes} />
      </Container>
    );
  }

  onAccountFormChange(formState) {
    this.setState({
      addAccountFormState: Object.assign({}, formState)
    });
  }

  addAccount() {
    this.props.addInvestmentAccount(Object.assign(
      {}, this.state.addAccountFormState.addAccountFields
    ));
    this.setState({
      addAccountOpen: false,
      addAccountFormState: {}
    });
  }
}

export default connect(mapToStateProps, mapDispatchToProps)(App);
