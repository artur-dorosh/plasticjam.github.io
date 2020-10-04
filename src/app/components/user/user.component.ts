import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Chart } from 'chart.js';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IStatistic } from '../../models/statistic.interface';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  public from = this.formatDate(new Date(), 6);
  public till = this.formatDate(new Date());

  public userId: string;
  public userName: string;

  public chart = [];

  public views: any;
  public clicks: any;
  public dates: any;

  private onDestroyed$ = new Subject<any>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap((params: {name: string, id: string}) => {
          this.userName = params.name;
          return this.userService.getUserStatistic({userId: params.id, from: this.from, till: this.till});
        }
      )
    ).subscribe((data: IStatistic[]) => {
      this.views = data.map(item => item.page_views);
      this.clicks = data.map(item => item.clicks);
      this.dates = data.map(item => item.date).map((item: string) => new Date(item).toLocaleDateString());

      this.drawCharts();
    });
  }

  changeFromDate(event) {
    this.userService.getUserStatistic({userId: this.userId, from: event, till: this.till}).pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe((data: IStatistic[]) => {
        this.views = data.map(item => item.page_views);
        this.clicks = data.map(item => item.clicks);
        this.dates = data.map(item => item.date).map((item: string) => new Date(item).toLocaleDateString());

        this.drawCharts();
      }, error => console.log(error));
  }

  changeTillDate(event) {
    this.userService.getUserStatistic({userId: this.userId, from: this.from, till: event}).pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe((data: IStatistic[]) => {
        this.views = data.map(item => item.page_views);
        this.clicks = data.map(item => item.clicks);
        this.dates = data.map(item => item.date).map((item: string) => new Date(item).toLocaleDateString());

        this.drawCharts();
      });
  }

  formatDate(date: Date, sub: number = 0): string {
    const year = date.getFullYear();
    let month = (Math.abs(date.getMonth() + 1)).toString();
    month = month.length === 1 ? '0' + month : month;
    let day = (Math.abs(date.getDate() - sub)).toString();
    day = day.length === 1 ? '0' + day : day;

    return `${year}-${month}-${day}`;
  }

  drawCharts(): void {
    this.chart = new Chart('clicks', {
      type: 'line',
      data: {
        labels: this.dates,
        datasets: [
          {
            data: this.clicks,
            borderColor: '#3A80BA',
            fill: 'false'
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
      }
    });

    this.chart = new Chart('views', {
      type: 'line',
      data: {
        labels: this.dates,
        datasets: [
          {
            data: this.views,
            borderColor: '#3A80BA',
            fill: 'false'
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
