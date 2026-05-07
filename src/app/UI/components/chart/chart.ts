import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CandlestickSeries, createChart } from 'lightweight-charts';
import { MarketService } from '../../../infraestructure/services/market.service';

@Component({
  selector: 'app-chart',
  template: `<div #chart></div>`,
})
export class ChartComponent implements OnInit {
  @ViewChild('chart') chartEl!: ElementRef;

  constructor(private market: MarketService) {}

 ngOnInit() {
  const chart = createChart(this.chartEl.nativeElement, {
    width: 600,
    height: 300,
  });

  const candleSeries = chart.addSeries(CandlestickSeries);

  this.market.onCandle().subscribe((candle: { time: number; open: any; high: any; low: any; close: any; }) => {
    candleSeries.update({
      time: String(Math.floor(candle.time / 1000)) as any,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    });
  });
}
}