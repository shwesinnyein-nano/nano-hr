import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountingComponent } from './accounting.component';
import { BudgetExpensesComponent } from './budget-expenses/budget-expenses.component';
import { BudgetRevenuesComponent } from './budget-revenues/budget-revenues.component';


import { BudgetExpensesAddModalComponent } from './budget-expenses-add-modal/budget-expenses-add-modal.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { ApprovalExpenseComponent } from './approval-expense/approval-expense.component';

const routes: Routes = [
  { 
    path: '', 
    component: AccountingComponent,
    children: [
     
     
      { path: "budget-expenses", component: BudgetExpensesComponent },
      { path: "budget-revenues", component: BudgetRevenuesComponent },
     
      { path: "budget-expenses-add-modal", component: BudgetExpensesAddModalComponent },
      { path: "transaction-history", component: TransactionHistoryComponent },
      { path: "approval-expense", component: ApprovalExpenseComponent },
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
