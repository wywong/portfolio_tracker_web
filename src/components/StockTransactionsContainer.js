import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  addTransaction,
  deleteTransaction,
  getAccountTransactions
} from "../actions/StockTransaction";
import { Button, Checkbox, Icon, Modal, Table } from 'semantic-ui-react'
import AddStockTransactionForm from './AddStockTransactionForm';
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
    deleteTransaction: deleteTransaction,
    getAccountTransactions: getAccountTransactions,
  }, dispatch);
}

const initialAddTransactionFormState = {
  transactionFields: {},
  allFieldsValid: false
}

class StockTransactionsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      addTransactionFormState: Object.assign(
        {}, initialAddTransactionFormState
      ),
      deleteConfirmOpen: false,
      deleteId: null,
    };
    this.show = () => this.setState({ open: true })
    this.close = () => this.setState({ open: false })
    this.showConfirmDelete = (id) => this.setState({ deleteConfirmOpen: true, deleteId: id })
    this.closeConfirmDelete = () => this.setState({ deleteConfirmOpen: false, deleteId: null })
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.addStock = this.addStock.bind(this);
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
               onClose={this.close}>
            <Modal.Header>Add Stock Transaction</Modal.Header>
            <Modal.Content>
              <AddStockTransactionForm onChange={this.onChange} />
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.close}>
                Cancel
              </Button>
              <Button primary
                      disabled={!this.state.addTransactionFormState.allFieldsValid}
                      onClick={this.addStock}>
                Create
              </Button>
            </Modal.Actions>
        </Modal>
        <Button primary onClick={this.show}>
          <Icon name="plus" />
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
                      <Icon name="pencil" className="action"/>
                      <Icon name="trash"
                            className="action"
                            onClick={() => this.showConfirmDelete(transaction.id)}
                      />
                    </Table.Cell>
                    <Table.Cell>{transaction.transaction_type === 0 ? "Buy" : "Sell" }</Table.Cell>
                    <Table.Cell>{transaction.stock_symbol}</Table.Cell>
                    <Table.Cell>{(transaction.cost_per_unit / 100).toFixed(2)}</Table.Cell>
                    <Table.Cell>{transaction.quantity}</Table.Cell>
                    <Table.Cell>{(transaction.trade_fee / 100).toFixed(2)}</Table.Cell>
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

  deleteTransaction() {
    if (this.state.deleteId !== null) {
      this.props.deleteTransaction(this.state.deleteId);
      this.closeConfirmDelete();
    }
  }

  addStock() {
    this.props.addTransaction(
      Object.assign(
        {}, this.state.addTransactionFormState.transactionFields, {
          account_id: this.props.selectedAccountId
        }
      )
    );
    this.setState({
      addTransactionFormState: Object.assign(
        {}, initialAddTransactionFormState
      )
    });
    this.close();
  }

  onChange(formState) {
    this.setState({
      addTransactionFormState: formState
    });
  }
}

export default connect(mapToStateProps, mapDispatchToProps)(StockTransactionsContainer);
