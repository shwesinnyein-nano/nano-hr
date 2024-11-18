import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { EmployeeDashboardComponent } from "./employee-dashboard/employee-dashboard.component";

import { DealsDashboardComponent } from "./deals-dashboard/deals-dashboard.component";
import { LeadsDashboardComponent } from "./leads-dashboard/leads-dashboard.component";


const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      { path: "admin", component: AdminDashboardComponent },
      { path: "employee", component: EmployeeDashboardComponent },

      { path: "leads", component: LeadsDashboardComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
