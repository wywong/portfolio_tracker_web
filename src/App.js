import React from 'react';
import './App.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUserDetails } from './actions/index';
import { REQUEST_STATUS } from "./models/RequestStatus";
import StockTransactionsContainer from './components/StockTransactionsContainer';
import PortfolioDashboard from './components/PortfolioDashboard';
import {
  getAccountStats,
} from './actions/Stats';
import TopBar from './components/TopBar';
import {
  Container,
  Dimmer,
  Loader,
  Tab,
} from 'semantic-ui-react';

const mapToStateProps = function(state) {
  return {
    detailState: state.userDetailReducer.requestState,
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({
    fetchUserDetails: fetchUserDetails,
    getAccountStats: getAccountStats,
  }, dispatch);
}

const panes = [
  {
    menuItem: 'Dashboard',
    render: () => {
      return (
        <Tab.Pane>
          <PortfolioDashboard />
        </Tab.Pane>
      );
    }
  },
  {
    menuItem: 'Stock Transactions',
    render: () => {
      return (
        <Tab.Pane>
          <StockTransactionsContainer />
        </Tab.Pane>
      );
    }
  },
]



class App extends React.Component {

  componentDidMount() {
    this.props.fetchUserDetails();
  }

  componentDidUpdate(prevProps) {
    if (this.props.detailState === REQUEST_STATUS.FAILED) {
      window.location.href = '/auth/login';
    }
    if (this.props.detailState === REQUEST_STATUS.SUCCESS) {
      this.props.getAccountStats();
    }
  }

  get isLoading() {
    return !this.props.detailState;
  }

  render() {
    return (
      <Container fluid={true}>
        { this.isLoading ?
          <Dimmer active>
            <Loader />
          </Dimmer> : null
        }
        <TopBar></TopBar>
        <Tab className="portfolio-tabs" panes={panes} />
      </Container>
    );
  }
}

export default connect(mapToStateProps, mapDispatchToProps)(App);
