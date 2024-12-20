import { Component, computed, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { Approver, Branch, Company, Position, Role, routes, UserRole } from 'src/app/core/core.index';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/core/services/data/data.service';
import { EmployeeService } from 'src/app/core/services/employee/employee.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, map } from 'rxjs';
import { Location } from 'src/app/core/services/interface/models';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-employee-profile-info',

  templateUrl: './employee-profile-info.component.html',
  styleUrl: './employee-profile-info.component.scss'
})
export class EmployeeProfileInfoComponent implements OnInit {
  public routes = routes;
  @Input() lastNumber!: number;
  bsValue = new Date();
  bloodGroupList: any[] = [];
  employeeData: any;
  employeeProfileData: any = {};
  vaccinationsStatus: any[] = [];
  allergies: any[] = [];

  disabilities: any[] = [];
  congenitalDiseases: any[] = [];
  addEmployeeForm!: FormGroup;
  searchText: string = '';
  name: string = '';
  position: string = '';
  company: string = '';

  phone: string = '';
  joinDate: string = '';
  uploadedDocuments: { name: string; dateUploaded: string }[] = [];
  isEdit: boolean = false;
  imageUrl: string | undefined = ''; // URL of uploaded image
  uploadProgress: number = -1;
  isAllergies: boolean = false;
  isDisabilities: boolean = false;
  isCongenitalDiseases: boolean = false;


  isUser: boolean = false;

  companyList: WritableSignal<Company[]> = signal<Company[]>([]);
  companyListFilter = computed(() => this.companyList().filter((company: any) => company.id === this.selectedCompany));
  selectedCompany: any;
  locationList: WritableSignal<Location[]> = signal<Location[]>([]);
  selectedLocation: any;
  selectedLocationList: any[] = [];
  branchList: WritableSignal<Branch[]> = signal<Branch[]>([]);
  selectedBranch: any;
  selectedBranchList: any[] = [];
  positionList: WritableSignal<Position[]> = signal<Position[]>([]);
  selectedPosition: any;
  selectedPositionList: any[] = [];
  roleList: WritableSignal<Role[]> = signal<Role[]>([]);
  userRoleList: WritableSignal<UserRole[]> = signal<UserRole[]>([]);
  approverList: WritableSignal<Approver[]> = signal<Approver[]>([]);
  nationalityList: WritableSignal<any[]> = signal<any[]>([]);
  isApprover: boolean = false;
  isNanoVIP: boolean = false;
  employeeID: string = '';

  isCard: boolean = false;
  // imageUrl: string | ArrayBuffer | null = null; // Initialize as needed
  imageFile: File | null = null;
  constructor(private formBuilder: FormBuilder, private storage: AngularFireStorage, private firestore: AngularFirestore, private router: Router, private activatedRoute: ActivatedRoute, private dataService: DataService, private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.fetchAllData()

    this.loadForm()

    this.activatedRoute.queryParams.subscribe((params: any) => {
      console.log("params", params);
      if (params.data) {
        this.employeeData = JSON.parse(params.data);
        this.loadForm(this.employeeData);
      }
      if (params.uid) {
        this.employeeID = params.uid;
        this.addEmployeeForm.get('uid')?.setValue(this.employeeID);
      }
      else {
        this.generateEmployeeNo();
      }
    });

  }

  loadForm(data?: any) {
    console.log("data", data);
    this.addEmployeeForm = this.formBuilder.group({
      uid: new FormControl(data?.uid || this.employeeID),

      isUser: new FormControl(data?.isUser || null),
      company: new FormControl(data?.company || null, [Validators.required]),
      companyName: new FormControl(data?.companyName || null),

      branch: new FormControl(data?.branch || null),
      branchName: new FormControl(data?.branchName || null),

      position: new FormControl(data?.position || null, [Validators.required]),
      positionName: new FormControl(data?.positionName || null),

      location: new FormControl(data?.location || null, [Validators.required]),
      locationName: new FormControl(data?.locationName || null),

      firstName: new FormControl(data?.firstName || null, [Validators.required]),
      lastName: new FormControl(data?.lastName || null, [Validators.required]),

      nickname: new FormControl(data?.nickname || null, [Validators.required]),
      role: new FormControl(data?.role || null, [Validators.required]),
      roleName: new FormControl(data?.roleName || null),
      approver: new FormControl(data?.approver || null),

      email: new FormControl(data?.email || null),
      primary_number: new FormControl(data?.primary_number || null, [Validators.required]),
      secondary_number: new FormControl(data?.secondary_number || null),

      idType: new FormControl(data?.idType || null, [Validators.required]),
      idCardNumber: new FormControl(data?.idCardNumber || null, [Validators.required]),
      joinDate: new FormControl(data?.joinDate || null),
      gender: new FormControl(data?.gender || null, [Validators.required]),
      dateOfBirth: new FormControl(data?.dateOfBirth || null, [Validators.required]),
      nationality: new FormControl(data?.nationality || null, [Validators.required]),

      maritalStatus: new FormControl(data?.maritalStatus || null),

      idAddress: new FormControl(data?.idAddress || null, [Validators.required]),
      district: new FormControl(data?.district || null, [Validators.required]),
      subDistrict: new FormControl(data?.subDistrict || null, [Validators.required]),
      province: new FormControl(data?.province || null, [Validators.required]),
      postalCode: new FormControl(data?.postalCode || null, [Validators.required]),

      sameAsIdAddress: new FormControl(data?.sameAsIdAddress || null),
      currentAddress: new FormControl(data?.currentAddress || null),
      currentDistrict: new FormControl(data?.currentDistrict || null),
      currentSubDistrict: new FormControl(data?.currentSubDistrict || null),
      currentProvince: new FormControl(data?.currentProvince || null),
      currentPostalCode: new FormControl(data?.currentPostalCode || null),

      emgContactName: new FormControl(data?.emgContactName || null, [Validators.required]),
      emgRelationship: new FormControl(data?.emgRelationship || null, [Validators.required]),
      emgMobileNumber: new FormControl(data?.emgMobileNumber || null, [Validators.required]),
      emgAddress: new FormControl(data?.emgAddress || null),

      bankName: new FormControl(data?.bankName || null),
      bankAccountNumber: new FormControl(data?.bankAccountNumber || null),
      bankHolderName: new FormControl(data?.bankHolderName || null),

      bloodType: new FormControl(data?.bloodGroup || null),
      allergies: new FormControl(data?.allergies || null),
      allergiesDetails: new FormControl(data?.allergiesDetails || null),
      disabilitiesStatus: new FormControl(data?.disabilitiesStatus || null),
      disabilitiesDetails: new FormControl(data?.disabilitiesDetails || null),
      congenitalDiseases: new FormControl(data?.congenitalDiseases || null),
      congenitalDetails: new FormControl(data?.congenitalDetails || null),
      vaccinationsStatus: new FormControl(data?.vaccinationsStatus || null),

      profileImage: new FormControl(data?.profileImage || null),

    });
  }
  getAutoIncrementNumber() {
    this.employeeService.getLastEmployeeNo().subscribe((lastNumber: number) => {
      this.lastNumber = Number(lastNumber);
      console.log("this.lastNumber", this.lastNumber);
    });
  }
  generateEmployeeNo(): void {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();

    const datePart = `${day}${month}${year}`;
    this.employeeService.getLastEmployeeNo().subscribe((lastNumber: number) => {
      this.lastNumber = Number(lastNumber);
      console.log("this.lastNumber", this.lastNumber);
      if (!isNaN(this.lastNumber)) {
        const incrementPart = (this.lastNumber + 1).toString().padStart(3, '0');
        console.log('incrementPart:', incrementPart); // It should output 005 if lastNumber is 4
      } else {
        console.error('Invalid lastNumber:', this.lastNumber);
      }

      const incrementPart = (this.lastNumber + 1).toString().padStart(3, '0');
      console.log("incrementPart", incrementPart);


      this.employeeID = `EMP-${datePart}${incrementPart}`;
      console.log("this.employeeID", this.employeeID);
    });


  }

  onIsUserChange(event: any) {
    console.log("event", event.target.checked);
    this.addEmployeeForm.get('isUser')?.setValue(event.target.checked);
    if (event.target.checked) {
      this.isUser = true;
      this.addEmployeeForm.get('email')?.setValidators([Validators.required, Validators.email]);
    }
    else {
      this.isUser = false;
      this.addEmployeeForm.get('email')?.setValidators([Validators.required]);
    }
  }
  get email() {
    return this.addEmployeeForm.get('email');
  }
  get postalCode() {
    return this.addEmployeeForm.get('postalCode');
  }

  restrictToDigits(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    return charCode >= 48 && charCode <= 57; // Allow digits 0-9
  }

  // onFileSelected(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const userId = this.employeeData.uid; // Get current user's UID
  //     const filePath = `profile-images/${userId}/${file.name}`; // Save under user's UID folder
  //     const fileRef = this.storage.ref(filePath);
  //     const task = this.storage.upload(filePath, file);

  //     console.log("filepath", filePath);
  //     console.log("fileRef", fileRef);
  //     console.log("task", task);
  //     task.percentageChanges().subscribe(progress => {
  //       console.log('Upload Progress:', progress);
  //     });
  //     task.snapshotChanges().pipe(
  //       finalize(() => {
  //         fileRef.getDownloadURL().subscribe(url => {
  //           this.imageUrl = url;
  //           console.log("imageUrl", this.imageUrl);
  //           // Save URL to display the image
  //           this.saveImageUrlToDatabase(url); // Save URL to Firestore
  //         });
  //       })
  //     ).subscribe();
  //   }
  // }

  // saveImageUrlToDatabase(url: string): void {
  //   // const userId = this.employeeData.uid;
  //   // const data = { profileImage: url, updatedAt: new Date() };
  //   // this.firestore.collection('users').doc(userId).set(data, { merge: true })
  //   //   .then(() => console.log('Image URL saved to Firestore'))
  //   //   .catch(error => console.error('Error saving image URL to Firestore', error));
  // }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const userId = this.employeeData?.uid || 'unknown-user'; // Ensure UID is valid
      const filePath = `profile-images/${userId}/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // Display upload progress
      task.percentageChanges().subscribe(progress => {
        console.log('Upload Progress:', progress);
      });

      // Handle completion
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              this.imageUrl = url;
              console.log('Image URL:', url);
              this.saveImageUrlToDatabase(url); // Save URL to Firestore
            });
          })
        )
        .subscribe();
    } else {
      console.error('No file selected');
    }
  }

  saveImageUrlToDatabase(url: string): void {
    const userId = this.employeeData?.uid || 'unknown-user';
    const data = { profileImage: url, updatedAt: new Date() };

    this.firestore.collection('users').doc(userId).set(data, { merge: true })
      .then(() => console.log('Image URL saved to Firestore'))
      .catch(error => console.error('Error saving image URL to Firestore', error));
  }

  fetchAllData() {
    this.dataService.fetchAllList().subscribe((data) => {
      this.companyList.set(data.companyList.data);
      this.locationList.set(data.locationList.data);
      this.positionList.set(data.positionList.data);
      this.branchList.set(data.branchList.data);
      this.roleList.set(data.userRoleList.data);
      this.approverList.set(data.approverList.data);
      this.nationalityList.set(data.nationalityList.data);
      console.log("this.companyList", this.companyList());
    });


  }

  onCompanyChange(event: any) {
    console.log("event", event.value);
    this.selectedLocationList = []
    this.selectedBranchList = []
    this.selectedPositionList = []

    this.approverList.set([])
    this.selectedCompany = event.value;
    this.addEmployeeForm.get('companyName')?.setValue(this.companyList().find((company: any) => company.id === event.value)?.name);

    if (event.value == "nano-vip") {
      this.isNanoVIP = true;
      this.addEmployeeForm.get('branch')?.disable();
    }
    else {
      this.isNanoVIP = false;
      this.addEmployeeForm.get('branch')?.enable();
    }
    this.dataService.getLocationList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((location: any) => location.parentId == event.value);
      console.log("list", list);
      this.locationList.set(list);
      this.selectedLocationList = list;
    });
  }
  onLocationChange(event: any) {
    console.log("onLocationChange", event.value);
    this.branchList.set([])
    this.selectedLocation = event.value;
    this.addEmployeeForm.get('locationName')?.setValue(this.locationList().find((location: any) => location.id === event.value)?.name);
    if (event.value == "nano-vip-phuket" || event.value == "nano-vip-bangkok") {
      this.dataService.getPositionList().pipe(
        map((res: any) => res.data)
      ).subscribe((res: any) => {
        const list = res.filter((position: any) => position.companyId == this.selectedCompany && position.locationId == event.value);
        console.log("list", list);
        this.positionList.set(list);
        this.selectedPositionList = list;
      });
    }

    this.dataService.getBranchList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((branch: any) => branch.parentId == event.value);
      console.log("list", list);
      this.branchList.set(list);
      this.selectedBranchList = list;
    });
  }

  onBranchChange(event: any) {
    console.log("onBranchChange", event.value);
    this.selectedBranch = event.value;
    this.addEmployeeForm.get('branchName')?.setValue(this.branchList().find((branch: any) => branch.id === event.value)?.name);

    this.dataService.getPositionList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((position: any) => position.parentId == event.value);
      console.log("list", list);
      this.positionList.set(list);
      this.selectedPositionList = list;
    });
  }
  onRoleChange(event: any) {
    console.log("event", event);
    if (event.value == "approver") {
      this.isApprover = true;

    }
    else {
      this.isApprover = false;
    }
    this.addEmployeeForm.get("roleName")?.setValue(this.roleList().find((role: any) => role.id === event.value)?.name);
    this.dataService.getApproverList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((approver: any) => approver.parentId == event.value);
      console.log("list", list);
      this.approverList.set(list);
    });
  }

  onPositionChange(event: any) {
    console.log("onPositionChange", event.value);
    this.selectedPosition = event.value;
    this.addEmployeeForm.get('positionName')?.setValue(this.positionList().find((position: any) => position.id === event.value)?.name);
  }

  cancelUpdate() {
    this.router.navigate([routes.employee_info_list]);
  }
  submitEmployee() {
    console.log("submitEmployee", this.addEmployeeForm.value);
    console.log("submitEmployeeControl", this.addEmployeeForm);
    console.log("this.addEmployeeForm.valid", this.addEmployeeForm.getRawValue());

    console.log("isUser", this.isUser);
    if (this.addEmployeeForm.valid) {
      if (this.addEmployeeForm.value.dateOfBirth) {
        const dateOfBirth = new Date(this.addEmployeeForm.value.dateOfBirth);
        this.addEmployeeForm.patchValue({
          dateOfBirth: dateOfBirth.toISOString()
        });
      }
      if (this.addEmployeeForm.value.joinDate) {
        const joinDate = new Date(this.addEmployeeForm.value.joinDate);
        this.addEmployeeForm.patchValue({
          joinDate: joinDate.toISOString()
        });
      }
      this.employeeService.saveEmployeeData(this.addEmployeeForm.value.uid, this.addEmployeeForm.getRawValue()).subscribe((res: any) => {
        console.log("res", res);
        this.router.navigate([routes.employee_info_list]);
      });
    }
    else {
      this.addEmployeeForm.markAllAsTouched();
    }
  }
  onIdTypeChange(selectedType: string): void {
    const idCardNumberControl = this.addEmployeeForm.get('idCardNumber');
    this.addEmployeeForm.get('idCardNumber')?.setValue(null);
    if (selectedType === 'id_card') {
      this.isCard = true;

    } else if (selectedType === 'passport') {
      this.isCard = false;

    }

    // Update the validation status
    idCardNumberControl?.updateValueAndValidity();
  }
  validateIdCard(event: Event): void {
    if (this.isCard) {
      const inputElement = event.target as HTMLInputElement;
      inputElement.value = inputElement.value.replace(/[^0-9]/g, ''); // Allow only numeric input

      if (inputElement.value.length > 13) {
        inputElement.value = inputElement.value.slice(0, 13); // Truncate to 13 characters
      }

      this.addEmployeeForm.get('idCardNumber')?.setValue(inputElement.value); // Sync with FormControl
    } else {
      const inputElement = event.target as HTMLInputElement;

      if (inputElement.value.length > 10) {
        inputElement.value = inputElement.value.slice(0, 10); // Truncate to 13 characters
      }
    }
  }
  onSameAsIdAddressChange(event: any) {
    const sameAsIdAddress = event.target.checked;
  
    if (sameAsIdAddress) {
      // Ensure values are set properly
      const idAddress = this.addEmployeeForm.get('idAddress')?.value;
      console.log("idAddress", idAddress);
      const district = this.addEmployeeForm.get('district')?.value;
      const subDistrict = this.addEmployeeForm.get('subDistrict')?.value;
      const province = this.addEmployeeForm.get('province')?.value;
      const postalCode = this.addEmployeeForm.get('postalCode')?.value;
  
      if (idAddress || district || subDistrict || province || postalCode) {
        this.addEmployeeForm.patchValue({
          currentAddress: idAddress,
          currentDistrict: district,
          currentSubDistrict: subDistrict,
          currentProvince: province,
          currentPostalCode: postalCode
        });
      }
      console.log("this.addEmployeeForm.currentAddress", this.addEmployeeForm.get('currentAddress')?.value);
  
      this.disableCurrentAddress();
    } else {
      this.enableCurrentAddress();
    }
  }
  
  disableCurrentAddress() {
    this.addEmployeeForm.get('currentAddress')?.disable();
    this.addEmployeeForm.get('currentDistrict')?.disable();
    this.addEmployeeForm.get('currentSubDistrict')?.disable();
    this.addEmployeeForm.get('currentProvince')?.disable();
    this.addEmployeeForm.get('currentPostalCode')?.disable();
  }
  enableCurrentAddress() {
    this.addEmployeeForm.get('currentAddress')?.enable();
    this.addEmployeeForm.get('currentDistrict')?.enable();
    this.addEmployeeForm.get('currentSubDistrict')?.enable();
    this.addEmployeeForm.get('currentProvince')?.enable();
    this.addEmployeeForm.get('currentPostalCode')?.enable();
  }

  onDisabilitiesChange(event: any) {

    this.isDisabilities = event.value == "Yes";
  }

  onCongenitalDiseasesChange(event: any) {
    console.log("event", event);
    this.isCongenitalDiseases = event.value == "Yes";
  }

  onAllergiesChange(event: any) {
    console.log("event", event);
    this.isAllergies = event.value == "Yes";
  }


}
