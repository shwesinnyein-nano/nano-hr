import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data/data.service';
import { v4 as uuidv4 } from 'uuid';
import { map } from 'rxjs';

@Component({
  selector: 'app-add-car-modal',
  
  templateUrl: './add-car-modal.component.html',
  styleUrl: './add-car-modal.component.scss'
})
export class AddCarModalComponent {

  data: any;
  addCarForm!: FormGroup;
  isEdit: boolean = false;
  isView: boolean = false;
  carBrandList: any[] = [];
  carSubBrandList: any[] = [];
  selectedBrandList: any;
  selectedBrand: any;
  selectedModel: any;
  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, private ngbActiveModal: NgbActiveModal, private router: Router, private dataService: DataService) {

  }
  ngOnInit(): void {
    
    this.loadForm();
    this.dataService.fetchAllCarList().subscribe((data) => {
      this.carBrandList = data.carBrandList.data;
      this.carSubBrandList = data.carSubBrandList.data;
      // console.log("carBrandList", this.carBrandList);
      // console.log("carSubBrandList", this.carSubBrandList);
      this.loadForm(this.data);
    });
   
    
    

  }

  loadForm(data?: any): void {
   
    this.addCarForm = this.formBuilder.group({
      uid: new FormControl(data?.uid || uuidv4()),
      brand: new FormControl(data?.brand || '', Validators.required),
      brandName: new FormControl(data?.brandName || ''),
      model: new FormControl(data?.model || '', Validators.required),
      modelName: new FormControl(data?.modelName || ''),
      color: new FormControl(data?.color || '', Validators.required),
      car_number: new FormControl(data?.car_number || '', Validators.required),
      current_mile: new FormControl(data?.current_mile || ''),
      expire_date_for_tax: [data ? data.expire_date_for_tax ? data.expire_date_for_tax : new Date().toISOString() : new Date().toISOString()],
      expire_date_for_insurance: [data ? data.expire_date_for_insurance ? data.expire_date_for_insurance : new Date().toISOString() : new Date().toISOString()],
      maintain_date: [data ? data.maintain_date ? data.maintain_date : new Date().toISOString() : new Date().toISOString()],
      createdDate:new FormControl(data?.createdDate || new Date().toISOString()),
      updatedDate:new FormControl(data?.updatedDate || new Date().toISOString()),

    });
    this.selectedBrand = data?.brand;
    this.selectedModel = data?.model;
   
    if(this.data && this.data.uid){
      
      this.setOldData();
    }

  }

  setOldData(){
    // console.log("carSubBrandList", this.carSubBrandList);
    
    if(this.selectedBrand){
      
      
      this.selectedBrandList = this.carSubBrandList.filter((model: any) => model.parentId == this.selectedBrand);
     
      this.addCarForm.get('model')?.setValue(this.selectedModel);
     
      // console.log("selectedBrandList", this.selectedBrandList);
    }
  }

  onBrandChange(event: any): void {
    this.selectedBrand = event.value;
   
    this.addCarForm.get('brandName')?.setValue(this.carBrandList.find((brand: any) => brand.id == event.value)?.name);
    if(event.value == 'mercedes'){
      this.selectedBrandList = this.carSubBrandList.filter((model: any) => model.parentId == event.value);
    }
    else if(event.value == 'toyota'){
      this.selectedBrandList = this.carSubBrandList.filter((model: any) => model.parentId == event.value);
    }
    this.dataService.getCarSubBrandList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((model: any) => model.parentId == event.value);

      this.selectedBrandList = list;
    });
  }
  onModelChange(event: any): void {
    this.selectedModel = event.value;
    this.addCarForm.get('modelName')?.setValue(this.selectedBrandList.find((model: any) => model.id == event.value)?.name);
  }

  submitAddCar(): void {
    if (this.addCarForm.value.expire_date_for_tax) {
      const expire_date_for_tax = new Date(this.addCarForm.value.expire_date_for_tax);
      this.addCarForm.patchValue({
        expire_date_for_tax: this.dataService.formatDateWithoutTimezone(expire_date_for_tax)
      });
    }
    if (this.addCarForm.value.expire_date_for_insurance) {
      const expire_date_for_insurance = new Date(this.addCarForm.value.expire_date_for_insurance);
      this.addCarForm.patchValue({
        expire_date_for_insurance: this.dataService.formatDateWithoutTimezone(expire_date_for_insurance)
      });
    }
    if (this.addCarForm.value.maintain_date) {
      const maintain_date = new Date(this.addCarForm.value.maintain_date);
      this.addCarForm.patchValue({
        maintain_date: this.dataService.formatDateWithoutTimezone(maintain_date)
      });
    }
   
    if(this.addCarForm.valid){

      this.ngbActiveModal.close({data: {...this.addCarForm.value}});
    }
    else{
      this.addCarForm.markAllAsTouched();
    }

  }
  

  closeModal(): void {
    this.modalService.dismissAll();
  }

}
