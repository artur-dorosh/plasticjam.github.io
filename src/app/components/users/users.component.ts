import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any;
  maxItemsCount: number;
  totalPages: number;
  public currentPage: number;
  public previousPageDisabled: boolean = true;
  public nextPageDisabled: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 1;
      this.maxItemsCount = +params['range'] || 6;

      this.userService.getAllUsers({page: this.currentPage, range: this.maxItemsCount}).subscribe(data => {
        // @ts-ignore
        this.users = data.content;
        // @ts-ignore
        this.totalPages = data.totalPages;
      }, error => console.log(error));

      this.previousPageDisabled = this.currentPage === 1;
      this.nextPageDisabled = this.currentPage === this.totalPages;

    });
  }

  public activatePage(count): void {
    this.router.navigate(['statistics'], {queryParams: {page: count}});
  }

  public nextPage(): void {
    this.router.navigate(['statistics'], {queryParams: {page: this.currentPage + 1}});
  }

  public previousPage(): void {
    this.router.navigate(['statistics'], {queryParams: {page: this.currentPage - 1}});
  }
}
