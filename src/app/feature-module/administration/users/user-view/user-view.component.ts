import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { AuthService, DataService, apiResultFormat, getUsers, routes } from 'src/app/core/core.index';
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


  positionListNanoVipList: any;
  positionListNanoStore: any;
  positionListNanoEntertainmentSugarDaddy: any;
  positionListNanoEntertainmentHu: any;
  locationList: any;
  storeBranchPhuketList: any;
  storeBranchBangkokList: any;
  entertainmentBranchList: any;
  companyList: any;
  constructor(private formBuilder: FormBuilder,private data: DataService, private modalService: NgbModal, private authService: AuthService, private userService: UserRoleService, private employeeService: EmployeeService     ) {

  }

  ngOnInit(): void {
    this.getTableData();
    this.fetchAllData();




  }
  fetchAllData(): void {
    this.data.fetchAllData().subscribe(
      (data) => {
        this.positionListNanoVipList = data.nanoVipPosition.data;
        this.positionListNanoStore = data.nanoStorePosition.data;
        this.positionListNanoEntertainmentSugarDaddy = data.nanoEntertainmentSugarDaddyPosition.data;
        this.positionListNanoEntertainmentHu = data.nanoEntertainmentHuPosition.data;
        this.locationList = data.location.data;
        this.storeBranchPhuketList = data.storeBranchPhuket.data;
        this.storeBranchBangkokList = data.storeBranchBangkok.data;
        this.entertainmentBranchList = data.entertainmentBranch.data;
        this.companyList = data.companyList.data;
        console.log('Data fetched successfully', data);

      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }


  addUser(){
    console.log("addUser", this.addUsers.value);
  }

  openAddUserModal(){
    console.log("openAddUserModal");
   const modalRef = this.modalService.open(AddUserModalComponent, { size: 'lg', centered: true })

   modalRef.result.then((result: any) => {
    console.log("result", result);
    if(result.data){
      this.authService.registerUser(result.data.email, result.data.password, result.data).subscribe((res: any) => {
        console.log("res", res);
        if(res.success){
          this.getTableData();
        }
      })
    }
   })


  }

  searchUser(){
    console.log("searchUser", this.searchName, this.searchCompany);
    this.userService.searchUsers(this.searchName, this.searchCompany).then((res: any) => {
      console.log("res", res);
      this.users = res;
    });
  }
  cancelSearch(){
    this.searchName = '';
    this.searchCompany = '';
    this.getTableData();
  }

  disabledUser(user: any){

  }

  private getTableData(): void {
    this.users = [];
    this.serialNumberArray = [];

    this.userService.getUsers().subscribe((res: any) => {

      this.users = res.data



      console.log("users", this.users);
      this.totalData = res.data.length
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);
      console.log("data", this.users)
    })
  }

  // findMatchName(id: string, listName: any){
  //   console.log("id", id);
  //   console.log("companyList", listName);
  //   const company = listName.find((company: any) => company['id'] === id);

  //   return company ;
  // }
  openEditUserModal(user: any){
    console.log("openEditUserModal", user);
    const modalRef = this.modalService.open(AddUserModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.data = user;
    modalRef.componentInstance.isEdit = true;

    modalRef.result.then((result: any) => {
      console.log("edit result", result);
      if(result.data) {
        this.userService.updateUserData(result.data.uid, result.data).subscribe((res: any) => {
          console.log("res", res);
          if(res.success){
            this.getTableData();
          }
        })
      }
    });

  }

  openViewUserModal(user: any){
    console.log("openViewUserModal", user);
    const modalRef = this.modalService.open(AddUserModalComponent, { size: 'lg', centered: true });
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
