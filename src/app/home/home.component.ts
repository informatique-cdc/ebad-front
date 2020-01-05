import {Component, OnInit} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexLegend,
  ApexStroke,
  ApexXAxis
} from "ng-apexcharts";

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  chart: ApexChart[] = [];
  stroke: ApexStroke;
  fill: ApexFill;
  series: ApexAxisChartSeries;
  xaxis: ApexXAxis;
  labels: string[];
  colors: string[];
  legend: ApexLegend;

  constructor() {
  }

  ngOnInit() {
    this.chart[0] = {
      type: "bar",
      fontFamily: 'inherit',
      height: 40.0,
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: false
      },
    };
    this.chart[1] = {
      type: "line",
      fontFamily: 'inherit',
      height: 40.0,
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: false
      },
    };
    this.chart[2] = {
      type: "area",
      fontFamily: 'inherit',
      height: 40.0,
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: false
      },
    };
    this.stroke = {
      width: 2,
      dashArray: [0, 3],
      lineCap: "round",
      curve: "smooth",
    };
    this.fill = {
      opacity: 1
    };

    this.series = [{
      name: "Profits",
      data: [37, 35, 44, 28, 36, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46, 39, 62, 51, 35, 41, 67]
    }];

    this.xaxis = {
      type: 'datetime',
    };

    this.labels = [];
    for (let i = 1; i < 31; i++) {
      this.labels.push('2019-09-' + i);

    }
    this.colors = ["#206bc4"];
    this.legend = {
      show: false,
    };
  }

}
