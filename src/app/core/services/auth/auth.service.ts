import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, first, from, map, of, switchMap } from 'rxjs';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import * as CryptoJS from 'crypto-js';
import { UserRoleService } from '../user-role/user-role.service';
import { EmployeeService } from '../employee/employee.service';
import { ValidationErrors } from '@angular/forms';
import { AsyncValidatorFn } from '@angular/forms';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AuthService  {

    private userDataSubject = new BehaviorSubject<any>(null);
    userData$: Observable<any> = this.userDataSubject.asObservable();

     key: string = 'NANO-#13213412123';


    constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore, private router: Router, private userRoleService: UserRoleService, private employeeService: EmployeeService) {}


    ngOnInit() {

    }
    getUid(){
      return this.afAuth.authState.pipe(first()).toPromise().then((user: any) => {
        return user.uid;
      });
    }



    loginWithEmail(email: string, password: string): Promise<void> {
      console.log("loginWithEmail email", email);
      console.log("loginWithEmail password", password);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.error('Invalid email format.');
        return Promise.reject('Invalid email format.');
      }

      return this.afAuth.signInWithEmailAndPassword(email, password)
        .then((result: any) => {
          console.log('Successfully logged in with email:', result.user);
          const userId = result.user?.uid;

          if (userId) {
            this.getUserData(userId);
          } else {
            console.error('User ID is undefined.');
          }
        })
        .catch(error => {
          switch (error.code) {
            case 'auth/user-not-found':
              console.error('No user found with this email.');
              break;
            case 'auth/wrong-password':
              console.error('Incorrect password.');
              break;
            case 'auth/user-disabled':
              console.error('User account is disabled.');
              break;
            case 'auth/invalid-email':
              console.error('Invalid email format.');
              break;
            default:
              console.error('Error during email login:', error.message);
          }
          return Promise.reject(error.message);
        });
    }

    
    registerUser(email: string, password: string, userData: any) {
      console.log("registerUser userData", userData);
    
      // Step 1: Capture the current user (the currently authenticated user)
      const currentUser = this.afAuth.currentUser;
    
      // Step 2: Proceed with creating the new user (this will not sign out the current user)
      return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
        switchMap((userCredential: any) => {
          console.log("userCredential", userCredential);
          
          if (userCredential.user) {
            const uid = userCredential.user.uid;
            console.log("uid", uid);
    
            // Save user data to Firestore
            delete userData.password;
            delete userData.confirmPassword;
            if (!userData.uid) {
              userData.uid = uid;
            }
    
            return this.userRoleService.saveUserData(uid, userData).pipe(
              switchMap(() => this.employeeService.saveEmployeeData(uid, userData)),
              map(() => ({
                success: true,
                message: 'User registered successfully',
                data: {
                  uid: uid,
                  ...userData
                }
              }))
            );
          }
          throw new Error("User registration failed.");
        }),
        catchError((error: any) => {
          console.error("Error registering user", error);
          throw error;
        })
      );
    }
    
    
    registerUser1(email: string, password: string, userData: any) {
      console.log("registerUser userData", userData);
      return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
        switchMap((userCredential: any) => {
          console.log("userCredential", userCredential);
          if (userCredential.user) {
            const uid = userCredential.user.uid;

            console.log("uid", uid);
            // Save user data to Firestore
            delete userData.password;
            delete userData.confirmPassword;
            if(!userData.uid){
              userData.uid = uid;
            }


            return this.userRoleService.saveUserData(uid, userData).pipe(
              // Save employee data after user data is saved

              switchMap(() => this.employeeService.saveEmployeeData(uid, userData)),
              map(() => ({
                success: true,
                message: 'User registered successfully',
                data: {
                  uid: uid,
                  ...userData
                }
              }))


            );
          }
          throw new Error("User registration failed.");
        })
      );
    }

    disabledUser(uid: string){
      console.log("disabledUser", uid);

    }

    resetPassword(email: string): Promise<boolean> {
      return this.afAuth.sendPasswordResetEmail(email)
        .then(() => {
          console.log('Password reset email sent successfully.');
          return true;
        })
        .catch((error) => {
          console.error('Error sending password reset email:', error);
          return false;
        });
    }


    async registerWithEmail(email: string, password: string, employeeData: any): Promise<void> {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.error('Invalid email format.');
        return Promise.reject('Invalid email format.');
      }

      // Store the current user credentials
      const currentUser = await this.afAuth.currentUser;
      const currentEmail = currentUser?.email;
      const currentPassword = localStorage.getItem('currentUserPassword');// You need to have the current user's password

      return this.afAuth.createUserWithEmailAndPassword(email, password)
        .then(async (result: any) => {
          console.log('Successfully registered with email:', result.user);
          const userId = result.user?.uid;
          if (userId) {
            // Create a new user document in Firestore
            await this.firestore.collection('employee').doc(userId).set({

              ...employeeData,
              employeeId: userId

            });
            console.log('User document created in Firestore');

            // Re-authenticate the original user
            if (currentEmail && currentPassword) {
              await this.afAuth.signInWithEmailAndPassword(currentEmail, this.decrypt(currentPassword));
            }
          } else {
            console.error('User ID is undefined.');
            return Promise.reject('User ID is undefined.');
          }
          return result
        })
        .catch(error => {
          switch (error.code) {
            case 'auth/email-already-in-use':
              console.error('Email is already in use.');
              break;
            case 'auth/invalid-email':
              console.error('Invalid email format.');
              break;
            case 'auth/weak-password':
              console.error('Password is too weak.');
              break;
            default:
              console.error('Error during email registration:', error.message);
          }
          return Promise.reject(error.message);
        });
    }

    emailExistsValidator1(): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return this.firestore
          .collection('users', ref => ref.where('email', '==', control.value))
          .get()
          .pipe(
            map(snapshot => {
              return snapshot.empty ? null : { emailExists: true };
            })
          );
      };
    }

    emailExistsValidator(email: string) {
      return this.firestore
          .collection('users', ref => ref.where('email', '==', email))
          .get()
          .pipe(
            map(snapshot => {
              return snapshot.empty ? null : { emailExists: true };
            })
          );
    }

    phoneExistsValidator(): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) {
          return of(null); // Return if there's no value yet
        }

        return this.firestore
          .collection('users', ref => ref.where('phone', '==', control.value))
          .get()
          .pipe(
            map(snapshot => {
              return snapshot.empty ? null : { phoneExists: true };
            })
          );
      };
    }
    // async loginWithMobileq(mobileNumber: any): Promise<any> {
    //   // Search for employee by phone number
    //   console.log("mobileNumber", mobileNumber);
    //   return this.firestore
    //     .collection('users', ref => ref.where('phone', '==', (mobileNumber).toString()))
    //     .get()
    //     .toPromise()
    //     .then(snapshot => {
    //       if (snapshot?.empty) {
    //         console.log('No employee found with this mobile number');
    //         return null;
    //       }
    //       // Return the first matching employee document
    //       return snapshot?.docs[0]?.data();

    //     })
    //     .catch(error => {
    //       console.error('Error searching for employee:', error);
    //       throw error;
    //     });
    //   // return this.firestore.collection('employees').doc(mobileNumber).get().toPromise();
    // }
    // async loginWithMobile(mobileNumber: string): Promise<any> {
    //   try {
    //     // Step 1: Check if the mobile number exists in the Firestore `users` collection
    //     const userSnapshot = await this.firestore
    //       .collection('users', (ref) => ref.where('phone', '==', mobileNumber))
    //       .get()
    //       .toPromise();

    //     if (userSnapshot?.empty) {
    //       // If no user is found, throw an error or handle accordingly
    //       throw new Error('Mobile number not found');
    //     }

    //     // Step 2: User found, generate OTP and send via SMS
    //     const otp = this.generateOTP();
    //     await this.saveOtpToFirestore(mobileNumber, otp);
    //     await this.smsService.sendSMS(mobileNumber, `Your OTP is ${otp}`);

    //     // Step 3: Return a success message
    //     return { message: 'OTP sent successfully', mobileNumber };
    //   } catch (error) {
    //     console.error('Error during loginWithMobile:', error);
    //     throw error; // Re-throw error to be handled in calling function
    //   }
    // }

    // Helper method to generate a 6-digit OTP


    private generateOTP(): string {
      return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Helper method to save OTP and expiration to Firestore
    private async saveOtpToFirestore(phone: string, otp: string): Promise<void> {
      await this.firestore.collection('otp-verifications').doc(phone).set({
        otp,
        expiresAt: Date.now() + 300000, // OTP expires in 5 minutes
      });
    }


    // generateOTP(): string {
    //   return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
    // }

    // async sendOtpToPhone(phone: string): Promise<void> {
    //   const otp = this.generateOTP();

    //   // Save OTP and expiration to Firestore
    //   await this.firestore.collection('otp-verifications').doc(phone).set({
    //     otp,
    //     expiresAt: Date.now() + 300000 // OTP expires in 5 minutes
    //   });

    //   // Send OTP via SMS
    //   await this.smsService.sendSMS(phone, `Your OTP is ${otp}`);
    // }


    async getUserData(userId: string) {

      try {
        const userDocRef = this.firestore.collection('users').doc(userId);

        const docSnapshot = await userDocRef.get().toPromise();

        if (!docSnapshot) {

          return null;
        }

        if (docSnapshot?.exists) {
          const userData = docSnapshot.data();

          this.userDataSubject.next(userData);
          return userData;
        } else {

          return null;
        }
      } catch (error) {
        console.error('Error fetching user document:', error);
        throw error;
      }

    }
    async getConfigurationData(company: string, location: string, branch?: string) {
      // console.log("company", company);
      // console.log("location", location);
      // console.log("branch", branch);
      const query = this.firestore.collection('user-config').ref
        .where('company', '==', company)
        .where('location', '==', location)
        .where('branch', '==', branch || '');
        
      return query.get()
        .then((snapshot: any) => {
          const configs: any[] = [];
          snapshot.forEach((doc: any) => {
            configs.push(doc.data());
          });
          return configs;
        });
    }

    async getEmployeeData(employeeId: string) {
      return this.firestore.collection('employee').doc(employeeId).get().toPromise().then((snapshot: any) => {
        return snapshot.data();
      });
    }

    isAuthenticated(): boolean {
      return true; // or false based on your authentication logic
    }

    async getCurrentUserId(): Promise<string | null> {
      const user = await this.afAuth.authState.pipe(first()).toPromise();
      return user && 'uid' in user ? user.uid : null;
    }

    async getCurrentUser(): Promise<any | null> {
      const user = await this.afAuth.authState.pipe(first()).toPromise();
      return (user);
    }





    logout(): Promise<void> {
      // Implement the logout logic here
      return new Promise((resolve, reject) => {
        // Simulate logout process
        this.afAuth.signOut().then(() => {
          console.log('User logged out successfully');
          resolve();
        }).catch(error => {
          console.error('Error during logout:', error);
          reject(error);
        });
        console.log('Logging out...');
        resolve();
      });
    }

    public getAuthState(): Observable<any> {
      return this.afAuth.authState;
    }
    public encrypt(password: string): string {
      return CryptoJS.AES.encrypt(password, this.key).toString();
    }


    public decrypt(passwordToDecrypt: string) {
      return CryptoJS.AES.decrypt(passwordToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
    }
  }
