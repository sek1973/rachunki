import { Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { getSafe } from 'src/app/helpers';
import { Bill } from 'src/app/model/bill';
import { ConfirmationService } from 'src/app/services/confirmation.service';

import { BillsDataSource } from '../../services/bills.datasource';
import { BillsFirebaseService } from '../../services/bills.firebase.service';
import { AuthService } from './../../services/auth.service';
import { TableComponent } from './../tools/table/table.component';
import { ConfirmDialogInputType } from '../tools/confirm-dialog/confirm-dialog.model';
import { validateBillName } from '../tools/inputs/validators/validators';

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

	@ViewChild('table', { static: false }) table: TableComponent;

	constructor(private billsFirebaseService: BillsFirebaseService,
		private authService: AuthService,
		private router: Router,
		private confirmationService: ConfirmationService) { }

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
					if (response) { this.billsFirebaseService.delete(row); }
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
				console.log('logged out');
			},
			rejected => console.error('logout:', rejected));
	}

	refresh() {
		this.billsFirebaseService.load();
	}

}
