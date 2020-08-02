import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { APIService } from 'src/app/services/api.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
  // added_stakeholders = []
  // project_stakeholders = [];
  @ViewChild('evaluationFileInput') evaluationFileInput;
  @ViewChild('reportFileInput') reportFileInput;
  evaluation_files = [];
  evaluation_file = null;
  report_files = [];
  report_file = null;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  jru_stakeholders = null;
  community_stakeholders = null;
  other_stakeholders = null;
  stakeholderAddModal: BsModalRef;
  stakeholderEditModal: BsModalRef;
  added_stakeholder = null;
  stakeholder_for_edit = null;

  constructor(
    private API:APIService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private modalService: BsModalService,
  ) {
    this.project_form = this.formBuilder.group({
      project_area : '',
      project_strategy : '',
      project_date : '',
      project_time : '',
      project_place : '',
      project_theme : '',
      project_status : '',
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
      project_theme : data.theme,
      project_status : data.status,
    });
    // this.loadStakeHolders(data.stakeholders);
    this.jru_stakeholders = data.jru_stakeholders;
    this.community_stakeholders = data.community_stakeholders;
    this.jru_stakeholders = data.jru_stakeholders;
    this.other_stakeholders = data.other_stakeholders;
    this.evaluation_files = data.evaluation_files;
    this.report_files = data.report_files;
    Swal.close();
    this.dtTrigger.next();
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
    this.API.put('projects/'+this.projectId, {
        project_area : project.project_area,
        project_strategy : project.project_strategy,
        project_place : project.project_place,
        project_theme : project.project_theme,
        project_date : project.project_date,
        project_time : project.project_time,
        project_status : project.project_status,
    }).subscribe(
      (data:any) => {
        this.dtTrigger.unsubscribe();
        this.responseSuccess(data)
      },
      error => this.responseError(error)
    );
  }

  responseSuccess(data){
    this.evaluationFileInput.nativeElement.value = null;
    this.reportFileInput.nativeElement.value = null;
    this.applyData(data.data);
    Swal.fire({
      'title':data.status,
      'icon':'success',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  responseError(error){
    Swal.close();
    console.error(error)
    this.project_form_errors = error.error.errors;
    if(error.status == 413) {
      this.showImageSizeError();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'There was an error!',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  addStakeHolder(modal_ref: TemplateRef<any>, stakeholder_key) {
    this.added_stakeholder = {
      stakeholder: stakeholder_key,
      stakeholder_type: '',
      field_data: [],
    };
    this.openStakeholderAddModal(modal_ref);
  }

  removeStakeHolder(index) {
    // this.added_stakeholders.splice(index, 1);
    // this.project_stakeholders.splice(index, 1);
  }

  stakeholder_type_selected(type, stakeholder_key, stakeholder_type_key) {
    if(type == 'add') {
      let field_array = [];
      for( let i = 0; i < this.stakeholders[stakeholder_key][stakeholder_type_key].length; i++) {
        let field_title = this.stakeholders[stakeholder_key][stakeholder_type_key][i];
        field_array.push({stakeholder_field : field_title, stakeholder_field_value : ''});
      }
      this.added_stakeholder.stakeholder_type = stakeholder_type_key;
      this.added_stakeholder.field_data = field_array;
    } else if(type == 'edit') {
      let field_array = [];
      for( let i = 0; i < this.stakeholders[stakeholder_key][stakeholder_type_key].length; i++) {
        let field_title = this.stakeholders[stakeholder_key][stakeholder_type_key][i];
        field_array.push({stakeholder_field : field_title, stakeholder_field_value : ''});
      }
      this.stakeholder_for_edit.stakeholder_type = stakeholder_type_key;
      this.stakeholder_for_edit.field_data = field_array;
    }
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

  file_upload(event, type) {
    if(type=="evaluation") {
      this.evaluation_file = event.target.files[0];
    } else {
      this.report_file = event.target.files[0];
    }
  }

  upload_evaluation() {
    this.showLoading('Uploading', 'Please wait...');
    const formData = new FormData();
    formData.append('project_id', this.projectId);
    formData.append('file', this.evaluation_file);
    formData.append('type', 'evaluation');

    this.API.post('projects/add-file', formData).subscribe(
      (data:any) => {
        this.dtTrigger.unsubscribe();
        this.responseSuccess(data)
      },
      error => this.responseError(error)
    );
  }

  upload_report() {
    this.showLoading('Uploading', 'Please wait...');
    const formData = new FormData();
    formData.append('project_id', this.projectId);
    formData.append('file', this.report_file);
    formData.append('type', 'report');

    this.API.post('projects/add-file', formData).subscribe(
      (data:any) => {
        this.dtTrigger.unsubscribe();
        this.responseSuccess(data)
      },
      error => this.responseError(error)
    );
  }

  delete_file(file_id) {
    this.showLoading('Deleting', 'Please wait...');
    this.API.delete('projects/'+this.projectId+'/remove-file/'+file_id).subscribe(
      (data:any) => {
        this.dtTrigger.unsubscribe();
        this.responseSuccess(data)
      },
      error => this.responseError(error)
    );
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
  
  showImageSizeError(){
    Swal.fire({
      'title':'Payload too large',
      'icon':'error',
      'html':'<h3>The data or file you are trying to upload are too large.</h3>'
    });
  }

  openStakeHolderTab(tab) {
    var i, tabcontent, tablinks;
  
    tabcontent = document.getElementsByClassName("stakeholder-tab-pane");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    
    tablinks = document.getElementById('stakeholder-pills-tab').getElementsByClassName("nav-link");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tab+'-tab').className += ' active';
  
    document.getElementById(tab).style.display = "block";
    document.getElementById(tab).className += 'show active';
  }

  viewStakeholder(modal_ref: TemplateRef<any>, stakeholder) {
    this.stakeholder_for_edit = JSON.parse(JSON.stringify(stakeholder));
    this.openStakeholderEditModal(modal_ref);
  }

  openStakeholderAddModal(template: TemplateRef<any>) {
    this.stakeholderAddModal = this.modalService.show(template);
  }

  openStakeholderEditModal(template: TemplateRef<any>) {
    this.stakeholderEditModal = this.modalService.show(template);
  }

  saveStakeholder(){
    this.showLoading('Saving', 'Please wait...');
    this.API.post('projects/'+this.projectId+'/stakeholder/', this.added_stakeholder).subscribe(
      (response:any) => this.stakeholderResponseSuccess(response),
      error => this.stakeholderResponseError(error)
    );
  }

  updateStakeholder(){
    this.showLoading('Saving', 'Please wait...');
    this.API.put('projects/stakeholder/'+this.stakeholder_for_edit.id, this.stakeholder_for_edit).subscribe(
      (response:any) => this.stakeholderResponseSuccess(response),
      error => this.stakeholderResponseError(error)
    );
  }

  removeStakeholder(stakeholder){
    let $this = this;
    Swal.fire({
      title: 'Are you sure?',
      text: "You remove will "+stakeholder.field_data[0].stakeholder_field_value+"!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        $this.showLoading('Removing', 'Please wait...');
        $this.API.delete('projects/stakeholder/'+stakeholder.id).subscribe(
          (response:any) => {
            $this.dtTrigger.unsubscribe();
            $this.stakeholderResponseSuccess(response)
          },
          error => $this.stakeholderResponseError(error)
        );
      }
    })
  }

  stakeholderResponseSuccess(response) {
    this.jru_stakeholders = response.data.jru_stakeholders;
    this.community_stakeholders = response.data.community_stakeholders;
    this.jru_stakeholders = response.data.jru_stakeholders;
    if(this.stakeholderAddModal)
      this.stakeholderAddModal.hide();
    if(this.stakeholderEditModal)
      this.stakeholderEditModal.hide();
    Swal.fire({
      'title':response.status,
      'icon':'success',
      showConfirmButton: false,
      timer: 1500,
    });
    this.dtTrigger.next();
  }

  stakeholderResponseError(error_response) {
    console.error(error_response);
    if(error_response.status == 422) {
      Swal.fire({
        icon: 'error',
        title: 'Make sure to fill out all the required fields!',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
      });
    }
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
