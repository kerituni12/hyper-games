import { Component, OnInit } from '@angular/core';
import { WebService } from 'src/app/services/web.service';
import { AdMob, AdOptions, AdLoadInfo, InterstitialAdPluginEvents, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public webApi: WebService, private iab: InAppBrowser) { }

  games: any;
  env: any;
  homeData = [];
  
  intOptions: AdOptions = {
    adId: environment.interstitial_ad_id,
    isTesting: environment.testing_ad
  };

  bannerOptions: BannerAdOptions = {
    adId: environment.banner_ad_id,
    adSize: BannerAdSize.BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: environment.testing_ad
  };



  ngOnInit() {
    this.env = environment;
    this.prepareData();
    this.initAdmob();
    this.showBannerAds();
  }

  doRefresh(event) {
    this.prepareData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);

  }

  prepareData() {
    if (!localStorage.getItem("games")) {
      this.getData();
    } else {
      this.games = JSON.parse(localStorage.getItem("games"));
      this.getData();
    }
  }

  getData(){
    this.webApi.getData().subscribe(data => {
      if (data.status == "success") {
        localStorage.setItem("games", JSON.stringify(data));
        this.games = data;
      }
    });

 
    if(this.games != undefined){
      this.homeData = [];
      for(let i = 0; i < this.games.games.length; i++){
        this.homeData[i] = [];
        for(let j = 0; j < this.games.games[i].length; j++){
          if(this.homeData[i].length < 4){
            this.homeData[i][j] = this.games.games[i][j];
          }
        }
      }
    }
  }
  
  
  async initAdmob() {
    await AdMob.initialize({});
  }


  openGame(gameUri) {
    this.prepareAd();
    const browser = this.iab.create(gameUri, '_blank', 'location=no,mediaPlaybackRequiresUserAction=yes');
    browser.on('exit').subscribe(e => {
      this.showInterstitialAd();
    });
    browser.on('loaderror').subscribe(e => {
      this.prepareAd();
      browser.close();
      this.showInterstitialAd();
    });

    browser.on('loadstop').subscribe(e => {
      this.prepareAd();

      browser.executeScript({"code":"var scripts=document.getElementsByTagName('script');console.log(scripts.length);for(var totalScripts=scripts.length,i=0;i<totalScripts;i++)scripts[i]?(scripts[i].remove(),console.log(i,' is removed')):console.log(i,' is skipped');"});
      browser.executeScript({"code":"var scripts=document.getElementsByTagName('script');console.log(scripts.length);for(var totalScripts=scripts.length,i=0;i<totalScripts;i++)scripts[i]?(scripts[i].remove(),console.log(i,' is removed')):console.log(i,' is skipped');"});
      browser.executeScript({"code":"var scripts=document.getElementsByTagName('script');console.log(scripts.length);for(var totalScripts=scripts.length,i=0;i<totalScripts;i++)scripts[i]?(scripts[i].remove(),console.log(i,' is removed')):console.log(i,' is skipped');"});
      browser.executeScript({"code":"var scripts=document.getElementsByTagName('script');console.log(scripts.length);for(var totalScripts=scripts.length,i=0;i<totalScripts;i++)scripts[i]?(scripts[i].remove(),console.log(i,' is removed')):console.log(i,' is skipped');"});
      
      this.showInterstitialAd();
    });

  }

  async showBannerAds(){
    AdMob.showBanner(this.bannerOptions);
  }
  
  async showInterstitialAd() {

    AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
      console.log(info);
    });

    await AdMob.showInterstitial().then(
      value => {
        console.log(value)
      },
      error => {
        console.log(error); // show error for debuging if ad is not showing
      }
    );

  }


  async prepareAd(){
    await AdMob.prepareInterstitial(this.intOptions).then(
      value => {
        console.log(value)
      },
      error => {
        console.log(error); // show error for debuging if ad is not showing
      }
    );
  }

  

}
