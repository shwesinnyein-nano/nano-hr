import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetExpensesAddModalComponent } from './budget-expenses-add-modal.component';

describe('BudgetExpensesAddModalComponent', () => {
  let component: BudgetExpensesAddModalComponent;
  let fixture: ComponentFixture<BudgetExpensesAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetExpensesAddModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BudgetExpensesAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
