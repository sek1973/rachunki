import { ConfirmDialogResponse } from './../tools/confirm-dialog/confirm-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { getSafe } from 'src/app/helpers';
import { Bill } from 'src/app/model/bill';
import { ConfirmationService } from 'src/app/services/confirmation.service';

import { BillsDataSource } from '../../services/bills.datasource';
import { BillsFirebaseService } from '../../services/bills.firebase.service';
import { ConfirmDialogInputType } from '../tools/confirm-dialog/confirm-dialog.model';
import { validateBillName } from '../tools/inputs/validators/validators';
import { AuthService } from './../../services/auth.service';
import { TableComponent } from './../tools/table/table.component';

export interface TableColumn {
	name: string;
	header: string;
}

@Component({
	selector: 'app-overview',
	templateUrl: './overview.component.html',
	styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
	dataSource: BillsDataSource;
	columns = [
		{ name: 'name', header: 'Nazwa' },
		{ name: 'deadline', header: 'Termin' },
		{ name: 'sum', header: 'Kwota' }
	];
	loading: boolean = false;

	@ViewChild('table', { static: false }) table: TableComponent;

	constructor(private billsFirebaseService: BillsFirebaseService,
		private authService: AuthService,
		private router: Router,
		private confirmationService: ConfirmationService,
		private snackBar: MatSnackBar) { }

	ngOnInit() {
		this.dataSource = new BillsDataSource(this.billsFirebaseService);
	}

	onRowClicked(row: Bill) {
		this.table.canDelete = row ? true : false;
		this.table.canEdit = row ? true : false;
	}

	getValue(row: Bill, column: string): string {
		return getSafe(() => row[column]);
	}

	getId(row: Bill): number {
		return row.id;
	}

	deleteBill() {
		const row = this.table.activeRow as Bill;
		if (row) {
			this.confirmationService
				.confirm('Usuń rachunek',
					'Czy na pewno chcesz usunąć bieżący rachunek wraz z historią płatności? Operacji nie będzie można cofnąć! ' +
					'Aby potwierdzić podaj nazwę rachunku.', 'Nie', 'Tak',
					ConfirmDialogInputType.InputTypeText, undefined, [Validators.required, validateBillName(row.name)], 'Nazwa rachunku', 'Nazwa rachunku')
				.subscribe((response) => {
					if (response) {
						this.billsFirebaseService.delete(row)
							.then(() => this.snackBar.open('Opłacenie rachunku zapisane!', 'Ukryj', { duration: 3000 }),
								error => this.snackBar.open('Błąd usuwania rachunku: ' + error, 'Ukryj', { panelClass: 'snackbar-style-error' }));
					}
				});
		}
	}

	editBill() {
		const row = this.table.activeRow;
		if (row) {
			this.router.navigate(['/rachunek', this.getId(row)]);
		}
	}

	addBill() {
		this.router.navigate(['/rachunek']);
	}

	logout() {
		this.billsFirebaseService.disconnect();
		this.authService.logout().then(
			() => {
				this.router.navigate(['/login']);
				this.snackBar.open('Wylogowano z aplikacji!', 'Ukryj', { duration: 3000 });
			},
			rejected => this.snackBar.open('Błąd wylogowania z aplikacji:' + rejected, 'Ukryj', { panelClass: 'snackbar-style-error' }));
	}

	refresh() {
		this.billsFirebaseService.load();
	}

	formatLinkColor(row: Bill): string {
		if (!row.active) { return 'lighgray'; }
		return '';
	}

	formatColor(row: Bill): string {
		if (!row.active) { return 'lighgray'; }
		if (row.deadline && row.deadline.toDate() < new Date()) { return 'red'; }
		const inAWeek = new Date();
		inAWeek.setDate(inAWeek.getDate() + 7);
		if (row.deadline && row.deadline.toDate() < inAWeek) { return 'darkgoldenrod'; }
		console.log(new Date(new Date().getDate() + 7));
		return '';
	}

	payBill() {
		if (this.table.activeRow) {
			const bill = this.table.activeRow;
			this.confirmationService
				.confirm('Rachunek opłacony',
					'Podaj kwotę jaka została zapłacona:', 'Anuluj', 'OK',
					ConfirmDialogInputType.InputTypeCurrency, bill.sum * bill.share, [Validators.required], 'Kwota', 'Kwota')
				.subscribe((response) => {
					if (response) {
						this.loading = true;
						this.billsFirebaseService.pay(bill, (response as ConfirmDialogResponse).value)
							.then(() => {
								this.loading = false;
								this.snackBar.open('Opłacenie rachunku zapisane!', 'Ukryj', { duration: 3000 });
							},
								error => {
									this.loading = false;
									this.snackBar.open('Błąd zapisania opłacenia rachunku: ' + error,
										'Ukryj', { panelClass: 'snackbar-style-error' });
								}
							);
					}
				});
		}
	}

}
