import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addTransaction } from "../actions/StockTransaction";
import { Button, Input, Modal, Dropdown } from 'semantic-ui-react'
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

const transactionTypes = [
  { key: '0', value: '0', text: 'Buy' },
  { key: '1', value: '1', text: 'Sell' },
];

const addTransactionFormInitialState = {
  transactionType: '0',
  stock_symbol: "",
  cost_per_unit: "",
  quantity: "",
  trade_fee: "",
  trade_date: "",
  valid_date: false
}

const validCurrency = (value) => {
  return /^\d+(\.\d{0,2}?)?$/.test(value);
}

const currencyToInteger = (value) => {
  return Math.round(parseFloat(value) * 100);
}

const validPositiveInteger = (value) => {
  return /^\d+$/.test(value);
}

const validYYYY_MM_DD = (value) => {
  return /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(value);
}

class AddStockTransactionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addTransactionFields: Object.assign(
        {}, addTransactionFormInitialState
      )
    };
    this.transactionType = this.transactionType.bind(this);
    this.handleTransactionTypeChange = this.handleTransactionTypeChange.bind(this);
    this.stockSymbol = this.stockSymbol.bind(this);
    this.handleStockSymbolChange = this.handleStockSymbolChange.bind(this);
    this.costPerUnit = this.costPerUnit.bind(this);
    this.handleCostPerUnitChange = this.handleCostPerUnitChange.bind(this);
    this.quantity = this.quantity.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.tradeFee = this.tradeFee.bind(this);
    this.handleTradeFeeChange = this.handleTradeFeeChange.bind(this);
    this.tradeDate = this.tradeDate.bind(this);
    this.handleTradeDateChange = this.handleTradeDateChange.bind(this);
    this.revertBadFormInput = this.revertBadFormInput.bind(this);
    this.allFormInputsValid = this.allFormInputsValid.bind(this);
    this.emitFormState = this.emitFormState.bind(this);
  }

  render() {
    return (
      <div className="add-transaction">
        <Dropdown placeholder="Transaction type"
                  selection
                  value={this.transactionType()}
                  onChange={this.handleTransactionTypeChange}
                  options={transactionTypes}/>
        <Input placeholder="Stock Symbol"
               value={this.stockSymbol()}
               onChange={this.handleStockSymbolChange}
        />
        <Input placeholder="Quantity"
               type="number"
               value={this.quantity()}
               onChange={this.handleQuantityChange}
        />
        <Input placeholder="Cost per unit"
               type="number"
               value={this.costPerUnit()}
               onChange={this.handleCostPerUnitChange}
        />
        <Input placeholder="Trade Fee"
               type="number"
               value={this.tradeFee()}
               onChange={this.handleTradeFeeChange}
        />
        <Input placeholder="Trade Date"
               value={this.tradeDate()}
               onChange={this.handleTradeDateChange}
        />
      </div>
    );
  }

  emitFormState() {
    this.props.onChange({
      transactionFields: {
        transaction_type: parseInt(this.transactionType(), 10),
        stock_symbol: this.stockSymbol(),
        cost_per_unit: currencyToInteger(this.costPerUnit()),
        quantity: this.quantity(),
        trade_fee: currencyToInteger(this.tradeFee()),
        trade_date: this.tradeDate()
      },
      allFieldsValid: this.allFormInputsValid()
    });
  }

  allFormInputsValid() {
    return this.stockSymbol() !== "" &&
      this.costPerUnit() !== "" &&
      this.quantity() !== "" &&
      this.tradeFee() !== "" &&
      this.state.addTransactionFields.valid_date;
  }

  revertBadFormInput() {
    this.setState({
      addTransactionFields: Object.assign(
        {}, this.state.addTransactionFields
      )
    });
  }

  transactionType() {
    return this.state.addTransactionFields.transactionType;
  }

  handleTransactionTypeChange(e, { value }) {
    this.setState({
      addTransactionFields: Object.assign(
        {}, this.state.addTransactionFields, {
          transactionType: value
        }
      )
    }, () => {
      this.emitFormState();
    });
  }

  stockSymbol() {
    return this.state.addTransactionFields.stock_symbol;
  }

  handleStockSymbolChange(e, { value }) {
    this.setState({
      addTransactionFields: Object.assign(
        {}, this.state.addTransactionFields, {
          stock_symbol: value
        }
      )
    }, () => {
      this.emitFormState();
    });
  }

  costPerUnit() {
    return this.state.addTransactionFields.cost_per_unit;
  }

  handleCostPerUnitChange(e, { value }) {
    if (validCurrency(value)) {
      this.setState({
        addTransactionFields: Object.assign(
          {}, this.state.addTransactionFields, {
            cost_per_unit: value
          }
        )
      }, () => {
        this.emitFormState();
      });
    } else {
      this.revertBadFormInput();
    }
  }

  quantity() {
    return this.state.addTransactionFields.quantity;
  }

  handleQuantityChange(e, { value }) {
    if (validPositiveInteger(value)) {
      this.setState({
        addTransactionFields: Object.assign(
          {}, this.state.addTransactionFields, {
            quantity: value
          }
        )
      });
    } else {
      this.revertBadFormInput();
    }
  }

  tradeFee() {
    return this.state.addTransactionFields.trade_fee;
  }

  handleTradeFeeChange(e, { value }) {
    if (validCurrency(value)) {
      this.setState({
        addTransactionFields: Object.assign(
          {}, this.state.addTransactionFields, {
            trade_fee: value
          }
        )
      }, () => {
        this.emitFormState();
      });
    } else {
      this.revertBadFormInput();
    }
  }

  tradeDate() {
    return this.state.addTransactionFields.trade_date;
  }

  handleTradeDateChange(e, { value }) {
    this.setState({
      addTransactionFields: Object.assign(
        {}, this.state.addTransactionFields, {
          trade_date: value,
          valid_date: validYYYY_MM_DD(value)
        }
      )
    }, () => {
      this.emitFormState();
    });
  }
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
        <Button onClick={this.show}>Add transaction</Button>
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
