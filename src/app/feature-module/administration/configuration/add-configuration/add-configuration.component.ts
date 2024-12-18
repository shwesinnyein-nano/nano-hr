import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/core/services/data/data.service';
import { UserRoleService } from 'src/app/core/services/user-role/user-role.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-add-configuration',
  
  templateUrl: './add-configuration.component.html',
  styleUrl: './add-configuration.component.scss'
})
export class AddConfigurationComponent implements OnInit {

  addConfigurationForm!: FormGroup;
  companyList: any[] = [];
  selectedCompany: any;
  selectedLocation: any;
  selectedBranch: any;
  selectedVerifier: any;
  selectedApproverOne: any;
  selectedApproverTwo: any;
  selectedApproverThree: any;
  positionList: any[] = [];
  roleList: any[] = [];
  locationList: any[] = [];
  branchList: any[] = [];
  isEdit: boolean = false;
  isView: boolean = false;
  selectedLocationList: any[] = [];
  data: any;
  firstApproverList: any[] = [];
  secondApproverList: any[] = [];
  thirdApproverList: any[] = [];
  selectedBranchList: any[] = [];
  isNotVip: boolean = false;
  

  verifierList: any[] = [];
  userList: any[] = [];
  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal, private dataService: DataService, private userService: UserRoleService    ) { }

  ngOnInit(): void {
    this.fetchAllList();
    this.getUserList();
    this.loadForm(this.data);
   
  }

  loadForm(data?: any) {
   
    this.addConfigurationForm = this.fb.group({
      uid: [data?.uid || uuidv4()],
      company: [data?.company || '', Validators.required],
      companyName: [data?.companyName || ''],
      location: [data?.location || '', Validators.required],
      locationName: [data?.locationName || ''],
      branch: [data?.branch || '',],
      branchName: [data?.branchName || ''],
      verifier: [data?.verifier || '', Validators.required],
      verifierName: [data?.verifierName || ''],
      approver_one: [data?.approver_one || '', Validators.required],
      approver_oneName: [data?.approver_oneName || ''],
      approver_two: [data?.approver_two || '', Validators.required],
      approver_twoName: [data?.approver_twoName || ''],
      approver_three: [data?.approver_three || '', Validators.required],
      approver_threeName: [data?.approver_threeName || ''],
    });
    console.log("edit data", this.data);
    this.selectedCompany = this.data?.company;
    this.selectedLocation = this.data?.location;
    this.selectedBranch = this.data?.branch;
    this.selectedVerifier = this.data?.verifier;
    this.selectedApproverOne = this.data?.approver_one;
    this.selectedApproverTwo = this.data?.approver_two;
    this.selectedApproverThree = this.data?.approver_three;
   
    if(this.data && this.data.uid){
      this.setOldData();
    }
  }
  getUserList(){
    this.userService.getUsers().subscribe((res: any) => {
      this.userList = res.data;
      
    });
    console.log("userList 1", this.userList);
    
  }
  fetchAllList() {
   this.dataService.fetchAllList().subscribe((res: any) => {
    this.companyList = res.companyList.data;
    this.positionList = res.positionList.data;
    this.roleList = res.userRoleList.data;
    this.locationList = res.locationList.data;
    this.branchList = res.branchList.data;
    
   });
  }

  setOldData(){
    console.log("user data list", this.userList);
    if(this.selectedCompany){
      if(this.selectedCompany == 'nano-vip'){
        this.isNotVip = false;
        this.firstVerifierListByCompany('nano-vip');
       
      }
      else if(this.selectedCompany == 'nano-store'){
        this.isNotVip = true;
        this.firstVerifierListByCompany('nano-store');
      }
      else{
        this.isNotVip = true;
        this.firstVerifierListByCompany('nano-entertainment');
      }
    }
    this.dataService.getCompanyList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
     
      if(res){
        this.companyList = res;
        
      }
    });
    this.dataService.getLocationList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((location: any) => location.parentId == this.selectedCompany);
     
      this.locationList = list;
      this.selectedLocationList = list;
    });
    this.dataService.getBranchList().pipe(
      map((res: any) => res.data)
    ).subscribe((res: any) => {
      const list = res.filter((branch: any) => branch.parentId == this.selectedLocation);
    
      this.branchList = list;
      this.selectedBranchList = list;
    });
    
   
   this.getVerifierListByLocation(this.selectedLocation);
  
  

  }
  onCompanyChange(event: any) {
    
    console.log(event.value);
    this.selectedCompany = event.value;
    if(this.selectedCompany == 'nano-vip'){
      this.isNotVip = false;
     
     this.firstVerifierListByCompany('nano-vip');
    }
    else if(this.selectedCompany == 'nano-store'){
      this.isNotVip = true;

      this.firstVerifierListByCompany('nano-store');
    }
    else{
      this.isNotVip = true;
      this.firstVerifierListByCompany('nano-entertainment');
    }
    this.addConfigurationForm.get('companyName')?.setValue(this.companyList.find((company: any) => company.id == this.selectedCompany)?.name);
  }
  firstVerifierListByCompany(company?: string){
   
    console.log("company", company);
    console.log("this.locationList", this.locationList);
    
    this.selectedLocationList = [];
    this.locationList.filter((location: any) => location.parentId == company).forEach((location: any) => {
      this.selectedLocationList.push(location);
    });
    console.log("this.selectedLocationList", this.companyList);
    

    
    
  }
  onModelChangeLocation(event: any) {
    console.log("event.value", event.value);
    this.selectedBranchList = [];
      this.branchList.filter((branch: any) => branch.parentId == event.value).forEach((branch: any) => {
        this.selectedBranchList.push(branch);
      });
      this.getVerifierListByLocation(event.value);
     this.addConfigurationForm.get('locationName')?.setValue(this.selectedLocationList.find((location: any) => location.id == event.value)?.name);
  }
  
  getVerifierListByLocation(location?: string){
    console.log("location", location);
    this.verifierList = []; 
    this.firstApproverList = [];
    this.secondApproverList = [];
    this.thirdApproverList = [];
    this.userService.getUsers().subscribe((res: any) => {
      this.userList = res.data;

      this.userList.filter((user: any) => user.company == this.selectedCompany && user.location == location && user.role == 'verifier').forEach((user: any) => {
        this.verifierList.push(user);
      });
      this.firstApproverList = [];
      this.userList.filter((user: any) => user.company == this.selectedCompany && user.location == location && user.role == 'approver' && user.positionName == 'Management').forEach((user: any) => {
        
        this.firstApproverList.push(user);
      });
      this.secondApproverList  = [];
      this.userList.filter((user: any) => user.company == this.selectedCompany && user.location == location && user.role == 'approver' && user.positionName == 'Accountant').forEach((user: any) => {
        
          this.secondApproverList.push(user);
      });
      this.userList.filter((user: any) => user.company == this.selectedCompany && user.location == location && user.role == 'approver' && user.positionName == 'Management').forEach((user: any) => {
        
        this.thirdApproverList.push(user);
      });
      
    });
   
   
  }
  onChangeVerifier(event: any) {
   
    this.addConfigurationForm.get('verifierName')?.setValue(this.verifierList.find((user: any) => user.id == event.value)?.firstName + ' ' + this.verifierList.find((user: any) => user.id == event.value)?.lastName);
  }
  onChangeApproverOne(event: any) {
    this.addConfigurationForm.get('approver_oneName')?.setValue(this.firstApproverList.find((user: any) => user.id == event.value)?.firstName + ' ' + this.firstApproverList.find((user: any) => user.id == event.value)?.lastName);
  }
  onChangeApproverTwo(event: any) {
    this.addConfigurationForm.get('approver_twoName')?.setValue(this.secondApproverList.find((user: any) => user.id == event.value)?.firstName + ' ' + this.secondApproverList.find((user: any) => user.id == event.value)?.lastName);
  }
  onChangeApproverThree(event: any) {
    this.addConfigurationForm.get('approver_threeName')?.setValue(this.thirdApproverList.find((user: any) => user.id == event.value)?.firstName + ' ' + this.thirdApproverList.find((user: any) => user.id == event.value)?.lastName);
  }
  onModelChangeBranch(event: any) {
    console.log("event.value", event.value);
    // this.selectedBranchList = event.value;
  }
  submitAddConfiguration() {
    console.log(this.addConfigurationForm.value);
    if(this.addConfigurationForm.invalid){
      this.addConfigurationForm.markAllAsTouched();
    }   
    else{
     
      this.activeModal.close({
        data: { ...this.addConfigurationForm.value},
      // Add current user's UID to the data
      });
    }
  }
  onModelChange(event: any) {
    console.log(event);
  }
  closeModal() {
    this.activeModal.close();
  }

}
