import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react'
import * as d3 from 'd3';
import './PorfolioDashboards.css';

const mapToStateProps = function(state) {
  return {
    stats: state.statsReducer.stats,
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
    this.drawChart = this.drawChart.bind(this);
    this.drawSlices = this.drawSlices.bind(this);
    this.drawLabels = this.drawLabels.bind(this);
  }

  componentDidMount() {
    if (this.hasBreakdown()) {
      this.drawChart();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.hasBreakdown()) {
      this.drawChart();
    }
  }

  render() {
    return (
      <div className="portfolio-dashboard">
        { this.hasBreakdown() ? <div className="breakdown-container">
            <Table celled compact collapsing>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Stock</Table.HeaderCell>
                  <Table.HeaderCell>Market Value</Table.HeaderCell>
                  <Table.HeaderCell>Percent</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { this.breakdown().map( stock => {
                  return (
                    <Table.Row key={stock.stock_symbol}>
                      <Table.Cell>{stock.stock_symbol}</Table.Cell>
                      <Table.Cell>{stock.formatted_value}</Table.Cell>
                      <Table.Cell>{stock.percent}</Table.Cell>
                    </Table.Row>
                  )
                }) }
              </Table.Body>
            </Table>
            <div id="market-value-chart">
            </div>
          </div>: null }
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
        formatted_value: breakdown_obj[key].formatted_value,
        value: breakdown_obj[key].raw_percent,
        percent: breakdown_obj[key].percent,
      });
    }
    return breakdown_data;
  }

  drawChart() {
    this._current = undefined;
    let width = 960;
    let height = 450;
    let svg = d3.select("#market-value-chart")
      .append("svg")
      .attr('height', height)
      .attr('width', width)
      .append("g");

    svg.append("g")
      .attr("class", "slices");
    svg.append("g")
      .attr("class", "labels");
    svg.append("g")
      .attr("class", "lines");

    let radius = Math.min(width, height) / 2;
    let pie = d3.pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });

    let arc = d3.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);
    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    this.drawSlices(svg, pie, radius, arc, this.breakdown());
    this.drawLabels(svg, pie, radius, arc, this.breakdown());
  }

  drawSlices(svg, pie, radius, arc, data) {
	let key = function(d){ return d.data.stock_symbol; };
    let slice = svg
      .select(".slices")
      .selectAll("path.slice")
      .data(pie(data), key);


    slice.enter()
      .insert("path")
      .style("fill", function(d) {
        return "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
      })
      .attr("class", "slice")
      .merge(slice)
	  .transition().duration(1000)
	  .attrTween("d", function(d) {
		this._current = this._current || d;
		let interpolate = d3.interpolate(this._current, d);
		this._current = interpolate(0);
		return function(t) {
		  return arc(interpolate(t));
		};
	})

   slice.exit().remove();
  }

  drawLabels(svg, pie, radius, arc, data) {
	let key = function(d){ return d.data.stock_symbol; };
    let outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    let text = svg.select(".labels").selectAll("text")
      .data(pie(data), key);

    function midAngle(d){
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
    text.enter()
      .append("text")
      .attr("dy", ".35em")
      .text(function(d) {
        return d.data.stock_symbol + " " + d.data.percent;
      })
      .merge(text)
      .transition().duration(1000)
        .attrTween("transform", function(d) {
          this._current = this._current || d;
          let interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            let d2 = interpolate(t);
            let pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            return "translate("+ pos +")";
          };
        }).styleTween("text-anchor", function(d){
          this._current = this._current || d;
          let interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            let d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start":"end";
          };
        });

    text.exit().remove();

    let polyline = svg.select(".lines").selectAll("polyline")
      .data(pie(data), key);

    polyline.enter()
      .append("polyline")
      .merge(polyline)
      .transition().duration(1000)
        .attrTween("points", function(d){
          this._current = this._current || d;
          let interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            let d2 = interpolate(t);
            let pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
        });

    polyline.exit().remove();
  }
}

export default connect(mapToStateProps, mapDispatchToProps)(PortfolioDashboard);
