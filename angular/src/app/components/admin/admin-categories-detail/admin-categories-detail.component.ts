import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-admin-categories-detail',
  templateUrl: './admin-categories-detail.component.html',
  styleUrls: ['./admin-categories-detail.component.sass']
})
export class AdminCategoriesDetailComponent implements OnInit {
  category_form;
  category_form_errors;
  category;
  category_data;
  categorySlug;
  constructor(
    private API:APIService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, 
  ) {

    this.category_form = this.formBuilder.group({
      name : '',
      slug : '',
      description : '',
    });

    this.categorySlug = this.route.snapshot.paramMap.get("categorySlug")
    console.log(this.categorySlug);
    this.API.get(`categories/${this.categorySlug}`).subscribe((data)=>
    {
      console.log(data);
      this.category_data = data;
      this.category_form = this.formBuilder.group(data);
    });
  }

  ngOnInit(): void {
  }


  save() {
    let category = this.category_form.value;
    this.API.put(`categories/${this.categorySlug}`,{
      name : category.name,
      slug : category.slug,
      description : category.description,
    }).subscribe(
      data => this.responseSuccess(data),
      error => this.responseError(error)
    );
     
  }

  responseSuccess(data){
    console.log(data);
    this.categorySlug = data.slug;
    this.category_form.slug = data.slug;
    this.category_form = this.formBuilder.group(data);
    this.router.navigate(['/admin/categories/' + this.categorySlug]);
    this.succesSwal();
    console.log(data);
  }
  /**/
  
  responseError(error){
    this.category_form_errors = error.error.errors;
  }
  changeStatus(id){
    event.preventDefault();
    let params = {
      active : true
    };
    if(this.category_data.active)
      params.active = false
      
    this.API.put(`categories/change-status/${id}`, params).subscribe(
      data => this.successfulStatus(data),
      error => this.responseError(error)
    )
  }
  succesSwal(){
    Swal.fire({
      'title':'Category details has been updated!',
      'icon':'success'
    });
  }
  successfulStatus(data){
    this.category_data = data;
    if(data.active){
      Swal.fire({
        'title':'Category has been activated!',
        'icon':'success'
      });
    } else {
      Swal.fire({
        'title':'Category has been deactivated!',
        'icon':'success'
      });
    }
  }

}
