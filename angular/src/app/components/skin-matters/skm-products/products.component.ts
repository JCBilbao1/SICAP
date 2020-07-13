import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'skm-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass'],
  styles : [
    '/deep/ ul.pagination { width: fit-content; margin: 0 auto; }',
    '/deep/ a.page-link { color: #4a4a4a !important; }',
    '/deep/ li.active a.page-link { color: #ffffff !important; background-color: #f48373 !important; border-color: #f48373 !important; }'
  ]
})
export class ProductsComponent implements OnInit {

  categories;
  products;
  backup_products;
  total_products;
  category_filter = {
    slug: null,
    name: null
  };
  sorting_filter = '';

  per_page = 12;
  page = 1;

  constructor( private API:APIService, private route: ActivatedRoute) {
    this.getCategories();
    this.route.paramMap.subscribe(params => {
      if(params.get('categorySlug')) {
        this.category_filter.slug = params.get('categorySlug');
      } else {
        this.category_filter.slug = '';
      }
      this.getProducts();
    })
  }

  getCategories() {
    this.API.get('categories').subscribe(
      data => this.handleCategoriesResponse(data),
      error => this.handleError(error)
    );
  }

  getProducts() {
    this.products = null;

    this.API.customGet('products', {
      params : {
        category_filter : this.category_filter.slug,
        sorting_filter : this.sorting_filter,
        per_page : this.per_page,
        page : this.page,
      },
    }).subscribe(
      data => this.handleProductsResponse(data),
      error => this.handleError(error)
    );
  }

  handleCategoriesResponse(data){
   // console.log(data);
    this.categories = data;    
  }

  checkProductRank(product_data){
    this.API.post('auth/me', {}).subscribe(
      data => {
        var distributor = data;

        product_data.products.forEach(function(obj){
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

  handleProductsResponse(data){
    this.backup_products = data.products;
    this.products = this.checkProductRank(data).products;
    this.total_products = data.total_products;
    this.category_filter.name = data.category;
  }

  handleError(error){
    console.error(error);
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getProducts();
  }

  ngOnInit(): void {

  }

}
