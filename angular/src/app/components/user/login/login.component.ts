import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  public form = {
    email: null,
    password: null
  };

  public error = null;
  constructor(
    private API: APIService,
    private Token: TokenService,
    private router : Router,
    private Auth : AuthService
  ) { }

  onSubmit(){
    return this.API.post('auth/login', this.form).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data){
    this.Token.handle(data.access_token);
    this.Auth.changeAuthStatus(true);
    this.router.navigateByUrl('/')
  }

  handleError(error_response){
    console.error(error_response);
    this.error = error_response.error.error;
  }

  ngOnInit(): void {
  }

}
