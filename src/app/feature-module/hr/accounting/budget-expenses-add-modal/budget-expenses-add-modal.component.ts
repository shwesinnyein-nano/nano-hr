import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { DataService } from 'src/app/core/services/data/data.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ExpenseDataService } from 'src/app/core/services/expense-data/expense-data.service';
import { ToastrService } from 'ngx-toastr';
import { UserRoleService } from 'src/app/core/services/user-role/user-role.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-budget-expenses-add-modal',

  templateUrl: './budget-expenses-add-modal.component.html',
  styleUrl: './budget-expenses-add-modal.component.scss'
})
export class BudgetExpensesAddModalComponent implements OnInit {
  @Input() lastNumber!: number;
  addRevenueForm!: FormGroup;
  bsConfig: any;
  uploadedDocuments: { name: string; dateUploaded: string, url: string }[] = [];
  previewUrl: string | ArrayBuffer | null = null;
  companyList: any[] = [];
  selectedCompany: any;
  currentUserID: any;
  selectedLocationList: any[] = [];
  selectedExpenseTypeList: any[] = [];
  isNanoStore: boolean = false;
  isNanoEntertainment: boolean = false;
  selectedBranchList: any[] = [];
  isNotVip: boolean = false;
  locationList: any[] = [];
  expenseSlipNo: string = '';
  autoIncrementNumber: number = 1;
  createdByName: string = '';

  branchList: any[] = [];
  constructor(private userRoleService: UserRoleService,private toastrService: ToastrService,private afAuth: AngularFireAuth,private authService:AuthService, private expenseDataService: ExpenseDataService, private dataService: DataService, private fb: FormBuilder, private ngbActiveModal: NgbActiveModal, private storage: AngularFireStorage, private firestore: AngularFirestore  ) {
    this.bsConfig = {
      dateInputFormat: 'YYYY-MM-DD', // Format of the date
      showWeekNumbers: false,       // Hide week numbers
      minDate: new Date()           // Disable dates before today
    };

  }

  ngOnInit(): void {

    this.loadForm();
    // this.getAutoIncrementNumber();
    this.fetchAllList();
    this.generateExpenseSlipNo();
    this.getCurrentUser();

  }
  getAutoIncrementNumber() {
    this.expenseDataService.getLastExpenseSlipNo().subscribe((lastNumber: number) => {
      this.lastNumber = Number(lastNumber);
      console.log("this.lastNumber", this.lastNumber);
    });
  }
  generateExpenseSlipNo(): void {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();

    const datePart = `${day}${month}${year}`;
    this.expenseDataService.getLastExpenseSlipNo().subscribe((lastNumber: number) => {
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
     
  
     this.expenseSlipNo = `EXP-${datePart}${incrementPart}`;
     console.log("this.expenseSlipNo", this.expenseSlipNo);
    });
    // Check if lastNumber is a valid number
    
  }
  onLocationChange(event: any) {
    console.log("event", event);
  }
  onBranchChange(event: any) {
    console.log("event", event);
  }

  getCurrentUser() {
    this.afAuth.currentUser.then((currentUser) => {

      if (currentUser) {
        this.currentUserID = currentUser.uid;
        if(this.currentUserID){
          this.userRoleService.getUserByUid(this.currentUserID).subscribe((res: any) => {
            this.createdByName = res.firstName + ' ' + res.lastName;
            this.addRevenueForm.get('createdByName')?.setValue(this.createdByName);
          });
        }
      }
    });

  }
  fetchAllList() {
    this.dataService.fetchAllList().subscribe((res: any) => {
      this.companyList = res.companyList.data;

      this.locationList = res.locationList.data;
      this.branchList = res.branchList.data;

    });
  }


  loadForm(data?: any) {
    this.addRevenueForm = this.fb.group({
      uid: new FormControl(data?.uid || uuidv4()),
      expense_slip_no: new FormControl(this.expenseSlipNo || null),
      createdBy: new FormControl(this.currentUserID || null),
      createdByName: new FormControl(this.createdByName || null),
      company: new FormControl(data?.company || null, Validators.required),
      companyName: new FormControl(data?.companyName || null),
      location: new FormControl(data?.location || null, Validators.required),
      locationName: new FormControl(data?.locationName || null),
      branch: new FormControl(data?.branch || null,),
      branchName: new FormControl(data?.branchName || null,),
      expense_type: new FormControl(data?.expense_type || null, Validators.required),
      // expense_source: new FormControl(data?.expense_source || null, Validators.required),
      creditor_name: new FormControl(data?.creditor_name || null, Validators.required),
      invoice_number: new FormControl(data?.invoice_number || null),
      expense_date: new FormControl(data?.expense_date || null, Validators.required),
      due_date: new FormControl(data?.due_date || null, [Validators.required, this.futureDateValidator]),

      expense_amount: new FormControl(data?.expense_amount || null, Validators.required),
      expense_currency: new FormControl(data?.expense_currency || null,),
      expense_notes: new FormControl(data?.expense_notes || null,),
      image: new FormControl(data?.image || null,),
      status: new FormControl(data?.status || null,),
      createdDate: [data ? data.createdDate ? data.createdDate : new Date().toISOString() : new Date().toISOString()],
      updatedDate: [new Date().toISOString()],
    });

    this.afAuth.currentUser.then((currentUser) => {

      if (currentUser) {
        this.currentUserID = currentUser.uid;
        console.log("this.currentUserID", this.currentUserID);
        this.addRevenueForm.get('createdBy')?.setValue(this.currentUserID);
      }
    });

  }



  onCompanyChange(event: any) {
    console.log(event.value);
    this.selectedCompany = event.value;
    if (this.selectedCompany == 'nano-vip') {
      this.isNotVip = false;

      this.firstVerifierListByCompany('nano-vip');
    }
    else if (this.selectedCompany == 'nano-store') {
      this.isNotVip = true;

      this.firstVerifierListByCompany('nano-store');
    }
    else {
      this.isNotVip = true;
      this.firstVerifierListByCompany('nano-entertainment');
    }
    this.addRevenueForm.get('companyName')?.setValue(this.companyList.find((company: any) => company.id == this.selectedCompany)?.name);
  }
  firstVerifierListByCompany(company?: string) {
    console.log("company", company);
    this.selectedLocationList = [];
    this.locationList.filter((location: any) => location.parentId == company).forEach((location: any) => {
      this.selectedLocationList.push(location);
    });
    console.log("this.selectedLocationList", this.locationList);
  }
  onModelChangeLocation(event: any) {
    console.log("event.value", event.value);
    this.selectedBranchList = [];
    console.log("this.branchList", this.branchList);
    this.branchList.filter((branch: any) => branch.parentId == event.value).forEach((branch: any) => {
      this.selectedBranchList.push(branch);
    });
    console.log("this.selectedBranchList", this.selectedBranchList);
    this.addRevenueForm.get('locationName')?.setValue(this.selectedLocationList.find((location: any) => location.id == event.value)?.name);

  }

  onModelChangeBranch(event: any) {
    console.log("event.value", event.value);
    this.addRevenueForm.get('branchName')?.setValue(this.selectedBranchList.find((branch: any) => branch.id == event.value)?.name);
  }
  // onFileSelectedFiles11(event: Event): void {
  //   const files = (event.target as HTMLInputElement).files;

  //   if (files) {
  //     const currentDate = new Date().toLocaleDateString(); // Format as per locale
  //     for (let i = 0; i < files.length; i++) {
  //       this.uploadedDocuments.push({
  //         name: files[i].name,
  //         dateUploaded: currentDate,
  //       });
  //     }
  //   }
  // }
  // onFileSelectedFiles2(event: Event): void {
  //   const files = (event.target as HTMLInputElement).files;

  //   if (files && files.length > 0) {
  //     const currentDate = new Date().toLocaleDateString(); // Format as per locale
  //     for (let i = 0; i < files.length; i++) {
  //       this.uploadedDocuments.push({
  //         name: files[i].name,
  //         dateUploaded: currentDate,
  //       });
  //     }

  //     // Generate preview URL for the first file (you can handle multiple previews if needed)
  //     const file = files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         this.previewUrl = e.target.result; // Set the preview URL to the file's data URL
  //       };
  //       reader.readAsDataURL(file); // Read the file as a data URL
  //     }
  //   }
  // }


  futureDateValidator(control: FormControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for comparison
    if (selectedDate < today) {
      return { invalidDate: true };
    }
    return null;
  }

  closeModal() {
    this.ngbActiveModal.dismiss();
  }
  async onSubmitExpense() {
    console.log("this.addRevenueForm.value", this.addRevenueForm.value);
   
    if (this.addRevenueForm.value.expense_date) {
      const expenseDate = new Date(this.addRevenueForm.value.expense_date);
      this.addRevenueForm.patchValue({
        expense_date: expenseDate.toISOString(),
      });
    }
    if (this.addRevenueForm.value.due_date) {
      const dueDate = new Date(this.addRevenueForm.value.due_date);
      this.addRevenueForm.patchValue({
        due_date: dueDate.toISOString(),
      });
    }

    this.addRevenueForm.patchValue({
      status: 'requested',
    });

    this.addRevenueForm.get('image')?.setValue(this.previewUrl);

    if (this.addRevenueForm.valid) {
      const configurationData = await this.authService.getConfigurationData(this.addRevenueForm.value.company, this.addRevenueForm.value.location,this.addRevenueForm.value.branch);
      console.log("configurationData", configurationData);
      if(configurationData.length > 0){
      console.log('valid');
      this.ngbActiveModal.close({
        data: {
          ...this.addRevenueForm.value,
          company: this.selectedCompany,
          expense_slip_no: this.expenseSlipNo,
          lastNumber: this.lastNumber,
          verifier: configurationData.length > 0 ? configurationData[0].verifier : null,
          approver_one: configurationData.length > 0 ? configurationData[0].approver_one : null,
          approver_two: configurationData.length > 0 ? configurationData[0].approver_two : null,
          approver_three: configurationData.length > 0 ? configurationData[0].approver_three : null,
          documents: this.uploadedDocuments,
        },
      });
    }
    else{
      console.log("no configuration data");
      this.toastrService.error('No configuration data found');
    }
    } else {
      this.addRevenueForm.markAllAsTouched();
      console.log("this.uploadedDocuments", this.uploadedDocuments);
      console.log('invalid');
    }
  }

  // onFileSelectedFiles3(event: Event): void {
  //   const files = (event.target as HTMLInputElement).files;

  //   if (files) {
  //     console.log("files", files);
  //     const currentDate = new Date().toLocaleDateString(); // Format as per locale
  //     for (let i = 0; i < files.length; i++) {
  //       this.uploadedDocuments.push({
  //         name: files[i].name,
  //         dateUploaded: currentDate,
  //       });
  //     }
  //   }
  // }
  onFileSelectedFiles(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      const userId = this.currentUserID; // Get current user's UID
      const filePaths = []; // To store file paths for each uploaded file
      const uploadTasks = []; // To track the progress of all uploads
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `profile-images/${userId}/${file.name}`; // Save each file under user's UID folder
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
  
        filePaths.push(filePath); // Store file path
        uploadTasks.push(task); // Store upload task
  
        console.log("Uploading file:", filePath);
  
        task.percentageChanges().subscribe(progress => {
          console.log(`Upload Progress for ${file.name}:`, progress);
        });
  
        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url: any) => {
              console.log(`File URL for ${file.name}:`, url);
              // Save the file metadata to uploadedDocuments array
              this.uploadedDocuments.push({
                name: file.name,
                url: url,
                dateUploaded: new Date().toLocaleString(), // Store the current date and time as upload date
              });
              console.log("uploadedDocuments:", this.uploadedDocuments);
              
              // Optionally save the URL to Firestore as well
              this.saveFileUrlToDatabase(url, file.name);
            });
          })
        ).subscribe();
      }
  
      // Optionally, you can track the completion of all upload tasks
      Promise.all(uploadTasks.map(task => task)).then(() => {
        console.log('All files uploaded successfully');
      }).catch(error => {
        console.error('Error uploading files:', error);
      });
    }
  }
  
  saveFileUrlToDatabase(url: string, fileName: string): void {
    const userId = this.currentUserID;
    const data = {
      [`uploadedFiles.${fileName}`]: { url: url, uploadedAt: new Date() },
    };
  
    this.firestore.collection('users').doc(userId).set(data, { merge: true })
      .then(() => console.log(`${fileName} URL saved to Firestore`))
      .catch(error => console.error(`Error saving ${fileName} URL to Firestore`, error));
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
