import { Component, signal, WritableSignal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { routes } from 'src/app/core/core.index';
import { GetEmployees } from 'src/app/core/services/interface/models';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/core/services/data/data.service';
import { EmployeeService } from 'src/app/core/services/employee/employee.service';
import { UserRoleService } from 'src/app/core/services/user-role/user-role.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Sort } from '@angular/material/sort';


@Component({
  selector: 'app-employee-info-list',
 
  templateUrl: './employee-info-list.component.html',
  styleUrl: './employee-info-list.component.scss'
})
export class EmployeeInfoListComponent {

  selected = 'option1';
   lstEmployee:WritableSignal<GetEmployees[]> = signal<GetEmployees[]>([]);
  public searchDataValue = '';
  dataSource!: MatTableDataSource<GetEmployees>;
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

  addEmployeeInfo() {
    this.router.navigate([routes.employee_profile_info]);
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

  updateEmployee(row: any, type: string): void {
    console.log("row", row.uid);
    this.router.navigate([routes.employee_profile_info],
      {
        queryParams:
          { uid: row.uid,
            type: type,
            data: JSON.stringify(row)
           }
      });
  }
  viewEmployee(row: any, type: string): void {
    console.log("row", row);
    this.router.navigate([routes.employee_info_view],
      {
        queryParams:
          { uid: row.uid,
            type: type,
            data: JSON.stringify(row)
           }
      });
  }



  getTableData(): void {
    this.lstEmployee.set([]);
    this.serialNumberArray = [];

    this.employeeService.getEmployeeList().subscribe((res: any) => {

      this.totalData = res.data.length
      res.data.map((res: GetEmployees, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id = serialNumber;
         
            this.lstEmployee.update((prev) => [...prev, res]);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.calculateTotalPages(this.totalData, this.pageSize);
      // this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);
      // console.log("data", this.lstEmployee)
    })
    
  }

  public sortData(sort: Sort) {
    const data = this.lstEmployee().slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstEmployee.set(data);
    } else {
      this.lstEmployee.set(data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      }));
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstEmployee.set(this.dataSource.filteredData);
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


