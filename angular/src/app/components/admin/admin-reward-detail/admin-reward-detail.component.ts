import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-admin-reward-detail',
  templateUrl: './admin-reward-detail.component.html',
  styleUrls: ['./admin-reward-detail.component.sass']
})
export class AdminRewardDetailComponent implements OnInit {

  @ViewChild('fileInput') fileInput;
  reward_form;
  reward_form_errors;
  reward;
  reward_data;
  rewardSlug;
  maxFileSize = 5000000; //In Bytes
  cropMode = false;
  newFiles = false;
  defaultImages = [];
  croppedImages = [];

  constructor(
    private API:APIService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, 
  ) {

    this.reward_form = this.formBuilder.group({
      name : '',
      price: '',
      slug : '',
      description : '',
    });

    this.rewardSlug = this.route.snapshot.paramMap.get("rewardSlug")
    this.getRewardDetails();
  }

  getRewardDetails() {
    this.API.get(`rewards/${this.rewardSlug}`).subscribe(
      (data:any)=>
      {
        console.log(data);
        this.reward_data = data;
        this.reward_form = this.formBuilder.group(data);
        this.defaultImages = JSON.parse(JSON.stringify(data.images));
        this.croppedImages = [];
      },
      (error_response) => {
        console.error(error_response);
      }
    );
  }

  ngOnInit(): void {
  }

  checkData() {
    //Prepare Images to upload
    this.croppedImages = [];
    for(let i = 0; i < this.reward_data.images.length; i++){
      this.croppedImages[i] = this.reward_data.images[i];
      if(!this.reward_data.images[i].cropped){
        this.croppedImages[i].base64 = '';
        this.croppedImages[i].cropped = null;
      }
    }
    
    if(this.cropMode) {
      this.reward_form_errors = {images : ['Finish Cropping']};
      return false;
    } else {
      if( this.reward_form_errors && 'images' in this.reward_form_errors)
        this.reward_form_errors.images = null;

      return true;
    }
  }

  save() {
    let reward = this.reward_form.value;
    if(this.checkData()) {
      this.API.put(`rewards/${this.rewardSlug}`,{
        name : reward.name,
        price : reward.price,
        slug : reward.slug,
        description : reward.description,
        base64Images : this.croppedImages,
      }).subscribe(
        data => this.responseSuccess(data),
        error => this.responseError(error)
      );
    }
  }

  responseSuccess(data){
    console.log(data);
    this.rewardSlug = data.slug;
    this.reward_form.slug = data.slug;
    this.reward_form = this.formBuilder.group(data);
    this.router.navigate(['/admin/rewards/' + this.rewardSlug]);
    this.succesSwal();
    this.getRewardDetails();
  }
  
  responseError(error){
    this.reward_form_errors = error.error.errors;
  }
  changeStatus(id){
    event.preventDefault();
    let params = {
      active : true
    };
    if(this.reward_data.active)
      params.active = false
      
    this.API.put(`rewards/change-status/${id}`, params).subscribe(
      data => this.successfulStatus(data),
      error => this.responseError(error)
    )
  }
  succesSwal(){
    Swal.fire({
      'title':'Reward details has been updated!',
      'icon':'success'
    });
  }
  successfulStatus(data){
    this.reward_data = data;
    if(data.active){
      Swal.fire({
        'title':'Reward has been activated!',
        'icon':'success'
      });
    } else {
      Swal.fire({
        'title':'Reward has been deactivated!',
        'icon':'success'
      });
    }
  }

  fileChangeEvent(event: any): void {
    let files = event.target.files;
    for(let i = 0; i < event.target.files.length; i++){
      const file = files[i];
      if(file.size > this.maxFileSize) {
        let maxSizeMB = (this.maxFileSize / 1000000).toFixed(1);
        this.reward_form_errors = {images : ['Image sizes must be equal or less than ' + maxSizeMB + ' MB.']};
        return;
      } else {
        if( this.reward_form_errors && 'images' in this.reward_form_errors)
          this.reward_form_errors.images = null;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        let reward_data = this.reward_data;
        reader.onload = () => {
          reward_data.images.push({base64 : reader.result, new: true});
        };
        this.newFiles = true;
        this.cropMode = true;
      }
    }
  }
  imageCropped(event: ImageCroppedEvent, index) {
      this.reward_data.images[index].cropped = event.base64;
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

  confirmCrop() {
    for(let i = 0; i < this.reward_data.images.length; i++){
      this.reward_data.images[i].base64Dimensions = null;
      this.reward_data.images[i].croppedDimensions = null;
      let $this = this;
      var imgBase64 = new Image();
      imgBase64.src = this.reward_data.images[i].base64;

      imgBase64.addEventListener('load',function(){
        $this.checkCropped(i, 'base64', imgBase64.width, imgBase64.height);
      });
      
      var imgCropped = new Image();
      imgCropped.src = this.reward_data.images[i].cropped;

      imgCropped.addEventListener('load',function(){
        $this.checkCropped(i, 'cropped', imgCropped.width, imgCropped.height);
      });
    }
    this.cropMode = false;
    this.newFiles = false;
  }

  checkCropped(i, image, width, height) {
    if(image == 'base64') {
      this.reward_data.images[i].base64Dimensions = width + 'x' + height;
    } else {
      this.reward_data.images[i].croppedDimensions = width + 'x' + height;
    }

    if((this.reward_data.images[i].base64Dimensions && this.reward_data.images[i].croppedDimensions) || (this.reward_data.images[i].base64Dimensions && this.reward_data.images[i].croppedDimensions && this.reward_data.images[i].new)) {
      if(this.reward_data.images[i].base64Dimensions != this.reward_data.images[i].croppedDimensions || this.reward_data.images[i].new) {
        this.reward_data.images[i].base64 = this.reward_data.images[i].cropped;
        this.reward_data.images[i].cropped = true;
        this.reward_data.images[i].new = null;
      } else {
        this.reward_data.images[i].cropped = null;
      }
    }
  }

  cancelCrop() {
    for(let i = 0; i < this.reward_data.images.length; i++){
      this.reward_data.images[i].cropped = null;
    }
    this.cropMode = false;
  }

  resetCrop() {
    this.reward_data.images = JSON.parse(JSON.stringify(this.defaultImages));
    this.fileInput.nativeElement.value = "";
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.reward_data.images, event.previousIndex, event.currentIndex);
  }

  removeImage(index) {
    this.reward_data.images.splice(index, 1);
  }

}
