import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, routes } from 'src/app/core/core.index';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
interface returndata {
  message: string | null;
  status: string | null;
}
import firebase from 'firebase/compat/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, Auth } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public routes = routes;
  loginForm!: FormGroup;
  isDarkMode: boolean = false;
  isMobileLogin: boolean = false;
  otp: string = '';
  otpSent: boolean = false;
  verificationId: any;
  auth!: Auth;
  // recaptchaVerifier: RecaptchaVerifier | null = null;  // Store the reCAPTCHA instance
  // recaptchaVerifier!: firebase.auth.RecaptchaVerifier;
  // reCaptchaVerifier!: any;
  reCaptchaVerifier!: RecaptchaVerifier;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private toastrService: ToastrService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.applyTheme();
    this.loadForm();
  }
  login1() {

    // this.router.navigate([routes.adminDashboard]);
  }
  loadForm() {
    this.loginForm = this.fb.group({
      email: new FormControl('',),
      password: new FormControl('',),
      mobileNumber: new FormControl(''),
    });
  }
  login(): void {
    console.log("this.isMobileLogin", this.isMobileLogin);
    if (this.isMobileLogin) {
      this.getOTP(this.loginForm.get('mobileNumber')?.value);
    } else {
      this.loginWithEmail();
    }

    // if (this.loginForm.valid) {
    //   const email = this.loginForm.get('email')?.value;
    //   const password = this.loginForm.get('password')?.value;

    //   this.authService.loginWithEmail(email, password)
    //     .then(() => {
    //       localStorage.setItem('currentUserPassword', this.authService.encrypt(password));
    //       this.router.navigate([routes.adminDashboard]);
    //     })
    //     .catch((error: any) => {
    //       console.error('Email login error:', error);

    //       if (error.code === 'auth/user-not-found') {
    //         this.toastrService.error('No user found with this email');
    //       } else if (error.code === 'auth/wrong-password') {
    //         this.toastrService.error('Incorrect password');
    //       } else if (error.code === 'auth/user-disabled') {
    //         this.toastrService.error('User account is disabled');
    //       } else if (error.code === 'auth/invalid-email') {
    //         this.toastrService.error('Invalid email format');
    //       } else {
    //         this.toastrService.error('Login failed. Please try again.');
    //       }
    //     });
    // } else {
    //   // Handle form validation errors
    //   if (this.loginForm.get('email')?.hasError('required') && this.loginForm.get('password')?.hasError('required')) {
    //     this.toastrService.error('Please check your email and password');
    //   } else if (this.loginForm.get('email')?.hasError('required')) {
    //     this.toastrService.error('Email is required');
    //   } else if (this.loginForm.get('password')?.hasError('required')) {
    //     this.toastrService.error('Password is required');
    //   } else {
    //     this.toastrService.error('Please check your email and password');
    //   }
    // }
  }
  initializeRecaptcha() {
    const auth = getAuth();

    // Initialize reCAPTCHA for invisible mode
    this.reCaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
      size: 'invisible',  // Invisible reCAPTCHA
      callback: (response: any) => {
        console.log('reCAPTCHA solved', response);
      },
      'expired-callback': () => {
        alert('reCAPTCHA expired');
      }
    });

    // Render the reCAPTCHA widget
    this.reCaptchaVerifier.render().then(() => {
      console.log('reCAPTCHA rendered successfully.');
    }).catch((error) => {
      console.error('Error rendering reCAPTCHA:', error.message);
      alert('Failed to render reCAPTCHA');
    });
  }

  getOTP(mobileNumber: string) {
    const auth = getAuth();
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
      size: 'invisible',
      callback: (response: any) => {
        console.log('reCAPTCHA solved', response);
      }
    });

    // Render reCAPTCHA widget
    recaptchaVerifier.render().then(() => {
      console.log('reCAPTCHA rendered successfully.');
    }).catch((error) => {
      console.error('Error rendering reCAPTCHA:', error.message);
      alert('Failed to render reCAPTCHA');
    });

    // Send OTP
    const formattedNumber = this.formatPhoneNumber(mobileNumber);
    signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        localStorage.setItem('verificationId', JSON.stringify(confirmationResult.verificationId));
        console.log('OTP sent successfully.');
      })
      .catch((error) => {
        console.error('Error sending OTP:', error.message);
        alert(error.message);
      });
  }

  // getOTP(mobileNumber: string) {
  //   const auth = getAuth();
  //   console.log('auth',auth);

  //   // Ensure the reCAPTCHA verifier is initialized before sending the OTP
  //   this.reCaptchaVerifier = new RecaptchaVerifier(auth,
  //     'sign-in-button',
  //     {
  //       size: 'invisible',  // You can use 'normal' if you want visible reCAPTCHA
  //     },
  //   );
  //   console.log("this.reCaptchaVerifier",this.reCaptchaVerifier);

  //   this.reCaptchaVerifier.render().then(() => {
  //     console.log('reCAPTCHA rendered successfully.');

  //     const formattedNumber = this.formatPhoneNumber(mobileNumber);

  //     signInWithPhoneNumber(auth, formattedNumber, this.reCaptchaVerifier)
  //       .then((confirmationResult) => {
  //         // Store the verification ID in local storage
  //         localStorage.setItem('verificationId', JSON.stringify(confirmationResult.verificationId));
  //         console.log('OTP sent successfully.');
  //       })
  //       .catch((error) => {
  //         console.error('Error sending OTP:', error.message);
  //         alert(error.message);
  //       });
  //   }).catch((error) => {
  //     console.error('Error rendering reCAPTCHA:', error.message);
  //     alert('Failed to render reCAPTCHA');
  //   });
  // }
  sendOTP(mobileNumber: string) {
    const formattedNumber = this.formatPhoneNumber(mobileNumber);
    const auth = getAuth();
    signInWithPhoneNumber(auth, formattedNumber, this.reCaptchaVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        localStorage.setItem(
          'verificationId',
          JSON.stringify(confirmationResult.verificationId)
        );
        // ...
      }).catch((error) => {
        // Error; SMS not sent
        // ...
        console.log(error.message);
        alert(error.message);
      });
  }

  // logina(): void {
  //   console.log("this.isMobile", this.isMobileLogin );

  //   if (this.isMobileLogin) {
  //     this.setupMobileLoginValidators();
  //     const mobileNumber = this.loginForm.get('mobileNumber')?.value;
  //     this.loginWithMobile(mobileNumber);
  //   }
  //   else {
  //     this.setupEmailLoginValidators();
  //     const { email, password } = this.loginForm.value;
  //     this.loginWithEmail(email, password);
  //   }
  // }
  // private loginWithEmail(email: string, password: string): void {
  //   if (this.loginForm.valid) {
  //     this.authService.loginWithEmail(email, password)
  //       .then(() => {
  //         localStorage.setItem('currentUserPassword', this.authService.encrypt(password));
  //         this.router.navigate([routes.adminDashboard]);
  //       })
  //       .catch(error => {
  //         console.error('Email login error:', error);
  //       });
  //   }
  //   else {
  //     console.log("this.loginForm", this.loginForm);
  //     if(this.loginForm.get('email')?.hasError('required') && this.loginForm.get('password')?.hasError('required')){
  //       this.toastrService.error('Please check your email and password');
  //     }
  //     else if (this.loginForm.get('email')?.hasError('required')) {
  //       this.toastrService.error('Email is required');
  //     } else if (this.loginForm.get('password')?.hasError('required')) {
  //       this.toastrService.error('Password is required');
  //     } else {
  //       this.toastrService.error('Please check your email and password');
  //     }

  //   }
  // }
  // async loginWithMobile(mobileNumber: string): Promise<void> {

  //   console.log("mobileNumber", mobileNumber);
  //   if (this.loginForm.valid) {
  //     // Step 1: Format the phone number if necessary
  //     const formattedNumber = this.formatPhoneNumber(mobileNumber);
  //     console.log("formattedNumber", formattedNumber);

  //     try {
  //       // Step 2: Call authService to initiate OTP-based login
  //       const res = await this.authService.loginWithMobile(mobileNumber);

  //       console.log("Login response", res);

  //       if (res && res.uid) {
  //         // Step 3: If login is successful and employeeId exists, save it in local storage and navigate
  //         console.log("res.uid", res.uid);
  //         localStorage.setItem('userId', this.authService.encrypt(res.uid));
  //         this.router.navigate([routes.adminDashboard]);
  //       }
  //     } catch (error) {
  //       // Step 4: Handle and display any login errors
  //       console.error("Login failed", error);
  //     }
  //   }
  //   // if (this.loginForm.valid) {
  //   //   const formattedNumber = this.formatPhoneNumber(mobileNumber);
  //   //  console.log("formattedNumber", formattedNumber);
  //   //   try {
  //   //     await this.authService.loginWithMobile(mobileNumber).then((res: any) => {
  //   //       console.log("res", res.employeeId);

  //   //       if(res.employeeId){
  //   //         console.log("res.employeeId", res.employeeId);
  //   //         localStorage.setItem('employeeId',this.authService.encrypt(res.employeeId));
  //   //         this.router.navigate([routes.adminDashboard]);
  //   //         //

  //   //       }
  //   //     });

  //   //   } catch (error) {

  //   //     console.error('Login failed', error);
  //   //   }
  //   // }
  // }
  // Initialize reCAPTCHA
  // initializeRecaptcha() {
  //   if (this.recaptchaVerifier) {
  //     console.log('reCAPTCHA already initialized');
  //     return;  // Prevent re-initializing
  //   }

  //   // Create reCAPTCHA verifier instance correctly, passing auth as third argument
  //   this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
  //     size: 'invisible',  // Invisible reCAPTCHA
  //     callback: (response: any) => {
  //       console.log('reCAPTCHA solved:', response);
  //     },
  //     'expired-callback': () => {
  //       console.log('reCAPTCHA expired');
  //       alert('reCAPTCHA expired. Please try again.');
  //     }
  //   },);  // Pass the auth instance here, NOT a string

  //   this.recaptchaVerifier.render().then(() => {
  //     console.log('reCAPTCHA rendered');
  //   }).catch((error) => {
  //     console.error('Error rendering reCAPTCHA:', error);
  //   });
  // }


  // Send OTP
  // sendOTP(mobileNumber: string) {
  //   const appVerifier = this.recaptchaVerifier;
  //   const formattedNumber = this.formatPhoneNumber(mobileNumber);
  //   //   console.log("formattedNumber", formattedNumber);
  //   firebase.auth().signInWithPhoneNumber(formattedNumber, appVerifier)
  //     .then((confirmationResult) => {
  //       const confirmationResult2 = confirmationResult;
  //       console.log("OTP sent successfully");
  //     })
  //     .catch((error) => {
  //       console.error("Error sending OTP:", error);
  //     });
  // }
  // sendOTP(mobileNumber: string) {
  //   if (!this.recaptchaVerifier) {
  //     console.error('reCAPTCHA not initialized');
  //     return;
  //   }

  //   const formattedNumber = this.formatPhoneNumber(mobileNumber);
  //   console.log("formattedNumber", formattedNumber);

  //   // Ensure reCAPTCHA has been rendered before using it
  //   if (this.recaptchaVerifier) {
  //     signInWithPhoneNumber(this.auth, formattedNumber, this.recaptchaVerifier)
  //       .then((confirmationResult) => {
  //         this.verificationId = confirmationResult.verificationId;
  //         this.otpSent = true;
  //         console.log('OTP sent');
  //       })
  //       .catch((error) => {
  //         console.error('Error sending OTP:', error.code, error.message);
  //         alert('Error sending OTP: ' + error.message);
  //       });
  //   }
  // }

  // Verify OTP
  // verifyOTP(otp: string) {
  //   if (!this.verificationId) {
  //     console.error('Verification ID not set');
  //     return;
  //   }

  //   // Correct way to use signInWithCredential in Firebase v9+ modular SDK
  //   const credential = PhoneAuthProvider.credential(this.verificationId, otp);
  //   signInWithCredential(this.auth, credential)  // Use signInWithCredential here
  //     .then((userCredential) => {
  //       console.log('User signed in:', userCredential.user);
  //     })
  //     .catch((error) => {
  //       console.error('Error verifying OTP:', error.code, error.message);
  //     });
  // }

  loginWithEmail() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService.loginWithEmail(email, password)
        .then(() => {
          localStorage.setItem('currentUserPassword', this.authService.encrypt(password));
          this.router.navigate([routes.adminDashboard]);
        })
        .catch((error: any) => {
          console.error('Email login error:', error);

          if (error.code === 'auth/user-not-found') {
            this.toastrService.error('No user found with this email');
          } else if (error.code === 'auth/wrong-password') {
            this.toastrService.error('Incorrect password');
          } else if (error.code === 'auth/user-disabled') {
            this.toastrService.error('User account is disabled');
          } else if (error.code === 'auth/invalid-email') {
            this.toastrService.error('Invalid email format');
          } else {
            this.toastrService.error('Login failed. Please try again.');
          }
        });
    } else {
      // Handle form validation errors
      if (this.loginForm.get('email')?.hasError('required') && this.loginForm.get('password')?.hasError('required')) {
        this.toastrService.error('Please check your email and password');
      } else if (this.loginForm.get('email')?.hasError('required')) {
        this.toastrService.error('Email is required');
      } else if (this.loginForm.get('password')?.hasError('required')) {
        this.toastrService.error('Password is required');
      } else {
        this.toastrService.error('Please check your email and password');
      }
    }
  }

  formatPhoneNumber(mobileNumber: string): string {
    if (mobileNumber.startsWith('0')) {
      mobileNumber = mobileNumber.substring(1); // Remove leading zero
    }
    // Return the formatted number
    return `+66${mobileNumber}`;
  }
  private setupMobileLoginValidators() {
    this.loginForm.get('mobileNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
    this.loginForm.get('mobileNumber')?.updateValueAndValidity();

    // Clear other validators
    this.loginForm.get('email')?.clearValidators();
    this.loginForm.get('email')?.updateValueAndValidity();
    this.loginForm.get('password')?.clearValidators();
    this.loginForm.get('password')?.updateValueAndValidity();
  }

  private setupEmailLoginValidators() {
    this.loginForm.get('email')?.setValidators([Validators.required, Validators.email]);
    this.loginForm.get('email')?.updateValueAndValidity();

    // Clear mobile validators
    this.loginForm.get('mobileNumber')?.clearValidators();
    this.loginForm.get('mobileNumber')?.updateValueAndValidity();
    this.loginForm.get('password')?.setValidators([Validators.required]);
    this.loginForm.get('password')?.updateValueAndValidity();
  }
  public password: boolean[] = [false];

  public togglePassword(index: any) {
    this.password[index] = !this.password[index]
  }

  changeLoginType() {
    this.isMobileLogin = !this.isMobileLogin;
  }


  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    console.log("this.isDarkMode", this.isDarkMode);
    this.applyTheme();
    const darkcolor = this.isDarkMode ? '#000001' : '#34383a';
    localStorage.setItem('theme', darkcolor);
  }

  applyTheme() {
    const loginCard = document.querySelector('.account-box') as HTMLElement;
    const accountPage = document.querySelector('.account-page') as HTMLElement;

    loginCard.style.border = '1px solid #d1b07d';
    if (this.isDarkMode) {
      // Optional: body background color
      if (loginCard) {
        loginCard.style.backgroundColor = '#000001'; // Dark mode background for card
        loginCard.style.color = 'white'; // Light text color for dark mode
      }
      if (accountPage) {
        accountPage.style.backgroundColor = '#16191c'; // Dark mode background for card
        accountPage.style.color = 'white'; // Light text color for dark mode
      }
    }
    else {
      // Optional: body background color
      loginCard.style.color = 'black'
      accountPage.style.backgroundColor = '#f9f9f9';
      loginCard.style.border = '1px solid #333';
      loginCard.style.backgroundColor = '#f9f9f9'; // Light mode background for card
      loginCard.style.color = '#333'; // Dark text color for light mode

    }

  }
}
