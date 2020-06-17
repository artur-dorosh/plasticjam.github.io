import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

const baseUrl = 'http://localhost:8080/task/api/v1/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllUsers(params) {
    return this.http.get(`${baseUrl}?page=${params.page}&range=${params.range}`);
  }

  getUserStatistic(params) {
    return this.http.get(`${baseUrl}/statistic?id=${params.userId}&from=${params.from}&to=${params.till}`);
  }
}
