import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalExpenseComponent } from './approval-expense.component';

describe('ApprovalExpenseComponent', () => {
  let component: ApprovalExpenseComponent;
  let fixture: ComponentFixture<ApprovalExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalExpenseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovalExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
