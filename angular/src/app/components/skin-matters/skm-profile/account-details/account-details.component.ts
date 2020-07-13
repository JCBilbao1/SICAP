import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import htmlToImage from 'html-to-image';
import { orderBy } from 'lodash';
import { ImageCroppedEvent } from 'ngx-image-cropper';

declare function require(name:string);
const cities = require('psgc2/cities.json');
const provinces = require('psgc2/provinces.json');

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.sass']
})
export class AccountDetailsComponent implements OnInit {

  cities;
  states;
  user;
  distributor;
  distributor_address;
  edit_mode = false;
  edit_form = {
    first_name: '',
    last_name: '',
    contact_number: '',
    email_address: '',
    city: '',
    state: '',
    facebook_name: '',
    instagram_name: '',
    image : '',
  }
  downloadable = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    private API: APIService,
  ) {
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
    console.log(data)
    this.user = data.user;
    this.imageChangedEvent = '';
    this.croppedImage = '';
    this.distributor = data.distributor;
    this.distributor_address = data.distributor_address;

    this.edit_form = {
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      contact_number: this.distributor.contact_number,
      email_address: this.user.email,
      city: this.distributor_address.city,
      state: this.distributor_address.state,
      facebook_name: this.distributor.facebook_name,
      instagram_name: this.distributor.instagram_name,
      image : '',
    }

    if(this.edit_form.first_name && this.edit_form.last_name && this.edit_form.contact_number &&
      this.edit_form.email_address && this.edit_form.city && this.edit_form.state && 
      this.edit_form.facebook_name && this.edit_form.instagram_name && this.user.image)
      this.downloadable = true;
    else
      this.downloadable = false;
  }

  handleError(error){
    console.error(error);
  }

  saveAccountDetails() {
    let form_data = this.edit_form;
    form_data.image = this.croppedImage;
    this.API.put('auth/me', {
      form_data
    }).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  saveAsImage() {
    htmlToImage.toJpeg(document.getElementById('distributor-id'), { quality: 1.00 })
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = 'distributor-id.jpeg';
      link.href = dataUrl;
      link.click();
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }

  imageLoaded() {
      // show cropper
  }

  cropperReady() {
      // cropper ready
  }

  loadImageFailed() {
      // show message
  }

  ngOnInit(): void {
  }

}
