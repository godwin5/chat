import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp();


exports.newMessage=functions.firestore.
    document('chats/{userId}/{messageCollectionId}/{messageId}').onCreate(async event=>{  
        const data = event.data();
        const fs=admin.firestore();
        const sender = data.Sender ;
        const receiver = data.Receiver;
        const text=data.Text;
        
        const userRef = fs.collection('users').where('UID', '==', sender);

        const user = await userRef.get();

        let name;

        user.forEach(result => {
          name = result.data().Name;
    
        })

        fs.collection('users').doc(sender).get().then(function(snap){
            name=snap.data().Name;
        }).catch(err=>{
            return;
        })
        const payload = {
            notification: {
                title:name,
                body: text,            
                icon: '/platform/android/app/src/main/res/ic_stat_onesignal_default.png'

                
            },
            data:{
                "Nick" : "Mario",
      "Room" : "PortugalVSDenmark"
            }
          }
        
      
          const devicesRef = fs.collection('devices').where('userid', '==', receiver);

          const devices = await devicesRef.get();

          const tokens=[];

          devices.forEach(result => {
            const token = result.data().token;
      
            tokens.push( token )
          })

          return admin.messaging().sendToDevice(tokens, payload).then(response=>{
            
              fs.collection('chats').doc(sender).collection(receiver).doc(event.id).update({
                  Status:2
                }).then(()=>{
                    return
                }).catch(err=>{
                    return
                });
                fs.collection('chats').doc(receiver).collection(sender).doc(event.id).update({
                    Status:2
                  }).then(()=>{
                    return
                }).catch(err=>{
                    return
                });;
          })

    })