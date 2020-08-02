import { Component, OnInit, Directive, ViewChild } from '@angular/core';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.sass']
})
export class AdminDashboardComponent implements OnInit {
  constructor( private API: APIService) {
   
  }

  ngOnInit(): void {

  }

}
