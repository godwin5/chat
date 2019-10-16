import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { LoginPage } from "../login/login";
import * as firebase from 'firebase';
import { CemailPage } from "../cemail/cemail";
import { CpwdPage } from "../cpwd/cpwd";

@IonicPage()
@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html',
})
export class PrivacyPage {
email;
dips;
ptext;
text_check;
  constructor(public loadingCtrl:LoadingController,public alertCtrl:AlertController,public af:AngularFireAuth,public fs:AngularFirestore,public navCtrl: NavController, public navParams: NavParams) {
  this.email=af.auth.currentUser.email;   
  }
sets(){
  if(this.dips==true){
    this.fs.collection('users').doc(this.af.auth.currentUser.uid).update({
      SearchStatus:this.dips
    });
this.text_check=false;
  }
  else{
    this.text_check=true;
    this.fs.collection('users').doc(this.af.auth.currentUser.uid).update({
      SearchStatus:this.dips,
      
    });
  }
}
sett(){
  if(this.ptext==true){
    this.fs.collection('users').doc(this.af.auth.currentUser.uid).update({
      AllowText:this.ptext
    });
  }
  else{
    this.fs.collection('users').doc(this.af.auth.currentUser.uid).update({
      AllowText:this.ptext
    });
  }
}
delete(){
  const confirm = this.alertCtrl.create({
    title: 'Delete this account?',
   
    buttons: [
      {
        text: 'Keep it',
        handler: () => {
          console.log('Disagree clicked');
        }
      },
      {
        text: 'Delete',
        handler: () => {
          let alert = this.alertCtrl.create({
            title: 'Re-Enter the Password',
            inputs: [
              {
                name: 'password',
                placeholder: 'Password',
                type: 'password'
              }
            ],
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: data => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Verify and Delete',
                handler: data => {
     const load=this.loadingCtrl.create({
                   content:'Verifying...'
                 });
              load.present();   
                 this.af.auth.signInWithEmailAndPassword(this.af.auth.currentUser.email,data.password).then(()=>{
                  
                  const load1=this.loadingCtrl.create({
                    content:'Deleting...'
                  });
                  load1.present();
                  load.dismiss();
                  this.fs.collection('users').doc(this.af.auth.currentUser.uid).delete();
                   this.af.auth.currentUser.delete().then(()=>{
                     
                     load1.dismiss();
                     load.dismiss(
                       
                     );
                     this.navCtrl.setRoot(LoginPage)
                   }).catch(err=>{
                     this.alertCtrl.create({
                       title:'Oops',
                       subTitle:err.message
                     }).present();
                     load.dismiss();
                     load1.dismiss();
                   })
                 }).catch(err=>{
                   load.dismiss();
                   
                  this.alertCtrl.create({
                    title:'Oops',
                    subTitle:err.message
                  }).present();
                 })
                }
              }
            ]
          });
          alert.present();
        }
      }
    ]
  });
  confirm.present();
}
cemail(){
  this.navCtrl.push(CemailPage)
}
cpwd(){
  this.navCtrl.push(CpwdPage)
}
item;
  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivacyPage');
    this.item=this.fs.collection('users').doc(this.af.auth.currentUser.uid).valueChanges();
    this.fs.collection('users').doc(this.af.auth.currentUser.uid).snapshotChanges().subscribe(a=>{
     if(a.type='added'){
      this.ptext=a.payload.data()['AllowText'];
      this.dips=a.payload.data()['SearchStatus'];
      if(a.payload.data()['SearchStatus']==false){
        this.text_check=true
      }
      else{
        this.text_check=false
      }
     }
    })
  }

}
