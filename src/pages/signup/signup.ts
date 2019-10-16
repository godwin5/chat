import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
//import * as $ from 'jquery';

import { NamePage } from '../name/name';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  email='';
  pwd='';
    constructor(public loadingCtrl:LoadingController,public db:AngularFirestore,public af:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams,public toastCtrl: ToastController) {
    }
    goto_l(){
      this.navCtrl.pop();
    }
    signup(){
      if(this.email!='' && this.pwd!=''){
        let loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        loading.present();
        this.af.auth.createUserWithEmailAndPassword(this.email,this.pwd).then(()=>{
  
  let user=this.af.auth.currentUser;
  this.db.collection('users').doc(user.uid).set({
    Email:this.email,
    DateCreated:user.metadata.creationTime,
    UID:user.uid,
  
  }).then(()=>{
    loading.dismiss();
    this.navCtrl.setRoot(NamePage);
  }).catch(()=>{
    user.delete();
    loading.dismiss();
    let toast = this.toastCtrl.create({
      message: 'Try Again',
      dismissOnPageChange:true,
      showCloseButton:true,
      closeButtonText:'ok',
      duration:5000,
      position: 'bottom'
    });
    toast.present();
  })
        }).catch(err=>{
          loading.dismiss();
          let toast = this.toastCtrl.create({
            message: err.message,
            dismissOnPageChange:true,
            showCloseButton:true,
            closeButtonText:'ok',
            position: 'bottom',
            duration:5000
          });
          toast.present();
        })
      }
    }
    ionViewDidLoad() {
      console.log('ionViewDidLoad SignupPage');
    }

}
