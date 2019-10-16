import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';



@IonicPage()
@Component({
  selector: 'page-cemail',
  templateUrl: 'cemail.html',
})
export class CemailPage {
  newemail;
  change_btn_status=true;
  constructor(public loadingCtrl:LoadingController,public alertCtrl:AlertController,public af:AngularFireAuth,public fs:AngularFirestore,public navCtrl: NavController, public navParams: NavParams) {
  }
checkc(){
if(this.newemail!=''){
this.change_btn_status=false;
}
else{
  this.change_btn_status=true
}
}
changeEmail(){

  const prompt = this.alertCtrl.create({
    title: 'Re-Authenticate',
    message: "Enter password of this account",
    inputs: [
      {
        name:'pwd',
        placeholder:'Password',
        type:'password'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Verify',
        handler: data => {
          const load1=this.loadingCtrl.create({
            content:'Verifying...'
          });
          load1.present();
          this.af.auth.signInWithEmailAndPassword(this.af.auth.currentUser.email,data.pwd).then(()=>{
            const load=this.loadingCtrl.create({
              content:'Updating...'
            });
            load.present();
            load1.dismiss();
          this.af.auth.currentUser.updateEmail(this.newemail).then(()=>{
            this.fs.collection('users').doc(this.af.auth.currentUser.uid).update({
              Email:this.newemail,
            }).then(()=>{
              load.dismiss();
              this.navCtrl.pop();
            }).catch(err=>{
              load.dismiss();
              alert(err)
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
            }).present();
          })
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
            }).present();
          })
        }
      }
    ]
  });
  prompt.present();

}
request(){
const load=this.loadingCtrl.create({
  content:'Sending...'
});
load.present();
this.af.auth.currentUser.sendEmailVerification().then(()=>{
  load.dismiss();
this.alertCtrl.create({
  title:'Succes',
  subTitle:'Email Sent',
  enableBackdropDismiss:false,
  buttons:[
    {
      text:'Ok',
      handler:data=>{
        this.navCtrl.pop();
      }
    }
  ]
}).present();
}).catch(err=>{
  load.dismiss();
  this.alertCtrl.create({
    title:'Oops',
    subTitle:err.message,
    buttons:[
      {
        text:'Ok',
      }
    ]
  }).present();
})
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad CemailPage');
  }

}
