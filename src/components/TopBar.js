import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './TopBar.css';
import {
  addInvestmentAccount,
  deleteInvestmentAccount,
  getAllInvestmentAccounts,
  selectInvestmentAccount,
} from '../actions/InvestmentAccount';
import AddInvestmentAccountForm from './AddInvestmentAccountForm';
import {
  Button,
  Dropdown,
  Menu,
  Modal,
} from 'semantic-ui-react';

const axios = require('axios');

const mapToStateProps = function(state) {
  return {
    accounts: state.investmentAccountReducer.accounts,
    selectedAccountId: state.investmentAccountReducer.selectedAccountId,
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({
    addInvestmentAccount: addInvestmentAccount,
    deleteInvestmentAccount: deleteInvestmentAccount,
    getAllInvestmentAccounts: getAllInvestmentAccounts,
    selectInvestmentAccount: selectInvestmentAccount,
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

const NULL_ID = 'NULL';

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addAccountOpen: false,
      addAccountFormState: {},
      accountOptions: [],
    }
    this.showAddAccount = () => this.setState({ addAccountOpen: true })
    this.closeAddAccount = () => this.setState({ addAccountOpen: false })
    this.handleSelectAccount = this.handleSelectAccount.bind(this);
    this.onAccountFormChange = this.onAccountFormChange.bind(this);
    this.addAccount = this.addAccount.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
  }

  componentDidMount() {
    this.props.getAllInvestmentAccounts();
  }

  componentDidUpdate(prevProps) {
    let accountListChanged = prevProps.accounts.length !== this.props.accounts.length;
    if (accountListChanged) {
      this.setState({
        accountOptions: this.props.accounts.map(account => {
          let id = account.id === null ? NULL_ID : account.id;
          return {
            key: id,
            text: account.name,
            value: id,
          };
        })
      });
    }
  }

  render() {
    return (
      <Menu fixed="top" className="top-bar">
        <Dropdown className="accounts-dropdown"
                  pointing="top left"
                  selection
                  onChange={this.handleSelectAccount}
                  value={this.selectedAccountId}
                  options={this.state.accountOptions}
        ></Dropdown>
        <Button primary onClick={this.showAddAccount}>
          Add Investment Account
        </Button>
        { this.selectedAccountId !== NULL_ID ?
        <Dropdown className="accounts-overflow-menu"
                  icon="ellipsis vertical"
                  pointing="top left">
          <Dropdown.Menu>
            <Dropdown.Item text="Delete" onClick={this.deleteAccount}/>
          </Dropdown.Menu>
        </Dropdown> : null }
        <Menu.Menu position="right">
          <UserDropdown>
          </UserDropdown>
        </Menu.Menu>
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
              <Button primary
                      disabled={!this.state.addAccountFormState.allFieldsValid}
                      onClick={this.addAccount}>
                Create
              </Button>
            </Modal.Actions>
        </Modal>
      </Menu>
    );
  }

  get selectedAccountId() {
    return this.props.selectedAccountId === null ? NULL_ID : this.props.selectedAccountId;
  }

  handleSelectAccount(e, {value}) {
    this.props.selectInvestmentAccount(value === NULL_ID ? null : value);
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

  deleteAccount() {
    if (this.selectedAccountId !== NULL_ID) {
      this.props.deleteInvestmentAccount(this.selectedAccountId);
    }
  }
}
export default connect(mapToStateProps, mapDispatchToProps)(TopBar);
