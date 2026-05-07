import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { createChart, LineSeries } from 'lightweight-charts';

@Component({
  selector: 'app-sparkline',
  standalone: true,
  template: `<div #chartContainer style="width:100px;height:40px;"></div>`,
})
export class SparklineComponent implements OnChanges {

  @ViewChild('chartContainer', { static: true }) container!: ElementRef;
  @Input() data: number[] = [];

  chart: any;
  series: any;

  ngOnChanges() {
    if (!this.container) return;

    // 🔥 crear chart solo una vez
    if (!this.chart) {
      this.chart = createChart(this.container.nativeElement, {
        width: 100,
        height: 40,
        layout: {
          background: { color: 'transparent' },
          textColor: '#999'
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { visible: false }
        },
        timeScale: { visible: false },
        rightPriceScale: { visible: false },
      });

      // 🔥 NUEVA API
      this.series = this.chart.addSeries(LineSeries, {
        color: '#16c784',
        lineWidth: 2,
      });
    }

    // 🔥 actualizar data
    const formatted = this.data.map((price, i) => ({
      time: i,
      value: price,
    }));

    this.series.setData(formatted);
  }
}