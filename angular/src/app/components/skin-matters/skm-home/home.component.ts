import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'skm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  @ViewChild('featured_products') featured_products: ElementRef;
  products;
  videoSource = location.protocol + '//' + 'apitest.skinmattersbeauty.com/assets/img/skin-matters-assets/skm-cover-video.mp4';

  constructor( private API:APIService ) {
    this.getFeaturedProducts();
   }

  ngOnInit(): void {
  }

  scrollLeft(){
    this.featured_products.nativeElement.scrollLeft -= 300;
  }

  scrollRight(){
    this.featured_products.nativeElement.scrollLeft += 300;
  }

  getFeaturedProducts() {
    this.products = null;

    this.API.post('products/featured', {}).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data){
    console.log(data);
    this.products = this.checkProductRank(data);
  }

  checkProductRank(product_data){
    this.API.post('auth/me', {}).subscribe(
      data => {
        var distributor = data;
        console.log(data);
        product_data.forEach(function(obj){
          console.log(obj.rank);
          if(!(Object.entries(obj.rank).length  === 0)){
            console.log(Object.entries(obj.rank));
            let ranks = obj.rank;
            ranks.forEach(function(obj2){
              console.log(obj2);
              if(obj2.id == distributor['rank']['id']){
                obj.price = obj2.pivot.price;
              }
            });
          }
        })
      },
      error => this.handleError(error)
    );
   // console.log(data.products);
   
    return product_data;
  }
  handleError(error){
    console.error(error);
  }

}
