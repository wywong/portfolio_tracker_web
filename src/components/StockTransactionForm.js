import React from 'react';
import { Input, Dropdown } from 'semantic-ui-react'

const transactionTypes = [
  { key: '0', value: '0', text: 'Buy' },
  { key: '1', value: '1', text: 'Sell' },
];

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

const transactionFormInitialState = {
  transaction_type: '0',
  stock_symbol: "",
  cost_per_unit: "",
  quantity: "",
  trade_fee: "",
  trade_date: "",
}

class StockTransactionForm extends React.Component {
  constructor(props) {
    super(props);
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
    let initialFields = Object.assign(
      {}, transactionFormInitialState, props.initialFormFields,
    );
    this.state = {
      transactionFields: initialFields,
      allFieldsValid: this.allFormInputsValid(initialFields)
    };
    this.emitFormState();
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
    let fields = {
      transaction_type: parseInt(this.transactionType(), 10),
      stock_symbol: this.stockSymbol(),
      cost_per_unit: currencyToInteger(this.costPerUnit()),
      quantity: this.quantity(),
      trade_fee: currencyToInteger(this.tradeFee()),
      trade_date: this.tradeDate()
    };
    this.props.onChange({
      transactionFields: fields,
      allFieldsValid: this.allFormInputsValid(fields)
    });
  }

  allFormInputsValid({
    transaction_type,
    stock_symbol,
    cost_per_unit,
    quantity,
    trade_fee,
    trade_date,
  }) {
    return stock_symbol !== "" &&
      validCurrency(cost_per_unit) &&
      validPositiveInteger(quantity) &&
      validCurrency(trade_fee) &&
      validYYYY_MM_DD(trade_date)
  }

  revertBadFormInput() {
    this.setState({
      transactionFields: Object.assign(
        {}, this.state.transactionFields
      )
    });
  }

  transactionType() {
    return this.state.transactionFields.transaction_type;
  }

  handleTransactionTypeChange(e, { value }) {
    this.setState({
      transactionFields: Object.assign(
        {}, this.state.transactionFields, {
          transaction_type: value
        }
      )
    }, () => {
      this.emitFormState();
    });
  }

  stockSymbol() {
    return this.state.transactionFields.stock_symbol;
  }

  handleStockSymbolChange(e, { value }) {
    this.setState({
      transactionFields: Object.assign(
        {}, this.state.transactionFields, {
          stock_symbol: value
        }
      )
    }, () => {
      this.emitFormState();
    });
  }

  costPerUnit() {
    return this.state.transactionFields.cost_per_unit;
  }

  handleCostPerUnitChange(e, { value }) {
    if (validCurrency(value) || value === "") {
      this.setState({
        transactionFields: Object.assign(
          {}, this.state.transactionFields, {
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
    return this.state.transactionFields.quantity;
  }

  handleQuantityChange(e, { value }) {
    if (validPositiveInteger(value) || value === "") {
      this.setState({
        transactionFields: Object.assign(
          {}, this.state.transactionFields, {
            quantity: value
          }
        )
      });
    } else {
      this.revertBadFormInput();
    }
  }

  tradeFee() {
    return this.state.transactionFields.trade_fee;
  }

  handleTradeFeeChange(e, { value }) {
    if (validCurrency(value) || value === "") {
      this.setState({
        transactionFields: Object.assign(
          {}, this.state.transactionFields, {
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
    return this.state.transactionFields.trade_date;
  }

  handleTradeDateChange(e, { value }) {
    this.setState({
      transactionFields: Object.assign(
        {}, this.state.transactionFields, {
          trade_date: value
        }
      )
    }, () => {
      this.emitFormState();
    });
  }
}

export default StockTransactionForm;
