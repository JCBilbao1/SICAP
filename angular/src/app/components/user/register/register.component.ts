import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { orderBy } from 'lodash';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { APIService } from 'src/app/services/api.service';

declare function require(name:string);
const cities = require('psgc2/cities.json');
const municipalities = require('psgc2/municipalities.json');
const provinces = require('psgc2/provinces.json');
const regions = require('psgc2/regions.json');

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  public form = {
    email: null,
    first_name: null,
    last_name: null,
    contact: null,
    address_line1: null,
    address_line2: null,
    city: "",
    state: "",
    zip_code: null,
    rank:"",
    area: "",
    password: null,
    password_confirmation: null,
    facebook: null,
    instagram: null,
    facebook_name: null,
    instagram_name: null,
    referral_code: null,
  };
  public error = {
    email: null,
    first_name: null,
    last_name: null,
    contact: null,
    address_line1: null,
    city: null,
    state: null,
    zip_code: null,
    rank:null,
    area: null,
    password: null,
    password_confirmation: null,
    facebook: null,
    instagram: null,
    facebook_name: null,
    instagram_name: null,
    referral_code: null,
  };

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

  back(){
    event.preventDefault();
    this.router.navigateByUrl('/login');
  }
  constructor(private API: APIService, private router: Router) {
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
  onSubmit(){
    console.log(this.form);
    return this.API.post('auth/signup', this.form).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }
  handleResponse(data){
    Swal.fire({
      'title':data.message,
      'icon':'success'
    }).then(okay => {
      this.router.navigateByUrl('/login');
    }); 
  }
  handleError(error){
    this.error = error.error.errors;
  }

  ngOnInit(): void {
  }

}
