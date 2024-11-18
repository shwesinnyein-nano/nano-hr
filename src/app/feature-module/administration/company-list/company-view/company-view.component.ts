import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { AuthService, DataService, getCompany, routes } from 'src/app/core/core.index';
import { AddCompanyModalComponent } from '../add-company-modal/add-company-modal.component';
import { CompanyService } from 'src/app/core/services/company/company.service';
import { Sort } from '@angular/material/sort';
@Component({
  selector: 'app-company-view',
  templateUrl: './company-view.component.html',
  styleUrl: './company-view.component.scss'
})
export class CompanyViewComponent implements OnInit  {

  public routes = routes;
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
  public searchRole = '';
  public companyList: Array<getCompany> = [];

  constructor(private formBuilder: FormBuilder,private data: DataService, private modalService: NgbModal, private authService: AuthService, private companyService: CompanyService     ) {

  }
  ngOnInit(): void {
    this.getTableData();
  }

  getTableData(){
    this.companyList = [];
    this.serialNumberArray = [];

    this.companyService.getCompanyList().subscribe((res: any) => {
      console.log("company lsit res", res);
      this.companyList = res.data
      this.totalData = res.data.length
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);
      console.log("data", this.companyList)


    })
  }

   openAddCompanyModal(): void {
    const modalRef = this.modalService.open(AddCompanyModalComponent, { size: 'lg', centered: true })

    modalRef.result.then((result: any) => {
     console.log("result", result);
     if(result.data){
      this.companyService.saveCompanyData(result.data.uid, result.data).subscribe((res: any) => {
        console.log("res", res);
        if(res.success){
          this.getTableData();
        }
      })

     }
    })
  }
  openEditCompanyModal(company: any){
    console.log("openEditCompanyModal", company);
    const modalRef = this.modalService.open(AddCompanyModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.data = company;
    modalRef.componentInstance.isEdit = true;

    modalRef.result.then((result: any) => {
      console.log("edit result", result);
      if(result.data) {
        this.companyService.updateCompanyData(result.data.uid, result.data).subscribe((res: any) => {
          console.log("res", res);
          if(res.success){
            this.getTableData();
          }
        })
      }
    });

  }

  openViewCompanyModal(company: any){
    console.log("openViewCompanyModal", company);
    const modalRef = this.modalService.open(AddCompanyModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.data = company;
    modalRef.componentInstance.isView = true;
    modalRef.result.then((result: any) => {
      console.log("view result", result);
    });

  }
  public sortData(sort: Sort) {
    const data = this.companyList.slice();
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.companyList = data;
    } else {
      this.companyList = data.sort((a: any, b: any) => {
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
