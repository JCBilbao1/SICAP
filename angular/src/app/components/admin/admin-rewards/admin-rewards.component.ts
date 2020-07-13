import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-admin-rewards',
  templateUrl: './admin-rewards.component.html',
  styleUrls: ['./admin-rewards.component.sass']
})
export class AdminRewardsComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  public rewards = [];
  dtTrigger: Subject<any> = new Subject();

  constructor( private API: APIService, private router:Router) {
  }
  loadData(){
    this.API.get('rewards').subscribe(
      data => this.applyData(data),
      error => console.log(error)
    );
  }

  applyData(data){
    this.rewards = data;
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
    this.delete(data);
  }
  delete(id){
    this.API.delete(`rewards/delete-temporary/${id}}`).subscribe(
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

    this.router.navigate([`/admin/rewards`]);
  }
}

