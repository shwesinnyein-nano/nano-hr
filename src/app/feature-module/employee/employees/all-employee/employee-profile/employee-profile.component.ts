import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/core.index';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/core/services/data/data.service';
import { EmployeeService } from 'src/app/core/services/employee/employee.service';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
interface data {
  value: string;
}

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
})
export class EmployeeProfileComponent implements OnInit {
  public selectedValue1 = '';
  public selectedValue2 = '';
  public selectedValue3 = '';
  public selectedValue4 = '';
  public selectedValue5 = '';
  public selectedValue6 = '';
  public selectedValue7 = '';
  public selectedValue8 = '';
  public selectedValue9 = '';
  public selectedValue10 = '';
  public selectedValue11 = '';
  public selectedValue12 = '';
  public selectedValue13 = '';
  public selectedValue14 = '';
  public selectedValue15 = '';
  public routes = routes;
  bsValue = new Date();
  bloodGroupList: any[] = [];
  employeeData: any;
  employeeProfileData:any = {};
  vaccinationsStatus: any[] = [];
  allergies: any[] = [];
  nationalityList: any[] = [];
  disabilities: any[] = [];
  congenitalDiseases: any[] = [];
   addEmployeeForm!: FormGroup;
  searchText: string = '';
  name: string = '';
  position: string = '';
  company: string = '';
  email: string = '';
  phone: string = '';
  joinDate: string = '';
  uploadedDocuments: { name: string; dateUploaded: string }[] = [];
  isEdit: boolean = false;
  imageUrl: string | undefined = ''; // URL of uploaded image
  uploadProgress: number = -1;
  isAllergies: boolean = false;
  isDisabilities: boolean = false;
  isCongenitalDiseases: boolean = false;

  // imageUrl: string | ArrayBuffer | null = null; // Initialize as needed
  imageFile: File | null = null;
  constructor(private formBuilder: FormBuilder,private storage: AngularFireStorage  ,private firestore: AngularFirestore, private router: Router, private activatedRoute: ActivatedRoute , private dataService: DataService, private employeeService: EmployeeService ) {}

  ngOnInit() {
    this.loadFormData();
    this.getCountry();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      console.log("params", params);

       this.employeeData = JSON.parse(params.data);
       this.name = this.employeeData.firstName + ' ' + this.employeeData.lastName;
       this.position = this.employeeData.positionName;
       this.company = this.employeeData.companyName;
       this.email = this.employeeData.email;
       this.phone = this.employeeData.phone;
       this.joinDate = this.employeeData.joinDate;
       console.log("employeeData", this.employeeData);
       if(this.employeeData) {
        this.loadFormData(this.employeeData);
      }

      if(params.type === 'view') {
        console.log("view");
        Object.keys(this.addEmployeeForm.controls).forEach(key => {
          this.addEmployeeForm.get(key)?.disable();
        });

      }
      else{
        if(this.employeeData) {
          this.loadFormData(this.employeeData);
        }

      }

      // console.log("employeeData", this.employeeData);
    });


  }

  onSameAsIdAddressChange(event?: any) {
    console.log("event", event.target.checked);
    const sameAsIdAddress = event.target.checked;
    if (sameAsIdAddress) {
      // Copy ID address fields to current address fields
      this.addEmployeeForm.get('currentAddress')?.setValue(this.addEmployeeForm.get('idAddress')?.value);
      this.addEmployeeForm.get('currentDistrict')?.setValue(this.addEmployeeForm.get('district')?.value);
      this.addEmployeeForm.get('currentSubDistrict')?.setValue(this.addEmployeeForm.get('subDistrict')?.value);
      this.addEmployeeForm.get('currentProvince')?.setValue(this.addEmployeeForm.get('province')?.value);
      this.addEmployeeForm.get('currentPostalCode')?.setValue(this.addEmployeeForm.get('postalCode')?.value);
      this.disableCurrentAddress();
    } else {
      // Clear current address fields
      this.enableCurrentAddress();
    }
    console.log("event", event);
  }
  filterNationality() {
    this.nationalityList = this.nationalityList.filter(item => item.nationality.toLowerCase().includes(this.searchText.toLowerCase()));
  }
  enableCurrentAddress() {
    this.addEmployeeForm.get('currentAddress')?.enable();
    this.addEmployeeForm.get('currentDistrict')?.enable();
    this.addEmployeeForm.get('currentSubDistrict')?.enable();
    this.addEmployeeForm.get('currentProvince')?.enable();
    this.addEmployeeForm.get('currentPostalCode')?.enable();
  }

  loadFormData(data?: any) {
    console.log("data", data);
    this.imageUrl = data?.profileImage || null;
   
    this.addEmployeeForm = this.formBuilder.group({
      uid: new FormControl(data?.uid || null),
      gender: new FormControl(data?.gender || null),
      dateOfBirth: new FormControl(data?.dateOfBirth || null),
      nationality: new FormControl(data?.nationality || null),
      idCardNumber: new FormControl(data?.idCardNumber || null),
      maritalStatus: new FormControl(data?.maritalStatus || null),
      idAddress: new FormControl(data?.idAddress || null),
      district: new FormControl(data?.district || null),
      subDistrict: new FormControl(data?.subDistrict || null),
      province: new FormControl(data?.province || null),
      postalCode: new FormControl(data?.postalCode || null),
      sameAsIdAddress: new FormControl(data?.sameAsIdAddress || null),
      currentAddress: new FormControl(data?.currentAddress || null),
      currentDistrict: new FormControl(data?.currentDistrict || null),
      currentSubDistrict: new FormControl(data?.currentSubDistrict || null),
      currentProvince: new FormControl(data?.currentProvince || null),
      currentPostalCode: new FormControl(data?.currentPostalCode || null),
      emergencyContactName: new FormControl(data?.emergencyContactName || null),
      relationship: new FormControl(data?.relationship || null),
      emergencyContactAddress: new FormControl(data?.emergencyContactAddress || null),
      emergencyContactPhoneNumber: new FormControl(data?.emergencyContactPhoneNumber || null),
      bankName: new FormControl(data?.bankName || null),
      bankAccountNumber: new FormControl(data?.bankAccountNumber || null),
      bankHolderName: new FormControl(data?.bankHolderName || null),
      bloodGroup: new FormControl(data?.bloodGroup || null),
      allergies: new FormControl(data?.allergies || null),
      allergiesDescription: new FormControl(data?.allergiesDescription || null),
      disabilities: new FormControl(data?.disabilities || null),
      disabilitiesDescription: new FormControl(data?.disabilitiesDescription || null),
      congenitalDiseases: new FormControl(data?.congenitalDiseases || null),
      congenitalDiseasesDescription: new FormControl(data?.congenitalDiseasesDescription || null),
      vaccinationsStatus: new FormControl(data?.vaccinationsStatus || null),
      profileImage: new FormControl(data?.profileImage || null),
    });
    if(data) {
     if(data.sameAsIdAddress === true) {
      this.disableCurrentAddress();
     }
     if(data.allergies === 'Yes') {
      this.isAllergies = true;
     }
     if(data.disabilities === 'Yes') {
      this.isDisabilities = true;
     }
     if(data.congenitalDiseases === 'Yes') {
      this.isCongenitalDiseases = true;
     }
    }
  }
  getCountry() {
    this.dataService.getCountry().subscribe((res: any) => {
      console.log("res", res);
      this.nationalityList = res.data;
    });
  }
  onAllergiesChange(event: any) {
    console.log("event", event);
    if(event.value === 'Yes') {
      this.isAllergies = true;
    } else {
      this.isAllergies = false;
    }
  }
  onDisabilitiesChange(event: any) {
    console.log("event", event);
    if(event.value === 'Yes') {
      this.isDisabilities = true;
    } else {
      this.isDisabilities = false;
    }
  }
  onCongenitalDiseasesChange(event: any) {
    console.log("event", event);
    if(event.value === 'Yes') {
      this.isCongenitalDiseases = true;
    } else {
      this.isCongenitalDiseases = false;
    }
  }
  deleteImage() {
    // this.imageUrl = null;
    // this.imageFile = null;
  }
  cancelUpdate() {
    this.router.navigate([routes.employee_list]);
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const userId = this.employeeData.uid; // Get current user's UID
      const filePath = `profile-images/${userId}/${file.name}`; // Save under user's UID folder
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      console.log("filepath", filePath);
      console.log("fileRef", fileRef);
      console.log("task", task);
      task.percentageChanges().subscribe(progress => {
        console.log('Upload Progress:', progress);
      });
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.imageUrl = url;
            console.log("imageUrl", this.imageUrl);
            // Save URL to display the image
            this.saveImageUrlToDatabase(url); // Save URL to Firestore
          });
        })
      ).subscribe();
    }
  }

  saveImageUrlToDatabase(url: string): void {
    const userId = this.employeeData.uid;
    const data = { profileImage: url, updatedAt: new Date() };
    this.firestore.collection('users').doc(userId).set(data, { merge: true })
      .then(() => console.log('Image URL saved to Firestore'))
      .catch(error => console.error('Error saving image URL to Firestore', error));
  }

  updateEmployee() {

    if (this.addEmployeeForm.value.dateOfBirth) {
      const dateOfBirth = new Date(this.addEmployeeForm.value.dateOfBirth);
      this.addEmployeeForm.patchValue({
          dateOfBirth: dateOfBirth.toISOString()
      });
    }
    this.addEmployeeForm.get('profileImage')?.setValue(this.imageUrl);

      this.employeeService.updateEmployeeData(this.employeeData.uid, this.addEmployeeForm.getRawValue()).subscribe((res: any) => {
        console.log("res", res);
        if(res.success){
          this.router.navigate([routes.employee_list]);
        }
      })
  }
  disableCurrentAddress() {
    this.addEmployeeForm.get('currentAddress')?.disable();
    this.addEmployeeForm.get('currentDistrict')?.disable();
    this.addEmployeeForm.get('currentSubDistrict')?.disable();
    this.addEmployeeForm.get('currentProvince')?.disable();
    this.addEmployeeForm.get('currentPostalCode')?.disable();
  }
  onFileSelectedFiles(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      const currentDate = new Date().toLocaleDateString(); // Format as per locale
      for (let i = 0; i < files.length; i++) {
        this.uploadedDocuments.push({
          name: files[i].name,
          dateUploaded: currentDate,
        });
      }
    }
  }
  downloadDocument(document: any): void {
    // Simulate the download process; you may replace this with actual file data
    const blob = new Blob(["This is a placeholder for the file content"], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = document.name; // Use the document name for the downloaded file
    anchor.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
  }


  removeDocument(index: number): void {
    this.uploadedDocuments.splice(index, 1); // Remove the document at the specified index
  }

}