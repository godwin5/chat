import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { PrivacyPage } from '../privacy/privacy';
import { EditprofilePage } from '../editprofile/editprofile';
import { EditdpPage } from '../editdp/editdp';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
item;
imgurl;
  constructor(public loadingCtrl:LoadingController,public alertCtrl:AlertController,public menuCtrl:MenuController,public fs:AngularFirestore,public af:AngularFireAuth,public nav: NavController, public navParams: NavParams) {
  }

  gotopri(){
    this.menuCtrl.close();
    this.nav.push(PrivacyPage);
  }
  zoom() {
    this.menuCtrl.close();
    let user = this.af.auth.currentUser;
    this.nav.push(EditdpPage, {
      ImgURL: user.photoURL || '/assets/imgs/nouser.jpg',
      UID: user.uid
    });

  }
  gotoedit() {
    this.menuCtrl.close();
    this.nav.push(EditprofilePage)
  }

  logout() {

    const confirm = this.alertCtrl.create({
      title: 'Logout?',

      buttons: [
        {
          text: 'Nope',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yeah',
          handler: () => {
            this.menuCtrl.close();
            const loader = this.loadingCtrl.create({
              content: "Logging Out...",
              duration: 2500
            });
            loader.present();
            loader.onDidDismiss(() => {
              this.af.auth.signOut().then(() => {
                this.nav.setRoot(LoginPage);
              })
            })
          }
        }
      ]
    });
    confirm.present();
  }
  ionViewDidLoad() {
    let user=this.af.auth.currentUser;
    this.imgurl=user.photoURL;
    this.item = this.fs.collection('users').doc(user.uid).valueChanges(); 
  }

}
