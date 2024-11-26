import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class WebService {

  constructor(private http: HttpClient) { }

  apiUrl = 'https://yourdomain.com/api';

  localUrl = '../../assets/db'; 
  gamesRoute = "/games";
  
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'YOUR_ENVATO_PURCHASE_CODE'
    })
  };


getData() { 
  
  if(environment?.enableapi == false){
    this.apiUrl = this.localUrl;
    this.gamesRoute = "/games.json"
  }

  return this.http.get<any>(this.apiUrl + this.gamesRoute, this.httpOptions);
}

getAppData(){
  return this.http.get<any>(this.apiUrl+'/settings', this.httpOptions);
}

}
