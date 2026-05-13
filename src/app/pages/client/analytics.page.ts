import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="page-grid">
      <div class="card">
        <h3>{{ 'nav.analytics' | translate }}</h3>
        <div class="stats-grid">
          <div class="stat">
            <span>Incoming</span>
            <strong>{{ data?.totals.incoming | number:'1.2-2' }} EUR</strong>
          </div>
          <div class="stat">
            <span>Outgoing</span>
            <strong>{{ data?.totals.outgoing | number:'1.2-2' }} EUR</strong>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Spending</h3>
        <canvas #chartCanvas height="120"></canvas>
      </div>
    </div>
  `
})
export class AnalyticsPageComponent implements OnInit {
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;
  data: any;
  chart?: Chart;

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<any>('/client/analytics').subscribe((res) => {
      this.data = res;
      this.renderChart();
    });
  }

  renderChart() {
    if (!this.chartCanvas) {
      return;
    }

    const labels = this.data?.spendingByDay?.map((item: any) => item.date) || [];
    const values = this.data?.spendingByDay?.map((item: any) => item.amount) || [];

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Spending',
            data: values,
            borderColor: '#00a6a0',
            backgroundColor: 'rgba(0, 166, 160, 0.2)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    };

    this.chart?.destroy();
    this.chart = new Chart(this.chartCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D, config);
  }
}
