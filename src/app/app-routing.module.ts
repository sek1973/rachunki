import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { BillComponent } from './components/bill/bill.component';
import { OverviewComponent } from './components/overview/overview.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: 'zestawienie', component: OverviewComponent },
  {
    path: 'rachunek',
    component: BillComponent,
    pathMatch: 'full',
    data: { title: 'Nowy rachunek' },
  },
  {
    path: 'rachunek/:id',
    component: BillComponent,
    pathMatch: 'full',
    data: { title: 'Rachunek' },
  },
  {
    path: '',
    redirectTo: '/zestawienie',
    pathMatch: 'full',
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
