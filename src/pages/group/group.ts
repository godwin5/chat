import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ActionSheetController, AlertController, ModalController } from 'ionic-angular';
import { ReadbyPage } from "../readby/readby";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { GroupinfoPage } from "../groupinfo/groupinfo";
import * as $ from 'jquery';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { ChatimgPage } from '../chatimg/chatimg';
@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {
  gref;
  groupid;
  gname;
  gpic;
  text: String;
  users;
  cuser;
  listenRef;
  adminname;
  adminpic;
  userslist1 = [];
  cname;
  chip = false;
  sendbtn = true;
  admin;
  @ViewChild(Content) content: Content;
  constructor(public modalCtrl:ModalController,public imagepicker:ImagePicker,public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public fs: AngularFirestore, public af: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
    this.groupid = navParams.get('id');
    this.gname = navParams.get('name');
    this.gpic = navParams.get('url');
    this.admin=navParams.get('admin');
    
    this.cuser = af.auth.currentUser.uid;

  }
  fname(n) {
    return n.split(" ")[0];
  }
  gotoInfo(){
    this.navCtrl.push(GroupinfoPage,{
      Members:this.userslist1,
      Admin:this.admin,
      GroupID:this.groupid,
    });
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
          } /*{
          text:'Read By',
          icon:'list-box',
          handler:()=>{
         this.navCtrl.push(ReadbyPage,{
           users:this.userslist1,
           id:identifier,
           gid:this.groupid,
         })
          }
        }*/, {
            text: 'Delete',
            icon: 'trash',
            handler: () => {
              let user = firebase.auth().currentUser;

              let gid = this.groupid;
              this.fs.collection('groups').doc(this.groupid).collection('messages').doc(identifier).delete().then(function (d) {
                let len = $('.gchat').length;

                if (len == 0) {

                  firebase.firestore().collection('groups').doc(gid).get().then(function (snap) {
                    firebase.firestore().collection('groups').doc(gid).update({
                      MessageTime: snap.data().DateCreated,
                      LastMessage: 'New Group Created',
                      LastSender: snap.data().Admin,
                    })
                  })

                }
                else {

                  let lastid = $('#gcontent div.temp:last').attr('id');
                  firebase.firestore().collection('groups').doc(gid).collection('messages').doc(lastid).
                    get().then(function (snap) {
                      firebase.firestore().collection('groups').doc(gid).update({
                        MessageTime: snap.data().Timestamp,
                        LastMessage: snap.data().Text,
                        LastSender: snap.data().Sender,
                      })
                    })



                }
              })
            }
          }
        ]
      });
      actionSheet.present();
    }
    else {
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
  input() {
    let user = this.af.auth.currentUser;
    if (this.text != '') {

      this.sendbtn = false
    }
    else {

      this.sendbtn = true
    }
  }
  send() {
      let mid = Date.now();
    let user = this.af.auth.currentUser;
    this.fs.collection('groups').doc(this.groupid).update({
      LastMessage: this.text.substr(0, 100),
      MessageTime: firebase.firestore.FieldValue.serverTimestamp(),
      LastSender: user.uid,
    });

    this.fs.collection('groups').doc(this.groupid).collection('messages').doc(mid.toString()).set({
      Text: this.text.substr(0, 700),
      Sender: user.uid,
      Timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    this.text = '';
    this.content.scrollToBottom(0);
  
  }
  select_image(){
    let mid = Date.now();
    let user = this.af.auth.currentUser;
    this.fs.collection('groups').doc(this.groupid).update({
      LastMessage: 'imagesendbyperson',
      MessageTime: firebase.firestore.FieldValue.serverTimestamp(),
      LastSender: user.uid,
    });
    const options: ImagePickerOptions = {
      maximumImagesCount: 1,
      outputType: 1,
      quality: 50,
    }

    this.imagepicker.getPictures(options).then(results => {
      for (var i = 0; i < results.length; i++) {
        this.fs.collection('groups').doc(this.groupid).collection('messages').doc(mid.toString()).set({
          Text: 'imagesendbyperson',
          ImgSrc: 'data:image/jpeg;base64,' + results[i],
          Sender: user.uid,
          Timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        
        this.content.scrollToBottom(0);
      }
    });
  }
  zoomcimg(src) {
    this.modalCtrl.create(ChatimgPage, {
      url: src
    }).present();
  }
  close() {
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    let user = this.af.auth.currentUser;
    this.gref = this.fs.collection('groups').doc(this.groupid).collection('messages', ref => ref.orderBy('Timestamp')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    this.users = this.fs.collection('users', ref => ref.where('Groups', 'array-contains', this.groupid)).snapshotChanges().subscribe(a => {
      this.userslist1=[];
      a.forEach(c => {
        let data = c.payload.doc.data();
        this.userslist1.push(data)
      })
    });
    let c = this.content;
    let gpid = this.groupid;
    let l1 = {};
    l1[user.uid] = 1;
    this.listenRef = firebase.firestore().collection('groups').doc(this.groupid).collection('messages')
      .onSnapshot(function (snap) {
        setTimeout(() => {
          c.scrollToBottom(0);
        }, 500);
        /*snap.forEach(c=>{
          firebase.firestore().doc('groups/'+gpid+'/messages/'+c.id).set({
            ReadBy:l1
          },{merge:true})
        })*/
        var sta2 = {};
        sta2[user.uid] = 1;
        firebase.firestore().collection('groups').doc(gpid).set({
          Status: sta2
        }, { merge: true });


      });

    this.fs.collection('groups').doc(this.groupid).snapshotChanges().subscribe(a => {
      let admin = a.payload.data()['Admin'];
      this.fs.collection('users').doc(admin).snapshotChanges().subscribe(c => {
        this.chip = true;
        if (admin == this.af.auth.currentUser.uid) {
          this.adminname = 'You created this group'
          this.adminpic = c.payload.data()['photoURL'];
        }
        else {
          this.adminname = c.payload.data()['Name'] + ' created this group';
          this.adminpic = c.payload.data()['photoURL'];
        }
      })

    })
  }
  disp(l, name) {
    if (l == true) {
      return name
    }
    else {
      return name + ','
    }
  }
  info() {
    this.navCtrl.push(GroupinfoPage)
  }
  ionViewDidLeave() {
    this.listenRef();
  }

}
