import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react'
const mapToStateProps = function(state) {
  return {
    stats: state.investmentAccountReducer.stats,
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({
  }, dispatch);
}


class PortfolioDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.breakdown = this.breakdown.bind(this);
    this.hasMarketValue = () => this.props.stats.market_value;
    this.hasBreakdown = () => (this.props.stats.market_value || {}).breakdown;
  }

  render() {
    return (
      <div className="portfolio-dashboard">
        { this.hasBreakdown() ? <Table celled compact collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Stock</Table.HeaderCell>
              <Table.HeaderCell>Market Value</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { this.breakdown().map( stock => {
              return (
                <Table.Row key={stock.stock_symbol}>
                  <Table.Cell>{stock.stock_symbol}</Table.Cell>
                  <Table.Cell>{stock.value}</Table.Cell>
                </Table.Row>
              )
            }) }
          </Table.Body>
        </Table> : null }
      </div>
    );
  }

  breakdown() {
    let market_value = this.props.stats.market_value || {};
    let breakdown_obj = market_value.breakdown || {};
    let breakdown_data = [];
    for (let key in breakdown_obj) {
      breakdown_data.push({
        stock_symbol: key,
        value: breakdown_obj[key]
      });
    }
    return breakdown_data;
  }
}

export default connect(mapToStateProps, mapDispatchToProps)(PortfolioDashboard);
