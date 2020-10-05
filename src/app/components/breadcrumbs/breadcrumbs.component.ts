import { Component, OnDestroy, OnInit } from '@angular/core';
import { IBreadCrumb } from '../../models/breadcrumb.interface';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface IUserInfo {
  id: string;
  name: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  public breadcrumbs: IBreadCrumb[];

  public user: IUserInfo;

  private onDestroyed$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe((info: IUserInfo) => this.user = info);

    this.breadcrumbs = this.buildBreadCrumb(this.route.root);
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadCrumb(this.route.root);
    });
  }

  buildBreadCrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: IBreadCrumb[] = []
  ): IBreadCrumb[] {
    let title = '';
    if (route.routeConfig && route.routeConfig.data) {
      title = route.routeConfig.data.breadcrumb ? route.routeConfig.data.breadcrumb : this.user.name;
    }

    const path = route.routeConfig ? route.routeConfig.path : '';
    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: IBreadCrumb = {
      label: title,
      url: nextUrl,
    };

    const newBreadcrumbs = breadcrumb.label ? [ ...breadcrumbs, breadcrumb ] : [ ...breadcrumbs ];
    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }

    return newBreadcrumbs;
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

}
