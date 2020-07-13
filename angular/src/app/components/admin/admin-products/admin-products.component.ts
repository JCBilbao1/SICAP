import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.sass']
})
export class AdminProductsComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  public product = [];
  dtTrigger: Subject<any> = new Subject();

  constructor( private API: APIService) {
  }
  loadData(){
    this.API.get('products').subscribe(
      data => this.applyData(data),
      error => console.log(error)
    );
  }

  applyData(data){
    this.product = data;
    this.dtTrigger.next();
  }

  view(data){
    console.log(data);
  }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.loadData();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  decline(data){
    event.preventDefault();
    this.delete(data.id);
  }
  delete(id){
    this.API.delete(`products/delete-temporary/${id}}`).subscribe(
      data => this.responseSuccess(data),
      error => this.responseError(error)
    )
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
