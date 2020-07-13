import { Component, OnInit, Directive, ViewChild } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { RouterExtService } from 'src/app/services/router-ext.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.sass']
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  public distributor = [];

  constructor( private API: APIService, private router:Router, private routerService:RouterExtService) {
   
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  reloadData(){
    this.API.get('distributor/unverified').subscribe(
      data => {this.applyData(data);this.rerender()},
      error => console.log(error)
    );
  }
  loadData(){
    this.API.get('distributor/unverified').subscribe(
      data => {this.applyData(data);
        this.dtTrigger.next();},
      error => console.log(error)
    );
  }

  applyData(data){
    this.distributor = data;
  }
  
  accept(data){
    event.stopPropagation()
    data.verified = 1;
    this.update(data);
  }

  
  decline(data){
    event.preventDefault();
    this.delete(data.id);
  }
  delete(id){
    this.API.delete(`distributor/delete-temporary/${id}}`).subscribe(
      data => this.responseDisapproveUpdate(data),
      error => this.responseError(error)
    )
  }

  update(data){
    this.API.put('distributor/update',data).subscribe(
      data => this.responseUpdate(data),
      error => console.log(error)
    )
  }
  view(data){
    this.router.navigateByUrl(`admin/distributors/${data}`);
  }
 
  responseUpdate(data){
    Swal.fire({
      'title':'Distributor has been approved!',
      'icon':'success'
    });
    this.reloadData();
  }

  responseDisapproveUpdate(data){
    Swal.fire({
      'title':'Distributor has been declined!',
      'icon':'success'
    });

    this.router.navigate([`/admin/dashboard`]);
  }
  responseError(error){
    console.log(error)
    let error_message = ['Kindly screenshot and send this to our support!',('<hr><br>'+ error.message +'<br><hr>'),'Thank you!'];

    Swal.fire({
      'title':'There was an error happen!',
      'icon':'error',
      'html': error_message.join('<br>')
    });

    this.router.navigate([`/admin/dashboard`]);
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
    this.loadData();
    this.routerService.getPreviousUrl();
  }

}
