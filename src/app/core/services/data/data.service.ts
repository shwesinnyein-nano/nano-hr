import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, forkJoin } from 'rxjs';
import {
  HorizontalSideBar,
  SideBar,
  SideBarMenu,
  apiResultFormat,
  routes,
} from '../../core.index';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  allAppliedCandidates!: Array<object>;

  constructor(private http: HttpClient) { }

  public getEmployees(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/employee.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
 
  public getLocation(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/location.json').pipe(
      map((res: apiResultFormat) => {

        return res;
      })
    );
  }
  

  public getCompanyList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/companies.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getCarBrandList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/car-brand.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getCarSubBrandList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/car-sub-brand.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getLocationList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/location.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPositionList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/position.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getBranchList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/branch.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
 
  public fetchAllList(): Observable<any> {
    return forkJoin({
      companyList: this.getCompanyList(),
      locationList: this.getLocationList(),
      positionList: this.getPositionList(),
      branchList: this.getBranchList(),
      userRoleList: this.getUserRole(),
      
    });
  }
  public fetchAllCarList(): Observable<any> {
    return forkJoin({
      carBrandList: this.getCarBrandList(),
      carSubBrandList: this.getCarSubBrandList(),
    });
  }

 

  public getCountry(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/country.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
 
 
  public getBudgets(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/budgets.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getEmployeeSalary(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/employee-salary.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAddPayroll1(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payroll-item1.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAddPayroll2(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payroll-item2.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAddPayroll3(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payroll-item3.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPolicies(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/policies.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getExpenseReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/expense-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getInvoiceReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/invoice-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPaymentReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payment-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getProjectReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/project-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }

  public getTaskReport(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/task-report.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getUserReport(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/user-report.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getEmployeeReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/employee-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPayslipReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payslip-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAttendanceReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/attendance-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAttendReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/attend-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getLeaveReport(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/leave-report.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getDailyReport(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/daily-report.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPerformanceReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/performance-indicator.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPerformanceappraisal(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/performance-appraisal.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getGoalList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/goal-list.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getGoalType(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/goal-type.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTrainList(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/training-list.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getTrainType(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/training-type.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public formatDateWithoutTimezone(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  public getTrainer(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/trainers.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPromotion(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/promotion.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getResignation(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/resignation.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTermination(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/termination.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAssets(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/assets-page.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAllJobs(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-all.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getSavedJobs(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-saved.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAppliedJobs(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-applied.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getOfferedJobs(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-offered.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getVisited(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-visited.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getArchived(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-archived.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getManageJobs(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/manage-jobs.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getManageResume(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/manage-resumes.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getShortList(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/shortlist-candidate.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getInterview(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/interview-questions.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getOffer(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/offer-approval.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getExpire(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/experience-level.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getSchedule(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/schedule-timing.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getCandidate(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/candidates-list.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAptitudeResult(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/aptitude-result.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAptitudeResults(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/aptitude-result.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAptitudeCandidate(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/applied-candidate.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getUsers(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/users.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getSubscribed(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/subscribed-company.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getDataTable(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/form-tables.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAssetsCategory(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/assets-category.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAssetsNew(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/assets-new.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAssetsReports(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/assets-reports.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  
  public getPipeline(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/pipeline.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  
  public getLeads(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/leads-list.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getdeals(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/deals-list.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getActivities(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/activity.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getUserRole(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/user-role.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }


  public sideBar: SideBar[] = [
    {
      tittle: 'Main',
      icon: 'airplay',
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Dashboard',
          route: routes.admin,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'dashcube',
          base: 'dashboard',
          materialicons: 'home',

        },

      ],
    },
    {
      tittle: 'Employees',
      icon: 'layers',
      showAsTab: false,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Employees',
          route: routes.employees,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'people',
          base: 'employees',
          dot: true,
          materialicons: 'people',
          subMenus: [
            {
              menuValue: 'All Employees',
              route: routes.employee_list,
              base: 'employee-list',

            },


          ],
        },

      ],
    },
    {
      tittle: 'Administration',
      icon: 'file',
      showAsTab: false,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Administration',
          route: routes.users,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'user',
          base: 'administration',
          dot: true,
          materialicons: 'person',
          subMenus: [
            {
              menuValue: 'Users',
              route: routes.users,
              base: 'users',
              // base2: 'employee-list',
            },
            {
              menuValue: 'Configuration',
              route: routes.configuration,
              base: 'configuration',
            },  


          ],
        },
        


      ],
    },
    {
      tittle: 'Products',
      icon: 'layers',
      showAsTab: false,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Products',
          route: routes.product,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'list',
          base: 'product',
          dot: true,
          materialicons: 'list',
          subMenus: [
            {
              menuValue: 'Car List',
              route: routes.carList,
              base: 'car-list',

            },


          ],
        },

      ],
    },
   
    {
      tittle: 'HR',
      icon: 'file',
      showAsTab: false,
      separateRoute: false,
      menu: [
        // {
        //   menuValue: 'Sales',
        //   route: routes.sales,
        //   hasSubRoute: true,
        //   showSubRoute: false,
        //   icon: 'files-o',
        //   base: 'sales',
        //   materialicons: 'track_changes',
        //   subMenus: [
        //     // {
        //     //   menuValue: 'Estimates',
        //     //   route: routes.estimatepage,
        //     //   base: 'estimate-page',
        //     //   base2: 'estimate-view',
        //     //   base3: 'create-estimate',
        //     //   base4: 'edit-estimate',
        //     // },
        //     // {
        //     //   menuValue: 'Invoices',
        //     //   route: routes.invoicepage,
        //     //   base: 'invoice-page',
        //     //   base2: 'invoice-view',
        //     //   base3: 'create-invoice',
        //     //   base4: 'edit-invoice',
        //     // },
        //     // { menuValue: 'Payments', route: routes.payments, base: 'payments' },
        //     // { menuValue: 'Expenses', route: routes.expenses, base: 'expenses' },
        //     // {
        //     //   menuValue: 'Provident Fund',
        //     //   route: routes.providentfund,
        //     //   base: 'provident-fund',
        //     // },
        //     // { menuValue: 'Taxes', route: routes.taxes, base: 'taxes' },
        //   ],
        // },
        {
          menuValue: 'Accounting',
          route: routes.accounting,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'file-alt',
          base: 'accounting',
          materialicons: 'checklist_rtl',
          subMenus: [
            // {
            //   menuValue: 'Categories',
            //   route: routes.category,
            //   base: 'category',
            // },
            // { menuValue: 'Budgets', route: routes.budgets, base: 'budgets' },
            {
              menuValue: 'Budget Expenses',
              route: routes.transactionHistory,
              base: 'budget-expenses',
            },
            {
              menuValue: 'Budget Income',
              route: routes.budgetrevenues,
              base: 'budget-revenues',
            },
            // {
            //   menuValue: 'Transaction History',
            //   route: routes.transactionHistory,
            //   base: 'transaction-history',
            // },
          ],
        },
        {
          menuValue: 'Payroll',
          route: routes.payroll,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'money',
          base: 'payroll',
          materialicons: 'auto_graph',
          subMenus: [
            {
              menuValue: 'Employee Salary',
              route: routes.employeesalary,
              base: 'employee-salary',
            },
            {
              menuValue: 'Payslip',
              route: routes.salaryview,
              base: 'salary-view',
            },
            {
              menuValue: 'Payroll Items',
              route: routes.payrollitems,
              base: 'payroll-items',
            },
          ],
        },
        {
          menuValue: 'Policies',
          route: routes.policies,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'file-pdf-o',
          base: 'policies',
          page1: 'main',
          materialicons: 'do_not_disturb_alt',
          subMenus: [],
        },
        {
          menuValue: 'Reports',
          route: routes.reports,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'pie-chart',
          base: 'reports',
          materialicons: 'web_asset',
          subMenus: [
            {
              menuValue: 'Expense Report',
              route: routes.expensereport,
              base: 'expense-report',
            },
            {
              menuValue: 'Invoice Report',
              route: routes.invoicereport,
              base: 'invoice-report',
            },
            {
              menuValue: 'Payments Report',
              route: routes.paymentsreport,
              base: 'payments-report',
            },
            {
              menuValue: 'Project Report',
              route: routes.projectreport,
              base: 'project-report',
            },
            {
              menuValue: 'Task Report',
              route: routes.taskreport,
              base: 'task-report',
            },
            {
              menuValue: 'User Report',
              route: routes.userreport,
              base: 'user-report',
            },
            {
              menuValue: 'Employee Report',
              route: routes.employeereport,
              base: 'employee-report',
            },
            {
              menuValue: 'Payslip Report',
              route: routes.payslipreport,
              base: 'payslip-report',
            },
            {
              menuValue: 'Attendance Report',
              route: routes.attendancereport,
              base: 'attendance-report',
            },
            {
              menuValue: 'Leave Report',
              route: routes.leavereport,
              base: 'leave-report',
            },
            {
              menuValue: 'Daily Report',
              route: routes.dailyreport,
              base: 'daily-report',
            },
          ],
        },
      ],
    },
    
  ];
  public sideBar2: HorizontalSideBar[] = [
    {
      tittle: 'Main',
      icon: 'airplay',
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Dashboard',
          route: routes.dashboard,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'dashcube',
          base: 'dashboard',
          materialicons: 'home',
          subMenus: [
            {
              menuValue: 'Admin Dashboard',
              route: routes.admin,
              base: 'admin',
            },
            {
              menuValue: 'Employee Dashboard',
              route: routes.employee,
              base: 'employee',
            },
            {
              menuValue: 'Deals Dashboard',
              route: routes.dealsDashboard,
              base: 'deals',
            },
            {
              menuValue: 'Leads Dashboard',
              route: routes.leadDashboard,
              base: 'leads',
            },
          ],
        },
        {
          menuValue: 'Apps',
          route: routes.apps,
          hasSubRouteTwo: true,
          showSubRoute: false,
          icon: 'cube',
          base: 'apps',
          materialicons: 'dashboard',
          subMenus: [
            {
              menuValue: 'Chat',
              route: routes.chat,
              base: 'apps',
              customSubmenuTwo: false,
            },
            {
              menuValue: 'Calls',
              customSubmenuTwo: true,
              hasSubRoute: true,
              showSubRoute: false,
              route: routes.calendar,
              page1: 'voice-call',
              page2: 'videocall',
              subMenusTwo: [
                {
                  menuValue: 'Voice Call',
                  route: routes.voicecall,
                  hasSubRoute: false,
                  showSubRoute: false,
                  page: 'call',
                },
                {
                  menuValue: 'Video Call',
                  route: routes.videocall,
                  hasSubRoute: false,
                  showSubRoute: false,
                },
                {
                  menuValue: 'Outgoing Call',
                  route: routes.outgoingcall,
                  hasSubRoute: false,
                  showSubRoute: false,
                },
                {
                  menuValue: 'Incoming Call',
                  route: routes.incomingcall,
                  hasSubRoute: false,
                  showSubRoute: false,
                },
              ],
            },
            {
              menuValue: 'Calendar',
              hasSubRoute: true,
              showSubRoute: false,
              route: routes.calendar,
              customSubmenuTwo: false,
            },
            {
              menuValue: 'Contacts',
              hasSubRoute: true,
              showSubRoute: false,
              route: routes.contacts,
              customSubmenuTwo: false,
            },
            {
              menuValue: 'Email',
              hasSubRoute: true,
              showSubRoute: false,
              route: routes.email,
              customSubmenuTwo: false,
            },
            {
              menuValue: 'File Manager',
              hasSubRoute: true,
              showSubRoute: false,
              route: routes.filemanager,
              customSubmenuTwo: false,
            },
          ],
        },
      ],
    },
    {
      tittle: 'Employees',
      icon: 'layers',
      showAsTab: false,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Employees',
          route: routes.employees,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'user',
          base: 'employees',
          dot: true,
          materialicons: 'people',
          subMenus: [
            {
              menuValue: 'All Employees',
              route: routes.employee_page,
              base: 'employee-page',
              base2: 'employee-list',
            },
            { menuValue: 'Holidays', route: routes.holidays, base: 'holidays' },
            {
              menuValue: 'Leaves (Admin)',
              route: routes.leaveadmin,
              base: 'leave-admin',
              currentActive: true,
            },
            {
              menuValue: 'Leaves (Employee)',
              route: routes.leaveemployee,
              base: 'leave-employee',
            },
            {
              menuValue: 'Leave Settings',
              route: routes.leavesettings,
              base: 'leave-settings',
            },
            {
              menuValue: 'Attendance (Admin)',
              route: routes.attendanceadmin,
              base: 'attendance-admin',
            },
            {
              menuValue: 'Attendance (Employee)',
              route: routes.attendanceemployee,
              base: 'attendance-employee',
            },
            {
              menuValue: 'Departments',
              route: routes.departments,
              base: 'departments',
            },
            {
              menuValue: 'Designations',
              route: routes.designations,
              base: 'designations',
            },
            {
              menuValue: 'Timesheet',
              route: routes.timesheet,
              base: 'timesheet',
            },
            {
              menuValue: 'Shift & Schedule',
              route: routes.shiftschedule,
              base: 'shift-schedule',
            },
            { menuValue: 'Overtime', route: routes.overtime, base: 'overtime' },
          ],
        },
        {
          menuValue: 'Clients',
          route: routes.clientPage,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'users',
          base: 'clients',
          materialicons: 'person',
          subMenus: [],
        },


      ],
    },
    {
      tittle: 'HR',
      icon: 'file',
      showAsTab: false,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Sales',
          route: routes.sales,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'files-o',
          base: 'sales',
          materialicons: 'track_changes',
          subMenus: [
            {
              menuValue: 'Estimates',
              route: routes.estimatepage,
              base: 'estimate-page',
              base2: 'estimate-view',
              base3: 'create-estimate',
              base4: 'edit-estimate',
            },
            {
              menuValue: 'Invoices',
              route: routes.invoicepage,
              base: 'invoice-page',
              base2: 'invoice-view',
              base3: 'create-invoice',
              base4: 'edit-invoice',
            },
            { menuValue: 'Payments', route: routes.payments, base: 'payments' },
            { menuValue: 'Expenses', route: routes.expenses, base: 'expenses' },
            {
              menuValue: 'Provident Fund',
              route: routes.providentfund,
              base: 'provident-fund',
            },
            { menuValue: 'Taxes', route: routes.taxes, base: 'taxes' },
          ],
        },
        {
          menuValue: 'Accounting',
          route: routes.accounting,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'file-alt',
          base: 'accounting',
          materialicons: 'checklist_rtl',
          subMenus: [
            {
              menuValue: 'Categories',
              route: routes.category,
              base: 'category',
            },
            { menuValue: 'Budgets', route: routes.budgets, base: 'budgets' },
            {
              menuValue: 'Budget Expenses',
              route: routes.budgetexpenses,
              base: 'budget-expenses',
            },
            {
              menuValue: 'Budget Revenues',
              route: routes.budgetrevenues,
              base: 'budget-revenues',
            },
            {
              menuValue: 'Transaction History',
              route: routes.transactionHistory,
              base: 'transaction-history',
            },
          ],
        },
        {
          menuValue: 'Payroll',
          route: routes.payroll,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'money',
          base: 'payroll',
          materialicons: 'auto_graph',
          subMenus: [
            {
              menuValue: 'Employee Salary',
              route: routes.employeesalary,
              base: 'employee-salary',
            },
            {
              menuValue: 'Payslip',
              route: routes.salaryview,
              base: 'salary-view',
            },
            {
              menuValue: 'Payroll Items',
              route: routes.payrollitems,
              base: 'payroll-items',
            },
          ],
        },
        {
          menuValue: 'Policies',
          route: routes.policies,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'file-pdf-o',
          base: 'policies',
          materialicons: 'do_not_disturb_alt',
          subMenus: [],
        },
        {
          menuValue: 'Reports',
          route: routes.reports,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'pie-chart',
          base: 'reports',
          materialicons: 'web_asset',
          subMenus: [
            {
              menuValue: 'Expense Report',
              route: routes.expensereport,
              base: 'expense-report',
            },
            {
              menuValue: 'Invoice Report',
              route: routes.invoicereport,
              base: 'invoice-report',
            },
            {
              menuValue: 'Payments Report',
              route: routes.paymentsreport,
              base: 'payments-report',
            },
            {
              menuValue: 'Project Report',
              route: routes.projectreport,
              base: 'project-report',
            },
            {
              menuValue: 'Task Report',
              route: routes.taskreport,
              base: 'task-report',
            },
            {
              menuValue: 'User Report',
              route: routes.userreport,
              base: 'user-report',
            },
            {
              menuValue: 'Employee Report',
              route: routes.employeereport,
              base: 'employee-report',
            },
            {
              menuValue: 'Payslip Report',
              route: routes.payslipreport,
              base: 'payslip-report',
            },
            {
              menuValue: 'Attendance Report',
              route: routes.attendancereport,
              base: 'attendance-report',
            },
            {
              menuValue: 'Leave Report',
              route: routes.leavereport,
              base: 'leave-report',
            },
            {
              menuValue: 'Daily Report',
              route: routes.dailyreport,
              base: 'daily-report',
            },
          ],
        },
      ],
    },

    {
      tittle: 'Administration',
      icon: 'file',
      showAsTab: false,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Assets',
          route: routes.assets,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'object-ungroup',
          base: 'assets',
          materialicons: 'perm_contact_calendar',
          subMenus: [],
        },
        {
          menuValue: 'Jobs',
          route: routes.jobs,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'briefcase',
          base: 'jobs',
          materialicons: 'announcement',
          subMenus: [
            {
              menuValue: 'User Dashboard',
              route: routes.userDashboard,
              base: 'user-dashboard',
              base2: 'user-all-jobs',
              base3: 'saved-jobs',
              base4: 'applied-jobs',
              base5: 'interview-jobs',
              base6: 'offered-jobs',
              base7: 'visited-jobs',
              base8: 'archived-jobs',
            },
            {
              menuValue: 'Jobs Dashboard',
              route: routes.jobsdashboard,
              base: 'jobs-dashboard',
            },
            {
              menuValue: 'Manage Jobs',
              route: routes.managejobs,
              base: 'manage-jobs',
            },
            {
              menuValue: 'Manage Resumes',
              route: routes.manageresumes,
              base: 'manage-resumes',
            },
            {
              menuValue: 'Shortlist Candidates',
              route: routes.shortlist,
              base: 'shortlist',
            },
            {
              menuValue: 'Interview Questions',
              route: routes.interviewquestions,
              base: 'interview-questions',
            },
            {
              menuValue: 'Offer Approvals',
              route: routes.offerapproval,
              base: 'offer-approval',
            },
            {
              menuValue: 'Experience Level',
              route: routes.experiencelevel,
              base: 'experience-level',
            },
            {
              menuValue: 'Candidates List',
              route: routes.candidateslist,
              base: 'candidates-list',
            },
            {
              menuValue: 'Schedule Timing',
              route: routes.scheduletiming,
              base: 'schedule-timing',
            },
            {
              menuValue: 'Aptitude Results',
              route: routes.aptituderesult,
              base: 'aptitude-result',
            },
          ],
        },
        {
          menuValue: 'Knowledgebase',
          route: routes.knowledgebasemain,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'question',
          base: 'knowledgebase',
          materialicons: 'loyalty',
          subMenus: [],
        },
        {
          menuValue: 'Users',
          route: routes.users,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'users-cog',
          base: 'users',
          materialicons: 'layers',
          subMenus: [],
        },
        {
          menuValue: 'Settings',
          route: routes.companysettings,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'cog',
          base: 'company-settings',
          materialicons: 'foundation',
          subMenus: [],
        },
      ],
    },
    {
      tittle: 'Pages',
      icon: 'file',
      showAsTab: false,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Profile',
          route: routes.profile,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'user-tag',
          base: 'profile',
          materialicons: 'bento',
          subMenus: [
            {
              menuValue: 'Employee Profile',
              route: routes.employeeProfile,
              base: 'employee-profile',
            },
            {
              menuValue: 'Client Profile',
              route: routes.clientProfile,
              base: 'client-profile',
            },
          ],
        },
        {
          menuValue: 'Authentication',
          route: routes.loginpro,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'key',
          base: 'login',
          materialicons: 'bar_chart',
          subMenus: [
            { menuValue: 'Login', route: routes.loginpro, base: 'login' },
            {
              menuValue: 'Register',
              route: routes.registers,
              base: 'register',
            },
            {
              menuValue: 'Forgot Password',
              route: routes.forgotpassword,
              base: 'forgot-password',
            },
            { menuValue: 'OTP', route: routes.otp, base: 'otp' },
            {
              menuValue: 'Lock Screen',
              route: routes.lockscreen,
              base: 'lock-screen',
            },
          ],
        },
        {
          menuValue: 'Error Page',
          route: routes.error,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'exclamation-triangle',
          base: '404',
          materialicons: 'grading',
          subMenus: [
            { menuValue: '404 Error', route: routes.error, base: '404' },
            { menuValue: '500 Error', route: routes.errors, base: '500' },
          ],
        },
        
        {
          menuValue: 'Pages',
          route: routes.pages,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'columns',
          base: 'pages',
          materialicons: 'table_rows',
          subMenus: [
            { menuValue: 'Search', route: routes.search, base: 'search' },
            { menuValue: 'FAQ', route: routes.faq, base: 'faq' },
            { menuValue: 'Terms', route: routes.terms, base: 'terms' },
            {
              menuValue: 'Privacy Policy',
              route: routes.privacy,
              base: 'privacy-policy',
            },
            {
              menuValue: 'Blank Page',
              route: routes.blankpage,
              base: 'blank-page',
            },
            
          ],
        },
      ],
    },
    
   
    

  ];

  public getSideBarData: BehaviorSubject<Array<SideBar>> = new BehaviorSubject<
    Array<SideBar>
  >(this.sideBar);
  public resetData(): void {
    this.sideBar.map((res: SideBar) => {
      res.showAsTab = false;
      res.menu.map((menus: SideBarMenu) => {
        menus.showSubRoute = false;
      });
    });
  }
  public getSideBarData2: BehaviorSubject<Array<HorizontalSideBar>> = new BehaviorSubject<
    Array<HorizontalSideBar>
  >(this.sideBar2);
  public resetData2(): void {
    this.sideBar.map((res: SideBar) => {
      res.showAsTab = false;
      res.menu.map((menus: SideBarMenu) => {
        menus.showSubRoute = false;
      });
    });
  }
  


 
 
}
