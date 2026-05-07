import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MarketService } from '../../../infraestructure/services/market.service';
import { SparklineComponent } from "../../shared/sparkline/sparkline";

@Component({
  selector: 'app-market-container',
  standalone: true,
  imports: [CommonModule, FormsModule, SparklineComponent, RouterModule],
  templateUrl: './market-container.html',
  styleUrls: ['./market-container.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketContainer implements OnInit, OnDestroy {

  coins: any[] = [];
  filteredCoins: any[] = [];
  search: string = '';
  loading: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    private marketService: MarketService,
    private router: Router,
    private cdr: ChangeDetectorRef // 🔥 CLAVE con OnPush
  ) {}

  ngOnInit(): void {
    this.initMarket();
  }

async initMarket() {

  this.loading = true;

  try {
    const data = await this.marketService.getMarket();

    this.coins = (data || []).map(c => ({
      ...c,
      prevPrice: c.price ?? 0,
      history: []
    }));

    this.filteredCoins = [...this.coins];
    this.loading = false;

    // 🔥 CONECTAR TODOS LOS SÍMBOLOS
    const symbols = this.coins.map(c => c.symbol);
    this.marketService.connectMultiple(symbols);

    this.cdr.markForCheck();

  } catch (error) {
    console.error(error);
    this.loading = false;
    this.cdr.markForCheck();
  }

  // 🔥 STREAM GLOBAL (esto sí sigue igual)
  this.marketService.onPrice()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.updateCoin(data);
    });
}
  trackBySymbol(index: number, item: any) {
    return item.symbol;
  }


updateCoin(data: any) {
  const coin = this.coins.find(c => c.symbol === data.symbol);
  if (!coin) return;

  coin.prevPrice = coin.price;
  coin.price = data.price;

  if (!coin.history) coin.history = [];

  coin.history.push(data.price);

  if (coin.history.length > 20) {
    coin.history.shift();
  }

  if (this.search) {
    this.onSearch();
  }

  this.cdr.markForCheck();
}
  onSearch() {
    const term = this.search.toLowerCase();

    if (!term) {
      this.filteredCoins = [...this.coins];
      return;
    }

    this.filteredCoins = this.coins.filter(c =>
      c.symbol.toLowerCase().includes(term) ||
      c.name.toLowerCase().includes(term)
    );
  }

  goToTrade(coin: any) {
    this.router.navigate(['/trade', coin.symbol]);
  }

  get topGainers() {
    if (!this.coins.length) return [];

    return [...this.coins]
      .filter(c => typeof c.change === 'number')
      .sort((a, b) => b.change - a.change)
      .slice(0, 5);
  }

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();

  this.marketService.disconnect();
}
}