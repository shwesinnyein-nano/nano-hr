import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-add-company-modal',
  templateUrl: './add-company-modal.component.html',
  styleUrl: './add-company-modal.component.scss'
})
export class AddCompanyModalComponent implements OnInit {

  data: any;
  addCompanyForm!: FormGroup;
  isEdit: boolean = false;
  isView: boolean = false;
  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, private ngbActiveModal: NgbActiveModal, private router: Router) {

  }
  ngOnInit(): void {
    this.loadForm(this.data);


  }

  loadForm(data?: any): void {
    this.addCompanyForm = this.formBuilder.group({
      uid: new FormControl(data?.uid || uuidv4()),
      company:new FormControl(data?.company || '', Validators.required),
      location:new FormControl(data?.location || '', Validators.required),
      branchCode:new FormControl(data?.branchCode || '', Validators.required),
      branch:new FormControl(data?.branch || '', Validators.required),
      address:new FormControl(data?.address || ''),
      createdDate:new FormControl(data?.createdDate || new Date().toISOString()),
      updatedDate:new FormControl(data?.updatedDate || new Date().toISOString()),

    });
  }

  submitAddCompany(): void {
    console.log(this.addCompanyForm.value);
    let showLabel = this.addCompanyForm.getRawValue().company + ' - ' +  this.addCompanyForm.getRawValue().location;
    console.log(showLabel);
    if(this.addCompanyForm.valid){

      this.ngbActiveModal.close({data: {...this.addCompanyForm.value, showLabel: showLabel}});
    }
    else{
      this.addCompanyForm.markAllAsTouched();
    }

  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

}
