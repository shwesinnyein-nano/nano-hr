import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth) { }
  // canActivate(): boolean {
  //   if (this.authService.isAuthenticated()) {
  //     return true;
  //   } else {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  //   }
  canActivate(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.authService.getAuthState().subscribe((user) => {
        if (user) {
          observer.next(true);
          observer.complete();
        } else {
          this.router.navigate(['/login']);
          observer.next(false);
          observer.complete();
        }
      });
    });
    // return this.authService.user$.pipe(  // Replace with actual auth state observable
    //   take(1),
    //   map((user: any) => {
    //     if (user) {
    //       return true;  // User is authenticated, allow access
    //     } else {
    //       // If no user, redirect to login page
    //       this.router.navigate(['/login']);
    //       return false;
    //     }
    //   })
    // );
  }

}
