
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react'
import {
  getInvestmentAccountAdjustCostBase,
} from '../actions/InvestmentAccount.js';
import InvestmentAccountTools from './InvestmentAccountTools';

const mapToStateProps = function(state) {
  return {
    acb: state.investmentAccountReducer.acb,
    selectedAccountId: state.investmentAccountReducer.selectedAccountId,
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({
    getInvestmentAccountAdjustCostBase: getInvestmentAccountAdjustCostBase,
  }, dispatch);
}


class AdjustCostBaseContainer extends React.Component {
  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedAccountId !== this.props.selectedAccountId) {
      if (this.props.selectedAccountId !== null) {
        this.props.getInvestmentAccountAdjustCostBase(this.props.selectedAccountId);
      }
    }
  }

  render() {
    return (
      <div className="adjust-cost-base-container">
        <InvestmentAccountTools taxableOnly={true}/>
        <Table celled compact collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Stock</Table.HeaderCell>
              <Table.HeaderCell>Adjust Cost Base</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              this.props.acb['adjust_cost_base'] ?  Object.keys(
                this.props.acb['adjust_cost_base']
              ).map(key => {
                let stock_acb = this.props.acb['adjust_cost_base'][key];
                return (
                  <Table.Row key={key}>
                    <Table.Cell textAlign="center">{key}</Table.Cell>
                    <Table.Cell textAlign="center">{stock_acb}</Table.Cell>
                  </Table.Row>
                );
              }) : null
            }
          </Table.Body>
        </Table>
      </div>
    );
  }

}

export default connect(mapToStateProps, mapDispatchToProps)(AdjustCostBaseContainer);
