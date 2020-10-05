import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/user.interface';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { defaultPagination, IPagination } from '../../constants/pagination.constant';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  public users: IUser[];
  public totalPages: number[] = [];

  public params = defaultPagination;

  public previousPageDisabled = true;
  public nextPageDisabled = false;

  private onDestroyed$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.navigate();

    this.route.queryParams.pipe(
      switchMap((params: IPagination) => {
        this.params = {
          page: +params.page || defaultPagination.page,
          range: +params.range || defaultPagination.range
        };

        return this.userService.getAllUsers(this.params).pipe(
          takeUntil(this.onDestroyed$)
        );
      })
    ).subscribe((data: {content: IUser[], totalPages: number, totalElements: number}) => {
      this.users = data.content;
      this.totalPages = new Array(data.totalPages);

      this.previousPageDisabled = this.params.page === 0;
      this.nextPageDisabled = (this.params.page + 1) === this.totalPages.length;
    });
  }

  public activatePage(pageIndex: number): void {
    this.params = {
      ...this.params,
      page: pageIndex,
    };
    this.navigate();
  }

  public nextPage(): void {
    if (this.params.page + 1 < this.totalPages.length) {
      this.params.page++;
      this.navigate();
    }
  }

  public previousPage(): void {
    if (this.params.page > 0) {
      this.params.page--;
      this.navigate();
    }
  }

  private navigate(): void {
    this.router.navigate([window.location.pathname], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        ...this.params
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
