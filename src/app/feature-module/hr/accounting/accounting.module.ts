import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingComponent } from './accounting.component';

import { BudgetExpensesComponent } from './budget-expenses/budget-expenses.component';
import { BudgetRevenuesComponent } from './budget-revenues/budget-revenues.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { BudgetExpensesAddModalComponent } from './budget-expenses-add-modal/budget-expenses-add-modal.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageModule } from 'src/app/core/services/languages/languages.modules'
import { ApprovalExpenseComponent } from './approval-expense/approval-expense.component';
@NgModule({
  declarations: [
    AccountingComponent,
   
    BudgetExpensesComponent,
    BudgetRevenuesComponent,
  
    BudgetExpensesAddModalComponent,
    TransactionHistoryComponent,
    ApprovalExpenseComponent
    
  ],
  imports: [
    CommonModule,
    AccountingRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LanguageModule
  ]
})
export class AccountingModule { }
