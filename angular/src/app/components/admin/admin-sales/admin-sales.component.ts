import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as moment from 'moment';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-admin-sales',
  templateUrl: './admin-sales.component.html',
  styleUrls: ['./admin-sales.component.sass']
})
export class AdminSalesComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  public sales = [];
  public total_sales = null;
  public sales_per_merchandise = [];

  public minDate: Date = new Date;
  public maxDate: Date = new Date;
  public startValue: Date = null;
  public endValue: Date = null;
  constructor( private API: APIService, ) {
    //this.startValue.setHours(0,0,0,0);
    //this.endValue.setHours(23,59,59,999);
  }

  loadData(){
    let params = {
      startDate: this.startValue?moment(this.startValue).format('YYYY-MM-DD HH:mm:ss'):null,
      endDate: this.endValue?moment(this.endValue).format('YYYY-MM-DD HH:mm:ss'):null,
    };
    console.log(params);
    this.API.post('order/product-sales', params).subscribe(
      data => {
        this.applyData(data);
        this.dtTrigger.next();
      },
      error => console.error(error)
    );
  
  }
  reloadData(){

    let params = {    
      startDate: this.startValue?moment(this.startValue).format('YYYY-MM-DD HH:mm:ss'):null,
      endDate: this.endValue?moment(this.endValue).format('YYYY-MM-DD HH:mm:ss'):null,
    };
    if(params.startDate != null && params.endDate != null){
      if(moment(params.startDate) > (moment(params.endDate))){
        Swal.fire({
          'title':'Date is wrong!',
          'icon':'error',
          'html': 'Start date should be less than the end date'
        });
        return;
      }
    }
      this.API.post('order/product-sales', params).subscribe(
        data => {
          this.applyData(data)
          this.rerender()
        },
        error => console.error(error)
      );
    
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  applyData(data){
    console.log(data);
    var order_products = [];
    var order_product = [];
    var product_sales_total = 0;
    
    data.forEach(function(obj){
      
      (obj.order_details).forEach(function(obj2){
        if(typeof order_product[obj2.product_id] !== 'undefined'){
          order_product[obj2.product_id].quantity += obj2.quantity;
          order_product[obj2.product_id].subtotal += obj2.subtotal;
          order_product[obj2.product_id].discount += obj2.discount;
          order_product[obj2.product_id].total_price += obj2.total;
        } else {
          order_product[obj2.product_id] = {
            id: obj2.product_id,
            name: obj2.product.product_name,
            quantity : obj2.quantity,
            subtotal : obj2.subtotal,
            discount : obj2.discount,
            total_price : obj2.total
          }
        }
        product_sales_total += obj2.total;
      });
    });
    //pushing all in an array format;
    order_product.forEach(function(obj){
      obj.discount = obj.discount.toFixed(2);
      obj.subtotal = obj.subtotal.toFixed(2);
      obj.total_price = obj.total_price.toFixed(2);
      order_products.push(obj);
    });

    this.sales_per_merchandise = order_products;
    this.total_sales = product_sales_total.toFixed(2);
    console.log(this.total_sales);
    this.sales = data;
    
  }

  ngAfterViewInit(){
    //Define datatable 
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
