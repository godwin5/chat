import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ViewController, ModalController } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import * as firebase from 'firebase';
import { AboutPage } from '../about/about';
import { AngularFireStorage } from '@angular/fire/storage';
import { GroupPage } from '../group/group';

@IonicPage()
@Component({
  selector: 'page-sgroup',
  templateUrl: 'sgroup.html',
})
export class SgroupPage {
  users;
  username;
  imagesrc = '/assets/imgs/groupno.png';
  tempSource = '';
  q;
  a = 0;
  b = 25;
  nameForm: any;
  np = "^[a-zA-Z ]*$";
  ntc;
  nt = true;
  nnnn;
  members: Array<any>;
  groupid;
  uid;
  all = true;
  searchable = false;
  tempArr = [];
  resArr = [];
  userslists = [];
  
  next_btn_status: boolean = true;
  constructor(public modalCtrl:ModalController,public storage: AngularFireStorage, public view: ViewController, public loadingCtrl: LoadingController, public base64: Base64, public cropService: Crop, public alertCtrl: AlertController, public camera: Camera, private fb: FormBuilder, public af: AngularFireAuth, public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.members = navParams.get('Users');
    this.groupid = navParams.get('Id');
    this.uid = this.af.auth.currentUser.uid;
    this.users = this.afs.collection('users').valueChanges();
    this.username = af.auth.currentUser.uid;
    this.nameForm = this.fb.group({

      name: ['', [Validators.required, Validators.maxLength(25)]],
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
  clear() {

    this.resArr = [];
    this.tempArr = [];
    this.all = true;
    this.searchable = false;

  }
  focusn() {
    this.nt = false;
  }
  blurn() {
    this.nt = true
  }
  con() {
    this.a = this.nameForm.value.name.length;
    if (this.a > 25) {
      this.ntc = true;
    }
    else {
      this.ntc = false
    }
  }
  check() {
    if (this.nameForm.valid && this.userslists.length != 0) {
      this.next_btn_status = false;
    }
    else {
      this.next_btn_status = true;
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
    if (this.nameForm.valid && this.userslists.length != 0) {
      this.next_btn_status = false;
    }
    else {
      this.next_btn_status = true;
    }
  }
  createGroup() {
    const load = this.loadingCtrl.create({
      content: 'Creating New Group...',

    });
    load.present();
    let user = this.af.auth.currentUser;
    let tempid = Date.now();
    if (this.tempSource == '') {
      var sta1 = {};
      sta1[user.uid] = user.uid;
      var s1={};
      s1[user.uid]=0;
      this.afs.collection('groups').doc(user.uid + tempid).set({
        GroupName: this.nnnn,
        GID: user.uid + tempid,
        GroupPic: '',
        Admin: user.uid,
        DateCreated: firebase.firestore.FieldValue.serverTimestamp(),
        LastMessage:'New Group Created',
        LastSender:user.uid,
        MessageTime:firebase.firestore.FieldValue.serverTimestamp(),
        Members: sta1,
        Status:s1
      },{merge:true}).then(() => {
        this.afs.collection('users').doc(user.uid).update({
          Groups:firebase.firestore.FieldValue.arrayUnion(user.uid+tempid)
        });
        let len = this.userslists.length;
        for (var i = 0; i < len; i++) {
          if (i == (len - 1)) {
            load.dismiss();
            
            this.navCtrl.push(GroupPage,{
              id: user.uid + tempid,
              name: this.nnnn,
              url: '',
             });
             this.view.dismiss();
          }
          let u = this.userslists[i];
          this.afs.collection('users').doc(this.userslists[i]).update({
            Groups:firebase.firestore.FieldValue.arrayUnion(user.uid+tempid)
          });
          var sta2 = {};
          sta2[this.userslists[i]] =this.userslists[i];
          var s={};
          s[this.userslists[i]]=0;
          this.afs.collection('groups').doc(user.uid + tempid).set({
            Members:sta2,
            Status:s
          },{merge:true});
         
        }
      }).catch(err => {
        console.log(err);
      })
    }
    else {
      load.present();
      this.storage.ref('Group_Photo/' + user.uid + tempid + '/' + user.uid + tempid).putString(this.tempSource, 'data_url').then(d => {

        firebase.storage().ref('Group_Photo/' + user.uid + tempid + '/' + user.uid + tempid).getDownloadURL().then(url => {
          var sta1 = {};
          sta1[user.uid] = user.uid;
          this.afs.collection('groups').doc(user.uid + tempid).set({
            GroupName: this.nnnn,
            GID: user.uid + tempid,
            GroupPic: url,
            Admin: user.uid,
            DateCreated: firebase.firestore.FieldValue.serverTimestamp(),
            LastMessage:'New Group Created',
        MessageTime:firebase.firestore.FieldValue.serverTimestamp(),
        LastSender:user.uid,
        Members:sta1,
          },{
            merge:true
          }).then(() => {
            this.afs.collection('users').doc(user.uid).update({
              Groups:firebase.firestore.FieldValue.arrayUnion(user.uid+tempid)
            });
            let len = this.userslists.length;
            for (var i = 0; i < len; i++) {
              if (i == (len - 1)) {
                load.dismiss();
                
               this.navCtrl.push(GroupPage,{
                id: user.uid + tempid,
                name: this.nnnn,
                url: url,
               });
               this.view.dismiss();
              }
              let u = this.userslists[i];
              this.afs.collection('users').doc(this.userslists[i]).update({
                Groups:firebase.firestore.FieldValue.arrayUnion(user.uid+tempid)
              });
              var sta2 = {};
      sta2[user.uid] = user.uid;
              this.afs.collection('groups').doc(user.uid + tempid).set({
                Members: sta2,
              },{merge:true});
              
            }
          }).catch(err => {
            console.log(err);
          })

        })
      })
    }
  }
  showConfirm() {
    let c_options: CameraOptions =
    {
      quality: 75,

      // destinationType:this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    let g_options: CameraOptions =
    {
      quality: 75,
      correctOrientation: true,
      // destinationType:this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    const confirm = this.alertCtrl.create({
      title: 'Set Group Photo',
      message: 'Choose a picture to describe your group.',
      buttons: [
        {
          text: 'Camera',
          handler: () => {

            this.camera.getPicture(c_options).then((imageData) => {
              this.imagesrc = '/assets/imgs/preload.gif';
              this.cropService.crop(imageData, { quality: 75 }).then((newImage) => {
                let path = newImage;
                this.base64.encodeFile(path).then((b64) => {
                  let temp = b64.substring(34);
                  this.tempSource = 'data:image/jpeg;base64,' + temp;
                  setTimeout(() => {
                    document.getElementById('imgsrc').setAttribute('src', this.tempSource);
                  }, 500);
                })
              }).catch(err => {
                this.imagesrc = '/assets/imgs/groupno.png';
                this.tempSource = '';
              })
            }).catch(err => {
              this.imagesrc = '/assets/imgs/groupno.png';
              this.tempSource = '';
            })
          }
        },
        {
          text: 'Gallery',
          handler: () => {


            this.camera.getPicture(g_options).then((ImageData) => {
              this.imagesrc = '/assets/imgs/preload.gif';
              this.cropService.crop(ImageData, { quality: 75 }).then((newImage) => {
                let path = newImage;

                this.base64.encodeFile(path).then((b64) => {
                  let temp = b64.substring(34);
                  this.tempSource = 'data:image/jpeg;base64,' + temp;
                  setTimeout(() => {

                    document.getElementById('imgsrc').setAttribute('src', this.tempSource);
                  }, 1000);
                })
              }).catch(err => {
                this.imagesrc = '/assets/imgs/groupno.png';
                this.tempSource = '';
              })
            }).catch(err => {
              this.imagesrc = '/assets/imgs/groupno.png';
              this.tempSource = '';
            })
          }
        }
      ]
    });
    confirm.present();
  }

  c(id) {
    if (this.userslists.indexOf(id) > -1) {

      return true;
    }
    else {

      return false
    }
  }
  ionViewDidLoad() {
    this.users = this.afs.collection('users').valueChanges();
  }

}
