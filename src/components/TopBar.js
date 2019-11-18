import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './TopBar.scss';
import {
  Dropdown,
  Menu,
} from 'semantic-ui-react';

const axios = require('axios');

const mapToStateProps = function(state) {
  return {
    stats: state.statsReducer.stats,
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

class UserSettings extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.downloadAllTransactions = this.downloadAllTransactions.bind(this);
  }

  render() {
    return (
      <Dropdown icon="settings"
                className="settings-dropdown"
                pointing="top right"
      >
        <Dropdown.Menu>
          <Dropdown.Item text="Download All Transactions"
                         onClick={this.downloadAllTransactions} />
          <Dropdown.Item text="Logout"
                         onClick={this.logout} />
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  downloadAllTransactions() {
    window.open('/api/v1/transaction/export');
  }

  logout() {
    axios.post('/auth/logout', {})
      .then(() => {
        window.location.href = '/auth/login';
      })
      .catch(() => {
        // todo-ww decide how to handle this error
      });
  }
}


class TopBar extends React.Component {

  render() {
    return (
      <Menu fixed="top" className="top-bar">
        { this.props.stats.book_cost ?
          <span className="portfolio-stat">
            <span className="stat-label">Book cost:</span>
            <p>{this.props.stats.book_cost}</p>
          </span> : null }
        { this.props.stats.market_value ?
          <span className="portfolio-stat">
            <span className="stat-label">Market value:</span>
            <p>{this.props.stats.market_value.total}</p>
          </span> : null }
        <Menu.Menu position="right">
          <UserSettings>
          </UserSettings>
        </Menu.Menu>
      </Menu>
    );
  }

}
export default connect(mapToStateProps, mapDispatchToProps)(TopBar);
