import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController ,ActionSheetController, ToastController, MenuController} from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { PhotoLibrary } from "@ionic-native/photo-library";
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-editdp',
  templateUrl: 'editdp.html',
})
export class EditdpPage {
Imgurl;
uuid;
 src;
  constructor(public toast:ToastController,public pl:PhotoLibrary,public actionSheetCtrl: ActionSheetController,public storage:AngularFireStorage,public af:AngularFireAuth,public fs:AngularFirestore,public loadingCtrl:LoadingController,public base64:Base64,public cropService:Crop,public camera:Camera,public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,public alertCtrl:AlertController) {
  this.Imgurl=navParams.get('ImgURL');
  this.uuid=navParams.get('UID');
  }
  saveBase64AsFile() {
  
  }
  close(){    
this.viewCtrl.dismiss();
  } 
  edit(){
    let user=this.af.auth.currentUser;
    let nav=this.navCtrl;
    let view=this.viewCtrl;
    let loading = this.loadingCtrl.create({
      content: 'Please Wait...',        
    });
    let c_options:CameraOptions =
    {
      quality: 50,
      correctOrientation:false,
     // destinationType:this.camera.DestinationType.DATA_URL,
      sourceType:this.camera.PictureSourceType.CAMERA,
     encodingType:this.camera.EncodingType.JPEG,
     mediaType:this.camera.MediaType.PICTURE,
    };
    let g_options:CameraOptions =
    {
      quality: 50,
      correctOrientation: true,
     // destinationType:this.camera.DestinationType.DATA_URL,
      sourceType:this.camera.PictureSourceType.SAVEDPHOTOALBUM,
     encodingType:this.camera.EncodingType.JPEG,
     mediaType:this.camera.MediaType.PICTURE,
    };
    var img:HTMLImageElement=document.querySelector('.photo');
    if(img.src.slice(-10)=='nouser.jpg'){
      const actionSheet = this.actionSheetCtrl.create({
        title: 'Profile Picture',
        buttons: [
          {
            icon:'camera',
            text: 'Take a photo',
            handler: () => {
                
              this.camera.getPicture(c_options).then((imageData)=>{
                
                this.cropService.crop(imageData,{quality:50}).then((newImage)=>{
                  let path=newImage;               
                  this.base64.encodeFile(path).then((b64)=>{
                    loading.present();
                    let temp=b64.substring(34);
                  let res='data:image/jpeg;base64,'+temp;
                  this.storage.ref('Profile_Picture/'+user.uid+'/'+user.uid).putString(res,'data_url').then(d=>{
                    firebase.storage().ref('Profile_Picture/' + user.uid + '/' + user.uid).getDownloadURL().then(url => {
                      
                      user.updateProfile({
                        displayName: user.displayName,
                        photoURL: url,
                      }).then(function () {
                        
                        firebase.firestore().collection('users').doc(user.uid).update({
                          photoURL: url,
                        }).then(function () {
                          // Update successful.
            
                          var img:HTMLImageElement=document.querySelector('.pph');
                          img.src=url;
                          loading.dismiss();
                          view.dismiss();
                       //   menu.open();
            
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
                  })
                }).catch(err=>{
                
                })
              }).catch(err=>{
                
              })
            }
          },{
            icon:'images',
            text: 'Choose existing photo',
            handler: () => {
              this.camera.getPicture(g_options).then((ImageData)=>{
                
                this.cropService.crop(ImageData,{quality:50}).then((newImage)=>{
                  let path=newImage;
                  
                  this.base64.encodeFile(path).then((b64)=>{
                    loading.present();
                    let temp=b64.substring(34);
                    
                  let res='data:image/jpeg;base64,'+temp;
                  this.storage.ref('Profile_Picture/'+user.uid+'/'+user.uid).putString(res,'data_url').then(d=>{
                    firebase.storage().ref('Profile_Picture/' + user.uid + '/' + user.uid).getDownloadURL().then(url => {
                      
                      user.updateProfile({
                        displayName: user.displayName,
                        photoURL: url,
                      }).then(function () {
                        
                        firebase.firestore().collection('users').doc(user.uid).update({
                          photoURL: url,
                        }).then(function () {
                          // Update successful.
            
                          var img:HTMLImageElement=document.querySelector('.pph');
                          img.src=url;
                          loading.dismiss();
                          view.dismiss();
                      //    menu.open();
            
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
                  })
                }).catch(err=>{
                 
                })
              }).catch(err=>{
                
              })
            }
          }
        ]
      });
      actionSheet.present();
    }
    else{
      let fss=this.fs;
     
              const actionSheet = this.actionSheetCtrl.create({
                title: 'Profile Picture',
                buttons: [
                  {
                    icon:'camera',
                    text: 'Take a photo',
                    handler: () => {
                        
                      this.camera.getPicture(c_options).then((imageData)=>{
                        
                        this.cropService.crop(imageData,{quality:50}).then((newImage)=>{
                          let path=newImage;               
                          this.base64.encodeFile(path).then((b64)=>{
                            loading.present();
                            let temp=b64.substring(34);
                          let res='data:image/jpeg;base64,'+temp;
                          this.storage.ref('Profile_Picture/'+user.uid+'/'+user.uid).putString(res,'data_url').then(d=>{
                            firebase.storage().ref('Profile_Picture/' + user.uid + '/' + user.uid).getDownloadURL().then(url => {
                              
                              user.updateProfile({
                                displayName: user.displayName,
                                photoURL: url,
                              }).then(function () {
                                
                                firebase.firestore().collection('users').doc(user.uid).update({
                                  photoURL: url,
                                }).then(function () {
                                  // Update successful.
                    
                                  var img:HTMLImageElement=document.querySelector('.pph');
                                  img.src=url;
                                  loading.dismiss();
                                  view.dismiss();
                                //  menu.open();
                    
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
                          })
                        }).catch(err=>{
                        
                        })
                      }).catch(err=>{
                        
                      })
                    }
                  },{
                    icon:'images',
                    text: 'Choose existing photo',
                    handler: () => {
                      this.camera.getPicture(g_options).then((ImageData)=>{
                        
                        this.cropService.crop(ImageData,{quality:50}).then((newImage)=>{
                          let path=newImage;
                          
                          this.base64.encodeFile(path).then((b64)=>{
                            loading.present();
                            let temp=b64.substring(34);
                            
                          let res='data:image/jpeg;base64,'+temp;
                          this.storage.ref('Profile_Picture/'+user.uid+'/'+user.uid).putString(res,'data_url').then(d=>{
                            firebase.storage().ref('Profile_Picture/' + user.uid + '/' + user.uid).getDownloadURL().then(url => {
                              
                              user.updateProfile({
                                displayName: user.displayName,
                                photoURL: url,
                              }).then(function () {
                                
                                firebase.firestore().collection('users').doc(user.uid).update({
                                  photoURL: url,
                                }).then(function () {
                                  // Update successful.
                    
                                  var img:HTMLImageElement=document.querySelector('.pph');
                                  img.src=url;
                                  loading.dismiss();
                                  view.dismiss();
                               //   menu.open();
                    
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
                          })
                        }).catch(err=>{
                         
                        })
                      }).catch(err=>{
                        
                      })
                    }
                  },
                  {
                    icon:'trash',
                    cssClass:'deletedp',
                    text: 'Remove',
                   
                    handler: () => {
                      loading.present();
                    this.storage.ref('Profile_Picture/'+user.uid+'/'+user.uid).delete().subscribe(d=>{
                     user.updateProfile({
                       displayName:user.displayName,
                       photoURL:'',
                     }).then(()=>{
                      this.fs.collection('users').doc(user.uid).update({
                        photoURL:''
                      }).then(()=>{
                        var img:HTMLImageElement=document.querySelector('.pph');
                        img.src='/assets/imgs/nouser.jpg';
                        loading.dismiss();
                        view.dismiss();
                      //  menu.open();
                      }).catch(err=>{
                        console.log(err);
                        alert('Try Again')
                      })
                     }).catch(err=>{
                      console.log(err);
                       alert('Try Again');
                     })
                    })
                      
                    }
                  }
                ]
              });
              actionSheet.present();
            
          }
        
    
  }
  save(){
    this.pl.saveImage(this.Imgurl || 'http://citizen.edisha.gov.in/Content/assets/stylesheet/img/placeholder-user.png','Chat-on').then(()=>{
const t1=this.toast.create({
  message:'Image Saved',
  duration:2000,
  dismissOnPageChange:true,
});
t1.present();
    }).catch(err=>{
      const t2=this.toast.create({
        message:err.message,
        duration:2000,
        dismissOnPageChange:true,
      });
      t2.present();
    })
  }
  ionViewDidLoad() {
    let userid=this.af.auth.currentUser.uid;
if(this.uuid==userid){
  document.getElementById('foot_of_dp').style.display='block'
}
else{
  document.getElementById('foot_of_dp').style.display='none'
}
    if(this.Imgurl){
      document.getElementById('loader').style.display='none';
      //document.getElementById('img').setAttribute('src',this.Imgurl);
    }
  }

}
