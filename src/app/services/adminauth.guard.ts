import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {

    constructor(private router: Router) { }

    /**
     * Used to activate auth guard service
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns
     * @memberof AdminAuthGuard
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('adminUser')) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/admin/signin'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
