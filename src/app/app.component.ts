import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router } from '@angular/router';

import { faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  currentUser = this.authenticationService.currentUserValue;
  title = 'partners-request';
  routerEventSubscription: any;
  activeNav = false;
  faSignOutAlt = faSignOutAlt;

  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) { }

  ngOnInit(): void {
    this.routerEventSubscription = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.activeNav = val.url.indexOf('login') == 1 ? false : true;
      }
    });
  }

  ngOnDestroy(): void {
    this.routerEventSubscription.unsubscribe();
  }

  logOut(){
    this.authenticationService.logout();
    this.router.navigate(['login'])
  }
}
