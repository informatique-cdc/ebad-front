import {Component, OnInit, ViewChild} from '@angular/core';
import {ApexChart, ApexFill, ApexLegend, ApexStroke, ApexXAxis, ChartComponent} from "ng-apexcharts";
import {StatisticsService} from "../core/services";
import {Statistics} from "../core/models";

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild("chartComponentAvgTime", { static: true })
  chartComponentAvgTime: ChartComponent;
  @ViewChild("chartComponentBatchRunnedNbr", { static: true })
  chartComponentBatchRunnedNbr: ChartComponent;
  chart: ApexChart[] = [];
  stroke: ApexStroke;
  fill: ApexFill;
  xaxis: ApexXAxis;
  colors: string[];
  legend: ApexLegend;
  optionsCountUpMs = {
    separator: ' ',
    decimal: ',',
    suffix: ' ms'
  };

  optionsCountUp = {
    separator: ' ',
    decimal: ','
  };

  statistics: Statistics;
  private dataBatchsNbr: number[] = [];
  seriesBatchsNbr = [{
    name: "Count batchs",
    data: this.dataBatchsNbr
  }];

  private dataAvgTime: number[] = [];
  seriesAvgTime = [{
    name: "Average Time",
    data: this.dataAvgTime
  }];

  labels: string[] = [];

  constructor(private statisticsService: StatisticsService) {
  }

  ngOnInit() {
    this.statisticsService.get().subscribe(
      (statistics) => {
        this.statistics = statistics;
        for(let statByDay of statistics.statisticsByDay){
          this.labels.push(statByDay.date);
          this.dataAvgTime.push(statByDay.executionTime);
          this.dataBatchsNbr.push(statByDay.nbr);
        }
        this.chartComponentAvgTime.updateSeries(this.seriesAvgTime,true);
        this.chartComponentBatchRunnedNbr.updateSeries(this.seriesBatchsNbr,true);
      }
    );

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
        enabled: true
      },
    };

    this.chart[2] = {
      type: "line",
      fontFamily: 'inherit',
      height: 40.0,
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: true,
        speed: 2000
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

    this.xaxis = {
      type: 'datetime',
    };

    this.colors = ["#206bc4"];
    this.legend = {
      show: false,
    };
  }

}
