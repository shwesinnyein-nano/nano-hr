import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeInfoViewComponent } from './employe-info-view.component';

describe('EmployeInfoViewComponent', () => {
  let component: EmployeInfoViewComponent;
  let fixture: ComponentFixture<EmployeInfoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeInfoViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
