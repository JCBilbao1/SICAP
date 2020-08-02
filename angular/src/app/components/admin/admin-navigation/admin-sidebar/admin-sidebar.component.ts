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
    this.API.post('auth/me','').subscribe(
        data => this.successResponse(data),
        error => this.errorResponse(error)
    );
  }

  successResponse(data){
    this.hasRole = data.user.slug;
  }

  errorResponse(error){
    console.error(error)
  }

  ngOnInit(): void {
  }

}
