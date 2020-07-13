import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.sass']
})
export class AdminSidebarComponent implements OnInit {
  hasRole = null;
  constructor(
    private API:APIService
  ) { 
    this.API.post('users/me','').subscribe(
        data => this.successResponse(data),
        error => this.errorResponse(error)
    );
  }
  successResponse(data){
    this.hasRole = data.role
  }
  errorResponse(error){
    console.log(error)
  }
  ngOnInit(): void {
  }

}
