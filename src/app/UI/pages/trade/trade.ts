import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MarketService } from '../../../infraestructure/services/market.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { UserService } from '../../../infraestructure/services/user.service';

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, DecimalPipe, NgIf, NgFor],
  templateUrl: './trade.html',
  styleUrl: './trade.css',
})
export class Trade implements OnInit, OnDestroy {

  symbol: string = 'BTCUSDT';
  private currentSymbol: string = '';

  price: number = 0;
  change: number = 0;
  balance: number | null = 0;

  type: 'buy' | 'sell' = 'buy';
  orderType: 'market' | 'limit' = 'limit';

  amount: number = 0;
  priceInput: number = 0;

  orderbook: any = { bids: [], asks: [] };

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private marketService: MarketService,
    private userService: UserService
  ) {}

  get baseSymbol(): string {
    return this.symbol ? this.symbol.replace('USDT', '') : '';
  }

  /* =========================
     🔥 TRADING VIEW
  ========================== */

  loadTradingView(): Promise<void> {
    return new Promise((resolve) => {

      if ((window as any).TradingView) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.onload = () => resolve();

      document.body.appendChild(script);
    });
  }

  async initChart() {
    await this.loadTradingView();

    const TradingView = (window as any).TradingView;

    if (!TradingView) return;

    new TradingView.widget({
      container_id: "tv-chart",
      width: "100%",
      height: 400,
      symbol: `BINANCE:${this.symbol}`,
      interval: "15",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "es",
      toolbar_bg: "#0b0e11",
    });
  }

  /* =========================
     🔥 MARKET DATA
  ========================== */

  connectMarket(symbol: string) {
    this.currentSymbol = symbol.toLowerCase();

    this.marketService.connect(this.currentSymbol);

    // 💰 PRICE
    this.marketService.onPrice()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.price = data.price;
      });

    // 📚 ORDERBOOK
    this.marketService.onOrderBook()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.orderbook = {
          bids: data.bids?.slice(0, 10) || [],
          asks: data.asks?.slice(0, 10) || []
        };
      });
  }

  /* =========================
     🔥 INIT
  ========================== */

  ngOnInit() {
    this.userService.getMe().subscribe(user => {
      this.balance = user.balance;
    }
    );
    this.route.paramMap.subscribe(params => {
      this.symbol = params.get('symbol') || 'BTCUSDT';

      this.connectMarket(this.symbol);
      setTimeout(() => this.initChart(), 0);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.marketService.disconnect(); // 🔥 importante
  }

  /* =========================
     🔥 TRADING LOGIC
  ========================== */

  executeTrade() {
    if (!this.amount || this.amount <= 0) {
      alert('Cantidad inválida');
      return;
    }

    const price = this.orderType === 'market'
      ? this.price
      : this.priceInput;

    if (!price || price <= 0) {
      alert('Precio inválido');
      return;
    }

    const total = this.amount * price;

    if (this.type === 'buy') {
      this.buy(total, price);
    } else {
      this.sell(total, price);
    }
  }

  buy(total: number, price: number) {
    if ((this.balance || 0) < total) {
      alert('Fondos insuficientes');
      return;
    }

    this.balance! -= total;

    alert(`Compraste ${this.amount} ${this.baseSymbol}`);

    this.resetForm();
  }

  sell(total: number, price: number) {
    this.balance! += total;

    alert(`Vendiste ${this.amount} ${this.baseSymbol}`);

    this.resetForm();
  }

  resetForm() {
    this.amount = 0;
    this.priceInput = 0;
  }

  getTotal() {
    const price = this.orderType === 'market'
      ? this.price
      : this.priceInput;

    return this.amount * price;
  }
}