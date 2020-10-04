import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/user/user.component';
import { BaseComponent } from './components/base/base.component';


const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Main page'
    },
    children: [
      {
        path: '',
        component: MainComponent
      },
      {
        path: 'statistics',
        component: BaseComponent,
        data: {
          breadcrumb: 'User statistics'
        },
        children: [
          {
            path: '',
            component: UsersComponent,
          },
          {
            path: 'user',
            component: UserComponent,
            data: {
              breadcrumb: ''
            }
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
