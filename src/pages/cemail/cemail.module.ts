import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CemailPage } from './cemail';

@NgModule({
  declarations: [
    CemailPage,
  ],
  imports: [
    IonicPageModule.forChild(CemailPage),
  ],
})
export class CemailPageModule {}
