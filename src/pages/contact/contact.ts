import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import * as firebase from "firebase";

import { EditdpPage } from '../editdp/editdp';
import { ChatprofilePage } from "../chatprofile/chatprofile";
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  users;
  uid;
  tempArr = [];
  resArr = [];
  all = true;
  searchable = false;
  constructor(public modalCtrl: ModalController, private afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.uid = firebase.auth().currentUser.uid;

  }

  wrap(id) {
    let refid = document.getElementById(id);
    if (refid.hasAttribute('text-wrap')) {
      document.getElementById(id).removeAttribute('text-wrap');

    }
    else {
      document.getElementById(id).setAttribute('text-wrap', 'true');

    }
  }
  clear(){
    
    this.resArr = [];
    this.tempArr = [];
    this.all = true;
    this.searchable = false;
 
  }
  zoomimgall(url) {

    this.navCtrl.push(EditdpPage, {
      ImgURL: url || '/assets/imgs/nouser.jpg',

    });

  }
  goto_chat(id, name, url) {
    this.navCtrl.push(ChatprofilePage, {
      Uid: id,
      Name: name,
      Url: url
    });
  }

  getItems(event) {
    let searchKey: string = event.target.value;
    let capitalize = searchKey.toUpperCase().substring(0, 1);
    if (searchKey.length > 0) {
      this.all = false;
      this.searchable = true;
      if (this.tempArr.length == 0) {
        this.afs.collection('users', ref => ref.where('SearchIndex', '==', capitalize)).snapshotChanges()
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


  shows() {
    document.getElementById('tsrh').style.display = 'block';
    document.getElementById('tbtn').style.display = 'none';
    document.getElementById('title').style.display = 'none';
  }

  ionViewDidLoad() {

    this.users = this.afs.collection('users').valueChanges();
  }

}
