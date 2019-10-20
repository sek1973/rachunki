import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/model/bill';

import { FirebaseService } from '../../services/firebase.service';
import { BillsDataSource } from '../../services/rachunki.datasource';

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
	dataColumns = ['name', 'deadline', 'sum'];
	columns = ['_expand', ...this.dataColumns];

	constructor(private firebaseService: FirebaseService) { }

	ngOnInit() {
		this.dataSource = new BillsDataSource(this.firebaseService);
		this.dataSource.loadBills();
	}

	onRowClicked(row) {
		console.log('Row clicked: ', row);
	}

	onRowClick(row: any) {
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
				return row[column].toDate().toISOString().substring(0, 10);
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
}
