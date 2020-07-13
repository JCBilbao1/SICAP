import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-admin-order-detail',
  templateUrl: './admin-order-detail.component.html',
  styleUrls: ['./admin-order-detail.component.sass']
})
export class AdminOrderDetailComponent implements OnInit {
  orderForm
  orderId
  order_details
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject();
  constructor(private API:APIService, private route:ActivatedRoute, private router:Router) { }

  loadData(){
    this.API.get(`orders/details/${this.orderId}`).subscribe(
      data => this.applyData(data),
      error => console.log(error)
    );
  }

  applyData(data){
    this.order_details = data;
    this.dtTrigger.next();
    console.log(this.order_details);
  }

  accept_order(){
    console.log('accept');

    this.API.post(`orders/update-status/${this.orderId}`,{'slug':'created'}).subscribe(
      data=> this.responseSuccess(data),
      error=>this.responseError(error)
    );
  }

  confirm_payment(){
    console.log('payment');

    this.API.post(`orders/update-status/${this.orderId}`,{'slug':'confirmed'}).subscribe(
      data=> this.responseSuccess(data),
      error=>this.responseError(error)
    );
  }

  deliver_order(){

    console.log('deliver order');
    this.API.post(`orders/update-status/${this.orderId}`,{'slug':'on-process'}).subscribe(
      data=> this.responseSuccess(data),
      error=>this.responseError(error)
    );
  }

  confirm_delivery(){

    console.log('confirm delivery');
    this.API.post(`orders/update-status/${this.orderId}`,{'slug':'delivered'}).subscribe(
      data=> this.givePoints(data),
      error=>this.responseError(error)
    );
  }

  givePoints(data){
    var points = 0;
    var backup_order_status = data;
    data.orders.forEach(function(obj){
      obj.order_details.forEach(function(obj2){
        points += 10 * obj2.quantity
      });
    });
    console.log(data); 
    this.API.post(`points/add/${data.orders[0].distributor_id}`,data).subscribe(
      data=> {
        console.log(data);
        this.responseSuccess(backup_order_status)
      },
      error=>this.responseError(error)
    );
    
  }

  cancel(){
    console.log('confirm delivery');
    this.API.post(`orders/update-status/${this.orderId}`,{'slug':'cancelled'}).subscribe(
      data=> this.responseSuccess(data),
      error=>this.responseError(error)
    );
  }
  
  responseSuccess(data){
    console.log(data);
    Swal.fire({
      'title':data.name,
      'icon':'success'
    });
    this.router.navigate([`/admin/orders/${this.orderId}`]);
    this.order_details.order_status = data;
  }

  responseError(error){
    console.log(error)
    let error_message = ['Kindly screenshot and send this to our support!',('<hr><br>'+ error.message +'<br><hr>'),'Thank you!'];

    Swal.fire({
      'title':'There was an error happen!',
      'icon':'error',
      'html': error_message.join('<br>')
    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.orderId = this.route.snapshot.paramMap.get("orderId");
    this.loadData();
  }
}
