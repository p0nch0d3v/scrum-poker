import React, { FunctionComponent, useEffect } from 'react';
import * as d3 from 'd3'
import { SummaryChartItemDTO } from "models";
import { PieArcDatum } from 'd3';

type SummaryChartProps = {
  style: any,
  data: Array<SummaryChartItemDTO>,
  outerRadius: number,
  innerRadius: number,
  windowinnerWidth: number
}

const SummaryChartComponent: FunctionComponent<SummaryChartProps> = ({ style, data, outerRadius, innerRadius, windowinnerWidth }) => {
  const margin = {
    top: 50, right: 50, bottom: 50, left: 50,
  };

  const width = 2 * outerRadius + margin.left + margin.right;
  const height = 2 * outerRadius + margin.top + margin.bottom;

  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateCool)
    .domain([0, data.length]);

  useEffect(() => {
    drawChart();
  }, [data, windowinnerWidth]);

  function drawChart() {
    // Remove the old svg
    d3.select('#pie-container')
      .select('svg')
      .remove();

    // Create new svg
    const svg = d3
      .select('#pie-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arcGenerator = d3
      .arc<PieArcDatum<SummaryChartItemDTO>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const pieGenerator = d3
      .pie<SummaryChartItemDTO>()
      .padAngle(0)
      .value((d) => d.value);

    const arc = svg
      .selectAll()
      .data(pieGenerator(data))
      .enter();

    // Append arcs
    arc
      .append('path')
      .attr('d', arcGenerator)
      .style('fill', (_, i) => colorScale(data.length - i))
      .style('stroke', '#fff')
      .style('stroke-width', 1);

    // Append text labels
    arc
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text((d) => d.data.label)
      .style('fill', (_, i) => colorScale((data.length - i) * -1))
      .style('font-size', '2rem')
      .attr('transform', (d) => {
        const [x, y] = arcGenerator.centroid(d);
        return `translate(${x}, ${y})`;
      });
  }

  return <div style={style} id="pie-container" />;
}

export default SummaryChartComponent;
