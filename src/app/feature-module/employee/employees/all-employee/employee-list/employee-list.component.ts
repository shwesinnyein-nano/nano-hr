import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, apiResultFormat, getEmployees, routes } from 'src/app/core/core.index';
import { EmployeeModalComponent } from '../employee-modal/employee-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRoleService } from 'src/app/core/services/user-role/user-role.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { EmployeeService } from 'src/app/core/services/employee/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  selected = 'option1';
  public lstEmployee: Array<getEmployees> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getEmployees>;
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
  searchCompany = '';
  searchName = '';
  companyList: any[] = [];
  //** / pagination variables

  constructor(private data: DataService, private employeeService: EmployeeService   , private modalService: NgbModal, private userRoleService: UserRoleService, private router: Router) { }

  ngOnInit(): void {
    this.getTableData();
    this.getCompanyList();
  }

  getCompanyList() {
    this.data.getCompanyList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      this.companyList = res;
    });
    console.log("companyList", this.companyList);
  }

  searchEmployee() {
    console.log("searchEmployee", this.searchCompany);
    this.employeeService.searchEmployee(this.searchCompany, this.searchName).then((res: any) => {
      console.log("res", res);
      this.lstEmployee = res;
    }); 
  }

  cancelSearch() {
    this.searchCompany = '';
    this.getTableData();
  }

  openEditEmployeeModal(row: any, type: string): void {
    console.log("row", row);
    this.router.navigate([routes.employeeProfile],
      {
        queryParams:
          { id: row.id,
            type: type,
            data: JSON.stringify(row)
           }
      });
  }
  openViewEmployeeModal(row: any, type: string): void {
    console.log("row", row);
    this.router.navigate([routes.employeeProfile],
      {
        queryParams:
          { id: row.id,
            type: type,
            data: JSON.stringify(row)
           }
      });
  }



  getTableData(): void {
    this.lstEmployee = [];
    this.serialNumberArray = [];

    this.employeeService.getEmployeeList().subscribe((res: any) => {

      this.lstEmployee = res.data
      console.log("this.lstEmployee", this.lstEmployee);

      this.totalData = res.data.length
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);



    })



  }

  public sortData(sort: Sort) {
    const data = this.lstEmployee.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstEmployee = data;
    } else {
      this.lstEmployee = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstEmployee = this.dataSource.filteredData;
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
