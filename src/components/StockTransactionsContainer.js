import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addTransaction } from "../actions/StockTransaction";
import { Button, Modal } from 'semantic-ui-react'
import AddStockTransactionForm from './AddStockTransactionForm';
import './StockTransactionsContainer.css';


const mapToStateProps = function(state) {
  return {
    transactions: state.stockTransactionReducer.transactions
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({
    addTransaction: addTransaction
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
        <Button onClick={this.show}>Add Transaction</Button>
      </div>
    );
  }

  addStock() {
    this.props.addTransaction(
      this.state.addTransactionFormState.transactionFields
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
