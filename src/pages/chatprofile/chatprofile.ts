import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, LoadingController, ModalController, AlertController, ActionSheetController, PopoverController, NavParams, Content, ViewController, Platform } from 'ionic-angular';
import { Keyboard } from "@ionic-native/keyboard";
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatimgPage } from "../chatimg/chatimg";
import * as firebase from 'firebase';
import { PhotoViewer, PhotoViewerOptions } from "@ionic-native/photo-viewer";
import { AngularFireDatabase } from "@angular/fire/database";
import * as $ from 'jquery';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { OtherprofilePage } from "../otherprofile/otherprofile";

@IonicPage()
@Component({
  selector: 'page-chatprofile',
  templateUrl: 'chatprofile.html',
})
export class ChatprofilePage {
  userid;
  name;
  text: String;
  chatRef
  photourl;
  meid;
  sendbtn = true;
  @ViewChild(Content) content: Content;
  constructor(public keyboard: Keyboard, public photoviewer: PhotoViewer, public db: AngularFireDatabase, public platform: Platform, public imagePicker: ImagePicker, public storage: AngularFireStorage, public modalCtrl: ModalController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, public popoverCtrl: PopoverController, public viewCtrl: ViewController, public af: AngularFireAuth, public fs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    this.userid = navParams.get('Uid');
    this.name = navParams.get('Name');
    this.photourl = navParams.get('Url');
    this.meid = af.auth.currentUser.uid;
  }
  close() {

    this.viewCtrl.dismiss();
  }

  select_image() {
    let user = this.af.auth.currentUser;
    let usid = this.userid;

    const options: ImagePickerOptions = {
      maximumImagesCount: 1,
      outputType: 1,
      quality: 50,
    }
    this.imagePicker.getPictures(options).then(results => {
      for (var i = 0; i < results.length; i++) {
        let dn = Date.now();

        let meRef = firebase.firestore().collection('chats').doc(user.uid).collection(usid).doc(dn.toString());
        let youRef = firebase.firestore().collection('chats').doc(usid).collection(user.uid).doc(dn.toString());
        meRef.set({
          Text: 'imageegamizzqrstrb',
          ImgSrc: 'data:image/jpeg;base64,' + results[i],
          Sender: user.uid,
          Receiver: usid,
          Timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          Status: 0,
        });
        youRef.set({
          Text: 'imageegamizzqrstrb',
          ImgSrc: 'data:image/jpeg;base64,' + results[i],
          Sender: user.uid,
          Receiver: usid,
          Timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          Status: 0,
        });
        let obj = {}
        obj[usid] = 'imageegamizzqrstrb';

        var obj1 = {};
        obj1[user.uid] = 'imageegamizzqrstrb';

        var mytime = {};
        mytime[user.uid] = firebase.firestore.FieldValue.serverTimestamp();
        var histime = {};
        histime[usid] = firebase.firestore.FieldValue.serverTimestamp();
        var sta = {};
        sta[user.uid] = 0;
        var sta1 = {};
        sta1[usid] = 0
        firebase.firestore().collection('users').doc(usid).set({
          LastMessage: obj1,
          MessageTime: mytime,
          Status: sta,
        }, { merge: true })

        firebase.firestore().collection('users').doc(user.uid).set({
          LastMessage: obj,
          MessageTime: histime,
          Status: sta1,

        }, { merge: true });




      }
    })
  }
  send() {
    let user=this.af.auth.currentUser;
    if (this.text != '') {
      firebase.database().ref('typing/' + user.uid + '/' + this.userid).remove();
      this.text = this.text.substr(0, 1000);
      let dn = Date.now();
      
      firebase.database().ref('typing/' + user.uid + '/' + this.userid).remove();
      let meRef = firebase.firestore().collection('chats').doc(user.uid).collection(this.userid).doc(dn.toString());
      let youRef = firebase.firestore().collection('chats').doc(this.userid).collection(user.uid).doc(dn.toString());
      meRef.set({
        Timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        Sender: user.uid,
        Receiver: this.userid,
        Status: 0,
        Text: this.text,
      });
      youRef.set({
        Timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        Sender: user.uid,
        Receiver: 'you',
        Status: 0,
        Text: this.text,
      });
      let obj = {}
      obj[this.userid] = this.text;

      var obj1 = {};
      obj1[user.uid] = this.text;
      var mytime = {};
      mytime[user.uid] = firebase.firestore.FieldValue.serverTimestamp();
      var histime = {};
      histime[this.userid] = firebase.firestore.FieldValue.serverTimestamp();
      var sta = {};
      sta[user.uid] = 0;
      var sta1 = {};
      sta1[this.userid] = 0;
      this.fs.collection('users').doc(this.userid).set({
        LastMessage: obj1,
        MessageTime: mytime,
        Status: sta
      }, { merge: true });

      firebase.firestore().collection('users').doc(user.uid).set({
        LastMessage: obj,
        MessageTime: histime,
        Status: sta1

      }, { merge: true });
      this.text = '';
      document.getElementById('typings').focus();
      this.sendbtn = true;
      
        this.content.scrollToBottom(0);
      
    }
  }

  focus() {
    //  this.content.scrollToBottom(0);

  }
  input() {
    
    let user=this.af.auth.currentUser;
    if (this.text != '') {
      firebase.database().ref('typing/' + user.uid + '/' + this.userid).set(true);
      this.sendbtn = false
    }
    else {
      firebase.database().ref('typing/' + user.uid + '/' +this.userid).remove();
      this.sendbtn = true
    }
  }
  presentActionSheet(time, identifier, texts) {
    
    if (time) {
      var temp;
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let date = new Date(time.toMillis());
      let tdays = date.getDay();
      let ddate = date.getDate();
      let tmonth = date.getMonth();
      let year = date.getFullYear();
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
      var strTime = days[tdays] + ', ' + months[tmonth] + ' ' + ddate + ' ' + year + ' at ' + hours + ':' + temp + ' ' + ampm;

    }
    else {
      let strTime = "Sending..."
    }
    if (texts != 'imageegamizzqrstrb') {
      const actionSheet = this.actionSheetCtrl.create({
        title: 'More Options',
        buttons: [
          {
            icon: 'time',
            text: strTime || 'Sending...',
          }, {
            icon: 'copy',
            text: 'Copy',
            handler: () => {
              var tempInput = document.createElement("input");
              tempInput.style.position = "position: absolute;";
              tempInput.style.left = ' left: -1000px;';
              tempInput.style.top = 'top: -1000px';
              tempInput.value = texts;
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand("copy");
              document.body.removeChild(tempInput);
            }
          }, {
            text: 'Delete',
            icon: 'trash',
            handler: () => {
              let user = firebase.auth().currentUser;
              let rc = this.userid;
              this.fs.collection('chats').doc(this.userid).collection(user.uid).doc(identifier).delete();
              this.fs.collection('chats').doc(user.uid).collection(this.userid).doc(identifier).delete().then(function (d) {
                let len = $('.chat').length;

                if (len == 0) {
                  let lastMSG = $('#content div.temp:last').text();
                  var obj = {};
                  obj[rc] = firebase.firestore.FieldValue.delete();

                  firebase.firestore().collection('users').doc(user.uid).set({
                    MessageTime: obj,
                    LastMessage: obj
                  }, { merge: true })
                  var obj1 = {};
                  obj1[user.uid] = firebase.firestore.FieldValue.delete();

                  firebase.firestore().collection('users').doc(rc).set({
                    MessageTime: obj1,
                    LastMessage: obj1
                  }, { merge: true })

                }
                else {

                  let lastMSG = $('#content div.temp:last').text();

                  var obj = {};
                  obj[rc] = lastMSG;

                  firebase.firestore().collection('users').doc(user.uid).set({
                    LastMessage: obj,
                  }, { merge: true })
                  var obj1 = {};
                  obj1[user.uid] = lastMSG;

                  firebase.firestore().collection('users').doc(rc).set({
                    LastMessage: obj1,
                  }, { merge: true })

                }
              })
            }
          }
        ]
      });
      actionSheet.present();
    }
    else {
      const actionSheet = this.actionSheetCtrl.create({
        title: 'More Options',
        buttons: [
          {
            icon: 'time',
            text: strTime || 'Sending...',
          },
          {
            text: 'Delete',
            icon: 'trash',
            handler: () => {
              let user = firebase.auth().currentUser;
              let rc = this.userid;
              this.fs.collection('chats').doc(this.userid).collection(user.uid).doc(identifier).delete();
              this.fs.collection('chats').doc(user.uid).collection(this.userid).doc(identifier).delete().then(function (d) {
                let len = $('.chat').length;

                if (len == 0) {
                  let lastMSG = $('#content div.temp:last').text();
                  var obj = {};
                  obj[rc] = firebase.firestore.FieldValue.delete();

                  firebase.firestore().collection('users').doc(user.uid).set({
                    MessageTime: obj,
                    LastMessage: obj
                  }, { merge: true })
                  var obj1 = {};
                  obj1[user.uid] = firebase.firestore.FieldValue.delete();

                  firebase.firestore().collection('users').doc(rc).set({
                    MessageTime: obj1,
                    LastMessage: obj1
                  }, { merge: true })

                }
                else {

                  let lastMSG = $('#content div.temp:last').text();

                  var obj = {};
                  obj[rc] = lastMSG;

                  firebase.firestore().collection('users').doc(user.uid).set({
                    LastMessage: obj,
                  }, { merge: true })
                  var obj1 = {};
                  obj1[user.uid] = lastMSG;

                  firebase.firestore().collection('users').doc(rc).set({
                    LastMessage: obj1,
                  }, { merge: true })

                }
              })
            }
          }
        ]
      });
      actionSheet.present();
    }

  }
  presentActionSheetyou(time, txt) {
    if (time) {
      var temp;
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let date = new Date(time.toMillis());
      let tdays = date.getDay();
      let ddate = date.getDate();
      let tmonth = date.getMonth();
      let year = date.getFullYear();
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
      var strTime = days[tdays] + ', ' + months[tmonth] + ' ' + ddate + ' ' + year + ' at ' + hours + ':' + temp + ' ' + ampm;

    }
    else {
      let strTime = "Sending..."
    }
    if (txt != 'imageegamizzqrstrb') {
      const actionSheet = this.actionSheetCtrl.create({
        title: 'More Options',
        buttons: [
          {
            icon: 'time',
            text: strTime || 'Sending...',
          }, {
            icon: 'copy',
            text: 'Copy',
            handler: () => {
              var tempInput = document.createElement("input");
              tempInput.style.position = "position: absolute;";
              tempInput.style.left = ' left: -1000px;';
              tempInput.style.top = 'top: -1000px';
              tempInput.value = txt;
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand("copy");
              document.body.removeChild(tempInput);
            }
          },
        ]
      });
      actionSheet.present();
    }
    else {
      const actionSheet = this.actionSheetCtrl.create({
        title: 'More Options',
        buttons: [
          {
            icon: 'time',
            text: strTime || 'Sending...',
          },

        ]
      });
      actionSheet.present();
    }

  }

  zoomcimg(src) {
    this.modalCtrl.create(ChatimgPage, {
      url: src
    }).present();
  }
  pro(){
this.navCtrl.push(OtherprofilePage,{
id:this.userid,
url:this.photourl,

});
  }
  listenRef; listen1ref; l3;
  sref;
  i = 11111111111111111111;
  ionViewDidLoad() {
    setInterval(() => {
      let len=$('.you').length;
     for(var i=0;i<len;i++){
      $('.you .avatar:last').show();
     }
    }, 10);
    this.keyboard.onKeyboardShow().subscribe(() => {
      var div: HTMLStyleElement = document.querySelector('#content');
      div.style.height = window.innerHeight + 'px';
      this.content.scrollToBottom(0);
    });
    this.keyboard.onKeyboardHide().subscribe(() => {
      var div: HTMLStyleElement = document.querySelector('#content');
      div.style.height = window.innerHeight + 'px';
      
    });
    console.log('loaded');
    let user = this.af.auth.currentUser;
    let ussid = this.userid;
    let c = this.content;
    this.chatRef = this.fs.collection('chats').doc(user.uid).collection(this.userid, ref => ref.orderBy('Timestamp')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    let iv = this.i;
    this.listen1ref = firebase.firestore().collection('chats').doc(ussid).collection(user.uid).onSnapshot(function (snapshot) {

      snapshot.docChanges().forEach(change => {
      if(change.type=='added'){
        let data = change.doc.data()
        let id = change.doc.id;

        // console.log(data['Timestamp'].toMillis());
        /* if(data['Status']==0 && data['Receiver']==user.uid){
           setTimeout(() => {
             document.getElementById(id).style.fontWeight='bold';
           }, 500);
           console.log(id);
           if(Number(id) < iv){
             iv=Number(id);
             setTimeout(() => {
               document.getElementById(iv.toString()).scrollIntoView();
             }, 500);
           }
           else{
             return false;
           }
           
         }
         */



        if (data['Status'] == 0 || data['Status'] == 2) {

          firebase.firestore().collection('chats').doc(ussid).collection(user.uid).doc(id).update({
            Status: 1
          })
        }
   setTimeout(() => {
     c.scrollToBottom(0);
     
     
   }, 200);
      }

      })

    });


    this.listenRef = firebase.firestore().collection('chats').doc(user.uid).collection(this.userid)
      .onSnapshot(function (snap) {
        var sta1 = {};
        sta1[user.uid] = 1;
        firebase.firestore().collection('users').doc(ussid).set({
          Status: sta1
        }, {
            merge: true
          });
      });
    firebase.database().ref('status/' + this.userid).on('value', function (snap) {
      if (snap.val().Status == 'Online') {
        document.getElementById('status_ref').innerHTML = 'Online'
      }
      else {

        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;
        let d: any = new Date(snap.val().LastOnline);
        var elapsed = Date.now() - d;

        if (elapsed < msPerMinute) {
          document.getElementById('status_ref').innerHTML = "Active " + Math.round(elapsed / 1000) + ' seconds ago';
        }

        else if (elapsed < msPerHour) {
          document.getElementById('status_ref').innerHTML = "Active " + Math.round(elapsed / msPerMinute) + ' minutes ago';
        }

        else if (elapsed < msPerDay) {
          document.getElementById('status_ref').innerHTML = "Active " + Math.round(elapsed / msPerHour) + ' hours ago';
        }

        else if (elapsed < msPerMonth) {
          document.getElementById('status_ref').innerHTML = "Active " + Math.round(elapsed / msPerDay) + ' days ago';
        }

        else if (elapsed < msPerYear) {
          document.getElementById('status_ref').innerHTML = "Active " + Math.round(elapsed / msPerMonth) + ' months ago';
        }

        else {
          document.getElementById('status_ref').innerHTML = "Active " + Math.round(elapsed / msPerYear) + ' years ago';
        }

      }
    })
    firebase.database().ref('typing/'+this.userid+'/'+user.uid).on('value',function(snap){
      if(snap.val()){
       document.getElementById('chip').innerHTML='is typing..';
      }
      else{
        document.getElementById('chip').innerHTML='';
      }
    })
  }
  ionViewDidLeave() {
    let useriden = this.af.auth.currentUser.uid;
    let nn = this.userid;

    firebase.database().ref('typing/' + useriden + '/' + nn).remove();
    this.db.database.ref('typing/' + nn + '/' + useriden).off();
    this.db.database.ref('status/' + nn).off();
    this.listenRef();
    this.listen1ref();
  }
}

