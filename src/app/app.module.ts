import 'hammerjs';

import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
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
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { BillComponent } from './components/bill/bill.component';
import { InputPasswordComponent } from './components/inputs/input-password/input-password.component';
import { InputTextComponent } from './components/inputs/input-text/input-text.component';
import { InputToggleComponent } from './components/inputs/input-toggle/input-toggle.component';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { FirebaseService } from './services/firebase.service';

const appRoutes: Routes = routes;

@NgModule({
	declarations: [AppComponent,
		LoginComponent, BillComponent, OverviewComponent, InputTextComponent, InputToggleComponent, InputPasswordComponent],
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
		MatSlideToggleModule,
		MatPaginatorModule,
		MatSortModule,
		MatProgressSpinnerModule,
		MatPasswordStrengthModule.forRoot(),
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
