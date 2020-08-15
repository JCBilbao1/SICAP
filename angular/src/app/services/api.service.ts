import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private http: HttpClient) { 
  }
  private baseUrl = location.protocol + '//' + location.hostname + ':8000/api'; //url for local or with port

  get(url){
    return this.http.get(`${this.baseUrl}/${url}`);
  }

  customGet(url,data){
    
    return this.http.get(`${this.baseUrl}/${url}`, data);
  }

  put(url,data){
    return this.http.put(`${this.baseUrl}/${url}`, data);
  }

  post(url,data){
    return this.http.post(`${this.baseUrl}/${url}`, data);
  }

  delete(url){
    return this.http.delete(`${this.baseUrl}/${url}`);
  }

  download(url,data){
    return this.http.post(`${this.baseUrl}/${url}`, data, {responseType:'arraybuffer'});
  }
}
