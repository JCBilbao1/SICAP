import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { APIService } from 'src/app/services/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-admin-categories-create',
  templateUrl: './admin-categories-create.component.html',
  styleUrls: ['./admin-categories-create.component.sass']
})
export class AdminCategoriesCreateComponent implements OnInit {
  
  new_category_form;
  new_category_form_errors;
  new_category;

  constructor(
    private API:APIService,
    private formBuilder: FormBuilder,
  ){
    this.new_category_form = this.formBuilder.group({
      name : '',
      slug : '',
      description : ''
    });
  }

  ngOnInit(): void {
  }

  save() {
    let new_category = this.new_category_form.value;
    this.API.post('categories', {
      name : new_category.name,
      slug : new_category.slug,
      description : new_category.description,
    }).toPromise().then((data:any)=>{
      if(data.status == 'Success') {
        this.new_category = data.new_category;
        this.new_category_form.reset();
        this.new_category_form_errors = null;
        this.succesSwal();
      }
    }, (error_response) => {
      this.new_category_form_errors = error_response.error.errors;
    })
  }

  succesSwal(){
    Swal.fire({
      'title':'Category has been created!',
      'icon':'success'
    });
  }
}
