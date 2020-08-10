import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-admin-my-account',
  templateUrl: './admin-my-account.component.html',
  styleUrls: ['./admin-my-account.component.sass']
})
export class AdminMyAccountComponent implements OnInit {
  userId
  user_details
  user_form;
  user_form_errors;
  password_form;
  password_form_errors;
  public roleList = {};
  constructor(
    private API:APIService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) { 
    this.user_form = this.formBuilder.group({
      first_name : '',
      last_name : '',
      email : '',
      role_name: ''
    });
    this.password_form = this.formBuilder.group({
      current_password : '',
      password : '',
      password_confirmation : ''
    });
    this.loadData();
    this.loadRoles();
  }

  loadData(){
    this.API.post(`auth/me`, {}).subscribe(
      data => this.applyData(data),
      error => console.error(error)
    );
  }

  loadRoles(){
    this.API.get('roles').subscribe(
      data => {
        this.roleList = data;
      },
      error => console.error(error)
    );
  }
  applyData(data){
    this.user_details = data.user;
    this.user_form = this.formBuilder.group(data.user);
  }
  save(){
    this.API.put(`auth/me`, this.user_form.value).subscribe(
      data => this.responseSuccess(data),
      error => this.responseError(error)
    );
  }

  change_password(){
    this.API.put(`auth/me/change_password`, this.password_form.value).subscribe(
      data => this.responseSuccess(data),
      error => {
        this.password_form_errors = error.error.errors;
        Swal.fire({
          icon: 'error',
          title: 'There was an error!',
          showConfirmButton: false,
          timer: 1000
        });
      }
    );
  }

  responseSuccess(data){
    this.applyData(data);
    Swal.fire({
      'title':data.status,
      'icon':'success',
      showConfirmButton: false,
      timer: 1000
    });
  }

  responseError(error){
    console.error(error)
    this.user_form_errors = error.error.errors;
    Swal.fire({
      icon: 'error',
      title: 'There was an error!',
      showConfirmButton: false,
      timer: 1000
    });
  }

  ngOnInit(): void {
  }
}
