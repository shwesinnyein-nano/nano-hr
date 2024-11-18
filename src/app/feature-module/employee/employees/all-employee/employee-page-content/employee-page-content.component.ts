import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, lstEmployee, routes } from 'src/app/core/core.index';
import { UserRoleService } from 'src/app/core/services/user-role/user-role.service';
import { pageSelection } from '../employee-list/employee-list.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-employee-page-content',
  templateUrl: './employee-page-content.component.html',
  styleUrls: ['./employee-page-content.component.scss'],
})
export class EmployeePageContentComponent {
  public routes = routes;
  selected = 'option1';
  public serialNumberArray: Array<number> = [];
  public totalData: number = 0;
  public pageSize: number = 10;
  public pageNumberArray: Array<number> = [];
  public totalPages: number = 0;
  public pageSelection: Array<pageSelection> = [];
  companyList: any[] = [];

  public lstEmployee: Array<lstEmployee> = [];
  constructor(public router: Router, private dataservice: DataService, private userRoleService: UserRoleService, private dataService: DataService) {
    // this.lstEmployee = this.dataservice.lstEmployee;
  }

  ngOnInit(): void {
    this.getTableData();
    this.getCompanyList();
  }

  getCompanyList(){
    this.dataService.getCompanyList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      this.companyList = res;
    });
  }
  openAddEmployeeModal(): void {
    this.router.navigate([routes.employeeProfile]);
  }

  getTableData(): void {
    this.lstEmployee = [];
      this.serialNumberArray = [];

    this.userRoleService.getUsers().subscribe((res: any) => {
      console.log("res", res);
      this.lstEmployee = res.data
      this.totalData = res.data.length
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);
      console.log("data", this.lstEmployee)


    })


  }

  editEmployee(emp?: any): void {

    this.router.navigate([routes.employeeProfile], {
      queryParams: {
        employeeId: emp.uid,
        data: JSON.stringify(emp),
        actionStatus: "edit"
      },
    });
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
