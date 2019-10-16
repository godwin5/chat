import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-addp',
  templateUrl: 'addp.html',
})
export class AddpPage {
  users;
  members: Array<any>;
  groupid;
  uid;
  all = true;
  searchable = false;
  tempArr = [];
  resArr = [];
  userslists = [];
  next_btn_status = true;
  constructor(public loadingCtrl: LoadingController, public af: AngularFireAuth, public fs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.members = navParams.get('Users');
    this.groupid = navParams.get('Id');
    this.uid = this.af.auth.currentUser.uid;
  }

  ionViewDidLoad() {
    this.users = this.fs.collection('users').valueChanges();
  }
  check(id) {
    if (this.members
      .map(function (element) { return element.UID; })
      .indexOf(id) > -1) {
      return true
    }
    else {
      return false
    }

  }
  checkbox(id) {

    if (this.userslists.indexOf(id) > -1) {

      var index = this.userslists.indexOf(id);
      this.userslists.splice(index, 1);
    }
    else {

      this.userslists.push(id);
    }
    if (this.userslists.length != 0) {
      this.next_btn_status = false;
    }
    else {
      this.next_btn_status = true;
    }
    console.log(this.userslists)
  }
  c(id) {
    if (this.userslists.indexOf(id) > -1) {

      return true;
    }
    else {

      return false
    }
  }
  getItems(event) {
    let searchKey: string = event.target.value;
    let capitalize = searchKey.toUpperCase().substring(0, 1);
    if (searchKey.length > 0) {
      this.all = false;
      this.searchable = true;
      if (this.tempArr.length == 0) {
        this.fs.collection('users', ref => ref.where('SearchIndex', '==', capitalize)).snapshotChanges()
          .subscribe(user => {
            user.forEach(userData => {
              this.tempArr.push(userData.payload.doc.data());
            })
          })
      }
      else {
        this.resArr = [];
        this.tempArr.forEach(user => {
          let name: string = user['Name'];
          if (name.toUpperCase().startsWith(searchKey.toUpperCase())) {
            if (true) {
              this.resArr.push(user);
            }
          }
        })
      }
    }
    else {
      this.resArr = [];
      this.tempArr = [];
      this.all = true;
      this.searchable = false;
    }
  }
  clear() {

    this.resArr = [];
    this.tempArr = [];
    this.all = true;
    this.searchable = false;

  }

  add() {
    const load = this.loadingCtrl.create({
      content: 'Adding New Members...',

    });
    load.present();
    for (var i = 0; i < this.userslists.length; i++) {
      var sta2 = {};
      sta2[this.userslists[i]] = this.userslists[i];
      if (i == (this.userslists.length - 1)) {
        load.dismiss();
        
        this.navCtrl.pop();
      }
          this.fs.collection('users').doc(this.userslists[i]).update({
            Groups:firebase.firestore.FieldValue.arrayUnion(this.groupid)
          });
      this.fs.collection('groups').doc(this.groupid).set({
        Members:sta2,
      },{merge:true});
    } 
  }
}
