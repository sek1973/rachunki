import 'hammerjs';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { BillComponent } from './components/bill/bill.component';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { FirebaseService } from './services/firebase.service';

const appRoutes: Routes = [
	{ path: 'zestawienie', component: OverviewComponent },
	{
		path: 'rachunek/:id',
		component: BillComponent,
		data: { title: 'Rachunek' },
	},
	{
		path: '',
		redirectTo: '/zestawienie',
		pathMatch: 'full',
	},
];

@NgModule({
	declarations: [AppComponent, LoginComponent, BillComponent, OverviewComponent],
	imports: [
		BrowserModule,
		RouterModule.forRoot(
			appRoutes,
			{ enableTracing: true }, // <-- debugging purposes only
		),
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		MatInputModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatProgressSpinnerModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
	],
	providers: [FirebaseService],
	bootstrap: [AppComponent],
})
export class AppModule { }
