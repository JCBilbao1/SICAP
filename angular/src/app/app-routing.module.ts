import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { AfterLoginService } from './services/after-login.service';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { BeforeLoginService } from './services/before-login.service';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminCommunityDevelopmentComponent } from './components/admin/admin-community-development/admin-community-development.component';
import { AdminCommunityDevelopmentCreateComponent } from './components/admin/admin-community-development-create/admin-community-development-create.component';

//url and component connection
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [BeforeLoginService],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [BeforeLoginService],
  },
  {
    path:'',
    component: AdminComponent,
    canActivate: [AfterLoginService],
    children: [
      {
        path: '',
        component: AdminDashboardComponent
      },
      {
        path: 'community-development',
        component: AdminCommunityDevelopmentComponent
      },
      {
        path: 'community-development/create',
        component: AdminCommunityDevelopmentCreateComponent
      },
      {
        path: 'users',
        component: AdminUsersComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
