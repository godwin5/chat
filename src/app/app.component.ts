import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { TabsPage } from '../pages/tabs/tabs';
import { AngularFireAuth } from "@angular/fire/auth";
import { LoginPage } from '../pages/login/login';
import { AngularFirestore } from '@angular/fire/firestore';
import { EditdpPage } from '../pages/editdp/editdp';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { PrivacyPage } from "../pages/privacy/privacy";
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireMessaging } from "@angular/fire/messaging";
import { FCM } from '@ionic-native/fcm';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  imgurl;
  uname;
  item;
  userslist=[];
  currentMessage = new BehaviorSubject(null);
  message;
  @ViewChild('mycontent') nav: NavController;
  constructor(public msg:AngularFireMessaging,public fcm:FCM,public db:AngularFireDatabase,public alertCtrl: AlertController, public loadingCtrl: LoadingController, public menuCtrl: MenuController, public fs: AngularFirestore, public af: AngularFireAuth, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      af.authState.subscribe(res => {
      
        if (res && res.displayName) {
          this.rootPage = TabsPage;
          let user = firebase.auth().currentUser;
          this.imgurl = user.photoURL;
          this.uname = user.displayName;
        
          console.log(this.imgurl);
          this.item = this.fs.collection('users').doc(user.uid).valueChanges();
 
      fcm.getToken().then(token=>{
        if(!token) return;
        const deviceRef=fs.collection('devices');
        const data={
          token,
          userid:user.uid,
        }
        deviceRef.doc(token).set(data);
      }).catch(err=>{
     //   alert(err)
      })
          let uid = firebase.auth().currentUser.uid;
fs.collection('users').snapshotChanges().subscribe(a=>{
  a.forEach(c=>{
localStorage.setItem(c.payload.doc.id,c.payload.doc.data()['Name']);
  })
})
          var myConnectionsRef = firebase.database().ref('status/' + uid);
firebase.database().ref('typing/'+user.uid).onDisconnect().remove();
          // stores the timestamp of my last disconnect (the last time I was seen online)
          //   var lastOnlineRef = firebase.database().ref('lastOnline/'+uid);

          var connectedRef = firebase.database().ref('.info/connected');
          connectedRef.on('value', function (snap) {
            if (snap.val() === true) {
              // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
              var con = myConnectionsRef;
              myConnectionsRef.remove();
              // When I disconnect, remove this device
              con.onDisconnect().remove();

              // Add this device to my connections list
              // this value could contain info about the device or a timestamp too
              con.set({
                Status: 'Online'
              });

              // When I disconnect, update the last time I was seen online
              myConnectionsRef.onDisconnect().set({
                Status: 'Offline',
                LastOnline: firebase.database.ServerValue.TIMESTAMP,
              });
            }
          });
          
        }
        else {
          this.rootPage = LoginPage;

        }
      })
      statusBar.show();
      splashScreen.hide();
    });
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
            this.uname = '';
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
}
