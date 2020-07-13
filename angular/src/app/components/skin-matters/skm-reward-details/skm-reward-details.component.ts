import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-skm-reward-details',
  templateUrl: './skm-reward-details.component.html',
  styleUrls: ['./skm-reward-details.component.sass'],
  styles : [
    '/deep/ div.ngxImageZoomContainer { width: 100% !important; height: auto !important;}',
    '/deep/ img.ngxImageZoomThumbnail { width: 100% !important; }',
  ]
})
export class SkmRewardDetailsComponent implements OnInit {

  reward;
  rewardSlug;
  zoomImage = '';
  zoomMode= 'hover';
  magnification = 1;
  checkImg = true;
  magnifyInterval;

  @ViewChild('image_gallery') image_gallery: ElementRef;

  constructor(private route: ActivatedRoute, private cookieService: CookieService, private router: Router, private API: APIService) {
    
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.rewardSlug = params.get('rewardSlug')
      this.getRewardDetails(this.rewardSlug);
    })
    document.getElementById('description-tab').click();
  }

  getRewardDetails(slug){
    this.API.get('rewards/skm-reward-details/'+slug).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data){
    console.log(data);
    this.reward = data;
    this.zoomImage = (this.reward?.images[0]?.url) ? this.reward.images[0].url : 'assets/skin_matters_assets/logo_bg.jpg';
    this.magnifyInterval = interval(500).subscribe(n => {
      if(this.checkImg) {
        this.checkImg = false;
        var img = new Image();
        img.src = this.zoomImage;
        var containerWidth = document.getElementsByClassName('ngxImageZoomContainer')[0].clientWidth * 2;
        var imageWidth = img.width;
        this.magnification = containerWidth / imageWidth;
        if(!containerWidth || !imageWidth || !this.magnification) {
          this.checkImg = true;
        } else {
          this.magnifyInterval.unsubscribe();
        }
      }
    });
  }

  handleError(error){
    console.error(error);
  }
  
  scrollLeft(){
    this.image_gallery.nativeElement.scrollLeft -= 300;
  }

  scrollRight(){
    this.image_gallery.nativeElement.scrollLeft += 300;
  }

  openTab(tab) {
    var i, tabcontent, tablinks;
  
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    document.getElementById(tab).style.display = "block";
    document.getElementById(tab + '-tab').className += ' active';
  }

  changeZoomImage(index) {
    this.zoomImage = (this.reward?.images[index]?.url) ? this.reward.images[index].url : 'assets/skin_matters_assets/logo_bg.jpg';
    this.magnifyInterval = interval(500).subscribe(n => {
      if(this.checkImg) {
        this.checkImg = false;
        var img = new Image();
        img.src = this.zoomImage;
        var containerWidth = document.getElementsByClassName('ngxImageZoomContainer')[0].clientWidth * 2;
        var imageWidth = img.width;
        this.magnification = containerWidth / imageWidth;
        if(!containerWidth || !imageWidth || !this.magnification) {
          this.checkImg = true;
        } else {
          this.magnifyInterval.unsubscribe();
        }
      }
    });
  }

}
