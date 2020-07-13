import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-admin-product-detail',
  templateUrl: './admin-product-detail.component.html',
  styleUrls: ['./admin-product-detail.component.sass']
})
export class AdminProductDetailComponent implements OnInit {

  @ViewChild('fileInput') fileInput;
  product_form;
  product_form_errors;
  product;
  productId;
  product_data;
  categories;
  stock_management = false;
  stock_action = '';
  public price_point_count = 1;
  public data_price_point = {'1':{
    rank: '',
    price: '',
    points: ''
  }}; 
  public price_point_management = ['1'];
  public price_point_management_store_count = ['1'];
  public data_rank = {'1':[{
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
  ]};

  public default_rank = [{
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
  
  maxFileSize = 5000000; //In Bytes
  cropMode = false;
  newFiles = false;
  defaultImages = [];
  croppedImages = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, 
    private API: APIService,
    ) {

    this.product_form = this.formBuilder.group({
      product_name : '',
      slug : '',
      description : '',
      price : '',
      points : '',
      category: '',
      stock_management: true,
      stock_status: 'outofstock',
      total_quantity: 0,
      stock_action: '',
      quantity_change: '',
      accept_reservation: false
    });
    
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('productId');
      this.getProductDetails(this.productId);
    })
    this.API.get('categories').subscribe(data => {
      this.categories = data;
    });
  }

  ngOnInit(): void {
  }

  getProductDetails(slug){
    this.API.get('products/'+slug).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data){
    console.log(data);
    if(data.category.id)
      data.category = data.category.id;
    data.stock_action = '';
    data.quantity_change = '';
    if(!data.total_quantity)
      data.total_quantity = 0;
    if(data.stock_status == 'reservation')
      data.accept_reservation = true;
    else
      data.accept_reservation = false;
    if(data.latest_inventory[0])
      data.total_quantity = data.latest_inventory[0].quantity;
    else
      data.total_quantity = 0;
    
    this.product_form = this.formBuilder.group(data);        
    this.stock_management = data.stock_management;
    this.stock_action = data.stock_action;
    if(data.rank.length != ''){
      let i = 0;
      let _self = this;
      data.rank.forEach(function(obj){
        i++;
        let id = i;
        _self.price_point_count++;
        if(id != 1){
          _self.price_point_management_store_count.push(id.toString());
          _self.price_point_management.push(id.toString());
        }
        _self.data_price_point[id.toString()] = {
          'rank': obj.slug,
          'price': obj.pivot.price,
          'points': obj.pivot.points
        };
        _self.data_rank[id.toString()] = [
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
        _self.selectRank();
      });

    }

    this.product_data = data;
    this.defaultImages = JSON.parse(JSON.stringify(data.images));
    this.croppedImages = [];
  }

  handleError(error){
    console.error(error);
  }

  selectRank(){
    let data_price_point = this.data_price_point;
    let data_rank = this.data_rank;
    let default_rank = this.default_rank;
    console.log(default_rank); 
    //disable all first in object
    Object.keys(this.data_price_point).forEach(function(keyValue){
      Object.keys(data_price_point).forEach(function(keyValue2){
        data_rank[keyValue2].forEach(function(obj){
          obj.disabled = false
        })
      })
    });
    Object.keys(this.data_price_point).forEach(function(keyValue){
      let rank_compare = data_price_point[keyValue].rank;
      Object.keys(data_price_point).forEach(function(keyValue2){
        data_rank[keyValue2].forEach(function(obj){
          if(rank_compare == obj.slug){
            obj.disabled = true
          }
        });
      });
    });
    this.data_rank = data_rank;
    console.log(this.data_rank['1']);
  }
  deselectRank(valueId){
    let data_price_point = this.data_price_point;
    let data_rank = this.data_rank;
    let rank_compare = data_price_point[valueId].rank ;
    Object.keys(this.data_price_point).forEach(function(keyValue){
      data_rank[keyValue].forEach(function(obj){
        if(rank_compare == obj.slug){
          obj.disabled = false
        }
      });
    });
    this.data_rank = data_rank;
  }

  deselectRankBefore(beforeRank){
    let data_price_point = this.data_price_point;
    let data_rank = this.data_rank;
    let rank_compare = beforeRank;
    Object.keys(this.data_price_point).forEach(function(keyValue){
      data_rank[keyValue].forEach(function(obj){
        if(rank_compare == obj.slug){
          obj.disabled = false
        }
      });
    });
    this.data_rank = data_rank;
  }
  addField(){
    event.preventDefault();
    console.log('add');
    console.log(this.price_point_management);
    let id = parseInt(Object.values(this.price_point_management_store_count)[Object.keys(this.price_point_management_store_count).length - 1]) + 1;
    this.price_point_management_store_count.push(id.toString());
    this.price_point_management.push(id.toString());
    this.data_price_point[id.toString()] = {
      'rank': '',
      'price': '',
      'points': ''
    };
    this.data_rank[id.toString()] = [
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
    this.selectRank();
    this.price_point_count++;
  }
  savePricePromo(){
    this.data_price_point
    this.selectRank();
    
    let price_promo = this.API.post(`products/price-promo/${this.product_data.id}`, {data:this.data_price_point}).subscribe(data=>this.successSwal(data),error=>this.errorSwal(error));
    
  }
  successSwal(data){
    Swal.fire({
      'title':data.message,
      'icon':'success'
    });
    this.router.navigate([`/admin/products/${this.productId}`]);
  }
  errorSwal(error){
    console.log(error);
    let error_message = ['Kindly screenshot and send this to our support!',('<hr><br>'+ error.message +'<br><hr>'),'Thank you!'];

    Swal.fire({
      'title':'There was an error happen!',
      'icon':'error',
      'html': error_message.join('<br>')
    });
}
  removeField(keyId, valueId){
    event.preventDefault();
    console.log('remove ' + keyId + ':' + valueId);
    this.deselectRank(valueId);
    delete this.price_point_management[keyId];
    delete this.data_price_point[valueId];
    this.price_point_count--;
  }
  checkData(product) {
    //Prepare Images to upload
    this.croppedImages = [];
    for(let i = 0; i < this.product_data.images.length; i++){
      this.croppedImages[i] = this.product_data.images[i];
      if(!this.product_data.images[i].cropped){
        this.croppedImages[i].base64 = '';
        this.croppedImages[i].cropped = null;
      }
    }
    
    if(this.cropMode) {
      this.product_form_errors = {images : ['Finish Cropping']};
      return false;
    } else {
      if( this.product_form_errors && 'images' in this.product_form_errors)
        this.product_form_errors.images = null;
    }
    
    if(product.stock_management) {
      if ( product.stock_action != '' && isNaN(parseInt(product.quantity_change))){
        this.product_form_errors = {quantity_change : ['Quantity Change must be number.']};
        return false; 
      } else if (product.stock_action == 'add_stock' && product.quantity_change <= 0){
        this.product_form_errors = {quantity_change : ['Quantity Change must be greater than 0.']};
        return false;
      } else if (product.stock_action == 'deduct_stock' && ( product.quantity_change <= 0 || product.quantity_change > product.total_quantity )){
        this.product_form_errors = {quantity_change : ['Quantity Change must be greater than 0 and less than the Total Quantity.']};
        return false;
      } else {
        this.product_form_errors = {};
        return true;
      }
    } else {
      return true;
    }
  }

  save() {
    let product = this.product_form.value;
    if (this.checkData(product)) {
      this.API.put('products/'+this.productId, {
        product_name : product.product_name,
        slug : product.slug,
        description : product.description,
        price : product.price,
        points : product.points,
        category : parseInt(product.category),
        stock_management : product.stock_management,
        stock_status : product.stock_status,
        stock_action : product.stock_action,
        quantity_change : product.quantity_change,
        accept_reservation : product.accept_reservation,
        base64Images : this.croppedImages,
      }).subscribe(
        (data:any) => {
          this.productId = data.product_slug;
          this.router.navigate(['/admin/products/' + this.productId]);
          this.updateSuccesSwal();
          this.getProductDetails(this.productId);
        },
        error_response => {
          console.error(error_response);
          this.product_form_errors = error_response.error.errors;
        }
      );
    }
  }

  updateSuccesSwal(){
    Swal.fire({
      'title':'Product details has been updated!',
      'icon':'success'
    });
  }

  fileChangeEvent(event: any): void {
    let files = event.target.files;
    for(let i = 0; i < event.target.files.length; i++){
      const file = files[i];
      if(file.size > this.maxFileSize) {
        let maxSizeMB = (this.maxFileSize / 1000000).toFixed(1);
        this.product_form_errors = {images : ['Image sizes must be equal or less than ' + maxSizeMB + ' MB.']};
        return;
      } else {
        if( this.product_form_errors && 'images' in this.product_form_errors)
          this.product_form_errors.images = null;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        let product_data = this.product_data;
        reader.onload = () => {
          product_data.images.push({base64 : reader.result, new: true});
        };
        this.newFiles = true;
        this.cropMode = true;
      }
    }
  }
  imageCropped(event: ImageCroppedEvent, index) {
      this.product_data.images[index].cropped = event.base64;
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
    for(let i = 0; i < this.product_data.images.length; i++){
      this.product_data.images[i].base64Dimensions = null;
      this.product_data.images[i].croppedDimensions = null;
      let $this = this;
      var imgBase64 = new Image();
      imgBase64.src = this.product_data.images[i].base64;

      imgBase64.addEventListener('load',function(){
        $this.checkCropped(i, 'base64', imgBase64.width, imgBase64.height);
      });
      
      var imgCropped = new Image();
      imgCropped.src = this.product_data.images[i].cropped;

      imgCropped.addEventListener('load',function(){
        $this.checkCropped(i, 'cropped', imgCropped.width, imgCropped.height);
      });
    }
    this.cropMode = false;
    this.newFiles = false;
  }

  checkCropped(i, image, width, height) {
    if(image == 'base64') {
      this.product_data.images[i].base64Dimensions = width + 'x' + height;
    } else {
      this.product_data.images[i].croppedDimensions = width + 'x' + height;
    }

    if((this.product_data.images[i].base64Dimensions && this.product_data.images[i].croppedDimensions) || (this.product_data.images[i].base64Dimensions && this.product_data.images[i].croppedDimensions && this.product_data.images[i].new)) {
      if(this.product_data.images[i].base64Dimensions != this.product_data.images[i].croppedDimensions || this.product_data.images[i].new) {
        this.product_data.images[i].base64 = this.product_data.images[i].cropped;
        this.product_data.images[i].cropped = true;
        this.product_data.images[i].new = null;
      } else {
        this.product_data.images[i].cropped = null;
      }
    }
  }

  cancelCrop() {
    for(let i = 0; i < this.product_data.images.length; i++){
      this.product_data.images[i].cropped = null;
    }
    this.cropMode = false;
  }

  resetCrop() {
    this.product_data.images = JSON.parse(JSON.stringify(this.defaultImages));
    this.fileInput.nativeElement.value = "";
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.product_data.images, event.previousIndex, event.currentIndex);
  }

  removeImage(index) {
    this.product_data.images.splice(index, 1);
  }
}
