import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRoleService } from 'src/app/core/services/user-role/user-role.service';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-approval-expense',
 
  templateUrl: './approval-expense.component.html',
  styleUrl: './approval-expense.component.scss'
})
export class ApprovalExpenseComponent implements OnInit{

  data: any;
  requestBy:any;
  companyList:any;
  isView:boolean = false;
  isVerify:boolean = false;
  isNotification:boolean = false;
  uploadedDocuments: any[] = [];

  constructor(private ngbActiveModal: NgbActiveModal, private userRoleService: UserRoleService, private route: Router, private storage: AngularFireStorage ) {
    
   }

  ngOnInit(): void {
  
    console.log("view .data", this.data);
   if(this.data){
    console.log('1v', this.data.documents);
    const documents = this.data?.documents || [];
    console.log('1', documents.length);

    if(this.data?.documents){
      console.log('2')
      this.uploadedDocuments = this.data.documents;
    }
    console.log("this.uploadedDocuments", this.uploadedDocuments);
    if(this.isVerify){
      this.data = this.data.data;
      console.log("this.data", this.data);
      this.isNotification = true;
    }

   
   }
  
   if(this.data.createdBy){
    this.getRequestBy(this.data.createdBy);
   }
  }
  getRequestBy(requestId:string){
  
    this.userRoleService.getUserByUid(requestId).subscribe((res:any)=>{
      if(res){
        this.requestBy = res;
      
      }
    });
  }

  downloadDocument(document: any): void {
    const fileUrl = document.url;  // Assuming the download URL is stored in the document object

    // Use refFromURL instead of ref
    const fileRef = this.storage.refFromURL(fileUrl);
    console.log("fileRef", fileRef);
    // Get the file download URL from Firebase Storage
    fileRef.getDownloadURL().toPromise().then(url => {
      // Use window.document to ensure you're accessing the correct document object
      const link = window.document.createElement('a');
      link.href = url;  // Set the download URL
      link.target = '_blank';  // Open the download in a new tab
      link.download = document.name;  // Set the file name (optional)

      // Programmatically click the link to download the file
      link.click();
    }).catch(error => {
      console.error("Error downloading file: ", error);
    });
  }
  downloadDocumentq(document: any): void {
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
  
  openTransaction(){
    this.route.navigate([routes.transactionHistory]).then(() => {
      this.ngbActiveModal.close(); // Close the modal/dialog
    });
  }
  rejectExpense(){
  
  }
 
  verifyExpense(){
    let newStatus = '';
    let verifiedDate =""
    let firstApprovedDate =""
    let secondApprovedDate =""
    let approvedDate =""
    
    // Determine new status based on current status
    switch(this.data.status) {
      case 'requested':
        newStatus = 'verified';
        verifiedDate = new Date().toISOString();
        break;
      case 'verified': 
        newStatus = 'first_approved';
        firstApprovedDate = new Date().toISOString();
        break;
      case 'first_approved':
        newStatus = 'second_approved';
        secondApprovedDate = new Date().toISOString();
        break;
      case 'second_approved':
        newStatus = 'approved';
        approvedDate = new Date().toISOString();
        break;
      default:
        newStatus = this.data.status;
    }

    // Update the data status
    this.data.status = newStatus;
    if(!this.data.verifiedDate){
      this.data.verifiedDate = verifiedDate;
    }
    if(!this.data.firstApprovedDate){
      this.data.firstApprovedDate = firstApprovedDate;
    }
    if(!this.data.secondApprovedDate){
      this.data.secondApprovedDate = secondApprovedDate;
    }
    if(!this.data.approvedDate){
      this.data.approvedDate = approvedDate;
    }
    this.ngbActiveModal.close({
      data: {
        ...this.data,
      },
    });
  

  }

  closeModal() {
    this.ngbActiveModal.dismiss();
  }

}
