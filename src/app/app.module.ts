import 'hammerjs';

import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { PercentPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MAT_DATE_LOCALE,
	MatButtonModule,
	MatDatepickerModule,
	MatDialogModule,
	MatInputModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatSelectModule,
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
import { BillEditComponent } from './components/bill/bill-edit/bill-edit.component';
import { BillComponent } from './components/bill/bill.component';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PaymentDialogComponent } from './components/payments/payment-dialog/payment-dialog.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { ScheduleDialogComponent } from './components/schedules/schedule-dialog/schedule-dialog.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { AppSpinnerComponent } from './components/tools/app-spinner/app-spinner.component';
import { ConfirmDialogComponent } from './components/tools/confirm-dialog/confirm-dialog.component';
import { InputDateComponent } from './components/tools/inputs/input-date/input-date.component';
import { InputPasswordComponent } from './components/tools/inputs/input-password/input-password.component';
import { InputSelectComponent } from './components/tools/inputs/input-select/input-select.component';
import { InputTextComponent } from './components/tools/inputs/input-text/input-text.component';
import { InputToggleComponent } from './components/tools/inputs/input-toggle/input-toggle.component';
import { TableCellDirective } from './components/tools/table/directives/table-cell.directive';
import { TableComponent } from './components/tools/table/table.component';
import { ViewFieldTextComponent } from './components/tools/view-fields/view-field-text/view-field-text.component';
import { ViewFieldToggleComponent } from './components/tools/view-fields/view-field-toggle/view-field-toggle.component';
import { CurrencyToStringPipe } from './pipes/currency-to-string.pipe';
import { DynamicPipe } from './pipes/dynamic.pipe';
import { TimespanToStringPipe } from './pipes/timespan-to-string.pipe';
import { NavigationService } from './services/navigation.service';
import { PreviousUrlService } from './services/previous-url.service';
import { InputCurrencyComponent } from './components/tools/inputs/input-currency/input-currency.component';
import { InputCurrencyDirective } from './components/tools/inputs/directives/input-currency.directive';

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
		SchedulesComponent,
		ScheduleDialogComponent,
		PaymentDialogComponent,
		InputDateComponent,
		TimespanToStringPipe,
		CurrencyToStringPipe,
		ConfirmDialogComponent,
		ViewFieldTextComponent,
		ViewFieldToggleComponent,
		BillEditComponent,
		DynamicPipe,
		InputSelectComponent,
		InputCurrencyComponent,
		InputCurrencyDirective
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
		AppRoutingModule,
		MatDialogModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatSelectModule
	],
	providers: [
		AngularFireAuth,
		NavigationService,
		PreviousUrlService,
		TimespanToStringPipe,
		CurrencyToStringPipe,
		PercentPipe,
		{
			provide: APP_INITIALIZER,
			useFactory: (ds: PreviousUrlService) => function () { return ds.init(); },
			deps: [PreviousUrlService],
			multi: true
		},
		{ provide: MAT_DATE_LOCALE, useValue: 'pl-PL' }
	],
	exports: [
		TableCellDirective
	],
	entryComponents: [
		ScheduleDialogComponent,
		PaymentDialogComponent,
		ConfirmDialogComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
