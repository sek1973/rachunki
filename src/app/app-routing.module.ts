import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { BillComponent } from './components/bill/bill.component';
import { OverviewComponent } from './components/overview/overview.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: 'zestawienie',
    component: OverviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rachunek',
    component: BillComponent,
    pathMatch: 'full',
    data: { title: 'Nowy rachunek' },
    canActivate: [AuthGuard]
  },
  {
    path: 'rachunek/:id',
    component: BillComponent,
    pathMatch: 'full',
    data: { title: 'Rachunek' },
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/zestawienie',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule, RouterModule.forRoot(
      routes,
      { enableTracing: false },
    ),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
