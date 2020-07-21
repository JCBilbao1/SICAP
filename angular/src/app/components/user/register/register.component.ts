import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  public form = {
    email: null,
    first_name: null,
    last_name: null,
    password: null,
    password_confirmation: null,
  };
  public error = {
    email: null,
    first_name: null,
    last_name: null,
    password: null,
    password_confirmation: null,
  };

  back(){
    event.preventDefault();
    this.router.navigateByUrl('/login');
  }

  constructor(private API: APIService, private router: Router) { }

  onSubmit(){
    return this.API.post('auth/signup', this.form).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data){
    Swal.fire({
      'title':data.message,
      'icon':'success'
    }).then(okay => {
      this.router.navigateByUrl('/login');
    }); 
  }

  handleError(error_response){
    console.error(error_response);
    this.error = error_response.error.errors;
  }

  ngOnInit(): void {
  }

}
