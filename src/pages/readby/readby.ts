import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
@IonicPage()
@Component({
  selector: 'page-readby',
  templateUrl: 'readby.html',
})
export class ReadbyPage {
users=[];
id;
gid;
mref;
uid;
  constructor(public fs:AngularFirestore,public af:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
  this.users=navParams.get('users');
  this.id=navParams.get('id');
  this.gid=navParams.get('gid');
  this.uid=af.auth.currentUser.uid;
  }

  ionViewDidLoad() {
    this.mref=this.fs.collection('groups').doc(this.gid).collection('messages', ref => ref.orderBy('Timestamp')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    
  }

}
