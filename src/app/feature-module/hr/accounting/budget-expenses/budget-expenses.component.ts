import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from '@angular/material/table';
import { DataService, apiResultFormat, getBudgets, routes } from 'src/app/core/core.index';
import { Router } from '@angular/router';
import { ExpenseDataService } from 'src/app/core/services/expense-data/expense-data.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BudgetExpensesAddModalComponent } from '../budget-expenses-add-modal/budget-expenses-add-modal.component';
import { TransactionHistoryComponent } from '../transaction-history/transaction-history.component';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { UserConfigService } from 'src/app/core/services/user-config/user-config.service';
import { FirebaseMessagingService } from 'src/app/core/services/firebase-messaging/firebase-messaging.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-budget-expenses',
  templateUrl: './budget-expenses.component.html',
  styleUrls: ['./budget-expenses.component.scss']
})
export class BudgetExpensesComponent implements OnInit {
  lstRevenue: any[] = [];
  public searchDataValue = '';
  public addRevenueForm!: FormGroup;
  public editRevenueForm!: FormGroup;
  dataSource!: MatTableDataSource<getBudgets>;
  public routes = routes;

  // pagination variables
  public lastIndex = 0;
  public expenseList: any[] = [];
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;
  verifyId: any;
  //** / pagination variables

  constructor(private firestore: AngularFirestore, private http: HttpClient,private firebaseMessagingService: FirebaseMessagingService,private notificationService: NotificationService,private configService: UserConfigService,private dataService: DataService,private formBuilder: FormBuilder,private router: Router, private modalService: NgbModal, private expenseDataService: ExpenseDataService) { }

  ngOnInit(): void {
    this.getTableData()


  }
  openAddModal() {
    // Fetch the last increment number
    
      // Open the modal and pass the last increment number
      const modalRef = this.modalService.open(BudgetExpensesAddModalComponent, { size: 'lg', centered: true });
      
      // Handle the modal result
      modalRef.result
        .then((result: any) => {
          console.log("result", result);
          if (result?.data) {
            // Increment the slip number and save it
            const newNumber = result.data.lastNumber + 1;
  
            this.expenseDataService.updateLastExpenseSlipNo(newNumber).subscribe(() => {
              // Save the expense data
              this.expenseDataService.saveExpenseData(result.data.uid, result.data).subscribe((response: any) => {
                if (response.success) {
                  console.log('Expense saved successfully:', response);
  
                  // Refresh the table or data
                  this.getTableData();
                }
              });
            });
          }
        })
        .catch(() => {
          console.log('Modal dismissed');
        });
   
  }
  
  openAddModalwww() {
    
    this.expenseDataService.getLastExpenseSlipNo().subscribe((lastNumber: number) => {
    
      const modalRef = this.modalService.open(BudgetExpensesAddModalComponent, { size: 'lg', centered: true });
      modalRef.componentInstance.lastNumber = lastNumber; // Pass data to the modal
  
      modalRef.result.then((result: any) => {
        if (result.data) {
          
          const newNumber = lastNumber + 1;
          this.expenseDataService.updateLastExpenseSlipNo(newNumber).subscribe(() => {
            
            this.expenseDataService.saveExpenseData(result.data.uid, result.data).subscribe((response: any) => {
              if (response.success) {
                console.log('Expense saved successfully:', response);
                this.getTableData();
              }
            });
          });
        }
      });
    });
  }
  

  openAddModal1() {
    const modalRef = this.modalService.open(BudgetExpensesAddModalComponent, { size: 'lg', centered: true })

    modalRef.result.then((result: any) => {
      console.log("result", result);
      if (result.data) {
        let veriId = ''
        const verifierId = result.data.company.id;
        console.log("verifierId", verifierId);
        this.configService.getConfigurationList().subscribe((res: any) => {
          console.log("company", res);
          veriId = res.data[0].verifier
          this.verifyId = veriId
          

        });
        console.log("veriId", veriId);
        this.expenseDataService.saveExpenseData(result.data.uid, result.data).subscribe((res: any) => {

          if (res.success) {
            console.log("res", res);
            
            const newRequest = {
              uid: result.data.uid,
              company: result.data.company,
              companyName: result.data.companyName,
              location: result.data.location,
              locationName: result.data.locationName,
              currentStep: 1,
              status: "in_progress",
              approvers: [
                { step: 1, approverId: result.data.approver_one, approverName: result.data.approver_oneName, status: "pending" },
                { step: 2, approverId: result.data.approver_two, approverName: result.data.approver_twoName, status: "pending" },
                { step: 3, approverId: result.data.approver_three, approverName: result.data.approver_threeName, status: "pending" }
              ],
              verifier: result.data.verifier,
              verifierName: result.data.verifierName,
              data: {
                branch: result.data.branch,
                branchName: result.data.branchName,
                expenseDetails: result.data.expenseDetails
              }
            };
            this.expenseDataService.approveExpense(result.data.uid, newRequest).subscribe((res: any) => { 
              console.log("res", res);
             // this.sendNotification(result.data.verifier, "You have a new verification request", result.data.uid);
            });
           
            
            this.getTableData();
          }
        })

      }
    })
  }

  // sendNotification(userId: string, message: string, requestId: string): void {
  //   // Get user FCM token from Firestore
  //   this.firestore.collection("users").doc(userId).get().subscribe((doc) => {
  //     const userToken = doc.data()?.fcmToken; // Assuming fcmToken is stored for each user

  //     if (userToken) {
  //       const payload = {
  //         notification: {
  //           title: "Approval Request",
  //           body: message
  //         },
  //         data: {
  //           requestId: requestId
  //         },
  //         to: userToken
  //       };

  //       const headers = {
  //         Authorization: `key=${YOUR_SERVER_KEY}` // Replace with your FCM Server Key
  //       };

  //       // Send the notification
  //       this.http.post("https://fcm.googleapis.com/fcm/send", payload, { headers })
  //         .subscribe(response => {
  //           console.log("Notification sent successfully:", response);
  //         }, error => {
  //           console.error("Error sending notification:", error);
  //         });
  //     }
  //   });
  // }
  // sendNotificationToNextApprover(stepIndex: number, expenseData: any) {
  //   if (stepIndex >= approvalWorkflow.length) return;
  
  //   const currentStep = approvalWorkflow[stepIndex];
  //   const message = {
  //     title: 'Expense Request',
  //     body: `Please ${currentStep.role === 'verifier' ? 'verify' : 'approve'} the expense request for ${expenseData.amount}`,
  //   };
  
  //   this.firebaseMessagingService.getPermission().subscribe((token: any) => {
  //     this.firebaseMessagingService.sendNotification(token, message);
  //     this.notificationService.sendNotification({ ...message, data: expenseData }, currentStep.id);
  //   });
  // }

  sendNotificationToVerifier(token: string, expense: any) {
    const message = {
      title: 'Expense Request',
      body: `Please verify the expense request for ${expense.amount}`,
    };

    this.firebaseMessagingService.sendNotification(token, message);
  }

  sendNotificationToApprover(approverId: string, token: string, expense: any) {
    const message = {
      title: 'Expense Request Approval',
      body: `Please approve the expense request for ${expense.amount}`,
    };

    this.firebaseMessagingService.sendNotification(token, message);
  }

  private getTableData(): void {
    this.expenseList = [];
    this.serialNumberArray = [];

    this.expenseDataService.getExpenseList().subscribe((res: any) => {

      if (res) {
        // Check if any expense has approved status
        const hasApprovedExpense = res.data.some((expense: any) => expense.status === 'approved');
        if (hasApprovedExpense) {
          console.log('At least one expense is approved');
          this.expenseList = res.data
          console.log("this.expenseList", this.expenseList);
          this.totalData = res.data.length
          this.calculateTotalPages(this.totalData, this.pageSize);
          this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);
        }
        else {
          console.log('No approved expense found');
        }

      }

    })


  }

  public sortData(sort: Sort) {
    const data = this.expenseList.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.expenseList = data;
    } else {
      this.expenseList = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.expenseList = this.dataSource.filteredData;
  }

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getTableData();
  }

  public changePageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 !== 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
}
export interface pageSelection {
  skip: number;
  limit: number;
}
