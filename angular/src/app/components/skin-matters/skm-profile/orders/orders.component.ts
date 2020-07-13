import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.sass']
})
export class OrdersComponent implements OnInit {

  orders;

  constructor( private API: APIService, ) {
    this.API.post('users/orders', {}).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data){
    this.orders = data.orders
  }

  handleError(error){
    console.error(error);
  }

  ngOnInit(): void {
  }

}
