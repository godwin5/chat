import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";

@IonicPage()
@Component({
  selector: 'page-cpwd',
  templateUrl: 'cpwd.html',
})
export class CpwdPage {
  currpwd='';
  newpwd='';
  change_status=true;
  constructor(public loadingCtrl:LoadingController,public alertCtrl:AlertController,public af:AngularFireAuth,public fs:AngularFirestore,public navCtrl: NavController, public navParams: NavParams) {
  }
  check(){
    if(this.currpwd !='' && this.newpwd!=''){
      this.change_status=false
    }
    else{
      this.change_status=true
    }
  }
  change_pwd(){
    if(this.currpwd!='' && this.newpwd!=''){
      const load=this.loadingCtrl.create({
        content:'Verifying...'
      });
      load.present();
      this.af.auth.signInWithEmailAndPassword(this.af.auth.currentUser.email,this.currpwd).then(()=>{
const load1=this.loadingCtrl.create({
  content:'Updating...'
});
load1.present();
load.dismiss();
this.af.auth.currentUser.updatePassword(this.newpwd).then(()=>{
  load1.dismiss();
  this.alertCtrl.create({
    title:'Success',
    subTitle:'Password Updated',
    enableBackdropDismiss:false,
    
    buttons:[
      {
        text:'Ok',
        handler:data=>{
          this.navCtrl.pop();
        }
      }
    ]
  }).present()
}).catch(err=>{
  load1.dismiss();
  this.alertCtrl.create({
    title:'Oops',
    subTitle:err.message,
    buttons:[
      {
        text:'Ok'
      }
    ]
  }).present()
})
      }).catch(err=>{
        load.dismiss();
this.alertCtrl.create({
  title:'Oops',
  subTitle:err.message,
  buttons:[
    {
      text:'Ok'
    }
  ]
}).present()
      })
    }
  }
  sendmail(){
    const load=this.loadingCtrl.create({
      content:'Sending...'
    });
    load.present();
    this.af.auth.sendPasswordResetEmail(this.af.auth.currentUser.email).then(()=>{
load.dismiss();
this.alertCtrl.create({
  title:'Success',
  subTitle:'Password reset email sent',
  enableBackdropDismiss:false,
  buttons:[
    {
      text:'Ok',
      handler:data=>{
        this.navCtrl.pop();
      }
    }
  ]
}).present()
    }).catch(err=>{
      load.dismiss();
      this.alertCtrl.create({
        title:'Oops',
        subTitle:err.message,
        buttons:[
          {
            text:'Ok'
          }
        ]
      }).present()
    })
  }
  ionViewDidLoad() {
   
  }

}
