import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.sass']
})
export class AdminOrdersComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  public order = [];
  dtTrigger: Subject<any> = new Subject();

  constructor( private API: APIService) {
  }

  loadData(){
    this.API.get('orders').subscribe(
      data => this.applyData(data),
      error => console.error(error)
    );
  }

  applyData(data){
    this.order = data;
    this.dtTrigger.next();
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.loadData();
  }

  cancel(id){
    console.log('confirm delivery');
    this.API.post(`orders/update-status/${id}`,{'slug':'cancelled'}).subscribe(
      data=> this.responseSuccess(data),
      error=>this.responseError(error)
    );
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  responseSuccess(data){
    Swal.fire({
      'title':data.message,
      'icon':'success'
    }); 
    this.dtTrigger.unsubscribe();
    this.loadData();
  }

  responseError(error){
    let error_message = ['Kindly screenshot and send this to our support!',('<hr><br>'+ error.message +'<br><hr>'),'Thank you!'];

    Swal.fire({
      'title':'There was an error happen!',
      'icon':'error',
      'html': error_message.join('<br>')
    });
  }
}
