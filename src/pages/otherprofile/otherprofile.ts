import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { AngularFirestore  } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { EditdpPage } from '../editdp/editdp';

@IonicPage()
@Component({
  selector: 'page-otherprofile',
  templateUrl: 'otherprofile.html',
})
export class OtherprofilePage {
ref;
userid;
url;
  constructor(public menuCtrl:MenuController,public fs:AngularFirestore,public af:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
  this.userid=navParams.get('id');
  this.url=navParams.get('url')
  }
  zoom(){

    this.navCtrl.push(EditdpPage,{
      ImgURL: this.url || '/assets/imgs/nouser.jpg',
      
    });
    
    }
  ionViewDidLoad() {
    this.ref=this.fs.collection('users').doc(this.userid).valueChanges();
  }

}
