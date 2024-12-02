import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
  selector: 'app-add-configuration',
  
  templateUrl: './add-configuration.component.html',
  styleUrl: './add-configuration.component.scss'
})
export class AddConfigurationComponent implements OnInit {

  addConfigurationForm!: FormGroup;
  companyList: any[] = [];
  selectedCompany: any;
  positionList: any[] = [];
  roleList: any[] = [];
  locationList: any[] = [];
  branchList: any[] = [];
  isEdit: boolean = false;
  isView: boolean = false;
  selectedLocationList: any[] = [];
  selectedFirstVerifierList: any[] = [];
  selectedSecondVerifierList: any[] = [];
  selectedApproverList: any[] = [];
  selectedBranchList: any[] = [];
  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal, private dataService: DataService  ) { }

  ngOnInit(): void {
    this.loadForm();
    this.fetchAllList();
  }

  loadForm(data?: any) {
    this.addConfigurationForm = this.fb.group({
      company: [data?.company || null, Validators.required],
      location: [data?.location || null, Validators.required],
      branch: [data?.branch || null, Validators.required],
      verifier: [data?.verifier || null, Validators.required],
      approval: [data?.approval || null, Validators.required],
    });
  }
  fetchAllList() {
   this.dataService.fetchAllList().subscribe((res: any) => {
    this.companyList = res.companyList.data;
    this.positionList = res.positionList.data;
    this.roleList = res.userRoleList.data;
    this.locationList = res.locationList.data;
    this.branchList = res.branchList.data;
    console.log("this.companyList", this.companyList);
   });
  }

  onCompanyChange(event: any) {
    console.log(event.value);
    this.selectedCompany = event.value;
    if(this.selectedCompany == 'nano-vip'){
     this.firstVerifierListByCompany('nano-vip');
    }
    else if(this.selectedCompany == 'nano-store'){
      this.firstVerifierListByCompany('nano-store');
    }
    else{
      this.firstVerifierListByCompany('nano-entertainment');
    }
  }
  firstVerifierListByCompany(company?: string){
    this.selectedLocationList = [];
    this.locationList.filter((location: any) => location.parentId == company).forEach((location: any) => {
      this.selectedLocationList.push(location);
    });
    console.log("this.selectedLocationList", this.selectedLocationList);
    
  }
  onModelChangeLocation(event: any) {
    console.log("event.value", event.value);
    this.selectedBranchList = [];
      this.branchList.filter((branch: any) => branch.parentId == event.value).forEach((branch: any) => {
        this.selectedBranchList.push(branch);
      });
  }
  onModelChangeBranch(event: any) {
    console.log("event.value", event.value);
    // this.selectedBranchList = event.value;
  }
  submitAddConfiguration() {
    console.log(this.addConfigurationForm.value);
  }
  onModelChange(event: any) {
    console.log(event);
  }
  closeModal() {
    this.activeModal.close();
  }

}
