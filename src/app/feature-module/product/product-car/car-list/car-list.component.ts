import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { getCarList, routes } from 'src/app/core/core.index';
import { DataService } from 'src/app/core/services/data/data.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCarModalComponent } from '../add-car-modal/add-car-modal.component';
import { CarDataService } from 'src/app/core/services/car-data/car-data.service';
import { Sort } from '@angular/material/sort';


@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.scss'
})
export class CarListComponent {
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
  public carList: Array<getCarList> = [];
  public carBrandList: Array<any> = [];
  public searchBrand: string = '';
  constructor(private formBuilder: FormBuilder,private data: DataService, private modalService: NgbModal, private authService: AuthService, private carDataService: CarDataService     ) {

  }
  ngOnInit(): void {
    this.getTableData();
    this.getCarBrand();
  }

  getCarBrand(){
    this.data.getCarBrandList().subscribe((res: any) => {
      
      this.carBrandList = res.data;
    })
  }

  getTableData(){
    this.carList = [];
    this.serialNumberArray = [];

    this.carDataService.getCarList().subscribe((res: any) => {
    
      this.carList = res.data
      this.totalData = res.data.length
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.serialNumberArray = Array.from({ length: this.totalData }, (_, i) => i + 1);
    
    })
  }

   openAddCompanyModal(): void {
    const modalRef = this.modalService.open(AddCarModalComponent, { size: 'lg', centered: true })

    modalRef.result.then((result: any) => {
     
     if(result.data){
      this.carDataService.saveCarData(result.data.uid, result.data).subscribe((res: any) => {
       
        if(res.success){
          this.getTableData();
        }
      })

     }
    })
  }
  openEditCompanyModal(company: any){
  
    const modalRef = this.modalService.open(AddCarModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.data = company;
    modalRef.componentInstance.isEdit = true;

    modalRef.result.then((result: any) => {
      
      if(result.data) {
        this.carDataService.updateCarData(result.data.uid, result.data).subscribe((res: any) => {
         
          if(res.success){
            this.getTableData();
          }
        })
      }
    });

  }

  openViewCompanyModal(company: any){
   
    const modalRef = this.modalService.open(AddCarModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.data = company;
    modalRef.componentInstance.isView = true;
    modalRef.result.then((result: any) => {
     
    });

  }
  searchCar(){
 
    this.carDataService.searchCar(this.searchBrand).then((res: any) => {
      
      this.carList = res;
    }); 
  }
  cancelSearch(){
    this.searchBrand = '';
    this.getTableData();
  }
  public sortData(sort: Sort) {
    const data = this.carList.slice();
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.carList = data;
    } else {
      this.carList = data.sort((a: any, b: any) => {
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

