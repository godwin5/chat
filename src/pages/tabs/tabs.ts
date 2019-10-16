import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1 = HomePage;
  tab2 = AboutPage;
  tab3 = ContactPage;
  tab4 = ProfilePage;
  constructor() {

  }
}
