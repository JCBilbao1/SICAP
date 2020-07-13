import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.sass']
})
export class AdminUsersComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  public users = [];
  dtTrigger: Subject<any> = new Subject();
  
  constructor(private API: APIService) {

  }
  
  loadData(){
    this.API.get('users').subscribe(
      data=> this.applyData(data),
      error => this.handleError(error)
    )
  }

  applyData(data){
    data.forEach(function(obj){
      console.log(obj);
      if(obj.roles.length == 0)
        obj.roles= [{name: "None"}];
    });
    console.log(data);
    this.users = data;
    this.dtTrigger.next();
  }

  handleError(error){
    console.log(error)
  }
  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.loadData();
  }

  decline(data){
    event.preventDefault();
    this.delete(data.id);
  }
  delete(id){
    this.API.delete(`users/delete-temporary/${id}}`).subscribe(
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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
