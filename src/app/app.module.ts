import 'hammerjs';

import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSlideToggleModule,
	MatSortModule,
	MatTableModule,
	MatTooltipModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BillComponent } from './components/bill/bill.component';
import { InputPasswordComponent } from './components/inputs/input-password/input-password.component';
import { InputTextComponent } from './components/inputs/input-text/input-text.component';
import { InputToggleComponent } from './components/inputs/input-toggle/input-toggle.component';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { FirebaseService } from './services/firebase.service';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		BillComponent,
		OverviewComponent,
		InputTextComponent,
		InputToggleComponent,
		InputPasswordComponent,
		PaymentsComponent,
		PageNotFoundComponent
	],
	imports: [
		BrowserModule,
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		MatInputModule,
		MatTableModule,
		MatSlideToggleModule,
		MatPaginatorModule,
		MatSortModule,
		MatProgressSpinnerModule,
		MatButtonModule,
		MatPasswordStrengthModule.forRoot(),
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
		FormsModule,
		ReactiveFormsModule,
		MatTooltipModule,
		AppRoutingModule
	],
	providers: [FirebaseService],
	bootstrap: [AppComponent],
})
export class AppModule { }
