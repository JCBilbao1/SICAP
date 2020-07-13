import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { interval } from 'rxjs';

@Component({
  selector: 'skm-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.sass'],
  styles : [
    '/deep/ div.ngxImageZoomContainer { width: 100% !important; height: auto !important;}',
    '/deep/ img.ngxImageZoomThumbnail { width: 100% !important; }',
  ]
})
export class ProductDetailsComponent implements OnInit {

  product;
  productSlug;
  quantity = 1;
  orderNowVisible = false;
  canOrder = false;
  zoomImage = '';
  zoomMode= 'hover';
  magnification = 1;
  checkImg = true;
  magnifyInterval;

  @ViewChild('image_gallery') image_gallery: ElementRef;

  constructor(private route: ActivatedRoute, private cookieService: CookieService, private router: Router, private API: APIService) {
    
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productSlug = params.get('productSlug')
      this.getProductDetails(this.productSlug);
    })
    document.getElementById('description-tab').click();
  }

  getProductDetails(slug){
    this.API.get('products/shop-product-details/'+slug).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data){
    console.log(data);
    
    let product:any = this.checkProductRank(data);
    if((product.stock_management && product.stock > 0) || 
    (!product.stock_management && product.stock_status == 'instock') || 
    (!product.stock_management && product.stock_status == 'reservation') || 
    (product.stock_management && product.stock <= 0 && product.stock_status == 'reservation')) {
      this.orderNowVisible = true;
      this.canOrder = true;
    }
    this.product = data;
    this.zoomImage = (this.product?.images[0]?.url) ? this.product.images[0].url : 'assets/skin_matters_assets/logo_bg.jpg';
    this.magnifyInterval = interval(500).subscribe(n => {
      if(this.checkImg) {
        this.checkImg = false;
        var img = new Image();
        img.src = this.zoomImage;
        var containerWidth = document.getElementsByClassName('ngxImageZoomContainer')[0].clientWidth * 2;
        var imageWidth = img.width;
        this.magnification = containerWidth / imageWidth;
        if(!containerWidth || !imageWidth || !this.magnification) {
          this.checkImg = true;
        } else {
          this.magnifyInterval.unsubscribe();
        }
      }
    });
  }

  handleError(error){
    console.error(error);
  }

  checkProductRank(product_data){
    this.API.post('auth/me', {}).subscribe(
      data => {
        var distributor = data;

        if(!(Object.entries(product_data.rank).length  === 0)){
          let ranks = product_data.rank;
          ranks.forEach(function(obj){
            if(obj.id == distributor['rank']['id']){
              product_data.price = obj.pivot.price;
            }
          });
        }
      
      },
      error => this.handleError(error)
    );
   // console.log(data.products);
   
    return product_data;
  }

  checkData() {
    if(this.quantity < 1 || (this.product.stock_management && ((this.quantity > this.product.stock && this.product.stock_status != 'reservation') ||
      (!this.product.stock && this.product.stock_status != 'reservation'))) ||
      (!this.product.stock_management && this.product.stock_status == 'outofstock'))
      this.canOrder = false;
    else
      this.canOrder = true;
    
    return this.canOrder;
  }

  orderNow() {
    if(this.checkData) {
      let product = {
        id : this.product.id,
        product_name : this.product.product_name,
        price : this.product.price,
        srp: this.product.price,
        checkoutQty : this.quantity,
      };
      console.log(product);
      this.cookieService.set('checkout-data', JSON.stringify({products : [product]}));
      this.router.navigate(['/checkout']);
    }
  }

  addQty() {
    if((this.product.stock_management && (this.quantity < this.product.stock || (!this.product.stock && this.product.stock_status == 'reservation'))) || 
      (!this.product.stock_management && this.product.stock_status != 'outofstock'))
      this.quantity++;
    this.checkData();
  }

  deductQty() {
    if(this.quantity > 1)
      this.quantity--
    this.checkData();
  }
  
  scrollLeft(){
    this.image_gallery.nativeElement.scrollLeft -= 300;
  }

  scrollRight(){
    this.image_gallery.nativeElement.scrollLeft += 300;
  }

  openTab(tab) {
    var i, tabcontent, tablinks;
  
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    document.getElementById(tab).style.display = "block";
    document.getElementById(tab + '-tab').className += ' active';
  }

  changeZoomImage(index) {
    this.zoomImage = (this.product?.images[index]?.url) ? this.product.images[index].url : 'assets/skin_matters_assets/logo_bg.jpg';
    this.magnifyInterval = interval(500).subscribe(n => {
      if(this.checkImg) {
        this.checkImg = false;
        var img = new Image();
        img.src = this.zoomImage;
        var containerWidth = document.getElementsByClassName('ngxImageZoomContainer')[0].clientWidth * 2;
        var imageWidth = img.width;
        this.magnification = containerWidth / imageWidth;
        if(!containerWidth || !imageWidth || !this.magnification) {
          this.checkImg = true;
        } else {
          this.magnifyInterval.unsubscribe();
        }
      }
    });
  }
}
