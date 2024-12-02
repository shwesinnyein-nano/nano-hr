import { Component } from '@angular/core';
import { getUsers } from 'src/app/core/services/interface/models';

import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/core/services/data/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserRoleService } from 'src/app/core/services/user-role/user-role.service';
import { routes } from 'src/app/core/core.index';
import { AddConfigurationComponent } from '../add-configuration/add-configuration.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-configuration-view',
 
  templateUrl: './configuration-view.component.html',
  styleUrl: './configuration-view.component.scss'
})
export class ConfigurationViewComponent {

  selected1 = 'option1';
  selected2 = 'option1';
  public users: Array<getUsers> = [];
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
  //** / pagination variables


  // positionListNanoVipList: any;
  // positionListNanoStore: any;
  // positionListNanoEntertainmentSugarDaddy: any;
  // positionListNanoEntertainmentHu: any;
  locationList: any;
  positionList: any;
  companyList: any;
  branchList: any;
  // storeBranchPhuketList: any;
  // storeBranchBangkokList: any;
  // entertainmentBranchList: any;
  positionObj:any
  constructor(private formBuilder: FormBuilder, private data: DataService, private modalService: NgbModal, private authService: AuthService, private userService: UserRoleService, ) {

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
   
    const modalRef = this.modalService.open(AddConfigurationComponent, { size: 'lg', centered: true })

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
    
      this.users = res;
    });
  }
  cancelSearch() {
    this.searchName = '';
    this.searchCompany = '';
    this.getTableData();
  }

  disabledUser(user: any) {

  }

  private getTableData(): void {
    this.users = [];
    this.serialNumberArray = [];

    this.userService.getUsers().subscribe((res: any) => {

      // this.users = res.data



     
      this.totalData = res.data.length
      res.data.map((res: getUsers, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id = serialNumber;
         
          this.users.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.calculateTotalPages(this.totalData, this.pageSize);
      // this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);
      // console.log("data", this.users)
    })
  }

  // findMatchName(id: string, listName: any){
  //   console.log("id", id);
  //   console.log("companyList", listName);
  //   const company = listName.find((company: any) => company['id'] === id);

  //   return company ;
  // }
  openEditUserModal(user: any) {
    console.log("openEditUserModal", user);
    const modalRef = this.modalService.open(AddConfigurationComponent, { size: 'lg', centered: true });
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
    const modalRef = this.modalService.open(AddConfigurationComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.data = user;
    modalRef.componentInstance.isView = true;
    modalRef.result.then((result: any) => {
      console.log("view result", result);
    });

  }
  public sortData(sort: Sort) {
    const data = this.users.slice();
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.users = data;
    } else {
      this.users = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.users = this.dataSource.filteredData;
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

