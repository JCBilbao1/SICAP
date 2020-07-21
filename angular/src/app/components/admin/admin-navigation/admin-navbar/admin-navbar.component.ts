import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.sass']
})
export class AdminNavbarComponent implements OnInit {
  public loggedIn :boolean;

  constructor(
    private API: APIService,
    private router:Router,
    private Auth: AuthService,
    private Token: TokenService
  ) {
    this.API.post('users/me','').subscribe(
        data => this.successResponse(data),
        error => this.errorResponse(error)
    );
  }
  
  successResponse(data){
    console.log('auth');
    if(!data.admin){
      this.Auth.changeAuthStatus(false);
      this.Token.remove();
      this.router.navigateByUrl('/login');
    }
    console.log(data);
  }

  errorResponse(error){
    console.log(error);
  }

  logout(e: MouseEvent){
    e.preventDefault();
    this.Auth.changeAuthStatus(false);
    this.Token.remove();
    this.router.navigateByUrl('/login');
  }
  
  ngOnInit(): void {
    this.Auth.authStatus.subscribe(value => this.loggedIn = value);
  }

}
