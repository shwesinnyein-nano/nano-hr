import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureModuleComponent } from './feature-module.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { TransactionHistoryComponent } from './hr/accounting/transaction-history/transaction-history.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FeatureModuleComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../feature-module/main/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'apps',
        loadChildren: () =>
          import('./main/apps/apps.module').then((m) => m.AppsModule),
      },
      {
        path: 'employees',
        loadChildren: () =>
          import('../feature-module/employee/employees/employees.module').then(
            (m) => m.EmployeesModule
          ),
      },
      {
        path: 'product',
        loadChildren: () =>
          import('../feature-module/product/product.module').then(
            (m) => m.ProductModule
          ),
      },


      
      {
        path: 'accounting',
        loadChildren: () =>
          import('./hr/accounting/accounting.module').then(
            (m) => m.AccountingModule
          ),
      },
      // {
      //   path: 'accounting/transaction-history',
      //   component: TransactionHistoryComponent  
        
      // },
      {
        path: 'payroll',
        loadChildren: () =>
          import('./hr/payroll/payroll.module').then((m) => m.PayrollModule),
      },
      {
        path: 'policies',
        loadChildren: () =>
          import('./hr/policies/policies.module').then((m) => m.PoliciesModule),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./hr/reports/reports.module').then((m) => m.ReportsModule),
      },



      {
        path: 'assets',
        loadChildren: () =>
          import('./administration/assets/assets.module').then(
            (m) => m.AssetsModule
          ),
      },

      {
        path: 'users',
        loadChildren: () =>
          import('./administration/users/users.module').then(
            (m) => m.UsersModule
          ),
      },
      
      {
        path: 'settings',
        loadChildren: () =>
          import('./administration/settings/settings.module').then(
            (m) => m.SettingsModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./page/profile/profile.module').then((m) => m.ProfileModule),
      },

      {
        path: 'configuration',
        loadChildren: () =>
          import('./administration/configuration/configuration.module').then(
              (m) => m.ConfigurationModule
          ),
      },

      {
        path: 'pages',
        loadChildren: () =>
          import('./page/pages/pages.module').then((m) => m.PagesModule),
      },
      // {
      //   path: 'elements',
      //   loadChildren: () =>
      //     import('./ui-interface/elements/elements.module').then(
      //       (m) => m.ElementsModule
      //     ),
      // },
      // {
      //   path: 'icon',
      //   loadChildren: () =>
      //     import('./ui-interface/icon/icon.module').then((m) => m.IconModule),
      // },
      // {
      //   path: 'charts',
      //   loadChildren: () =>
      //     import('./ui-interface/charts/charts.module').then(
      //       (m) => m.ChartsModule
      //     ),
      // },
      // {
      //   path: 'base-ui',
      //   loadChildren: () =>
      //     import('./ui-interface/base-ui/base-ui.module').then(
      //       (m) => m.BaseUiModule
      //     ),
      // },
      // {
      //   path: 'table',
      //   loadChildren: () =>
      //     import('./ui-interface/table/table.module').then(
      //       (m) => m.TableModule
      //     ),
      // },
      // {
      //   path: 'forms',
      //   loadChildren: () =>
      //     import('./ui-interface/forms/forms.module').then(
      //       (m) => m.FormsModule
      //     ),
      // },
      // {
      //   path: 'advanced-ui',
      //   loadChildren: () =>
      //     import('./ui-interface/advanced-ui/advanced-ui.module').then(
      //       (m) => m.AdvancedUiModule
      //     ),
      // },



      // {
      //   path: 'jobs',
      //   loadChildren: () =>
      //     import('../feature-module/administration/jobs/jobs.module').then(
      //       (m) => m.JobsModule
      //     ),
      // },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./auth/register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./auth/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
  },
  {
    path: 'otp',
    loadChildren: () =>
      import('./auth/otp/otp.module').then((m) => m.OtpModule),
  },
  {
    path: 'lock-screen',
    loadChildren: () =>
      import('./auth/lock-screen/lock-screen.module').then(
        (m) => m.LockScreenModule
      ),
  },
  {
    path: 'error-404',
    loadChildren: () =>
      import('./page/error-pages/error404/error404.module').then(
        (m) => m.Error404Module
      ),
  },
  {
    path: 'error-500',
    loadChildren: () =>
      import('./page/error-pages/error500/error500.module').then(
        (m) => m.Error500Module
      ),
  },

  { path: '**', redirectTo: 'admin/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureModuleRoutingModule {}
