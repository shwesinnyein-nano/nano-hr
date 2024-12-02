import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AbstractControl, FormBuilder, FormGroup, MaxValidator, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs';
import { apiResultFormat, SideBar } from 'src/app/core/core.index';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CompanyService } from 'src/app/core/services/company/company.service';
import { DataService } from 'src/app/core/services/data/data.service';
import { UserRoleService } from 'src/app/core/services/user-role/user-role.service';
import { LanguagesService } from 'src/app/core/services/languages/languages.service';

export const passwordStrengthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.value;
  if (!password) {
    return null;
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  return strongPasswordRegex.test(password) ? null : { passwordStrength: true };
};
@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.scss'
})
export class AddUserModalComponent implements OnInit {
  isEdit: boolean = false;
  data: any;
  addUserForm!: FormGroup;
  isBangkok: boolean = false;
  isDisabled: boolean = false;
  isView: boolean = false;
  isNanoStoreBkkBranch: boolean = false;
  isNanoStore: boolean = false;
  isNanoVip: boolean = false;
  isNanoEntertainment: boolean = false;
  companyList: any[] = [];
  positionList: any[] = [];
  userRoleList: any[] = [];
  locationList: any[] = [];
  branchList: any[] = [];
  selectedCompany: string = '';
  selectedLocation: any;
  selectedBranch: string = '';
  selectedPosition: string = '';
  side_bar_data: any = []

  selectedLocationList: any[] = [];
  selectedBranchList: any[] = [];
  selectedPositionList: any[] = [];
  selectedRoleList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private ngbActiveModal: NgbActiveModal,
    private authService: AuthService,
    private companyService: CompanyService,
    private http: HttpClient,
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private userRoleService: UserRoleService,
    private afAuth: AngularFireAuth,
    private translate: LanguagesService    
  ) {
    // Load position data from JSON files


  }


  ngOnInit(): void {
    this.getMenuData();
    this.dataService.fetchAllList().subscribe((data) => {
      this.companyList = data.companyList.data;
      this.locationList = data.locationList.data;
      this.positionList = data.positionList.data;
      this.branchList = data.branchList.data;
      this.userRoleList = data.userRoleList.data;
    });


    this.loadForm(this.data);


    if (this.isEdit) {
      // Disable email and password fields in edit mode
      this.addUserForm.get('email')?.disable();
      this.addUserForm.get('password')?.disable();

      this.addUserForm.get('password')?.updateValueAndValidity();

    }
    if (this.isView) {
      this.isDisabled = true;
      this.addUserForm.disable();
    }

  }
  getMenuData() {
    this.dataService.getSideBarData.subscribe((res: Array<SideBar>) => {
      this.side_bar_data = res.flatMap((item: any) => item.menu);
    })
  }

  loadForm(data?: any) {
    console.log("loadForm", data);


    this.addUserForm = this.formBuilder.group({
      uid: [data ? data.uid : ''],
      firstName: [data ? data.firstName : '', Validators.required],
      lastName: [data ? data.lastName : '', Validators.required],
      email: [data ? data.email : '',
      [Validators.required, Validators.email],
      [this.authService.emailExistsValidator1()],
      { updateOn: 'change' } // 'change' will validate on every keystroke
      ],
      // email: [data? data.email : '', Validators.required, this.authService.emailExistsValidator(), Validators.email],
      phone: [data ? data.phone : '', Validators.required],
      password: [data ? data.password : '', [Validators.required, passwordStrengthValidator]],

      company: [data ? data.company : '', Validators.required],
      companyName: [data ? data.companyName : ''],
      branch: [data ? data.branch : '',],
      branchName: [data ? data.branchName : ''],
      location: [data ? data.location : '', Validators.required],
      locationName: [data ? data.locationName : ''],
      position: [data ? data.position : '', Validators.required],
      positionName: [data ? data.positionName : ''],
      joinDate: [data ? data.joinDate ? data.joinDate : new Date().toISOString() : new Date().toISOString()],
      role: [data ? data.role : '', Validators.required],
      createdDate: [data ? data.createdDate ? data.createdDate : new Date().toISOString() : new Date().toISOString()],
      updatedDate: [new Date().toISOString()],


    })
    this.side_bar_data.forEach((module: any) => {
      this.addUserForm.addControl(`${module.menuValue}_read`, this.formBuilder.control(false));
      this.addUserForm.addControl(`${module.menuValue}_write`, this.formBuilder.control(false));
      this.addUserForm.addControl(`${module.menuValue}_create`, this.formBuilder.control(false));
      this.addUserForm.addControl(`${module.menuValue}_delete`, this.formBuilder.control(false));
    });
    this.selectedLocation = data?.location;
    this.selectedCompany = data?.company;
    this.selectedBranch = data?.branch;
    this.selectedPosition = data?.position;
    if (this.data && this.data.uid) {
      this.setOldData();
    }



  }
  setOldData() {
    if (this.selectedCompany) {
      if (this.selectedCompany == "nano-entertainment") {
        this.isNanoEntertainment = true;
        this.isNanoStore = false;
        this.isNanoVip = false;


      }
      else if (this.selectedCompany == "nano-store") {
        this.isNanoStore = true;
        this.isNanoEntertainment = false;
        this.isNanoVip = false;

      }
      else if (this.selectedCompany == "nano-vip") {
        this.isNanoVip = true;
        this.isNanoStore = false;
        this.isNanoEntertainment = false;


      }
    }

    this.dataService.getCompanyList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      this.companyList = res;
    });
    this.dataService.getUserRole().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      this.userRoleList = res;
      this.selectedRoleList = res;
    });

    this.dataService.getLocationList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((location: any) => location.parentId == this.selectedCompany);
      console.log("list", list);
      this.locationList = list;
      this.selectedLocationList = list;
    });
    this.dataService.getBranchList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((branch: any) => branch.parentId == this.selectedLocation);
      console.log("list", list);
      this.branchList = list;
      this.selectedBranchList = list;
    });
    this.dataService.getPositionList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((position: any) => position.companyId == this.selectedCompany && position.locationId == this.selectedLocation);
      
      this.positionList = list;
      this.selectedPositionList = list;
    });
    this.userRoleService.getMenuAccess(this.data.uid).subscribe((menuData: any) => {

      // Loop through the side_bar_data and set values
      this.side_bar_data.forEach((module: any) => {
        // Find the corresponding access data from menuData
        const access = menuData.menuAccess.find((accessItem: any) => accessItem.menuValue === module.menuValue);

        if (access) {
          // Set the values of the already existing form controls
          this.addUserForm.get(`${module.menuValue}_read`)?.setValue(access.read);
          this.addUserForm.get(`${module.menuValue}_write`)?.setValue(access.write);
          this.addUserForm.get(`${module.menuValue}_create`)?.setValue(access.create);
          this.addUserForm.get(`${module.menuValue}_delete`)?.setValue(access.delete);
        }
      });
    });
  }

  onBranchChange(event: any) {
    console.log("onBranchChange", event);

    this.selectedPosition = '';
    this.selectedBranch = event.value;
    this.addUserForm.get('position')?.setValue('');
    this.addUserForm.get('positionName')?.setValue('');
    this.addUserForm.get('branchName')?.setValue(this.branchList.find((branch: any) => branch.id === event.value)?.name);
    this.dataService.getPositionList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((position: any) => position.parentId == event.value);
      console.log("list", list);
      this.positionList = list;
      this.selectedPositionList = list;
    });


  }

  onPositionChange(event: any) {
    console.log("onPositionChange", event);
    console.log("selected language", this.translate.getSelectedLanguage());
    this.addUserForm.get('positionName')?.setValue(this.positionList.find((position: any) => position.id === event.value)?.name || '');
  }
  onLocationChange(event: any) {
    console.log("onLocationChange", event);
    this.selectedLocation = event.value;
    this.selectedBranch = '';
    this.selectedPosition = '';
    this.addUserForm.get('branch')?.setValue('');
    this.addUserForm.get('position')?.setValue('');
    this.addUserForm.get('location')?.setValue(event.value);
    this.addUserForm.get('locationName')?.setValue(this.locationList.find((location: any) => location.id === event.value)?.name);

    if (event.value == "nano-vip-phuket" || event.value == "nano-vip-bangkok") {
      this.dataService.getPositionList().pipe(
        map((res: any) => res.data)
      ).subscribe((res: any) => {
        const list = res.filter((position: any) => position.companyId == this.selectedCompany && position.locationId == event.value);
        console.log("list", list);
        this.positionList = list;
        this.selectedPositionList = list;
      });
    }

    this.dataService.getBranchList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((branch: any) => branch.parentId == event.value);
      console.log("list", list);
      this.branchList = list;
      this.selectedBranchList = list;
    });



  }
  onCompanyChange(event: any) {

   
    this.selectedCompany = event.value;
    this.selectedLocation = '';
    this.selectedBranch = '';
    this.selectedPosition = '';
    this.addUserForm.get('branch')?.setValue('');
    this.addUserForm.get('position')?.setValue('');
    this.addUserForm.get('location')?.setValue('');
    console.log("selectedCompany", this.selectedCompany);

    this.addUserForm.get('companyName')?.setValue(this.companyList.find((company: any) => company.id === event.value)?.name);
    if (event.value == "nano-entertainment") {
      this.isNanoEntertainment = true;
      this.isNanoStore = false;
      this.isNanoVip = false;
      


    }
    else if (event.value == "nano-store") {
      this.isNanoStore = true;
      this.isNanoEntertainment = false;
      this.isNanoVip = false;
      

    }
    else if (event.value == "nano-vip") {
      this.isNanoVip = true;
      this.isNanoStore = false;
      this.isNanoEntertainment = false;
      



    }
    this.dataService.getLocationList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((location: any) => location.parentId == event.value);

      this.selectedLocationList = list;
    });
  }

  closeModal() {
    this.ngbActiveModal.dismiss();
  }
  submitAddUser() {
    console.log("submitAddUser", this.addUserForm.value);
    

    // Convert joinDate to ISO string format if available
    if (this.addUserForm.value.joinDate) {
      const joinDate = new Date(this.addUserForm.value.joinDate);
      this.addUserForm.patchValue({
        joinDate: joinDate.toISOString()
      });
    }

    // Access the current authenticated user
    this.afAuth.currentUser.then((currentUser) => {
      if (currentUser) {
        // You now have access to the current authenticated user
        console.log("Current user UID:", currentUser.uid);

        // If the email exists validation
        const isEmailExists = this.authService.emailExistsValidator(this.addUserForm.getRawValue().email).subscribe((res: any) => {
          console.log("isEmailExists", res);
        });

        if (this.addUserForm.valid) {
          const menuAccess = this.side_bar_data.map((module: any) => ({
            menuValue: module.menuValue,
            read: this.addUserForm.get(`${module.menuValue}_read`)?.value,
            write: this.addUserForm.get(`${module.menuValue}_write`)?.value,
            create: this.addUserForm.get(`${module.menuValue}_create`)?.value,
            delete: this.addUserForm.get(`${module.menuValue}_delete`)?.value,
          }));

          // Clean up form fields
          this.side_bar_data.forEach((module: any) => {
            this.addUserForm.removeControl(`${module.menuValue}_read`);
            this.addUserForm.removeControl(`${module.menuValue}_write`);
            this.addUserForm.removeControl(`${module.menuValue}_create`);
            this.addUserForm.removeControl(`${module.menuValue}_delete`);
          });

          // Pass the current user's UID along with the new user data
          this.ngbActiveModal.close({
            data: { ...this.addUserForm.value, email: this.addUserForm.getRawValue().email, status: 'enabled' },
            menuAccess: menuAccess,
            createdBy: currentUser.uid  // Add current user's UID to the data
          });
        } else {
          this.addUserForm.markAllAsTouched();
        }
      } else {
        console.log("No user is currently signed in");
      }
    }).catch((error: any) => {
      console.error("Error fetching current user:", error);
    });
  }

  // submitAddUser() {
  //   console.log("submitAddUser", this.addUserForm.value);
  //   // Convert joinDate to ISO string format
  //   if (this.addUserForm.value.joinDate) {
  //     const joinDate = new Date(this.addUserForm.value.joinDate);
  //     this.addUserForm.patchValue({
  //       joinDate: joinDate.toISOString()
  //     });
  //   }

  //   const isEmailExists = this.authService.emailExistsValidator(this.addUserForm.getRawValue().email).subscribe((res: any) => {
  //     console.log("isEmailExists", res);
  //   });



  //   if (this.addUserForm.valid) {
  //     const menuAccess = this.side_bar_data.map((module: any) => ({
  //       menuValue: module.menuValue,
  //       read: this.addUserForm.get(`${module.menuValue}_read`)?.value,
  //       write: this.addUserForm.get(`${module.menuValue}_write`)?.value,
  //       create: this.addUserForm.get(`${module.menuValue}_create`)?.value,
  //       delete: this.addUserForm.get(`${module.menuValue}_delete`)?.value,
  //     }));
  //     this.side_bar_data.forEach((module: any) => {
  //       this.addUserForm.removeControl(`${module.menuValue}_read`);
  //       this.addUserForm.removeControl(`${module.menuValue}_write`);
  //       this.addUserForm.removeControl(`${module.menuValue}_create`);
  //       this.addUserForm.removeControl(`${module.menuValue}_delete`);
  //     });
  //     this.ngbActiveModal.close({ data: { ...this.addUserForm.value, email: this.addUserForm.getRawValue().email, status: 'enabled' }, menuAccess: menuAccess });
  //   }
  //   else {
  //     this.addUserForm.markAllAsTouched();
  //   }

  // }
  disabledUser() {
    this.ngbActiveModal.dismiss();
  }

}
