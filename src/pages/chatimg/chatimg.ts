import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ChatimgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatimg',
  templateUrl: 'chatimg.html',
})
export class ChatimgPage {
url;
  constructor(public view:ViewController,public navCtrl: NavController, public navParams: NavParams) {
  this.url=navParams.get('url');
  }
close(){
this.view.dismiss();
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatimgPage');
  }

}
