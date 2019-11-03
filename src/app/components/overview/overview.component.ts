import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/model/bill';

import { BillsDataSource } from '../../services/bills.datasource';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

export interface TableColumn {
	name: string;
	header: string;
}

@Component({
	selector: 'app-overview',
	templateUrl: './overview.component.html',
	styleUrls: ['./overview.component.scss'],
	// animation fix based on: https://github.com/angular/material2/issues/11990
	animations: [
		trigger('detailExpand', [
			state('collapsed, void', style({
				height: '0px',
				minHeight: '0',
				display: 'none'
			})),
			state('expanded', style({
				height: '*'
			})),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})
export class OverviewComponent implements OnInit {
	expandedRow: any;
	activeRow: any;

	dataSource: BillsDataSource;
	dataColumns = [
		{ name: 'name', header: 'Nazwa' },
		{ name: 'deadline', header: 'Termin' },
		{ name: 'sum', header: 'Kwota' }
	];
	columns = ['_expand', ...this.dataColumns.map(column => column.name)];

	constructor(private firebaseService: FirebaseService,
		private authService: AuthService,
		private router: Router) { }

	ngOnInit() {
		this.dataSource = new BillsDataSource(this.firebaseService);
		this.dataSource.loadBills();
	}

	onRowClicked(row) {
		if (this.activeRow !== row) {
			this.activeRow = row;
		}
	}

	onRowExpandClick(row: any) {
		if (this.expandedRow === row) {
			this.expandedRow = undefined;
		} else {
			this.expandedRow = row;
		}
	}

	getValue(row: Bill, column: string): string {
		switch (column) {
			case 'deadline':
			case 'remindOn':
				return row[column] ? row[column].toDate().toISOString().substring(0, 10) : undefined;
			case 'sum':
				const formatter = new Intl.NumberFormat('pl-PL', {
					style: 'currency',
					currency: 'PLN',
				});
				return formatter.format(row[column]);
			default:
				return row[column];
		}
	}

	getId(row: Bill): number {
		return row.id;
	}

	deleteBill() {
		if (this.activeRow) {
			this.firebaseService.deleteBill(this.activeRow)
				.then(() => {
					console.log('Document successfully deleted!');
					this.activeRow = undefined;
				}).catch((error) => console.error('Error deleting document: ', error));
		}
	}

	logout() {
		this.authService.logout();
		this.router.navigate(['/login']);
	}

}
