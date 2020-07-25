import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-admin-user-detail',
  templateUrl: './admin-user-detail.component.html',
  styleUrls: ['./admin-user-detail.component.sass']
})
export class AdminUserDetailComponent implements OnInit {
  userId
  user_details

  user_form;
  user_form_errors;
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
    this.userId = this.route.snapshot.paramMap.get("userId");
    this.loadData();
    this.loadRoles();
  }

  loadData(){
    this.API.get(`users/${this.userId}`).subscribe(
      data => this.applyData(data),
      error => console.error(error)
    );
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
  applyData(data){
    this.user_details = data;
    this.user_form = this.formBuilder.group(data);
    console.log(this.user_details);
  }
  save(){
    console.log(this.user_form);
    this.API.put(`users/${this.userId}`,this.user_form.value).subscribe(
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
  }
  responseError(error){
    console.log(error)
    this.user_form_errors = error.error.errors;
   
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
