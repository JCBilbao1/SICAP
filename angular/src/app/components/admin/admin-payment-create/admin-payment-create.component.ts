import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { APIService } from 'src/app/services/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-admin-payment-create',
  templateUrl: './admin-payment-create.component.html',
  styleUrls: ['./admin-payment-create.component.sass']
})
export class AdminPaymentCreateComponent implements OnInit {

  new_payment_form;
  new_payment_form_errors;
  new_payment;

  constructor(
    private API:APIService,
    private formBuilder: FormBuilder,
  ){
    this.new_payment_form = this.formBuilder.group({
      name : '',
      slug : '',
      description : ''
    });
  }

  ngOnInit(): void {
  }

  save() {
    let new_payment = this.new_payment_form.value;
    this.API.post('payments', {
      name : new_payment.name,
      slug : new_payment.slug,
      description : new_payment.description,
    }).toPromise().then((data:any)=>{
      if(data.status == 'Success') {
        this.new_payment = data.new_payment;
        this.new_payment_form.reset();
        this.new_payment_form_errors = null;
        this.succesSwal();
      }
    }, (error_response) => {
      console.log(error_response);
      this.new_payment_form_errors = error_response.error.errors;
    })
  }

  succesSwal(){
    Swal.fire({
      'title':'Payment method has been created!',
      'icon':'success'
    });
  }

}
