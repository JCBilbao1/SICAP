import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { APIService } from 'src/app/services/api.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-community-development-details',
  templateUrl: './admin-community-development-details.component.html',
  styleUrls: ['./admin-community-development-details.component.sass']
})
export class AdminCommunityDevelopmentDetailsComponent implements OnInit {

  projectId;
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
  student_organizations = [
    'COMSOC', 'YES', 'CPE', 'ECE', 'JPIA', 'MATSOC', 'HTM', 'CRIMSOC', 'TEATRO', 'JPEG', 'HISTORY', 'MANSOC', 'YOUNG MAKETER', 'SCA', 'Etc'
  ];
  added_stakeholders = []
  project_stakeholders = [];

  constructor(
    private API:APIService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.project_form = this.formBuilder.group({
      project_area : '',
      project_strategy : '',
      project_date : '',
      project_time : '',
      project_place : '',
      project_theme : ''
    });
    this.getProjectAreas();
    this.getProjectStrategies();
    this.projectId = this.route.snapshot.paramMap.get("projectId");
    this.loadProject();    
  }

  loadProject(){
    this.API.get(`projects/${this.projectId}`).subscribe(
      data => this.applyData(data),
      error => console.error(error)
    );
  }

  applyData(data){
    let date = new Date(data.date);
    this.project_form = this.formBuilder.group({
      project_area : data.project_area,
      project_strategy : data.project_strategy,
      project_date : date.getFullYear() + '-' + (((date.getMonth()+1)<=9) ? '0' : '') + (date.getMonth()+1) + '-' + (((date.getDate())<=9) ? '0' : '') + date.getDate(),
      project_time : (((date.getHours())<=9) ? '0' : '') + date.getHours( ) + ':' + (((date.getMinutes())<=9) ? '0' : '') + date.getMinutes(),
      project_place : data.place,
      project_theme : data.theme
    });
    this.loadStakeHolders(data.stakeholders);
  }

  loadStakeHolders(stakeholders_data) {
    this.added_stakeholders = [];
    this.project_stakeholders = [];
    for(let i = 0; i < stakeholders_data.length; i++) {
      this.added_stakeholders.push(this.stakeholders[stakeholders_data[i].stakeholder]);
      this.project_stakeholders.push({
        'stakeholder' : stakeholders_data[i].stakeholder,
        'stakeholder_type' : stakeholders_data[i].stakeholder_type,
        'stakeholder_field_data' : stakeholders_data[i].field_data
      });
    }
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
    this.project_form_errors = null;
    let project = this.project_form.value;
    let project_stakeholders = this.project_stakeholders;
    this.API.put('projects/'+this.projectId, {
        project_area : project.project_area,
        project_strategy : project.project_strategy,
        project_place : project.project_place,
        project_theme : project.project_theme,
        project_date : project.project_date,
        project_time : project.project_time,
        stakeholders : project_stakeholders
    }).subscribe(
      (data:any) => this.responseSuccess(data.data),
      error => this.responseError(error)
    );
  }

  responseSuccess(data){
    this.applyData(data);
    Swal.fire({
      'title':data.status,
      'icon':'success',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  responseError(error){
    console.error(error)
    this.project_form_errors = error.error.errors;
    Swal.fire({
      position: 'top-end',
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
      field_array.push({stakeholder_field : field_title, stakeholder_field_value : ''});
    }
    this.project_stakeholders[index].stakeholder_type = stakeholder_type_key;
    this.project_stakeholders[index].stakeholder_field_data = field_array;
  }

  openTab(tab) {
    var i, tabcontent, tablinks;
  
    tabcontent = document.getElementsByClassName("tab-pane");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    
    tablinks = document.getElementById('pills-tab').getElementsByClassName("nav-link");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tab+'-tab').className += ' active';
  
    document.getElementById(tab).style.display = "block";
    document.getElementById(tab).className += 'show active';
  }

  ngOnInit(): void {
  }

}
