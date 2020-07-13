import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { orderBy } from 'lodash';
import Swal from 'sweetalert2/dist/sweetalert2.js';

declare function require(name:string);
const cities = require('psgc2/cities.json');
const provinces = require('psgc2/provinces.json');

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.sass']
})
export class AddressesComponent implements OnInit {

  edit_mode = false;
  cities;
  states;
  distributorId;
  address = {
    address_line1 : '',
    address_line2 : '',
    country : '',
    city : '',
    state : '',
    zip_code : ''
  };

  constructor( private API: APIService, ) { 
    let city = cities
    city.forEach(function(obj){
      obj.name = obj.name.replace("City Of ", "");
    });
    this.cities = orderBy(city, ['name'], ['asc']);

    provinces.push({name: "Metro Manila", population: 0 , region: "NATIONAL CAPITAL REGION (NCR)"})
    this.states = orderBy(provinces, ['name'], ['asc']);

    this.API.post('auth/me', {}).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data){
    let user = data.user;
    let distributor = data.distributor;
    let distributor_address = data.distributor_address;

    this.distributorId = distributor.id
    this.address = {
      address_line1 : distributor_address.address_line1,
      address_line2 : distributor_address.address_line2,
      country : distributor_address.country,
      city : distributor_address.city,
      state : distributor_address.state,
      zip_code : distributor_address.zip_code,
    };
  }

  handleError(error){
    console.error(error);
  }

  saveAddress() {
    this.API.put(`distributors/${this.distributorId}`, this.address).subscribe(
      data => this.responseSuccess(data),
      error => this.responseError(error)
    );
  }

  responseSuccess(data){
    this.succesSwal();
  }
  
  responseError(error){
    console.log(error)
    let error_message = ['Kindly screenshot and send this to our support!',('<hr><br>'+ error.message +'<br><hr>'),'Thank you!'];

    Swal.fire({
      'title':'There was an problem updating your address!',
      'icon':'error',
      'html': error_message.join('<br>')
    });
  }

  succesSwal(){
    Swal.fire({
      'title':'Address has been updated!',
      'icon':'success'
    });
  }

  ngOnInit(): void {
  }

}
