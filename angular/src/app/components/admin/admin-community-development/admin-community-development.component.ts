import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-admin-community-development',
  templateUrl: './admin-community-development.component.html',
  styleUrls: ['./admin-community-development.component.sass']
})
export class AdminCommunityDevelopmentComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  programs = [];
  dtTrigger: Subject<any> = new Subject();

  constructor(private API: APIService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.loadData();
  }

  loadData(){
    this.API.get('projects').subscribe(
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
    this.programs = data;
    this.dtTrigger.next();
  }

  handleError(error){
    console.log(error)
  }

  decline(data){
    event.preventDefault();
    this.delete(data.id);
  }

  delete(id){
    this.API.delete(`projects/delete-temporary/${id}}`).subscribe(
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
