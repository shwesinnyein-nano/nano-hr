import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { apiResultFormat, getTransactionHistory } from 'src/app/core/services/interface/models';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, routes } from 'src/app/core/core.index';
import { getBudgets } from 'src/app/core/services/interface/models';
import { Sort } from '@angular/material/sort';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpenseDataService } from 'src/app/core/services/expense-data/expense-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApprovalExpenseComponent } from '../approval-expense/approval-expense.component';
import { UserRoleService } from 'src/app/core/services/user-role/user-role.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BudgetExpensesAddModalComponent } from '../budget-expenses-add-modal/budget-expenses-add-modal.component';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { v4 as uuidv4 } from 'uuid';
import { LanguagesService } from 'src/app/core/services/languages/languages.service';
import { notoSansThaiBase64 } from 'src/assets/fonts/thai-font';
@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent implements OnInit {

  dataSource!: MatTableDataSource<getTransactionHistory>;
  public routes = routes;

  // pagination variables
  public lastIndex = 0;
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
  public searchName: string = '';
  public searchCompany: string = '';
  public requestDate: string = '';
  public dueDate: string = '';
  dataArray: Array<getTransactionHistory> = [];
  currentUser: any;
  userList: any;
  userRole: any;
  configurationData: any;
  searchStatus: string = '';
  statusValue: any = {
    requested: 'Requested',
    verified: 'Verified',
    first_approved: 'First Approved',

    second_approved: 'Second Approved',
    approved: 'Approved',

    rejected: 'Rejected'

  }
  
  requestBy: any;
  currentLang!: string;
  private langSubscription!: Subscription;
  public lstTransactionHistory: Array<getTransactionHistory> = [];
  constructor(private languagesService: LanguagesService,private notificationService: NotificationService    ,private fb: FormBuilder, private userRoleService: UserRoleService, private authService: AuthService, private data: DataService, private expenseDataService: ExpenseDataService, private modalService: NgbModal) { }

  async ngOnInit(): Promise<void> {


    this.currentLang = this.languagesService.getSelectedLanguage();

    // Listen for changes in language
    this.langSubscription = this.languagesService.languageChanged.subscribe(() => {
      this.currentLang = this.languagesService.getSelectedLanguage();
    });
    console.log("currentLang", this.currentLang);
    this.currentUser = await this.authService.getCurrentUserId();
    // console.log("currentUser", this.currentUser);
    this.userList = await this.authService.getUserData(this.currentUser);
    this.configurationData = await this.authService.getConfigurationData(this.userList.company, this.userList.location, this.userList.branch);
  
    this.getTableData();
  }

  ngOnDestroy(): void {
    // Clean up the subscription to prevent memory leaks
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }


  private getTableData(): void {
    this.lstTransactionHistory = [];
    this.serialNumberArray = [];
    this.dataArray = [];
    this.expenseDataService.getExpenseList().subscribe((res: any) => {
    
      if (res) {

        // Check if any expense has approved status
        if (this.userList) {
           this.userRole = this.userList.role;
          const userName = this.userList.firstName + ' ' + this.userList.lastName;
         
          const userRequestedExpenses = res.data.filter((expense: any) =>
            expense.createdBy === this.userList.uid
            //  &&
            //   expense.status === 'requested'
          );

          this.lstTransactionHistory = [...userRequestedExpenses];
          
          if (this.userRole === 'verifier' && this.configurationData?.length > 0 && this.userList.uid === this.configurationData[0].verifier) {
            this.lstTransactionHistory = res.data.filter((expense: any) =>
              expense.status === 'requested' || expense.status === 'verified' || expense.status === 'first_approved' || expense.status === 'second_approved' || expense.status === 'approved' &&
              expense.verifier === this.userList.uid
            );
           
            this.totalData = this.lstTransactionHistory.length;
            // this.calculateTotalPages(this.totalData, this.pageSize);
            // this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);
          }
          // Check if user is approver_one and matches configuration
          else if (this.userRole === 'approver' && this.configurationData?.length > 0 && this.userList.uid === this.configurationData[0].approver_one) {
            this.lstTransactionHistory = res.data.filter((expense: any) =>
              expense.status === "verified" || expense.status === 'first_approved' || expense.status === 'second_approved' || expense.status === 'approved' &&
              expense.approver_one === this.userList.uid
            );
           
            this.totalData = this.lstTransactionHistory.length;
            // this.calculateTotalPages(this.totalData, this.pageSize);
            // this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);
          }
          // Check if user is approver_two and matches configuration  
          else if (this.userRole === 'approver' && this.configurationData?.length > 0 && this.userList.uid === this.configurationData[0].approver_two) {
            this.lstTransactionHistory = res.data.filter((expense: any) =>
              expense.status === 'first_approved' || expense.status === 'second_approved' || expense.status === 'approved' &&
              expense.approver_two === this.userList.uid
            );
            // console.log("Filtered transaction history for approver two:", this.lstTransactionHistory);
            this.totalData = this.lstTransactionHistory.length;
            // this.calculateTotalPages(this.totalData, this.pageSize);
            // this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);
          }
          // Check if user is approver_three and matches configuration
          else if (this.userRole === 'approver' && this.configurationData?.length > 0 && this.userList.uid === this.configurationData[0].approver_three) {
            this.lstTransactionHistory = res.data.filter((expense: any) =>
              (expense.status === 'approved' || expense.status === 'second_approved') &&
              expense.approver_three === this.userList.uid
            );
            console.log("Filtered transaction history for approver three:", this.lstTransactionHistory);

            // this.totalData = this.lstTransactionHistory.length;
            // this.calculateTotalPages(this.totalData, this.pageSize);
            // this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);
          }
          this.totalData = this.lstTransactionHistory.length
          const array = this.lstTransactionHistory
          array.map((res: getTransactionHistory, index: number) => {
            const serialNumber = index + 1;
            if (index >= this.skip && serialNumber <= this.limit) {
              res.id = serialNumber;
             
               this.dataArray.push(res);
              this.serialNumberArray.push(serialNumber);
            }
          });
          this.calculateTotalPages(this.totalData, this.pageSize);
         
        }
      }
    })


  }
  isPastDue(dueDate: string | Date): string {
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);
  
    // Compare dates (ignore time part by setting time to 00:00:00)
    currentDate.setHours(0, 0, 0, 0);  // Set today's time to midnight
    dueDateObj.setHours(0, 0, 0, 0);   // Set due date time to midnight
  
    if (dueDateObj < currentDate) {
      return 'past-due'; // Red color for past due
    } else if (dueDateObj.getTime() === currentDate.getTime()) {
      return 'due-today'; // Yellow color for due today
    } else {
      return ''; // No color if neither condition is met
    }
  }
  
  isPastDuea(dueDate: string | Date): boolean {
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);
    
    // Compare dates (ignore time part by setting time to 00:00:00)
    currentDate.setHours(0, 0, 0, 0);  // Set today's time to midnight
    dueDateObj.setHours(0, 0, 0, 0);   // Set due date time to midnight

    return dueDateObj < currentDate; // If due date is less than today, return true
  }

  openAddBudgetExpense() {
   
    const modalRef = this.modalService.open(BudgetExpensesAddModalComponent, { size: 'lg', centered: true });

    // Handle the modal result
    modalRef.result
      .then((result: any) => {
       
        if (result?.data) {

         
          const newNumber = result.data.lastNumber + 1;

          this.expenseDataService.updateLastExpenseSlipNo(newNumber).subscribe(() => {
            
            this.expenseDataService.saveExpenseData(result.data.uid, result.data).subscribe((response: any) => {
              if (response.success) {
               
                const notiBody = {
                  notiId: uuidv4(),
                  title: 'Expense ',
                  message: 'has been requested by '+ this.userList.firstName + ' ' + this.userList.lastName + '. Please verify it.',
                  type: 'expense',
                  data: result.data,
                  sender: this.userList.uid,
                  receiver: result.data.verifier,
                  status: 'requested',
                  requestBy: result.data.createdBy,
                  requestByName: result.data.createdByName,
                }
                this.notificationService.sendNotification(notiBody);
                this.getTableData();
              }
            });
          });
        }
      })
      .catch(() => {
      
      });
  }


  downloadExpense(data: any) {
    console.log("lang", this.currentLang);
    if (data) {
     

      this.userRoleService.getUsers().subscribe((res: any) => {
       
        if (res) {
          if (data.createdBy) {
            this.requestBy = res.data.filter((user: any) => user.uid === data.createdBy);
           
            data.positionName = this.requestBy[0].positionName;
            data.name = this.requestBy[0].firstName + " " + this.requestBy[0].lastName;


          }
          if (data.verifier) {

            const verifier = res.data.filter((user: any) => user.uid === data.verifier);
           
            data.verifierName = verifier[0].firstName + " " + verifier[0].lastName;

          }
          if (data.approver_one) {
            const approver_one = res.data.filter((user: any) => user.uid === data.approver_one);
           
            data.approver_oneName = approver_one[0].firstName + " " + approver_one[0].lastName;

          }
          if (data.approver_two) {
            const approver_two = res.data.filter((user: any) => user.uid === data.approver_two);
           
            data.approver_twoName = approver_two[0].firstName + " " + approver_two[0].lastName;

          }
          if (data.approver_three) {
            const approver_three = res.data.filter((user: any) => user.uid === data.approver_three);
           
            data.approver_threeName = approver_three[0].firstName + " " + approver_three[0].lastName;
          }
         
          this.generatePDF(data);



        }
      });

    }


  }
  formatCurrency(amount: number, currency: string) {
    if (amount === undefined || amount === null) return 'N/A';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'baht' ? 'THB' : 'USD',
      minimumFractionDigits: 0,
    });
    return formatter.format(amount);
  };
  generatePDF(data?: any,) {
    console.log("change language")
   
    if (!data) {
     
      return;
    }

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const lineWidth = pageWidth - 2 * margin;
    pdf.addFileToVFS('NotoSansThai-Regular.ttf', notoSansThaiBase64);
    pdf.addFont('NotoSansThai-Regular.ttf', 'NotoSansThai', 'normal');
    pdf.setFont('NotoSansThai');

    const tableContent = [
      [this.currentLang === 'EN' ? 'Expense Type' : 'ประเภทค่าใช้จ่าย', data?.expense_type || 'N/A'],
      // [this.currentLang === 'EN' ? 'Expense Source' : 'แหล่งที่มาของค่าใช้จ่าย', data?.expense_source || 'N/A'],
      [this.currentLang === 'EN' ? 'Creditor Name' : 'ชื่อเจ้าหนี้', data?.creditor_name || 'N/A'],
      [this.currentLang === 'EN' ? 'Invoice Number' : 'เลขที่ใบแจ้งหนี้', data?.invoice_number || 'N/A'],
      [this.currentLang === 'EN' ? 'Total Amount' : 'จำนวนเงินรวม', this.formatCurrency(data?.expense_amount, data?.expense_currency) || 'N/A'],
      // ['Total Amount', data?.expense_amount ? `${data.expense_currency === 'baht' ? '฿' : '$'}${data.expense_amount.toLocaleString()}` : 'N/A'],
      [this.currentLang === 'EN' ? 'Currency' : 'สกุลเงิน', data?.expense_currency || 'N/A'],
      [this.currentLang === 'EN' ? 'Notes' : 'หมายเหตุ', data?.expense_notes || 'N/A']
    ];

    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A'; // Handle empty dates
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).format(date);
    };

    // Convert image to Base64
    const convertToBase64 = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Failed to get canvas context');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => reject('Failed to load image');
        img.src = url;
      });
    };
    const statusColors: { [key: string]: [number, number, number] } = {
      approved: [0, 128, 0], // Green
      rejected: [255, 0, 0], // Red
      verified: [255, 165, 0], // Orange
      first_approved: [128, 2, 162], // Blue
      second_approved: [77, 106, 109], // Blue
      requested: [0, 123, 255], // Blue
    };


    // Set the text content
    pdf.setFontSize(10);
    const now = new Date();

    // Format the date as '10 Dec 2024'
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(now);
    
    // Format the time as 'HH:mm:ss'
    const formattedTime = now.toLocaleTimeString('en-GB', { hour12: false });
    
    // Combine date and time
    const printedDate = `${formattedDate} ${formattedTime}`;
    const fullText = `${this.currentLang === 'EN' ? 'Date' : 'วันที่'} : ${printedDate}`;
    
    // Calculate the X-coordinate for right alignment
    const textWidth = pdf.getTextWidth(fullText);
    const xPosition = pageWidth - 10 - textWidth; // 10px margin from the right
   
  
   
    pdf.text(fullText, xPosition, 5);
    convertToBase64('../../../../../assets/images/nano-store-light.png')
      .then((base64) => {
        pdf.addImage(base64, 'PNG', 75, 0, 70, 50);

        // Add Title and Text
        pdf.setFontSize(17);
        const text = this.currentLang === 'EN' ? 'Expense Transaction' : 'ธุรกรรมรายจ่าย';
        const pageWidth = pdf.internal.pageSize.getWidth();
        const textWidth = pdf.getTextWidth(text);

        // Calculate the position for centering
        const xPosition = (pageWidth - textWidth) / 2;
        const yPosition = 60; 
        pdf.text(text, xPosition, yPosition);// Vertical position
        // pdf.text(this.currentLang === 'EN' ? 'Expense Transaction' : 'ธุรกรรมรายจ่าย', 75, 60);

        pdf.setFontSize(12);
        pdf.text(`${this.currentLang === 'EN' ? 'Company' : 'บริษัท'} : ${data.companyName || 'N/A'}`, margin, 80);
        pdf.text(`${this.currentLang === 'EN' ? 'Location' : 'สถานที่'} : ${data.locationName || 'N/A'}`, margin, 87);
        pdf.text(`${this.currentLang === 'EN' ? 'Branch' : 'สาขา'} : ${data.branchName || 'N/A'}`, margin, 94);

        const rightTextWidth = pdf.getTextWidth(`${this.currentLang === 'EN' ? 'Expense Slip No' : 'เลขที่ใบรายจ่าย'} : ${data.expense_slip_no || 'N/A'}`);
        pdf.text(`${this.currentLang === 'EN' ? 'Invoice Number' : 'เลขที่ใบแจ้งหนี้'} : ${data.expense_slip_no || 'N/A'}`, pageWidth - margin - rightTextWidth, 80);
        pdf.text(`${this.currentLang === 'EN' ? 'Request Date' : 'วันที่ทำการขอ'} : ${formatDate(data.expense_date) || 'N/A'}`, pageWidth - margin - rightTextWidth, 87);
        pdf.text(`${this.currentLang === 'EN' ? 'Due Date' : 'วันครบกำหนดชำระ'} : ${formatDate(data.due_date) || 'N/A'}`, pageWidth - margin - rightTextWidth, 94);

        // Line
        pdf.line(margin, 100, pageWidth - margin, 100);
        pdf.text(`${this.currentLang === 'EN' ? 'Requested By' : 'ทำการขอโดย'} : ${data.name || 'N/A'}`, 10, 110);
        pdf.text(`${this.currentLang === 'EN' ? 'Position' : 'ตำแหน่ง'} : ${data.positionName || 'N/A'}`, 10, 117);

        // pdf.text(`Status: ${this.statusValue[data.status == 'approved' ? statusColors[data.status] : data.status] || 'N/A'}`, pageWidth - margin - rightTextWidth, 110);

        const statusKey = data.status?.toLowerCase() || 'unknown'; // Convert to lowercase for matching
        const statusText = this.statusValue[statusKey] || 'Unknown';
        
        // Get the color for the status
        const textColor = statusColors[statusKey] || [0, 0, 0]; // Default to black if no match
        
        // Set the text for "Status:"
        pdf.setTextColor(0, 0, 0); // Black for "Status:"
        pdf.text(`${this.currentLang === 'EN' ? 'Status' : 'สถานะ'} :`, pageWidth - margin - rightTextWidth, 110); // X=10, Y=100 (adjust as necessary)
        
        // Set the text for the actual status (e.g., Approved)
        pdf.setTextColor(...textColor); // Set color based on the status
        const statusX = pageWidth - margin - rightTextWidth + pdf.getTextWidth('Status: ') + 2; // Position after "Status: "
        pdf.text(statusText, statusX, 110); // X=calculated position, Y=100 (same line)
        
        // Reset the text color for subsequent text
        pdf.setTextColor(0, 0, 0);

        autoTable(pdf, {
          startY: 130,
          theme: 'grid',
          body: tableContent,
          tableWidth: lineWidth,
          margin: { left: 10 },
          columnStyles: {
            0: { cellWidth: 59, halign: 'left' },
            1: { cellWidth: lineWidth - 59, halign: 'right' }
          },
          styles: {
            font: 'NotoSansThai',
            fontSize: 10,
            lineColor: [50, 50, 50],
            lineWidth: 0.3,
            // fillColor: [245, 245, 245],
            textColor: [0, 0, 0]
          }
        });

        pdf.line(10, 130, pageWidth - margin, 130);


        pdf.setFontSize(10);

        // Page Height
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Footer Content
        const footerY = pageHeight - 30;
       
       
       
        pdf.text(`${this.currentLang === 'EN' ? 'Verified By' : 'ตรวจสอบแล้วโดย'} : ${data.verifiedDate ? data.verifierName : ''}`, 10, footerY);
       
        // pdf.text(data.verifiedDate ?(data.verifierName ? data.verifierName : '') : '', 35, footerY); 
        pdf.text(this.currentLang === 'EN' ? "Date : " : "วันที่ : ", 10, footerY + 5);
        pdf.text(data.verifiedDate ? formatDate(data.verifiedDate) : '', 20, footerY + 5);


        
        pdf.text(`${this.currentLang === 'EN' ? 'First Approved By' : 'อนุมัติครั้งแรกโดย'} : ${data.firstApprovedDate ? data.approver_oneName : ''} `, pageWidth - 80, footerY);
        // pdf.setFont('helvetica', 'normal');
        // pdf.text(data.firstApprovedDate ? (data.approver_oneName ? data.approver_oneName : '') : '', pageWidth - 40, footerY);
        pdf.text(this.currentLang === 'EN' ? "Date : " : "วันที่ : ",  pageWidth - 80, footerY + 5);
        pdf.text( data.firstApprovedDate ? formatDate(data.firstApprovedDate) : '', pageWidth -70, footerY + 5);


        
        pdf.text(`${this.currentLang === 'EN' ? 'Second Approved By' : 'อนุมัติครั้งที่สองโดย'} : ${data.secondApprovedDate ? data.approver_twoName : ''} `, 10, footerY + 15);
        // pdf.setFont('helvetica', 'normal');
        // pdf.text( data.secondApprovedDate ? (data.approver_twoName ? data.approver_twoName : '') : '', 55, footerY + 15);
        pdf.text(this.currentLang === 'EN' ? "Date : " : "วันที่ : ",  10, footerY + 20);
        pdf.text(data.secondApprovedDate ? formatDate(data.secondApprovedDate) : '', 20, footerY + 20);



        
        pdf.text(`${this.currentLang === 'EN' ? 'Approved By' : 'อนุมัติโดย'} : ${data.approvedDate ? data.approver_threeName : ''} `, pageWidth - 80, footerY + 15);
        // pdf.setFont('helvetica', 'normal');
        // pdf.text( data.approvedDate ? (data.approver_threeName ? data.approver_threeName : '') : '', pageWidth - 50, footerY + 15);
        
        pdf.text(this.currentLang === 'EN' ? "Date : " : "วันที่ : ", pageWidth - 80, footerY + 20);
        pdf.text(data.approvedDate ? formatDate(data.approvedDate) : '', pageWidth -70, footerY + 20);

        // Save the PDF
        pdf.save(`Expense_Transaction.pdf`);
      })
      .catch((error) => {
        console.error('Error loading image:', error);
      });
  }




  approveExpense(data?: any) {

    const modalRef = this.modalService.open(ApprovalExpenseComponent, { size: 'lg', centered: true })
    modalRef.componentInstance.data = data;
    modalRef.result.then((result: any) => {
    
            
      if (result.data) {
        this.expenseDataService.updateExpenseData(result.data.uid, result.data).subscribe((response: any) => {
          if (response.success) {
          
            // if(result.data.status === 'verified'){
            
            //   this.notificationService.getNotificationByUid(result.data.uid).subscribe(notifications => {
            //     // notifications.forEach(notification => {
                  
            //       const notiBody = {
            //         notiId: notifications[0].id,
            //         title: 'Expense',
            //         message: 'request has been verified by '+ this.userList.firstName + ' ' + this.userList.lastName + '. Please review it.',
            //         type: 'expense',
            //         data: result.data,
            //         sender: this.userList.uid,
            //         receiver: result.data.approver_one,
            //         status: 'verified',
            //         requestBy: result.data.createdBy,
            //         requestByName: result.data.createdByName,
            //         createdDate: result.data.createdDate,
            //       }
            //       this.notificationService.updateNotification(notiBody);
            //     // });
            //   });
              
            // }
            // else if(result.data.status === 'first_approved'){
              
            //   this.notificationService.getNotificationByUid(result.data.uid).subscribe(notifications => {
            //     // notifications.forEach(notification => {
                  
            //       const notiBody = {
            //         notiId: notifications[0].id,
            //         title: 'Expense ',
            //         message: 'request has been first approved by '+ this.userList.firstName + ' ' + this.userList.lastName + '. Please review it.',
            //         type: 'expense',
            //         data: result.data,
            //         sender: this.userList.uid,
            //         receiver: result.data.approver_two,
            //         status: 'first_approved',
            //         requestBy: result.data.createdBy,
            //         requestByName: result.data.createdByName,
            //         createdDate: result.data.createdDate,
            //       }
            //       this.notificationService.updateNotification(notiBody);
            //     // });
            //   });
            // }
            // else if(result.data.status === 'second_approved'){
              
            //   this.notificationService.getNotificationByUid(result.data.uid).subscribe(notifications => {
            //     // notifications.forEach(notification => {
                  
            //       const notiBody = {
            //         notiId: notifications[0].id,
            //         title: 'Expense ',
            //         message: 'request has been second approved by '+ this.userList.firstName + ' ' + this.userList.lastName + '. Please review it.',
            //         type: 'expense',
            //         data: result.data,
            //         sender: this.userList.uid,
            //         receiver: result.data.approver_three,
            //         status: 'second_approved',
            //         requestBy: result.data.createdBy,
            //         requestByName: result.data.createdByName,
            //       }
            //       this.notificationService.updateNotification(notiBody);
            //     // });
            //   });
            // }
            // else if(result.data.status === 'approved'){
             
            //   this.notificationService.getNotificationByUid(result.data.uid).subscribe(notifications => {
            //     // notifications.forEach(notification => {
            //       const notiBody = {
            //         notiId: notifications[0].id,
            //         title: 'Expense ',
            //         message: 'request has been approved by '+ this.userList.firstName + ' ' + this.userList.lastName + '. Please review it.',
            //         type: 'expense',
            //         data: result.data,
            //         sender: this.userList.uid,
            //         receiver: result.data.approver_three,
            //         status: 'approved',
            //         requestBy: result.data.createdBy,
            //         requestByName: result.data.createdByName,
            //         createdDate: result.data.createdDate,
            //       }
            //       this.notificationService.updateNotification(notiBody);
            //     // });
            //   });
            // }
            // Refresh the table or data
            // this.getTableData();
         

            const notificationSubscription = this.notificationService.getNotificationByUid(result.data.uid).subscribe(notifications => {
              const notification = notifications[0];
              const senderName = this.userList.firstName + ' ' + this.userList.lastName;
              let message = '';
              let receiver = '';
  
              if (result.data.status === 'verified') {
                message = `request has been verified by ${senderName}. Please review it.`;
                receiver = result.data.approver_one;
              } else if (result.data.status === 'first_approved') {
                message = `request has been first approved by ${senderName}. Please review it.`;
                receiver = result.data.approver_two;
              } else if (result.data.status === 'second_approved') {
                message = `request has been second approved by ${senderName}. Please review it.`;
                receiver = result.data.approver_three;
              } else if (result.data.status === 'approved') {
                message = `request has been approved by ${senderName}. Please review it.`;
                receiver = result.data.approver_three;
              }
  
              this.updateNotification(
                notification.id,
                'Expense',
                message,
                'expense',
                result.data,
                this.userList.uid,
                receiver,
                result.data.status,
                result.data.createdBy,
                result.data.createdByName,
                result.data.createdDate
              );
              notificationSubscription.unsubscribe();
            });
            this.getTableData();
          }
        });
      }
    })
  }
  updateNotification(notiId: string, title: string, message: string, type: string, data: any, sender: string, receiver: string, status: string, requestBy: string, requestByName: string, createdDate?: string) {
    console.log(`Updating notification: ${notiId}, Status: ${status}`); // Debugging log

    const notiBody = {
      notiId,
      title,
      message,
      type,
      data,
      sender,
      receiver,
      status,
      requestBy,
      requestByName,
      createdDate
    };
    this.notificationService.updateNotification(notiBody);
  }

  viewExpense(data: any) {
    console.log("data", data);
    const modalRef = this.modalService.open(ApprovalExpenseComponent, { size: 'lg', centered: true })
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.isView = true;
    modalRef.result.then((result: any) => {
      console.log("result", result);

    })
  }
  isOwnData(data: any) {
    return this.userList.uid === data.createdBy;
  }
  showAction() {
    let show = true
    if (this.dataArray.length > 0) {
      const ownData = this.dataArray.filter((expense: any) => expense.createdBy === this.userList.uid );
      if (ownData.length > 0) {
        show = false
      }
    }
    return show
  }

  openViewUserModal(user: getTransactionHistory) {
    
  }


  searchTransaction() {
    console.log("searchTransaction", this.currentUser);
    console.log("configurationData", this.configurationData);
    console.log("user list", this.userList);
    this.dataArray = [];
    this.serialNumberArray = [];
    this.expenseDataService.searchExpense(this.searchStatus, this.searchCompany, this.requestDate, this.dueDate).then((res: any) => {
     

      if (this.userRole === 'verifier' && this.configurationData?.length > 0 && this.userList.uid === this.configurationData[0].verifier) {

      }
      else if(this.userRole === 'approver' && this.configurationData?.length > 0 && this.userList.uid === this.configurationData[0].approver_one) {

      }
      else if(this.userRole === 'approver' && this.configurationData?.length > 0 && this.userList.uid === this.configurationData[0].approver_two) {

      }
      else if(this.userRole === 'approver' && this.configurationData?.length > 0 && this.userList.uid === this.configurationData[0].approver_three) {
        console.log("approver three", res);
        this.dataArray = res.filter((expense: any) => expense.status === 'approved');
        console.log("approver three", this.dataArray);
      }
      else {

      }
      
      // this.totalData = res.length
      // const array = res
      // array.map((res: getTransactionHistory, index: number) => {
      //   const serialNumber = index + 1;
      //   if (index >= this.skip && serialNumber <= this.limit) {
      //     res.id = serialNumber;
         
      //      this.dataArray.push(res);
      //     this.serialNumberArray.push(serialNumber);
      //   }
      // });
      // this.calculateTotalPages(this.totalData, this.pageSize);
     
    });
  }

  cancelSearch() {
   
    this.searchStatus = '';
    this.searchCompany = '';
    this.requestDate = '';
    this.dueDate = '';
    this.getTableData();
  }


  closeModal() {
    // this.ngbActiveModal.dismiss();
  }



 

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.dataArray = this.dataSource.filteredData;
  }
  public sortData(sort: Sort) {
    const data = this.dataArray.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.dataArray = data;
    } else {
      this.dataArray = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
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

