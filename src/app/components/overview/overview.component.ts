import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { getSafe } from 'src/app/helpers';
import { Bill } from 'src/app/model/bill';

import { BillsDataSource } from '../../services/bills.datasource';
import { FirebaseService } from '../../services/firebase.service';
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

	@ViewChild('table', { static: false }) table: TableComponent;

	constructor(private firebaseService: FirebaseService,
		private authService: AuthService,
		private router: Router) { }

	ngOnInit() {
		this.dataSource = new BillsDataSource(this.firebaseService);
	}

	onRowClicked(row: Bill) {
		if (row) {
			this.table.canDelete = true;
			this.table.canEdit = true;
		}
	}

	getValue(row: Bill, column: string): string {
		return getSafe(() => row[column]);
	}

	getId(row: Bill): number {
		return row.id;
	}

	deleteBill() {
		const row = this.table.activeRow;
		if (row) {
			this.firebaseService.deleteBill(row)
				.then(() => {
					console.log('Document successfully deleted!');
					// this.table.activeRow = undefined;
				}).catch((error) => console.error('Error deleting document: ', error));
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
		this.firebaseService.disconnect();
		this.authService.logout().then(
			() => {
				this.router.navigate(['/login']);
				console.log('logged out');
			},
			rejected => console.error('logout:', rejected));
	}

	refresh() {
		this.firebaseService.loadBills();
	}

}
