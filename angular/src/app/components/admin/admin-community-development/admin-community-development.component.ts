import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-community-development',
  templateUrl: './admin-community-development.component.html',
  styleUrls: ['./admin-community-development.component.sass']
})
export class AdminCommunityDevelopmentComponent implements OnInit {

  dtOptions;
  dtTrigger;
  programs = [];

  constructor() { }

  ngOnInit(): void {
  }

}
