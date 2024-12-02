import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { apiResultFormat, getTransactionHistory } from 'src/app/core/services/interface/models';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, routes } from 'src/app/core/core.index';
import { getBudgets } from 'src/app/core/services/interface/models';
import { Sort } from '@angular/material/sort';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpenseDataService } from 'src/app/core/services/expense-data/expense-data.service';
@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent implements OnInit{

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
  public lstTransactionHistory: Array<getTransactionHistory> = [];
  constructor(private fb: FormBuilder, private data: DataService, private expenseDataService: ExpenseDataService  ){}

  ngOnInit(): void {
    this.getTableData();
  }
  

    private getTableData(): void {
      this.lstTransactionHistory = [];
      this.serialNumberArray = [];
  
      this.expenseDataService.getExpenseList().subscribe((res: any) => {
  
        if (res) {
          // Check if any expense has approved status
          const hasApprovedExpense = res.data.filter((expense: any) => expense.status !== 'approved');
          console.log("hasApprovedExpense", hasApprovedExpense);
          if (hasApprovedExpense.length === 0) {
            console.log('At least one expense is approved');
            
          }
          else {
            this.lstTransactionHistory = hasApprovedExpense
            console.log("this.lstTransactionHistory", this.lstTransactionHistory);
            this.totalData = hasApprovedExpense.length
            this.calculateTotalPages(this.totalData, this.pageSize);
            this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);
           
          }
  
        }
  
      })
  
  
    }
  


  

  closeModal() {
    // this.ngbActiveModal.dismiss();
  }

  public sortData(sort: Sort) {
    const data = this.lstTransactionHistory.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstTransactionHistory = data;
    } else {
      this.lstTransactionHistory = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstTransactionHistory = this.dataSource.filteredData;
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

