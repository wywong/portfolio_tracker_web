import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addTransaction } from "../actions/StockTransaction";
import { Button, Input, Modal, Dropdown } from 'semantic-ui-react'


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

const transactionTypes = [
  { key: '0', value: '0', text: 'Buy' },
  { key: '1', value: '1', text: 'Sell' },
];

class StockTransactionsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      transactionType: '0',
    };
    this.show = () => this.setState({ open: true })
    this.close = () => this.setState({ open: false })
    this.handleTransactionTypeChange = (e, { value }) => this.setState({ transactionType: value });
    this.addStock = this.addStock.bind(this);
  }

  addStock() {
    // todo-ww clean this up and add error state

    let transactionType = parseInt(this.state.transactionType, 10);
    let stock_symbol = this.stockSymbolRef.inputRef.current.value;
    let cost_per_unit = this.costPerUnitRef.inputRef.current.value;
    // todo-ww converts cents to integer
    if (!/\d+(\.\d{1,2})?/.test(cost_per_unit)) {
      return;
    } else {
      let numDecimals = (cost_per_unit.split('.')[1] || []).length;
      cost_per_unit = Math.round(parseFloat(cost_per_unit, 10) * Math.pow(10, numDecimals));
    }
    let quantity = this.quantityRef.inputRef.current.value;
    if (!/\d+/.test(quantity)) {
      return;
    } else {
      quantity = parseInt(quantity, 10);
    }
    let trade_fee = this.tradeFeeRef.inputRef.current.value;
    // todo-ww converts cents to integer
    if (!/\d+(\.\d{1,2})?/.test(trade_fee)) {
      return;
    } else {
      let numDecimals = (trade_fee.split('.')[1] || []).length;
      trade_fee = Math.round(parseFloat(trade_fee, 10) * Math.pow(10, numDecimals));
    }
    let trade_date = this.tradeDateRef.inputRef.current.value;
    // todo-ww proper date validation
    if (!/\d{4}-\d{2}-\d{2}/.test(trade_date)) {
      return;
    }
    this.props.addTransaction({
      transaction_type: transactionType,
      stock_symbol: stock_symbol,
      cost_per_unit: cost_per_unit,
      quantity: quantity,
      trade_fee: trade_fee,
      trade_date: trade_date
    });
    this.close();
  }

  render() {
    return (
      <div className="">
        <Modal size="small"
               open={this.state.open}
               onClose={this.close}>
            <Modal.Header>Add Stock Transaction</Modal.Header>
            <Modal.Content>
              <Dropdown placeholder="Transaction type"
                        selection
                        value={this.state.transactionType}
                        onChange={this.handleTransactionTypeChange}
                        options={transactionTypes}/>
              <Input placeholder="Stock Symbol"
                     ref={el => this.stockSymbolRef = el}/>
              <Input placeholder="Quantity"
                     ref={el => this.quantityRef = el}/>
              <Input placeholder="Cost per unit"
                     ref={el => this.costPerUnitRef = el}/>
              <Input placeholder="Trade Fee"
                     ref={el => this.tradeFeeRef = el}/>
              <Input placeholder="Trade Date"
                     ref={el => this.tradeDateRef = el}/>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.close}>
                Cancel
              </Button>
              <Button positive
                      onClick={this.addStock}>
                Create
              </Button>
            </Modal.Actions>
        </Modal>
        <Button onClick={this.show}>Add transaction</Button>
      </div>
    );
  }
}

export default connect(mapToStateProps, mapDispatchToProps)(StockTransactionsContainer);
