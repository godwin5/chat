import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { SgroupPage } from "../sgroup/sgroup";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { GroupPage } from '../group/group';
import { map, retry } from 'rxjs/operators';
import * as firebase from 'firebase';
import * as $ from 'jquery';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  groups;
  u;
  constructor(public fs: AngularFirestore, public af: AngularFireAuth, public modalCtrl: ModalController, public navCtrl: NavController) {
this.u=af.auth.currentUser.uid;
  }
  opensgroup() {
    const modal = this.modalCtrl.create(SgroupPage);
    modal.present();
  }
  gotogrp(id, name, url,admin) {
    this.navCtrl.push(GroupPage, {
      id: id,
      name: name,
      url: url,
      admin:admin,
    });
  }
  time(t) {

    if (t) {
      var temp;
      var today = new Date();

      if (today.setHours(0, 0, 0, 0) == new Date(t.toMillis()).setHours(0, 0, 0, 0)) {
        let date = new Date(t.toMillis());

        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        if (minutes < 10) {
          temp = String(minutes);
          temp = '0' + temp;
        }
        else {
          temp = minutes
        }
        return hours + ':' + temp + ' ' + ampm;

      }
      else {
        let date = new Date(t.toMillis());
        let ddate = date.getDate();
        let tmonth = 1 + date.getMonth();
        let year = date.getFullYear().toString().substring(2);
        return ddate + '/' + tmonth + '/' + year;
      }
    }
    else {
      return 'Sending...'
    }
  }
  con(id){
    if(id==this.af.auth.currentUser.uid){
      return 'You';
    }
    else{
      let name=localStorage.getItem(id).split(' ');
      return name[0];
    }
  }
  temps;
  ionViewDidLoad() {
    
    let user = this.af.auth.currentUser;
    let uuid=user.uid;
    this.groups = this.fs.collection('groups', ref => ref.orderBy('MessageTime','desc')).valueChanges();
  firebase.firestore().collection('groups').onSnapshot(aa=>{
    setTimeout(() => {
      let len=$('#list').length;
      if(len==0){
        document.getElementById('nolist').style.display='block';
      }
      else{
        document.getElementById('nolist').style.display='none';
      }
    }, 100);
 })
  }
}
