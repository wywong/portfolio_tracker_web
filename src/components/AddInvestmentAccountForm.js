import React from 'react';
import {
  Checkbox,
  Input,
} from 'semantic-ui-react';

const addAccountFormInitialState = {
  name: "",
  taxable: false
};

class AddInvestmentAccountForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addAccountFields: Object.assign(
        {}, addAccountFormInitialState
      )
    };
    this.accountName = this.accountName.bind(this);
    this.handleAccountNameChange = this.handleAccountNameChange.bind(this);
    this.isTaxable = this.isTaxable.bind(this);
    this.handleTaxableChange = this.handleTaxableChange.bind(this);
    this.allFormInputsValid = this.allFormInputsValid.bind(this);
    this.emitFormState = this.emitFormState.bind(this);
  }

  render() {
    return (
      <div className="add-account">
        <Input placeholder="Account Name"
               value={this.accountName()}
               onChange={this.handleAccountNameChange}
        />
        <Checkbox label="Taxable"
                  checked={this.isTaxable()}
                  onChange={this.handleTaxableChange}
        />
      </div>
    );
  }

  emitFormState() {
    this.props.onChange({
      addAccountFields: Object.assign(
        {}, this.state.addAccountFields
      ),
      allFieldsValid: this.allFormInputsValid()
    });
  }

  allFormInputsValid() {
    return this.accountName() !== "";
  }

  accountName() {
    return this.state.addAccountFields.name;
  }

  handleAccountNameChange(e, { value }) {
    this.setState({
      addAccountFields: Object.assign(
        {}, this.state.addAccountFields, {
          name: value
        }
      )
    }, () => this.emitFormState());
  }

  isTaxable() {
    return this.state.addAccountFields.taxable;
  }

  handleTaxableChange(e, { checked }) {
    this.setState({
      addAccountFields: Object.assign(
        {}, this.state.addAccountFields, {
          taxable: checked
        }
      )
    }, () => this.emitFormState());
  }
}

export default AddInvestmentAccountForm;
