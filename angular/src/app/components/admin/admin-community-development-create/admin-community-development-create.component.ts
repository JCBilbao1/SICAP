import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { APIService } from 'src/app/services/api.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-community-development-create',
  templateUrl: './admin-community-development-create.component.html',
  styleUrls: ['./admin-community-development-create.component.sass']
})
export class AdminCommunityDevelopmentCreateComponent implements OnInit {

  project_form;
  project_form_errors;
  project_areas = [];
  project_strategies = [];
  stakeholders = {
    'JRU' : {
      'Student' : [
        'Name', 'Yr. Level', 'Program', 'Student Organization'
      ],
      'Faculty' : [
        'Name', 'Yr. Level - 0', 'Program/Department', 'Student Organization'
      ],
      'Employee/Staff' : [
        'Name', 'Yr. Level - 0', 'Program/Office', 'Designation'
      ],
      'Officer' : [
        'Name', 'Yr. Level', 'Program/Office'
      ]
    },
    'Community' : {
      'Individual/Families' : [
        'Name', 'Address', 'Contact Number'
      ],
      'Gov. Official' : [
        'Name', 'Address', 'Contact Number', 'Designation'
      ],
      'Ogranizations/Institution' : [
        'Name of Organization', 'Contact Person', 'Address', 'Contact Number'
      ],
    },
    'Other' : {
      'Organization' : [
        'Name of Organization', 'Contact Person', 'Address', 'Contact Number'
      ],
      'Business and Industry' : [
        'Name of Business', 'Contact Person', 'Address', 'Contact Number'
      ],
      'Institutional Community' : [
        'Name of Institution', 'Contact Person', 'Address', 'Contact Number'
      ],
      'Donor' : [
        'Name of Donor', 'Contact Person', 'Address', 'Contact Number'
      ],
    }
  };
  stakeholder_keys = Object.keys(this.stakeholders);
  added_stakeholders = []
  project_stakeholders = [];
  selected_project_areas = [];

  constructor(
    private API:APIService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.getProjectAreas();
    this.getProjectStrategies();
    this.project_form = this.formBuilder.group({
      project_area : '',
      project_strategy : '',
      project_start_date : '',
      project_start_time : '',
      project_end_date : '',
      project_end_time : '',
      project_place : '',
      project_theme : ''
    });
  }

  getProjectAreas() {
    this.API.get('project-areas').subscribe(
      (data:any) => this.project_areas = data,
      error => console.error(error)
    );
  }

  getProjectStrategies() {
    this.API.get('project-strategies').subscribe(
      (data:any) => this.project_strategies = data,
      error => console.error(error)
    );
  }

  save(){
    this.showLoading('Saving', 'Please wait...');
    this.project_form_errors = null;
    let project = this.project_form.value;
    let project_stakeholders = this.project_stakeholders;
    this.API.post('projects', {
        project_area : project.project_area,
        project_strategy : project.project_strategy,
        project_place : project.project_place,
        project_theme : project.project_theme,
        project_start_date : project.project_start_date,
        project_start_time : project.project_start_time,
        project_end_date : project.project_end_date,
        project_end_time : project.project_end_time,
        stakeholders : project_stakeholders
    }).subscribe(
      data => this.responseSuccess(data),
      error => this.responseError(error)
    );
  }

  responseSuccess(data){
    let $this = this;
    Swal.fire({
      'title':data.status,
      'icon':'success',
      showConfirmButton: false,
      timer: 1500,
      onClose: ()=>{
        $this.router.navigate(['/community-development/' + data.project_id]);
      }
    });
  }

  responseError(error){
    console.error(error)
    this.project_form_errors = error.error.errors;
    Swal.fire({
      icon: 'error',
      title: 'There was an error!',
      showConfirmButton: false,
      timer: 1500
    });
  }

  addStakeHolder(stakeholder_key) {
    this.added_stakeholders.push(this.stakeholders[stakeholder_key]);
    this.project_stakeholders.push({
      'stakeholder' : stakeholder_key,
      'stakeholder_type' : '',
      'stakeholder_field_data' : []
    });
  }

  removeStakeHolder(index) {
    this.added_stakeholders.splice(index, 1);
    this.project_stakeholders.splice(index, 1);
  }

  stakeholder_type_selected(index, stakeholder_type_key) {
    let field_array = [];
    for( let i = 0; i < this.added_stakeholders[index][stakeholder_type_key].length; i++) {
      let field_title = this.added_stakeholders[index][stakeholder_type_key][i];
      field_array.push({key : field_title, value : ''});
    }
    this.project_stakeholders[index].stakeholder_type = stakeholder_type_key;
    this.project_stakeholders[index].stakeholder_field_data = field_array;
  }

  showLoading(title, message){
    Swal.fire({
      title: title,
      html: message,
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
  }

  project_area_changed(event) {
    if(event.target.checked){
      this.selected_project_areas.push(event.target.value);
    } else {
      const index: number = this.selected_project_areas.indexOf(event.target.value);
      if (index !== -1) {
          this.selected_project_areas.splice(index, 1);
      }
    }
    this.selected_project_areas.sort();
    this.project_form.patchValue({
      project_area: this.selected_project_areas.join(', ')
    });
  }

  ngOnInit(): void {
  }

}
