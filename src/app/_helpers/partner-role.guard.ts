import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';

import * as moment from 'moment';
import { AuthGuard } from './auth.guard';


@Injectable({ providedIn: 'root' })
export class PartnerRoleGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService,
        private authGuard: AuthGuard
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
        if(this.authGuard.canActivate(route, state)){
            const currentUser = this.authenticationService.currentUserValue;
            if (currentUser && currentUser.canAccessPartnerRequests) {
                // authorised so return true
                return true;
            }
            console.log(`Go to login and then ${state.url}`);
            
            // not logged in so redirect to home page with the return url
            this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        return false;
    }
}