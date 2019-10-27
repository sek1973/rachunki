import { Bill } from './../../model/bill';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap, mergeMap, map } from 'rxjs/operators';

import { FirebaseService } from './../../services/firebase.service';
import { getSafe } from 'src/app/helpers';

@Component({
	selector: 'app-rachunek',
	templateUrl: './bill.component.html',
	styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit, OnDestroy {

	private subscription = Subscription.EMPTY;

	bill: Bill;
	form: FormGroup = new FormGroup({
		name: new FormControl(),
		description: new FormControl(),
		url: new FormControl()
	});

	constructor(private route: ActivatedRoute,
		private router: Router,
		private firebaseService: FirebaseService) { }

	ngOnInit() {
		let id: number;
		this.subscription = this.route.paramMap.pipe(switchMap(param => {
			const params = param['params'];
			id = params ? +params['id'] : undefined;
			return this.firebaseService.billsObservable;
		})).subscribe(bills => {
			if (bills && bills.length) {
				this.bill = bills.find(b => b.id === id);
				this.form.patchValue({
					id: this.bill.id,
					name: this.bill.name,
					description: this.bill.description,
					url: this.bill.url
				});
				console.log('bill data:', this.bill);
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	getTitle(): string {
		const title = getSafe(() => this.bill.name);
		return title || 'Rachunek bez nazwy';
	}

	getErrorMessage(...path: string[]): string {
		const formControl = this.form.get(path);
		if (formControl !== null) {
			const errors = formControl.errors;
			if (errors) {
				return errors.values().join('\n');
			}
		}
		return 'Invalid value provided';
	}

}
