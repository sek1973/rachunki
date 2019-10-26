import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FirebaseService } from './../../services/firebase.service';

@Component({
	selector: 'app-rachunek',
	templateUrl: './bill.component.html',
	styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit, OnDestroy {
	private subscription = Subscription.EMPTY;
	form: FormGroup = new FormGroup({
		name: new FormControl(),
		description: new FormControl(),
		url: new FormControl()
	});

	constructor(private route: ActivatedRoute,
		private router: Router,
		private firebaseService: FirebaseService) { }

	ngOnInit() {
		this.subscription = this.route.paramMap.pipe(switchMap(param => {
			const params = param['params'];
			const id = params ? params['id'] : undefined;
			return this.firebaseService.fetchBill(id);
		})).subscribe(bill => {
			this.form.patchValue({
				id: bill.id,
				name: bill.name,
				description: bill.description,
				url: bill.url
			});
			console.log('bill data:', bill);
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
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
