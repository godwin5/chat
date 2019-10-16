import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';

import { SignupPage } from "../signup/signup";
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { TabsPage } from "../tabs/tabs";  
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
email='';
pwd='';
  constructor(public view:ViewController,public toastCtrl:ToastController,public loadingCtrl:LoadingController,public af:AngularFireAuth,public navCtrl: NavController,public navParams: NavParams) {
  }
  goto_s(){
    this.navCtrl.push(SignupPage);
  }
login(){
  
if(this.email && this.pwd !=''){

  let load=this.loadingCtrl.create({
    content:'Please Wait...'
  });
  load.present();
  this.af.auth.signInWithEmailAndPassword(this.email,this.pwd).then(()=>{
    load.dismiss();
    this.navCtrl.setRoot(TabsPage);
  }).catch(err=>{
    load.dismiss();
    let toast = this.toastCtrl.create({
      message: err.message,
      dismissOnPageChange:true,
      duration:5000,
      showCloseButton:true,
      closeButtonText:'ok',
      position: 'bottom'
    });
    toast.present();
  })
}
}
  ionViewDidLoad() {
    if(sessionStorage.getItem('delete_uid')){
      firebase.firestore().collection('users').doc(sessionStorage.getItem('delete_uid')).delete();
    }
  }

}
