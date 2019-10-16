import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tab } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { Camera,CameraOptions } from "@ionic-native/camera";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from 'ionic-angular';

import { Base64 } from '@ionic-native/base64';
import { Crop } from '@ionic-native/crop';
import * as firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
@IonicPage()
@Component({
  selector: 'page-name',
  templateUrl: 'name.html',
})
export class NamePage {
  nameForm:any;
  np = "^[a-zA-Z ]*$";
  a = 0;
  b = 30;
  tempSource='';
  max=100;
  current=99;
  percentage=0;
imagesrc='/assets/imgs/nouser.jpg';
  ntc;
  nt = true;
  next_btn_status: boolean = true;
  constructor(public storage:AngularFireStorage,public base64:Base64,public cropService:Crop,public camera:Camera,public alertCtrl: AlertController, public af: AngularFireAuth, public fs: AngularFirestore, public loadingCtrl: LoadingController, public navCtrl: NavController, private fb: FormBuilder, public navParams: NavParams) {
    this.nameForm = this.fb.group({
      
      name: ['', [Validators.required, Validators.pattern(this.np), Validators.maxLength(30)]],
    });
  }
  focusn() {
    this.nt = false;
  }
  blurn() {
    this.nt = true
  }
  con() {
    this.a = this.nameForm.value.name.length;
    if (this.a > 30) {
      this.ntc = true;
    }
    else {
      this.ntc = false
    }
  }
  check() {
    if (this.nameForm.valid) {
      this.next_btn_status = false;
    }
    else {
      this.next_btn_status = true;
    }
  }
  nnnn;
  showConfirm() {
    let c_options:CameraOptions =
    {
      quality: 75,
      
     // destinationType:this.camera.DestinationType.DATA_URL,
      sourceType:this.camera.PictureSourceType.CAMERA,
     encodingType:this.camera.EncodingType.JPEG,
     mediaType:this.camera.MediaType.PICTURE,
    };
    let g_options:CameraOptions =
    {
      quality: 75,
      correctOrientation: true,
     // destinationType:this.camera.DestinationType.DATA_URL,
      sourceType:this.camera.PictureSourceType.SAVEDPHOTOALBUM,
     encodingType:this.camera.EncodingType.JPEG,
     mediaType:this.camera.MediaType.PICTURE,
    };
    const confirm = this.alertCtrl.create({
      title: 'Set Profile Picture',
      message: 'Choose a picture to show yourself.',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            
            this.camera.getPicture(c_options).then((imageData)=>{
              this.imagesrc='/assets/imgs/preload.gif';
              this.cropService.crop(imageData,{quality:75}).then((newImage)=>{
                let path=newImage;               
                this.base64.encodeFile(path).then((b64)=>{
                  let temp=b64.substring(34);
                this.tempSource='data:image/jpeg;base64,'+temp;
                setTimeout(() => {
                  document.getElementById('imgsrc').setAttribute('src',this.tempSource);
                }, 500);
                })
              }).catch(err=>{
                this.imagesrc='/assets/imgs/nouser.png';
                this.tempSource='';
              })
            }).catch(err=>{
              this.imagesrc='/assets/imgs/nouser.png';
              this.tempSource='';
            })
          }
        },
        {
          text: 'Gallery',
          handler: () => {
           
           
            this.camera.getPicture(g_options).then((ImageData)=>{
              this.imagesrc='/assets/imgs/preload.gif';
              this.cropService.crop(ImageData,{quality:75}).then((newImage)=>{
                let path=newImage;
                
                this.base64.encodeFile(path).then((b64)=>{
                  let temp=b64.substring(34);
                  this.tempSource='data:image/jpeg;base64,'+temp;
                  setTimeout(() => {
                    
                    document.getElementById('imgsrc').setAttribute('src',this.tempSource);
                  }, 1000);
                })
              }).catch(err=>{
                this.imagesrc='/assets/imgs/nouser.png';
                this.tempSource='';
              })
            }).catch(err=>{
              this.imagesrc='/assets/imgs/nouser.png';
              this.tempSource='';
            })
          }
        }
      ]
    });
    confirm.present();
  }
  next(){
    let user=this.af.auth.currentUser;
    if(this.nameForm.valid){
      
      let names:string=this.nnnn;
      
      let loading = this.loadingCtrl.create({
        content: 'Please Wait...',        
      });
      
      let nav=this.navCtrl;
     if(this.tempSource!=''){
      loading.present();
       this.storage.ref('Profile_Picture/'+user.uid+'/'+user.uid).putString(this.tempSource,'data_url').then(d=>{
 
        firebase.storage().ref('Profile_Picture/' + user.uid + '/' + user.uid).getDownloadURL().then(url => {
          
          user.updateProfile({
            displayName: names,
            photoURL: url,
          }).then(function () {
            
            firebase.firestore().collection('users').doc(user.uid).update({
              photoURL: url,
              Name:names,
              Bio:"Hey there, I'm a new Chatbee",
              UID:user.uid,
              SearchIndex:names.toUpperCase().substring(0,1),
              AllowText:true,
              SearchStatus:true,
            }).then(function () {
              // Update successful.

              loading.dismiss();
              nav.setRoot(TabsPage);

            }).catch(function (err) {
              loading.dismiss();
              alert('Try Again');
              console.log(err)
            });
          }).catch(function (error) {
            // An error happened.
            console.log(error)
            loading.dismiss();
            alert('Try Again!!!');
          });
        })
       })
     }
     else{
       
       loading.present();
user.updateProfile({
  displayName:this.nnnn,
  photoURL:'',
}).then(data=>{
  localStorage.setItem('theme_id','6');
  this.fs.collection('users').doc(user.uid).update({
    Name:names,
    Bio:"Hey there, I'm a new Chatbee",
    photoURL:'',
    AllowText:true,
    SearchStatus:true,
    SearchIndex:names.toUpperCase().substring(0,1),
    UID:user.uid,
  }).then(d=>{
    
    loading.dismiss();
    this.navCtrl.setRoot(TabsPage)
  }).catch(err=>{
    alert('Try Again');
    loading.dismiss();
  })
}).catch(err=>{
  alert('Try Again');
  loading.dismiss();
})
     }
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NamePage');
    
  }

}
