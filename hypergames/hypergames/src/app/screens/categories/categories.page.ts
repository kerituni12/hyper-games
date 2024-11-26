import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { WebService } from 'src/app/services/web.service';
import { AdMob, AdOptions, AdLoadInfo, InterstitialAdPluginEvents, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { environment } from "../../../environments/environment.prod";


@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  constructor(public webApi: WebService, private route: ActivatedRoute, private iab: InAppBrowser) { }

  categoryName = "";
  categoryId: any;
  games: any;
  categoryData = [];
  
  
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
    this.categoryId = this.route.snapshot.paramMap.get("id");
    this.categoryName = this.route.snapshot.paramMap.get("name");
    this.prepareData();
    this.initAdmob();
  }

  
  prepareData() {
    if (!localStorage.getItem("games")) {
      this.getData();
    } else {
      this.games = JSON.parse(localStorage.getItem("games"));
      this.categoryData = this.games['games'][this.categoryId];
      this.getData();
    }
    
    
    console.log(this.categoryData);
    
  }

  getData(){
    this.webApi.getData().subscribe(data => {
      if (data.status == "success") {
        localStorage.setItem("games", JSON.stringify(data));
        this.games = data;
      }
    });
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
      // Subscribe prepared interstitial
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
