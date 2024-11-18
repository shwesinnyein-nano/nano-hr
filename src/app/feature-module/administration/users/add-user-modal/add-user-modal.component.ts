import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, MaxValidator, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs';
import { apiResultFormat } from 'src/app/core/core.index';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CompanyService } from 'src/app/core/services/company/company.service';
import { DataService } from 'src/app/core/services/data/data.service';
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

  addUserForm!: FormGroup;
  data: any;
  isEdit: boolean = false;
  isBangkok: boolean = false;
  isDisabled: boolean = false;
  isView: boolean = false;
  isNanoStoreBkkBranch: boolean = false;
  isNanoStore: boolean = false;
  isNanoVip: boolean = false;
  isNanoEntertainment: boolean = false;
  companyList: any[] = [];
  positionList: any[] = [];

  locationList: any[] = [];
  branchList: any[] = [];
  selectedCompany: string = '';
  selectedLocation: any;
  selectedBranch: string = '';
  selectedPosition: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private ngbActiveModal: NgbActiveModal,
    private authService: AuthService,
    private companyService: CompanyService,
    private http: HttpClient,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {
    // Load position data from JSON files


  }


  ngOnInit(): void {

    this.dataService.fetchAllList().subscribe((data) => {
      this.companyList = data.companyList.data;
      this.locationList = data.locationList.data;
      this.positionList = data.positionList.data;
      this.branchList = data.branchList.data;
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
    this.selectedLocation = data?.location;
    this.selectedCompany = data?.company;
    this.selectedBranch = data?.branch;
    this.selectedPosition = data?.position;
    this.setOldData();



  }
  setOldData(){
    if(this.selectedCompany){
      if(this.selectedCompany == "nano-entertainment"){
        this.isNanoEntertainment = true;
        this.isNanoStore = false;
        this.isNanoVip = false;


      }
      else if(this.selectedCompany == "nano-store"){
        this.isNanoStore = true;
        this.isNanoEntertainment = false;
        this.isNanoVip = false;

      }
        else if(this.selectedCompany == "nano-vip"){
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

    this.dataService.getLocationList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((location: any) => location.parentId == this.selectedCompany );
      console.log("list", list);
      this.locationList = list;
    });
    this.dataService.getBranchList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((branch: any) => branch.parentId == this.selectedLocation);
      console.log("list", list);
      this.branchList = list;
    });
    this.dataService.getPositionList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((position: any) => position.companyId == this.selectedCompany && position.locationId == this.selectedLocation);
      console.log("list", list);
      this.positionList = list;
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
      });


  }

  onPositionChange(event: any) {
    console.log("onPositionChange", event);
    this.addUserForm.get('positionName')?.setValue(this.positionList.find((position: any) => position.id === event.value)?.name);
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

    if(event.value == "nano-vip-phuket" || event.value == "nano-vip-bangkok"){
      this.dataService.getPositionList().pipe(
        map((res: any) => res.data)
      ).subscribe((res: any) => {
        const list = res.filter((position: any) => position.companyId == this.selectedCompany && position.locationId == event.value);
        console.log("list", list);
        this.positionList = list;
      });
    }

      this.dataService.getBranchList().pipe(
        map((res: any) => res.data)
      ).subscribe((res: any) => {
        const list = res.filter((branch: any) => branch.parentId == event.value);
        console.log("list", list);
        this.branchList = list;
      });



  }
  onCompanyChange(event: any) {

    console.log("changeCompany", event);
    this.selectedCompany = event.value;


    this.selectedLocation = '';
    this.selectedBranch = '';
    this.selectedPosition = '';
    this.addUserForm.get('branch')?.setValue('');
    this.addUserForm.get('position')?.setValue('');
    this.addUserForm.get('location')?.setValue('');

     this.addUserForm.get('companyName')?.setValue(this.companyList.find((company: any) => company.id === event.value)?.name);
    if(event.value == "nano-entertainment"){
      this.isNanoEntertainment = true;
      this.isNanoStore = false;
      this.isNanoVip = false;


    }
    else if(event.value == "nano-store"){
      this.isNanoStore = true;
      this.isNanoEntertainment = false;
      this.isNanoVip = false;

    }
      else if(event.value == "nano-vip"){
      this.isNanoVip = true;
      this.isNanoStore = false;
      this.isNanoEntertainment = false;


    }
    this.dataService.getLocationList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((location: any) => location.parentId == event.value);

      this.locationList = list;
    });
  }

  closeModal() {
    this.ngbActiveModal.dismiss();
  }
  submitAddUser() {
    console.log("submitAddUser", this.addUserForm.value);
    // Convert joinDate to ISO string format
    if (this.addUserForm.value.joinDate) {
      const joinDate = new Date(this.addUserForm.value.joinDate);
      this.addUserForm.patchValue({
        joinDate: joinDate.toISOString()
      });
    }

    const isEmailExists = this.authService.emailExistsValidator(this.addUserForm.getRawValue().email).subscribe((res: any) => {
      console.log("isEmailExists", res);
    });



    if (this.addUserForm.valid) {
      this.ngbActiveModal.close({ data: { ...this.addUserForm.value, email: this.addUserForm.getRawValue().email, status: 'enabled' } });
    }
    else {
      this.addUserForm.markAllAsTouched();
    }

  }
  disabledUser() {
    this.ngbActiveModal.dismiss();
  }

}
