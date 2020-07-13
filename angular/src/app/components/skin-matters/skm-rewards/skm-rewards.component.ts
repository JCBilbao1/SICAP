import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-skm-rewards',
  templateUrl: './skm-rewards.component.html',
  styleUrls: ['./skm-rewards.component.sass']
})
export class SkmRewardsComponent implements OnInit {

  rewards;
  total_rewards;
  sorting_filter = '';

  per_page = 12;
  page = 1;

  constructor( private API:APIService ) {
    this.getRewards();
  }

  getRewards() {
    this.rewards = null;

    this.API.customGet('skm-rewards', {
      params : {
        sorting_filter : this.sorting_filter,
        per_page : this.per_page,
        page : this.page,
      },
    }).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data){
    console.log(data);
    
    this.rewards = data.rewards;
    this.total_rewards = data.total_rewards;
  }

  handleError(error){
    console.error(error);
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getRewards();
  }

  ngOnInit(): void {

  }

}
