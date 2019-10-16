import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, MenuController } from 'ionic-angular';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

import { LoadingController } from 'ionic-angular';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {
  gender = '';
  update_btn_status: boolean = true;
  editform;
  userRef;
  name;
  nickname;
  bio = '';
  dob = '';
  ntn = true; ntcn;
  ntc; ntcbio;
  a; nt = true; abio; ntbio = true;
  np = "^[a-zA-Z ]*$";
 
  b = 30; bbio = 150;
  c;
  d = 30;
  dup_nick;
  constructor(public menuCtrl:MenuController,public view:ViewController,public loadingCtrl: LoadingController, public fs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public afauth: AngularFireAuth) {
    this.dup_nick = navParams.get('Nickname');
    console.log(this.dup_nick);
    this.editform = this.formBuilder.group({
      nname: ['', [Validators.required, Validators.pattern(this.np), Validators.maxLength(30)]],
      nnickname: ['',],
      nbio: ['', [Validators.maxLength(150), Validators.required]],

    });
  }


  focusn() {
    this.nt = false;
  }
  blurn() {
    this.nt = true
  }
  con() {
    this.a = this.editform.value.nname.length;
    if (this.a > 30) {
      this.ntc = true;
    }
    else {
      this.ntc = false
    }
  }
  focusbio() {
    this.ntbio = false;
  }
  blurbio() {
    this.ntbio = true
  }
  conbio() {
    this.abio = this.bio.length;
    if (this.abio > 150) {
      this.ntcbio = true;
    }
    else {
      this.ntcbio = false
    }
  }
  check() {
    if (this.editform.valid) {
      this.update_btn_status = false;
    }
    else {
      this.update_btn_status = true;
    }
  }
  close(){
    this.view.dismiss();
  }
  update_bio() {
    if (this.editform.valid) {
     // document.getElementById('hide').style.display = 'none';
      const loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let user = this.afauth.auth.currentUser;
 let v=this.view;
      let nnn = this.name;
      let menu =this.menuCtrl;
      this.fs.collection('users').doc(user.uid).update({
        Name: this.name,
        Location: this.nickname || null,
        Bio: this.bio,
        DOB: this.dob || null,
        Gender: this.gender || null,
      }).then(function (data) {
        user.updateProfile({
          displayName: nnn,
          photoURL: user.photoURL,
        }).then(function () {
          loader.dismiss();
          v.dismiss();
        //  menu.open();
          //nav.setRoot(ProfilePage);
        }).catch(function (error) {
          loader.dismiss();
          alert('Try Again');
        });
      }).catch(err => {
        alert('Try Again');
        loader.dismiss();
      });
    }

  }

  ionViewDidLoad() {
    this.update_btn_status = false;
  }
  ionViewWillEnter() {
    this.update_btn_status = false;
    let user = this.afauth.auth.currentUser;
    this.userRef = this.fs.collection('users').doc(user.uid);
    this.userRef.snapshotChanges()
      .subscribe(action => {
        let value = action.payload.data();
        this.name = value.Name;
        this.nickname = value.Location || '';
        this.bio = value.Bio;
        this.a = this.name.length;
        this.abio = this.bio.length;
        this.c = this.nickname.length;
        this.gender = value.Gender;
        this.dob = value.DOB;
      });
  }
}
