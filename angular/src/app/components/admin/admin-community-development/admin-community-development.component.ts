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
    this.programs = data;
    this.dtTrigger.next();
  }

  handleError(error){
    console.error(error)
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
    console.error(error);
    let error_message = [('<hr><br>'+ error.message +'<br><hr>')];

    Swal.fire({
      'title':'Something went wrong!',
      'icon':'error',
      'html': error_message.join('<br>')
    });
  }

  markAsDone(id) {
    this.showLoading('Updating', 'Please wait...');
    this.API.put(`projects/change-status/${id}}`, {status:1}).subscribe(
      data => this.responseSuccess(data),
      error => this.responseError(error)
    )
  }

  markAsCancelled(id) {
    this.showLoading('Updating', 'Please wait...');
    this.API.put(`projects/change-status/${id}}`, {status:0}).subscribe(
      data => this.responseSuccess(data),
      error => this.responseError(error)
    )
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  showLoading(title, message){
    Swal.fire({
      title: title,
      html: message,
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
  }

}
