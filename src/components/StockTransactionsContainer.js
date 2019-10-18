import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addTransaction, getAccountTransactions } from "../actions/StockTransaction";
import { Button, Icon, Modal, Table } from 'semantic-ui-react'
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
      )
    };
    this.show = () => this.setState({ open: true })
    this.close = () => this.setState({ open: false })
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
      <div className="">
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
              <Button positive
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
        <Table celled>
          <Table.Header>
            <Table.Row>
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
                    <Table.Cell>{transaction.transaction_type === 0 ? "Buy" : "Sell" }</Table.Cell>
                    <Table.Cell>{transaction.stock_symbol}</Table.Cell>
                    <Table.Cell>{Math.round(transaction.cost_per_unit / 100).toFixed(2)}</Table.Cell>
                    <Table.Cell>{transaction.quantity}</Table.Cell>
                    <Table.Cell>{Math.round(transaction.trade_fee / 100).toFixed(2)}</Table.Cell>
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
