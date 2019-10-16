import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from "../pages/login/login";
import { SignupPage } from "../pages/signup/signup";
import { NamePage } from "../pages/name/name";
import { EditdpPage } from "../pages/editdp/editdp";
import { EditprofilePage } from "../pages/editprofile/editprofile";
import { ChatprofilePage } from "../pages/chatprofile/chatprofile";
import { ChatimgPage } from "../pages/chatimg/chatimg";
import { SgroupPage } from "../pages/sgroup/sgroup";
import { GroupPage } from "../pages/group/group";
import { PrivacyPage } from "../pages/privacy/privacy";
import { ChangePage } from "../pages/change/change";
import { ProfilePage } from "../pages/profile/profile";
import { CpwdPage } from "../pages/cpwd/cpwd";
import { CemailPage } from "../pages/cemail/cemail";
import { OtherprofilePage } from "../pages/otherprofile/otherprofile";
import { ReadbyPage } from "../pages/readby/readby";
import { GroupinfoPage } from "../pages/groupinfo/groupinfo";
import { AddpPage } from "../pages/addp/addp";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from "@ionic-native/camera";
import { Base64 } from "@ionic-native/base64";
import { Crop } from "@ionic-native/crop";
import { PhotoLibrary } from "@ionic-native/photo-library";
import { ImagePicker } from "@ionic-native/image-picker";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { FCM } from '@ionic-native/fcm';
import { Keyboard } from "@ionic-native/keyboard";


import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireDatabaseModule } from "@angular/fire/database";

@NgModule({
  declarations: [
    MyApp,PrivacyPage,ChangePage,ProfilePage,CpwdPage,CemailPage,
    AboutPage,EditprofilePage,GroupinfoPage,AddpPage,
    ContactPage,NamePage,EditdpPage,SgroupPage,
    HomePage,ChatprofilePage,ChatimgPage,ReadbyPage,
    TabsPage,LoginPage,SignupPage,GroupPage,OtherprofilePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages: true,
    }),AngularFireModule.initializeApp(config),AngularFirestoreModule.enablePersistence(),AngularFireAuthModule,AngularFireStorageModule,
    AngularFireMessagingModule,AngularFireDatabaseModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,ChatprofilePage,PrivacyPage,ChangePage,CpwdPage,CemailPage,AddpPage,
    AboutPage,EditdpPage,EditprofilePage,GroupPage,OtherprofilePage,
    ContactPage,ChatimgPage,SgroupPage,ProfilePage,GroupinfoPage,
    HomePage,LoginPage,SignupPage,NamePage,ReadbyPage,
    TabsPage
  ],
  providers: [
    StatusBar,Crop,Base64,PhotoLibrary,ImagePicker,PhotoViewer,FCM,
    SplashScreen,Camera,Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
