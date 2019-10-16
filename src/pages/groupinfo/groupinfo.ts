import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { AddpPage } from "../addp/addp";
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-groupinfo',
  templateUrl: 'groupinfo.html',
})
export class GroupinfoPage {
  users: Observable<any>;
  admin;
  groupid;
  addBtn = false;
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public fs: AngularFirestore, public af: AngularFireAuth) {
    this.admin = navParams.get('Admin');
    this.groupid = navParams.get('GroupID');
    this.users = this.fs.collection('users', ref => ref.where('Groups', 'array-contains', this.groupid)).valueChanges();
  }
  addParticipants() {
    this.navCtrl.push(AddpPage, {
      Id: this.groupid,
      Users: this.navParams.get('Members'),
    });
  }
  ionViewDidLoad() {

    if (this.admin == this.af.auth.currentUser.uid) {
      this.addBtn = true
    }
    else {
      this.addBtn = false;
    }
  }
  exit() {
    this.navCtrl.pop();
    this.navCtrl.pop();
    if (this.af.auth.currentUser.uid != this.admin) {

      var del = {};
      del[this.af.auth.currentUser.uid] = firebase.firestore.FieldValue.delete();
      this.fs.collection('groups').doc(this.groupid).set({
        Members: del
      }, { merge: true });
      this.fs.collection('users').doc(this.af.auth.currentUser.uid).set({
        Groups: firebase.firestore.FieldValue.arrayRemove(this.groupid)
      }, { merge: true });
    }
    else {

      this.fs.collection('groups').doc(this.groupid).set({
        Admin: firebase.firestore.FieldValue.delete(),
      }, { merge: true });
      var del = {};
      del[this.af.auth.currentUser.uid] = firebase.firestore.FieldValue.delete();
      this.fs.collection('groups').doc(this.groupid).set({
        Members: del
      }, { merge: true });
      this.fs.collection('users').doc(this.af.auth.currentUser.uid).set({
        Groups: firebase.firestore.FieldValue.arrayRemove(this.groupid)
      }, { merge: true });
    }
  }
  remove(id, name) {
    if (this.af.auth.currentUser.uid == this.admin) {
      if (id != this.admin) {
        const confirm = this.alertCtrl.create({
          title: 'Remove ' + name + '?',
          buttons: [
            {
              text: 'Cancel',
              handler: () => {
                console.log('Disagree clicked');
              }
            },
            {
              text: 'Remove',
              handler: () => {
                var del = {};
                del[id] = firebase.firestore.FieldValue.delete();
                this.fs.collection('groups').doc(this.groupid).set({
                  Members: del
                }, { merge: true });
                this.fs.collection('users').doc(id).set({
                  Groups: firebase.firestore.FieldValue.arrayRemove(this.groupid)
                }, { merge: true });
              }
            }
          ]
        });
        confirm.present();
      }
    }
  }
} 
