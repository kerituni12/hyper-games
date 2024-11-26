import { Component, OnInit } from '@angular/core';
import { WebService } from 'src/app/services/web.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {

  constructor(public webApi: WebService) { }
  env: any;
  about_app: any;

  ngOnInit() {
  this.env = environment;

  if (!localStorage.getItem("app_settings")) {
    this.getData();
  } else {
    this.about_app = JSON.parse(localStorage.getItem("app_settings"));
    this.getData();
  }
  }


  getData(){
    if(environment?.enableapi == true){
       this.webApi.getAppData().subscribe(data => {
        this.about_app = data;
        console.log(data);
    });
    }   
  }


}
