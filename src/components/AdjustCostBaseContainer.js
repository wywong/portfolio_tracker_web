
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react'
import InvestmentAccountTools from './InvestmentAccountTools';

const mapToStateProps = function(state) {
  return {
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({
  }, dispatch);
}


class AdjustCostBaseContainer extends React.Component {
  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
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
          </Table.Body>
        </Table>
      </div>
    );
  }

}

export default connect(mapToStateProps, mapDispatchToProps)(AdjustCostBaseContainer);
