import { Component, OnInit, TemplateRef } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from "@angular/router";
import { RouterExtService } from 'src/app/services/router-ext.service';
import { orderBy } from 'lodash';
import { config } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';

declare function require(name:string);
const cities = require('psgc2/cities.json');
const provinces = require('psgc2/provinces.json');
const regions = require('psgc2/regions.json');
@Component({
  selector: 'app-admin-distributor-detail',
  templateUrl: './admin-distributor-detail.component.html',
  styleUrls: ['./admin-distributor-detail.component.sass']
})
export class AdminDistributorDetailComponent implements OnInit {
  public distributorId = null;
  public distributor = null;
  public old_distributor = null;
  public previousDashboard = false;

  product_form;
  product_form_errors;
  public data_rank = [
    {
      title: 'Regional Distributors',
      slug: 'regional'
    },
    {
      title: 'City Distributors',
      slug: 'city'
    },
    {
      title: 'Provincial Distributors',
      slug: 'provincial'
    },
    {
      title: 'Resellers',
      slug: 'resellers'
    }
  ];
  public select_option = {
      city:null,
      state: null,
      region: null
  };

  constructor( private API:APIService, private route: Router,private router:ActivatedRoute,private routerService: RouterExtService) { 
    this.loadLocation();

  }
  loadLocation(){
    let city = cities;



    city.forEach(function(obj){
      obj.name = obj.name.replace("City Of ", "");
    });

    this.select_option.city = orderBy(city, ['name'], ['asc']);

    provinces.push({name: "Metro Manila", population: 0 , region: "NATIONAL CAPITAL REGION (NCR)"})
    
    this.select_option.state = orderBy(provinces, ['name'], ['asc']);
    this.select_option.region = orderBy(regions, ['name'], ['asc']);
    console.log(this.select_option.city);
    console.log(this.select_option.state);
  }
  ngOnInit(): void {
    this.distributorId = this.router.snapshot.paramMap.get("distributorId")
    console.log(this.distributorId);
    this.loadData();
    if(this.routerService.getPreviousUrl() =='/admin/dashboard'){
      this.previousDashboard = true;
    }
  }

  loadData(){
    this.API.get(`distributors/${this.distributorId}`).subscribe(
      data => this.applyData(data),
      error => console.log(error)
    );
  }

  applyData(data){
    this.old_distributor = data;
    if(data.referral_data){
      data.referral_data.full_name = data.referral_data.first_name+ ' ' + data.referral_data.last_name;
    }
    this.distributor = data;
    
    console.log(this.distributor);
  }
  save(){
    console.log(this.distributor);
    this.API.put(`distributors/${this.distributorId}`, this.distributor).subscribe(
      data => this.responseSuccess(data),
      error => this.responseError(error)
    );
    /*
    */
  }
  responseSuccess(data){
    //this.route.navigate(['/admin/distributors/' + this.distributorId]);
    this.succesSwal();
    console.log(data);
  }
  /**/
  
  responseError(error){
    console.log(error)
    let error_message = ['Kindly screenshot and send this to our support!',('<hr><br>'+ error.message +'<br><hr>'),'Thank you!'];

    Swal.fire({
      'title':'There was an error happen!',
      'icon':'error',
      'html': error_message.join('<br>')
    });
  }
  succesSwal(){
    Swal.fire({
      'title':'Distributor details has been updated!',
      'icon':'success'
    });
  }
  accept(data){
    event.preventDefault();
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

  responseDisapproveUpdate(data){
    Swal.fire({
      'title':'Distributor has been declined!',
      'icon':'success'
    });

    this.route.navigate([`/admin/dashboard`]);
  }
  update(data){
    this.API.put('distributor/update',data).subscribe(
      data => this.responseUpdate(data),
      error => this.responseError(error)
    )


    this.route.navigate([`/admin/dashboard`]);
  }
  responseUpdate(data){
    Swal.fire({
      'title':'Distributor has been approved!',
      'icon':'success'
    });
  }
}
