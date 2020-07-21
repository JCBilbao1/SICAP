import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { APIService } from 'src/app/services/api.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-create',
  templateUrl: './admin-user-create.component.html',
  styleUrls: ['./admin-user-create.component.sass']
})
export class AdminUserCreateComponent implements OnInit {

  userId
  user_details

  user_form;
  user_form_errors;
  public roleList = {};

  constructor(
    private API:APIService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.loadRoles();
    this.user_form = this.formBuilder.group({
      first_name : '',
      last_name : '',
      password : '',
      email : '',
      role_name : '',
    });
  }

  loadRoles(){
    this.API.get('roles').subscribe(
      data => {
        console.log(data);
        this.roleList = data;
      },
      error => console.log(error)
    );
  }
  save(){
    console.log(this.user_form);
    this.API.post('users',this.user_form.value).subscribe(
      data => this.responseSuccess(data),
      error => this.responseError(error)
    );
  }

  
  responseSuccess(data){
    console.log(data);
    Swal.fire({
      'title':data.status,
      'icon':'success',
      showConfirmButton: false,
      timer: 1000
    });

    this.user_form.reset();
    this.user_form_errors = null;
  }
  responseError(error){
    console.log(error)
    this.user_form_errors = error.error.errors;
    console.log(this.user_form_errors);
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'There was an error!',
      showConfirmButton: false,
      timer: 1000
    });
  }
  ngOnInit(): void {
  }

}
