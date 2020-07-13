import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.sass']
})
export class OrderDetailsComponent implements OnInit {

  order;
  orderId;
  payment_methods;

  constructor( private API: APIService, private route: ActivatedRoute ) {
    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('orderId');
      this.API.get('orders/'+this.orderId).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
    });
    this.getPaymentMethods();
  }

  getPaymentMethods() {
    this.API.post('payments/checkout', {}).subscribe(
      data => {
        this.payment_methods = data;
      },
      error => { console.error(error) }
    );
  }

  handleResponse(data){
    this.order = data
  }

  handleError(error){
    console.error(error);
  }

  ngOnInit(): void {
  }

}
