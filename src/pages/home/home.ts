import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, AlertController } from 'ionic-angular';
//import { DispfollowingPage } from '../dispfollowing/dispfollowing';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, } from "@angular/fire/firestore";
import { ChatprofilePage } from '../chatprofile/chatprofile';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  refs;
  u;
  constructor(public alertCtrl: AlertController, public modalCtrl: ModalController, public viewCtrl: ViewController, public fs: AngularFirestore, public af: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
    this.u = af.auth.currentUser.uid;
  }
  goto_chats(uid, name, nick, url) {
    this.navCtrl.push(ChatprofilePage, {
      Uid: uid,
      Name: name,
      Url: url
    });

  }
  disp(msg, uid) {
    let id = String(uid);
    console.log(id);
    console.log(msg[id])
    return msg['uid'];
  }

  interval;
  listenRef;
  listen1ref;
  delete(uid) {
    let user = this.af.auth.currentUser;
    const confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Messages will be deleted on your side permanently.',
      buttons: [
        {
          cssClass: 'deletechat',
          text: 'Delete',
          handler: () => {
            let obj = {};
            obj[user.uid] = firebase.firestore.FieldValue.delete();
            this.fs.collection('users').doc(uid).set({
              LastMessage: obj,
              MessageTime: obj,
            }, { merge: true });
            firebase.firestore().collection('chats').doc(user.uid).collection(uid).get().then(function (snap) {
              snap.forEach(child => {
                let id = child.id;
                firebase.firestore().collection('chats').doc(user.uid).collection(uid).doc(id).delete();
              })
            })
          }
        }
      ]
    });
    confirm.present();
  }


  ionViewDidLoad() {
    let user = this.af.auth.currentUser;
    let mt = "MessageTime." + user.uid;
    this.refs = this.fs.collection('users', ref => ref.orderBy("MessageTime." + user.uid, "desc")).valueChanges();

    //this.listen1ref=firebase.firestore().collection('badges').doc(user.uid).update({
    //   Status:1
    // })

    this.listenRef = firebase.firestore().collection("chats")
      .onSnapshot(function (snapshot) {

        //    firebase.firestore().collection('badges').doc(user.uid).update({
        //     Status:1
        //  });

      });

    this.interval = setInterval(() => {
      firebase.database().ref('status').on('value', function (snapshot) {
        snapshot.forEach(function (child) {
          let key = child.key;
          let DocId = document.getElementById(key);
          let sid:HTMLStyleElement=document.querySelector('#status'+key);
          if (sid) {
            if (child.val().Status == 'Online') {
              //document.getElementById('status'+key).style.color = '#32db64';
              //document.getElementById('status'+key).innerText = 'phonelink_ring';
              sid.style.color="#32db64";
              sid.innerText='phonelink_ring';

            }
            else {
              //document.getElementById('status'+key).style.color = '#f53d3d';
              //document.getElementById('status'+key).innerText = 'phonelink_erase';
              sid.style.color="#f53d3d";
              sid.innerText='phonelink_erase';
            }
          }
        })
      })
    }, 100);
  }

  ionViewDidLeave() {
   // this.listenRef();
   // window.clearInterval(this.interval);
  }

}
