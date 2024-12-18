import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { AuthService, DataService, SideBar, apiResultFormat, getUsers, routes } from 'src/app/core/core.index';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUserModalComponent } from '../add-user-modal/add-user-modal.component';
import { UserRoleService } from 'src/app/core/services/user-role/user-role.service';
import { EmployeeService } from 'src/app/core/services/employee/employee.service';
@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  selected1 = 'option1';
  selected2 = 'option1';
  public users: Array<getUsers> = [];
  userArray: Array<getUsers> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getUsers>;
  public addUsers!: FormGroup;
  public editUsers!: FormGroup;
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
  public searchName = '';
  public searchCompany = '';
  public searchLocation = '';
  
  locationList: any;
  positionList: any;
  companyList: any;
  branchList: any;
 
  positionObj:any
  constructor(private formBuilder: FormBuilder, private data: DataService, private modalService: NgbModal, private authService: AuthService, private userService: UserRoleService, private employeeService: EmployeeService) {

  }

  ngOnInit(): void {
    this.getTableData();
    this.fetchAllData();



  }

  fetchAllData(): void {
    this.data.fetchAllList().subscribe(
      (data) => {
        
        this.positionList = data.positionList.data;
        this.locationList = data.locationList.data;
        this.companyList = data.companyList.data;
        this.branchList = data.branchList.data; 
        this.positionObj = this.positionList.reduce((acc: any, position: any) => {
          acc[position.name] = position.name_th;
          return acc;
        }, {});
        
      

      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
    

  }


 

  openAddUserModal() {
    const email = this.authService.decrypt(localStorage.getItem('currentUserEmail') || '');
    const password = this.authService.decrypt(localStorage.getItem('currentUserPassword') || '');
   
    const modalRef = this.modalService.open(AddUserModalComponent, { size: 'lg', centered: true })

    modalRef.result.then((result: any) => {
      
      if (result.data) {
        this.authService.registerUser(result.data.email, result.data.password, result.data).subscribe((res: any) => {
         
          if (result.menuAccess) {
            this.userService.updateUserMenuAccess(res.data.uid, result.menuAccess, false).subscribe((menuRes: any) => {
            
              if (res.success) {
                this.authService.loginWithEmail(email, password)
                  .then(() => {
                    this.getTableData();
                  })
              }
            })
          }

        })
      }
    })


  }

  searchUser() {
   
    this.userService.searchUsers(this.searchName, this.searchCompany).then((res: any) => {
    
      this.userArray = res;
    });
  }
  cancelSearch() {
    this.searchName = '';
    this.searchCompany = '';
    this.getTableData();
  }

  disabledUser(user: any) {
    // this.userService.updateUserStatus(user.uid, user.status === 'disabled' ? 'enabled' : 'disabled').subscribe((res: any) => {
    //   this.getTableData();
    // });
  }

  private getTableData(): void {
    this.users = [];
    this.serialNumberArray = [];
    this.userArray = [];

    this.userService.getUsers().subscribe((res: any) => {

      this.totalData = res.data.length
      console.log("res", res)
      res.data.map((res: getUsers, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id = serialNumber;
         
          this.userArray.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.calculateTotalPages(this.totalData, this.pageSize);
      // this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);
      console.log("data", this.users)
    })
  }

  
  openEditUserModal(user: any) {
    console.log("openEditUserModal", user);
    const modalRef = this.modalService.open(AddUserModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.data = user;
    modalRef.componentInstance.isEdit = true;

    modalRef.result.then((result: any) => {
      console.log("edit result", result);
      if (result.data) {
        this.userService.updateUserData(result.data.uid, result.data).subscribe((res: any) => {
          console.log("res", res);
          if (result.menuAccess) {
            this.userService.updateUserMenuAccess(result.data.uid, result.menuAccess, true).subscribe((menuRes: any) => {
              console.log("menuRes", menuRes);
              if (res.success) {
                this.getTableData();
              }
            })
          }
        })
      }
    });

  }

  openViewUserModal(user: any) {
    console.log("openViewUserModal", user);
    const modalRef = this.modalService.open(AddUserModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.data = user;
    modalRef.componentInstance.isView = true;
    modalRef.result.then((result: any) => {
      console.log("view result", result);
    });

  }
  

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.userArray = this.dataSource.filteredData;
  }
  public sortData(sort: Sort) {
    const data = this.userArray.slice();
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.userArray = data;
    } else {
      this.userArray = data.sort((a: any, b: any) => {
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
