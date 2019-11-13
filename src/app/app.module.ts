import 'hammerjs';

import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatInputModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatSlideToggleModule,
	MatSortModule,
	MatTableModule,
	MatTooltipModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BillComponent } from './components/bill/bill.component';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { AppSpinnerComponent } from './components/tools/app-spinner/app-spinner.component';
import { InputPasswordComponent } from './components/tools/inputs/input-password/input-password.component';
import { InputTextComponent } from './components/tools/inputs/input-text/input-text.component';
import { InputToggleComponent } from './components/tools/inputs/input-toggle/input-toggle.component';
import { TableCellDirective } from './components/tools/table/directives/table-cell.directive';
import { TableComponent } from './components/tools/table/table.component';
import { FirebaseService } from './services/firebase.service';
import { NavigationService } from './services/navigation.service';
import { PreviousUrlService } from './services/previous-url.service';
import { SchedulesComponent } from './components/schedules/schedules.component';

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
		PageNotFoundComponent,
		AppSpinnerComponent,
		TableComponent,
		TableCellDirective,
		SchedulesComponent
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
		MatProgressBarModule,
		MatButtonModule,
		MatPasswordStrengthModule.forRoot(),
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
		FormsModule,
		ReactiveFormsModule,
		MatTooltipModule,
		AppRoutingModule
	],
	providers: [
		FirebaseService,
		AngularFireAuth,
		NavigationService,
		PreviousUrlService,
		{
			provide: APP_INITIALIZER,
			useFactory: (ds: PreviousUrlService) => function () { return ds.init(); },
			deps: [PreviousUrlService],
			multi: true
		}
	],
	exports: [
		TableCellDirective
	],
	bootstrap: [AppComponent],
})
export class AppModule { }
