import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getAccountTransactions
} from "../actions/StockTransaction";
import { Button, Checkbox, Icon, Modal, Table } from 'semantic-ui-react'
import StockTransactionForm from './StockTransactionForm';
import './StockTransactionsContainer.css';


const mapToStateProps = function(state) {
  return {
    selectedAccountId: state.investmentAccountReducer.selectedAccountId,
    transactions: state.stockTransactionReducer.transactions
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({
    addTransaction: addTransaction,
    updateTransaction: updateTransaction,
    deleteTransaction: deleteTransaction,
    getAccountTransactions: getAccountTransactions,
  }, dispatch);
}

const initialTransactionFormState = {
  transactionFields: {},
  allFieldsValid: false
}

class StockTransactionsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      transactionParams: {},
      transactionFormState: Object.assign(
        {}, initialTransactionFormState
      ),
      deleteConfirmOpen: false,
      deleteId: null,
    };
    this.showTransactionForm = (params) => this.setState({ open: true, transactionParams: params });
    this.closeTransactionForm = () => this.setState({ open: false, transactionParams: {}});
    this.showConfirmDelete = (id) => this.setState({ deleteConfirmOpen: true, deleteId: id });
    this.closeConfirmDelete = () => this.setState({ deleteConfirmOpen: false, deleteId: null });
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.addStock = this.addStock.bind(this);
    this.updateStock = this.updateStock.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
      this.props.getAccountTransactions(this.props.selectedAccountId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedAccountId !== this.props.selectedAccountId) {
      this.props.getAccountTransactions(this.props.selectedAccountId);
    }
  }

  render() {
    return (
      <div className="stock-transaction-container">
        <Modal size="small"
               open={this.state.open}
               onClose={this.closeTransactionForm}>
            <Modal.Header>{ this.state.transactionParams.header }</Modal.Header>
            <Modal.Content>
              <StockTransactionForm onChange={this.onChange}
                                    initialFormFields={ this.state.transactionParams.initialFormFields }/>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.closeTransactionForm}>
                Cancel
              </Button>
              <Button primary
                      disabled={!this.state.transactionFormState.allFieldsValid}
                      onClick={this.state.transactionParams.successCallback}>
                { this.state.transactionParams.actionButton }
              </Button>
            </Modal.Actions>
        </Modal>
        <Button primary onClick={() => this.showTransactionForm({
          header: 'Add Stock Transaction',
          actionButton: 'Create',
          initialFormFields: {},
          successCallback: this.addStock
        })}>
          Add Transaction
        </Button>
        <Modal size="small"
               open={this.state.deleteConfirmOpen}
               onClose={this.closeConfirmDelete}>
            <Modal.Header>Delete Transaction</Modal.Header>
            <Modal.Content>
              Are you sure you want do delete this transaction?
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.closeConfirmDelete}>
                Cancel
              </Button>
              <Button negative
                      onClick={this.deleteTransaction}>
                Delete
              </Button>
            </Modal.Actions>
        </Modal>
        <Table celled compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing><Checkbox /></Table.HeaderCell>
              <Table.HeaderCell collapsing>Actions</Table.HeaderCell>
              <Table.HeaderCell>Transaction Type</Table.HeaderCell>
              <Table.HeaderCell>Stock Symbol</Table.HeaderCell>
              <Table.HeaderCell>Cost per unit</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Trade Fee</Table.HeaderCell>
              <Table.HeaderCell>Trade Date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              this.props.transactions.map(transaction => {
                return (
                  <Table.Row key={transaction.id}>
                    <Table.Cell collapsing><Checkbox /></Table.Cell>
                      <Table.Cell collapsing
                                  className="action-cell"
                                  textAlign="center">
                      <Icon name="pencil"
                            className="action"
                            onClick={() => this.showTransactionForm({
                              id: transaction.id,
                              header: 'Edit Stock Transaction',
                              actionButton: 'Update',
                              initialFormFields: Object.assign({}, transaction),
                              successCallback: this.updateStock
                            })}
                      />
                      <Icon name="trash"
                            className="action"
                            onClick={() => this.showConfirmDelete(transaction.id)}
                      />
                    </Table.Cell>
                    <Table.Cell>{transaction.transaction_type === "buy" ? "Buy" : "Sell"}</Table.Cell>
                    <Table.Cell>{transaction.stock_symbol}</Table.Cell>
                    <Table.Cell>{transaction.cost_per_unit}</Table.Cell>
                    <Table.Cell>{transaction.quantity}</Table.Cell>
                    <Table.Cell>{transaction.trade_fee}</Table.Cell>
                    <Table.Cell>{transaction.trade_date}</Table.Cell>
                  </Table.Row>
                );
              })
            }
          </Table.Body>
        </Table>
      </div>
    );
  }

  updateStock() {
    if (this.state.transactionParams.id) {
      this.props.updateTransaction(
        Object.assign(
          {}, this.state.transactionFormState.transactionFields, {
            id: this.state.transactionParams.id,
            account_id: this.props.selectedAccountId,
          }
        )
      );
    }
    this.closeTransactionForm();
  }

  deleteTransaction() {
    if (this.state.deleteId !== null) {
      this.props.deleteTransaction(this.state.deleteId);
      this.closeConfirmDelete();
    }
  }

  addStock() {
    this.props.addTransaction(
      Object.assign(
        {}, this.state.transactionFormState.transactionFields, {
          account_id: this.props.selectedAccountId
        }
      )
    );
    this.setState({
      transactionFormState: Object.assign(
        {}, initialTransactionFormState
      )
    });
    this.closeTransactionForm();
  }

  onChange(formState) {
    this.setState({
      transactionFormState: formState
    });
  }
}

export default connect(mapToStateProps, mapDispatchToProps)(StockTransactionsContainer);
