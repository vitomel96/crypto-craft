import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MarketService implements OnDestroy {

  private ws!: WebSocket;

  private priceSubject = new Subject<any>();
  private candleSubject = new Subject<any>();
  private orderBookSubject = new Subject<any>();

  /* =========================
     🔥 LISTA BASE DE MERCADO
  ========================== */

  // Puedes ajustar esto dinámicamente luego
  private defaultSymbols = [
    'btcusdt',
    'ethusdt',
    'solusdt',
    'bnbusdt',
    'xrpusdt'
  ];

  /* =========================
     🔥 SNAPSHOT (SIN BACKEND)
  ========================== */

  getMarket(): Promise<any[]> {
    return fetch('https://api.binance.com/api/v3/ticker/24hr')
      .then(res => res.json())
      .then((data: any[]) => {

        return data
          .filter(d => d.symbol.endsWith('USDT'))
          .slice(0, 20) // 🔥 limita para rendimiento
          .map(d => ({
            symbol: d.symbol,
            name: d.symbol.replace('USDT', ''),
            price: parseFloat(d.lastPrice),
            change: parseFloat(d.priceChangePercent)
          }));
      });
  }

  /* =========================
     🔥 SINGLE SYMBOL
  ========================== */

  connect(symbol: string = 'btcusdt') {
    this.disconnect();

    const streams = [
      `${symbol}@trade`,
      `${symbol}@kline_1m`,
      `${symbol}@depth`
    ].join('/');

    this.ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streams}`
    );

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const data = msg.data;

      switch (msg.stream) {

        case `${symbol}@trade`:
          this.priceSubject.next({
            symbol: data.s,
            price: parseFloat(data.p)
          });
          break;

        case `${symbol}@kline_1m`:
          this.candleSubject.next(data.k);
          break;

        case `${symbol}@depth`:
          this.orderBookSubject.next(data);
          break;
      }
    };

    this.handleReconnect(() => this.connect(symbol));
  }

  /* =========================
     🔥 MULTI SYMBOL (MARKET)
  ========================== */

  connectMultiple(symbols: string[] = this.defaultSymbols) {
    this.disconnect();

    const streams = symbols
      .map(s => `${s.toLowerCase()}@trade`)
      .join('/');

    this.ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streams}`
    );

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const data = msg.data;

      this.priceSubject.next({
        symbol: data.s,
        price: parseFloat(data.p)
      });
    };

    this.handleReconnect(() => this.connectMultiple(symbols));
  }

  /* =========================
     🔁 RECONNECT CENTRALIZADO
  ========================== */

  private handleReconnect(reconnectFn: () => void) {
    this.ws.onerror = (err) => {
      console.error('Binance WS error', err);
    };

    this.ws.onclose = () => {
      console.warn('WS reconnecting...');
      setTimeout(() => reconnectFn(), 3000);
    };
  }

  /* =========================
     🔥 OBSERVABLES
  ========================== */

  onPrice(): Observable<any> {
    return this.priceSubject.asObservable().pipe(shareReplay(1));
  }

  onCandle(): Observable<any> {
    return this.candleSubject.asObservable().pipe(shareReplay(1));
  }

  onOrderBook(): Observable<any> {
    return this.orderBookSubject.asObservable().pipe(shareReplay(1));
  }

  /* =========================
     🔌 CLEANUP
  ========================== */

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}