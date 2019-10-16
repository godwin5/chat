import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatprofilePage } from './chatprofile';

@NgModule({
  declarations: [
    ChatprofilePage,
  ],
  imports: [
    IonicPageModule.forChild(ChatprofilePage),
  ],
})
export class ChatprofilePageModule {}
