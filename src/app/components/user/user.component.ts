import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import { Chart } from "chart.js";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userId: string;
  from = this.formatDate(new Date(), 6);
  till = this.formatDate(new Date());
  public userName: string;

  public chart = [];

  views: any;
  clicks: any;
  dates: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params.name.replace(/.+id=/, '');
      this.userName = params.name.replace(/\?id=\w+/, '');

      this.userService.getUserStatistic({userId: this.userId, from: this.from, till: this.till})
        .subscribe((data: Object[]) => {
          // @ts-ignore
          this.views = data.map(item => item.page_views);
          // @ts-ignore
          this.clicks = data.map(item => item.clicks);
          // @ts-ignore
          this.dates = data.map(item => item.date).map((item: Date) => new Date(item).toLocaleDateString());

          this.drawCharts();
      }, error => console.log(error));
    });
  }

  changeFromDate(event) {
    this.userService.getUserStatistic({userId: this.userId, from: event, till: this.till})
      .subscribe((data: Object[]) => {
        // @ts-ignore
        this.views = data.map(item => item.page_views);
        // @ts-ignore
        this.clicks = data.map(item => item.clicks);
        // @ts-ignore
        this.dates = data.map(item => item.date).map((item: Date) => new Date(item).toLocaleDateString());

        this.drawCharts();
      }, error => console.log(error));
  }

  changeTillDate(event) {
    this.userService.getUserStatistic({userId: this.userId, from: this.from, till: event})
      .subscribe((data: Object[]) => {
        // @ts-ignore
        this.views = data.map(item => item.page_views);
        // @ts-ignore
        this.clicks = data.map(item => item.clicks);
        // @ts-ignore
        this.dates = data.map(item => item.date).map((item: Date) => new Date(item).toLocaleDateString());

        this.drawCharts();
      }, error => console.log(error));
  }

  formatDate(date: Date, sub: number = 0): string {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    month = month.length === 1 ? '0' + month : month;
    let day = (date.getDate() - sub).toString();
    day = day.length === 1 ? '0' + day : day;

    return `${year}-${month}-${day}`;
  };

  drawCharts(): void {
    console.log(this.clicks);
    console.log(this.views);
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
}
