import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarketService } from '../../../infraestructure/services/market.service';

@Component({
  selector: 'app-trade-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trade-box.html',
  styleUrls: ['./trade-box.css']
})
export class TradeBoxComponent implements OnInit, OnDestroy {

  @Input() symbol: string = 'BTCUSDT';
  @Input() balance: number = 0;
  @Input() priceInput?: number;

  @Output() orderCreated = new EventEmitter<any>();

  price: number = 0;
  amount: number = 0;
  type: 'buy' | 'sell' = 'buy';
  orderType: 'market' | 'limit' = 'market';

  private currentSymbol!: string;

  constructor(private marketService: MarketService) {}

  ngOnInit() {
    this.currentSymbol = this.symbol.toLowerCase();

    if (!this.priceInput) {
      // 🔥 conectar a Binance
      this.marketService.connect(this.currentSymbol);

      this.marketService.onPrice().subscribe(data => {
        this.price = data.price;
      });
    } else {
      this.price = this.priceInput;
    }
  }

  ngOnDestroy(): void {
    this.marketService.disconnect(); // 🔥 importante
  }

  get total() {
    const price = this.orderType === 'market'
      ? this.price
      : this.priceInput || 0;

    return this.amount * price;
  }

  submit() {

    if (!this.amount || this.amount <= 0) {
      alert('Ingresa un monto válido');
      return;
    }

    if (this.type === 'buy' && this.total > this.balance) {
      alert('Saldo insuficiente');
      return;
    }

    const order = {
      symbol: this.symbol,
      type: this.type,
      orderType: this.orderType,
      price: this.orderType === 'market' ? this.price : this.priceInput,
      amount: this.amount,
      total: this.total,
      timestamp: Date.now()
    };

    this.orderCreated.emit(order);
  }
}