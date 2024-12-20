import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInfoListComponent } from './employee-info-list.component';

describe('EmployeeInfoListComponent', () => {
  let component: EmployeeInfoListComponent;
  let fixture: ComponentFixture<EmployeeInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeInfoListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
