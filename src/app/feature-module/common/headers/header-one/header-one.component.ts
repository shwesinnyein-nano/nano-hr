import { Component, OnInit, OnDestroy } from '@angular/core';

import { SideBarService } from 'src/app/core/services/side-bar/side-bar.service';
import { NavigationEnd, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { UserRoleService } from 'src/app/core/services/user-role/user-role.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeModalComponent } from 'src/app/feature-module/employee/employees/all-employee/employee-modal/employee-modal.component';
import { LanguagesService } from 'src/app/core/services/languages/languages.service';
import { FirebaseMessagingService } from 'src/app/core/services/firebase-messaging/firebase-messaging.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { ApprovalExpenseComponent } from 'src/app/feature-module/hr/accounting/approval-expense/approval-expense.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: ['./header-one.component.scss'],
})
export class HeaderOneComponent implements OnInit, OnDestroy {
  public base = '';
  public page = '';
  public routes = routes;
  public miniSidebar = false;
  public baricon = false;
  isDarkMode: boolean = false;
  displayName: string = '';
  userData: any;
  selectedLanguage: string = 'EN';
  notifications: any[] = [];
  notificationList: any[] = [];
   notificationSubscription!: Subscription;
   notificationCount: number = 0;
   profile:any;
  constructor(
    private sideBar: SideBarService,
    private router: Router,
    private userRoleService: UserRoleService,
    private authService: AuthService,
    private modalService: NgbModal,
    private _languageService: LanguagesService,
    private firebaseMessagingService: FirebaseMessagingService,
    private notificationService: NotificationService

  ) {
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res === 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
        if (
          this.base === 'components' ||
          this.page === 'tasks' ||
          this.page === 'email'
        ) {
          this.baricon = false;
          localStorage.setItem('baricon', 'false');
        } else {
          this.baricon = true;
          localStorage.setItem('baricon', 'true');
        }
      }
    });
    if (localStorage.getItem('baricon') == 'true') {
      this.baricon = true;
    } else {
      this.baricon = false;
    }
  }
  async ngOnInit(){
    this.isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    this.applyTheme();

    const userId = await this.authService.getCurrentUserId();
    if (userId) {
     
      this.userRoleService.getUserByUid(userId).subscribe((res: any) => {
       
        if(res){
          console.log("res", res);
          this.userData = res;
          if(res.profileImage){
            this.profile = res.profileImage;
          }
          const firstName = res.firstName ? res.firstName : '';
          const lastName = res.lastName ? res.lastName : '';
          this.displayName = firstName + ' ' + lastName;
        }
      });
    } else {
      console.error("User ID is null or undefined");
    }
    const langs = localStorage.getItem('kbzDefaultLanguage') || 'EN';
   
    this.changeLanguage(langs)
    this.getNotification(userId);

    // this.notificationSubscription = this.notificationService.notificationChanges.subscribe(() => {
    //   console.log('Notification changes detected');
    //   this.getNotification(userId);
    // });
    // this.firebaseMessagingService.receiveMessage().subscribe((message) => {
    //   // Push the incoming notification to the notifications array
    //   this.notifications.push(message);
    // });;
  }
 
  
  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.notificationSubscription) {
    
      this.notificationSubscription.unsubscribe();
    }
  }

  formatDate(createdDate: string): string {
    try {
      if (!createdDate) {
        // console.error('createdDate is null or undefined:', createdDate);
        return 'Invalid Date';
      }
  
      // Parse the date using the ISO 8601 standard
      const created = new Date(createdDate);
      if (isNaN(created.getTime())) {
      
        return 'Invalid Date';
      }
  
      const now = new Date();
  
      // Format time as HH:mm
      const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
      const time = new Intl.DateTimeFormat('en-GB', options).format(created);
  
      // Check if the date is today
      if (
        created.getDate() === now.getDate() &&
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      ) {
        return `Today at ${time}`;
      }
  
      // Format date as dd/MM/yy and add time
      const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: '2-digit' };
      const date = new Intl.DateTimeFormat('en-GB', dateOptions).format(created);
  
      return `${date} at ${time}`;
    } catch (error) {
     
      return 'Invalid Date';
    }
  }
  resetNotificationCount() {
    this.notifications.forEach(notification => {
        // Mark notification as read
        if (!notification.read) {
            notification.read = true; // You can store this in Firestore or update locally
            this.notificationService.updateNotificationStatus(notification.id, { read: true }).subscribe();
        }
    });

    // Update the notification count after marking as read
    this.notificationCount = 0;
}

  getNotification(userId: any) {
    this.notifications = [];
    this.notificationService.getNotification().subscribe((res: any) => {
       
        this.notificationList = res.data;
       
        this.notificationList.forEach((notification: any) => {
            if (!notification.data.createdDate) {
                console.warn('Notification missing createdDate:', notification);
            } else {
                // console.log('Valid createdDate:', this.formatDate(notification.data.createdDate));
            }
        });

        // Filter out read notifications and count only unread ones
        this.notificationList.forEach((notification: any) => {
         
            if (notification.receiver === userId && notification.status === 'requested') {
                this.notifications.push(notification);
            } else if (notification.receiver === userId && notification.status === 'verified') {
                this.notifications.push(notification);
            } else if (notification.requestBy === userId && notification.status !== 'requested') {
                this.notifications.push(notification);
            } else if (notification.receiver === userId && notification.status === 'first_approved') {
                this.notifications.push(notification);
            } else if (notification.receiver === userId && notification.status === 'second_approved') {
                this.notifications.push(notification);
            } else if (notification.receiver === userId && notification.status === 'rejected') {
                this.notifications.push(notification);
            }
        });

        // Only count unread notifications
        this.notificationCount = this.notifications.filter(notification => !notification.read).length;
    });
}

  getNotification1(userId: any){
    this.notifications = [];
    this.notificationService.getNotification().subscribe((res: any) => {
    
      this.notificationList = res.data;
      
      this.notificationList.forEach((notification: any) => {
        if (!notification.data.createdDate) {
         
        } else {
        

        }
      });
      
      // console.log("this.notificationList", this.notificationList);
      
      this.notificationList.forEach((notification: any) => {
        if(notification.receiver === userId && notification.status === 'requested'){
          this.notifications.push(notification);
          this.notificationCount = this.notifications.length;
          // console.log("this.notifications", this.notifications);
        }
        if(notification.receiver === userId && notification.status === 'verified'){
          this.notifications.push(notification);
          this.notificationCount = this.notifications.length;
        }
        if(notification.requestBy === userId && notification.status !== 'requested' ){
          this.notifications.push(notification);
          this.notificationCount = this.notifications.length;
          // this.notifications = []
        } 
        else if(notification.receiver === userId && notification.status === 'first_approved'){
          this.notifications.push(notification);
          this.notificationCount = this.notifications.length;
        }
        else if(notification.receiver === userId && notification.status === 'second_approved'){
        
          this.notifications.push(notification);
          this.notificationCount = this.notifications.length;
        }
        else if(notification.receiver === userId && notification.status === 'rejected'){
          this.notifications.push(notification);
          this.notificationCount = this.notifications.length;
        }
      });
    });
  }

  openNotificationModal(notification: any){
   const modalRef = this.modalService.open(ApprovalExpenseComponent, { size: 'lg', centered: true });
   modalRef.componentInstance.data = notification;
   modalRef.componentInstance.isVerify = true;

   
  }

  openProfileModal(){
   
    this.router.navigate([routes.employeeProfile],
      {
        queryParams:
          { id: this.userData.id,
            type: 'view',
            data: JSON.stringify(this.userData)
           }
      });

  }

  changeLanguage(language: string) {

    this.selectedLanguage = language;
    this._languageService.setLanguage(language);
  }

  public toggleSideBar(): void {
    this.sideBar.switchSideMenuPosition();
  }

  public togglesMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
  }
  navigation() {
    this.router.navigate([routes.search]);
  }
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', this.isDarkMode.toString());
    this.applyTheme();
  }
  applyTheme() {
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

}
