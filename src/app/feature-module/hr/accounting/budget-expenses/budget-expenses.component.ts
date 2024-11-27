import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from '@angular/material/table';
import { DataService, apiResultFormat, getBudgets, routes } from 'src/app/core/core.index';
import { ExpenseDataService } from 'src/app/core/services/expense-data/expense-data.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BudgetExpensesAddModalComponent } from '../budget-expenses-add-modal/budget-expenses-add-modal.component';
import { TransactionHistoryComponent } from '../transaction-history/transaction-history.component';

@Component({
  selector: 'app-budget-expenses',
  templateUrl: './budget-expenses.component.html',
  styleUrls: ['./budget-expenses.component.scss']
})
export class BudgetExpensesComponent implements OnInit {
  lstRevenue:any [] = [];
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
  //** / pagination variables

  constructor(private formBuilder: FormBuilder, private data: DataService, private modalService: NgbModal, private expenseDataService: ExpenseDataService) { }

  ngOnInit(): void {
    this.getTableData()
    

  }

  openAddModal() {
    const modalRef = this.modalService.open(BudgetExpensesAddModalComponent, { size: 'lg', centered: true })

    modalRef.result.then((result: any) => {
      console.log("result", result);
      if (result.data) {
        this.expenseDataService.saveExpenseData(result.data.uid, result.data).subscribe((res: any) => {

          if(res.success){
            this.getTableData();
          }
        })

      }
    })
  }

  openTransactionHistory() {
    // Open in extra large modal size
    const modalRef = this.modalService.open(TransactionHistoryComponent, { size: 'xl', centered: true })
    // const modalRef = this.modalService.open(TransactionHistoryComponent, { size: 'lg', centered: true })

    modalRef.result.then((result: any) => {

      if (result.data) {
        // this.carDataService.saveCarData(result.data.uid, result.data).subscribe((res: any) => {

        //   if(res.success){
        //     this.getTableData();
        //   }
        // })

      }
    })
  }

  private getTableData(): void {
    this.expenseList = [];
    this.serialNumberArray = [];

    this.expenseDataService.getExpenseList().subscribe((res: any) => {
    
      this.expenseList = res.data
      console.log("this.expenseList", this.expenseList);
      this.totalData = res.data.length
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);
    
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
