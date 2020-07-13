import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { APIService } from 'src/app/services/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-admin-reward-create',
  templateUrl: './admin-reward-create.component.html',
  styleUrls: ['./admin-reward-create.component.sass']
})
export class AdminRewardCreateComponent implements OnInit {

  @ViewChild('fileInput') fileInput;
  new_reward_form;
  new_reward_form_errors;
  new_reward;
  maxFileSize = 5000000; //In Bytes
  cropMode = false;
  newFiles = false;
  croppedImages = [];
  images = [];

  constructor(
    private API:APIService,
    private formBuilder: FormBuilder,
  ){
    this.new_reward_form = this.formBuilder.group({
      name : '',
      price: '',
      slug : '',
      description : ''
    });
  }

  ngOnInit(): void {
  }

  checkData() {
    //Prepare Images to upload
    this.croppedImages = [];
    for(let i = 0; i < this.images.length; i++){
      this.croppedImages[i] = this.images[i];
      if(!this.images[i].cropped){
        this.croppedImages[i].base64 = '';
        this.croppedImages[i].cropped = null;
      }
    }

    if(this.cropMode) {
      this.new_reward_form_errors = {images : ['Finish Cropping']};
      return false;
    } else {
      if( this.new_reward_form_errors && 'images' in this.new_reward_form_errors)
        this.new_reward_form_errors.images = null;

      return true;
    }
  }

  save() {
    let new_reward = this.new_reward_form.value;
    if (this.checkData()) {
      this.API.post('rewards', {
        name : new_reward.name,
        price: new_reward.price,
        slug : new_reward.slug,
        description : new_reward.description,
        base64Images : this.croppedImages,
      }).toPromise().then((data:any)=>{
        if(data.status == 'Success') {
          this.new_reward = data.new_reward;
          this.new_reward_form.reset();
          this.fileInput.nativeElement.value = "";
          this.new_reward_form_errors = null;
          this.succesSwal();
        }
      }, (error_response) => {
        console.log(error_response);
        this.new_reward_form_errors = error_response.error.errors;
      })
    }
  }

  fileChangeEvent(event: any): void {
    let files = event.target.files;
    for(let i = 0; i < event.target.files.length; i++){
      const file = files[i];
      if(file.size > this.maxFileSize) {
        let maxSizeMB = (this.maxFileSize / 1000000).toFixed(1);
        this.new_reward_form_errors = {images : ['Image sizes must be equal or less than ' + maxSizeMB + ' MB.']};
        return;
      } else {
        if( this.new_reward_form_errors && 'images' in this.new_reward_form_errors)
          this.new_reward_form_errors.images = null;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        let images = this.images;
        reader.onload = () => {
          images.push({base64 : reader.result, new: true});
        };
        this.newFiles = true;
        this.cropMode = true;
      }
    }
  }
  imageCropped(event: ImageCroppedEvent, index) {
      this.images[index].cropped = event.base64;
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
    for(let i = 0; i < this.images.length; i++){
      this.images[i].base64Dimensions = null;
      this.images[i].croppedDimensions = null;
      let $this = this;
      var imgBase64 = new Image();
      imgBase64.src = this.images[i].base64;

      imgBase64.addEventListener('load',function(){
        $this.checkCropped(i, 'base64', imgBase64.width, imgBase64.height);
      });
      
      var imgCropped = new Image();
      imgCropped.src = this.images[i].cropped;

      imgCropped.addEventListener('load',function(){
        $this.checkCropped(i, 'cropped', imgCropped.width, imgCropped.height);
      });
    }
    this.cropMode = false;
    this.newFiles = false;
  }

  checkCropped(i, image, width, height) {
    if(image == 'base64') {
      this.images[i].base64Dimensions = width + 'x' + height;
    } else {
      this.images[i].croppedDimensions = width + 'x' + height;
    }

    if((this.images[i].base64Dimensions && this.images[i].croppedDimensions) || (this.images[i].base64Dimensions && this.images[i].croppedDimensions && this.images[i].new)) {
      if(this.images[i].base64Dimensions != this.images[i].croppedDimensions || this.images[i].new) {
        this.images[i].base64 = this.images[i].cropped;
        this.images[i].cropped = true;
        this.images[i].new = null;
      } else {
        this.images[i].cropped = null;
      }
    }
  }

  cancelCrop() {
    for(let i = 0; i < this.images.length; i++){
      this.images[i].cropped = null;
    }
    this.cropMode = false;
  }

  resetCrop() {
    this.images = [];
    this.fileInput.nativeElement.value = "";
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
  }

  removeImage(index) {
    this.images.splice(index, 1);
  }

  succesSwal(){
    Swal.fire({
      'title':'Reward has been created!',
      'icon':'success'
    });
  }
}
