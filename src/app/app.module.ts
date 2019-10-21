import 'hammerjs';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatTooltipModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { BillComponent } from './components/bill/bill.component';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { FirebaseService } from './services/firebase.service';
import { InputTextComponent } from './components/inputs/input-text/input-text.component';

const appRoutes: Routes = routes;

@NgModule({
	declarations: [AppComponent, LoginComponent, BillComponent, OverviewComponent, InputTextComponent],
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
		FormsModule,
		ReactiveFormsModule,
		MatTooltipModule
	],
	providers: [FirebaseService],
	bootstrap: [AppComponent],
})
export class AppModule { }
