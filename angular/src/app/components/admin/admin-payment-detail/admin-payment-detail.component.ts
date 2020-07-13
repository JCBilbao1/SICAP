import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-admin-payment-detail',
  templateUrl: './admin-payment-detail.component.html',
  styleUrls: ['./admin-payment-detail.component.sass']
})
export class AdminPaymentDetailComponent implements OnInit {

  payment_form;
  payment_form_errors;
  payment;
  payment_data;
  paymentSlug;

  constructor(
    private API:APIService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, 
  ) {

    this.payment_form = this.formBuilder.group({
      name : '',
      slug : '',
      description : '',
    });

    this.paymentSlug = this.route.snapshot.paramMap.get("paymentSlug")
    this.getPaymentDetails();
  }

  getPaymentDetails() {
    this.API.get(`payments/${this.paymentSlug}`).subscribe(
      (data:any)=>
      {
        console.log(data);
        this.payment_data = data;
        this.payment_form = this.formBuilder.group(data);
      },
      (error_response) => {
        console.error(error_response);
      }
    );
  }

  ngOnInit(): void {
  }

  save() {
    let payment = this.payment_form.value;
    this.API.put(`payments/${this.paymentSlug}`,{
      name : payment.name,
      slug : payment.slug,
      description : payment.description,
    }).subscribe(
      data => this.responseSuccess(data),
      error => this.responseError(error)
    );
  }

  responseSuccess(data){
    console.log(data);
    this.paymentSlug = data.slug;
    this.payment_form.slug = data.slug;
    this.payment_form = this.formBuilder.group(data);
    this.router.navigate(['/admin/payments/' + this.paymentSlug]);
    this.succesSwal();
    this.getPaymentDetails();
  }
  
  responseError(error){
    this.payment_form_errors = error.error.errors;
  }
  changeStatus(id){
    event.preventDefault();
    let params = {
      active : true
    };
    if(this.payment_data.active)
      params.active = false
      
    this.API.put(`payments/change-status/${id}`, params).subscribe(
      data => this.successfulStatus(data),
      error => this.responseError(error)
    )
  }
  succesSwal(){
    Swal.fire({
      'title':'Payment details has been updated!',
      'icon':'success'
    });
  }
  successfulStatus(data){
    this.payment_data = data;
    if(data.active){
      Swal.fire({
        'title':'Payment has been activated!',
        'icon':'success'
      });
    } else {
      Swal.fire({
        'title':'Payment has been deactivated!',
        'icon':'success'
      });
    }
  }

}
