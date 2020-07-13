import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import { orderBy } from 'lodash';

declare function require(name:string);
const cities = require('psgc2/cities.json');
const provinces = require('psgc2/provinces.json');

@Component({
  selector: 'skm-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.sass']
})
export class CheckoutComponent implements OnInit {

  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  checkout_form = {
    first_name : '',
    last_name : '',
    company : '',
    country : '',
    address_line1 : '',
    address_line2 : '',
    city : '',
    state : '',
    post_code : '',
    contact_number : '',
    email : '',
    products: {},
    total: 0
  };
  accept_term = false;
  checkout;
  errors = {
    first_name : [],
    last_name : [],
    company : [],
    country : [],
    address_line1 : [],
    address_line2 : [],
    city : [],
    state : [],
    post_code : [],
    contact_number : [],
    email : [],
    accept_term: [],
    order: [],
  };
  cities;
  states;
  new_order;
  payment_methods;

  constructor(
    private API: APIService,
    private cookieService: CookieService, 
    private router: Router,
    private modalService: BsModalService,
    private changeDetection: ChangeDetectorRef 
  ) {
    let city = cities
    city.forEach(function(obj){
      obj.name = obj.name.replace("City Of ", "");
    });
    this.cities = orderBy(city, ['name'], ['asc']);

    provinces.push({name: "Metro Manila", population: 0 , region: "NATIONAL CAPITAL REGION (NCR)"})
    this.states = orderBy(provinces, ['name'], ['asc']);

    this.getPaymentMethods();
    this.getCheckoutProducts();

    this.API.post('auth/me', {}).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  getPaymentMethods() {
    this.API.post('payments/checkout', {}).subscribe(
      data => {
        console.log(data);
        this.payment_methods = data;
      },
      error => { console.error(error) }
    );
  }

  handleResponse(data){
    let user = data.user;
    let distributor = data.distributor;
    let distributor_address = data.distributor_address;

    this.checkout_form = {
      first_name : user.first_name,
      last_name : user.last_name,
      company : this.checkout_form.company,
      country : distributor_address.country,
      address_line1 : distributor_address.address_line1,
      address_line2 : distributor_address.address_line2,
      city : distributor_address.city,
      state : distributor_address.state,
      post_code : distributor_address.zip_code,
      contact_number : distributor.contact_number,
      email : user.email,
      products: this.checkout_form.products,
      total: this.checkout_form.total
    };
  }

  handleError(error){
    console.error(error);
  }

  ngOnInit(): void {
    
  }

  getCheckoutProducts() {
    let checkout = JSON.parse(this.cookieService.get('checkout-data'));
    let total = 0;
    checkout.products.forEach(function(value) {
      total += value.price * value.checkoutQty;
    });
    this.checkout_form['products'] = checkout.products;
    this.checkout_form['total'] = total;
  }

  placeOrder(template) {
    if(!this.accept_term) {
      this.errors.accept_term = ['You need to accept our terms and conditions'];
      return;
    } else {
      this.errors.accept_term = []
    }
    
    this.API.post('orders', {
      checkoutData: this.checkout_form,
    }).subscribe(
      (data:any)=>{
        if(data.status == 'Success') {
          this.cookieService.delete('checkout-data');
          this.new_order = data.new_order;
          this.openModal(template);
        } else if(data.status == 'Failed') {
          this.errors.order = data.error;
        }
      },
      error_response => {
        console.error(error_response);
      }
    )
  }

  openModal(template: TemplateRef<any>) {
    const _combine = combineLatest(
      this.modalService.onHide,
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        this.goToOrderDetails()
      })
    );
    
    this.modalRef = this.modalService.show(template, {class: 'modal-md'});
  }
 
  goToOrderDetails(): void {
    this.modalRef.hide();
    this.router.navigate(['/profile/orders/' + this.new_order.id]);
  }

}
