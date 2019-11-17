import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { getSafe } from 'src/app/helpers';
import { ConfirmationService } from 'src/app/services/confirmation.service';

import { Bill } from './../../model/bill';
import { AuthService } from './../../services/auth.service';
import { BillsFirebaseService } from './../../services/bills.firebase.service';

@Component({
	selector: 'app-bill',
	templateUrl: './bill.component.html',
	styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit, OnDestroy {

	private subscription = Subscription.EMPTY;
	editMode = false;
	private newBill = false;

	bill: Bill;
	form: FormGroup = new FormGroup({
		id: new FormControl,
		uid: new FormControl,
		name: new FormControl(),
		description: new FormControl(),
		url: new FormControl(),
		active: new FormControl(),
		login: new FormControl(),
		password: new FormControl(),
		share: new FormControl(),
		sum: new FormControl(),
		deadline: new FormControl()
	});

	constructor(private route: ActivatedRoute,
		private router: Router,
		private billsFirebaseService: BillsFirebaseService,
		private authService: AuthService,
		private confirmationService: ConfirmationService) { }

	ngOnInit() {
		let id: number;
		this.subscription = this.route.paramMap.pipe(switchMap(param => {
			const params = param['params'];
			id = params ? +params['id'] : undefined;
			return this.billsFirebaseService.billsObservable;
		}))
			.subscribe(bills => this.handleData(bills, id));
	}

	private handleData(bills: Bill[], id: number) {
		this.bill = bills.find(b => b.id === id);
		if (!this.bill) {
			this.createBill();
			this.editMode = true;
			this.newBill = true;
		} else {
			this.editMode = false;
			this.newBill = false;
		}
		this.loadBill();
	}

	private loadBill() {
		if (this.bill) {
			this.form.patchValue({
				id: this.bill.id,
				uid: this.bill.uid,
				name: this.bill.name,
				description: this.bill.description,
				url: this.bill.url,
				active: this.bill.active,
				login: this.bill.login,
				password: this.bill.password
			});
			console.log('bill data:', this.bill);
		}
	}

	private createBill() {
		this.bill = new Bill();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	getTitle(): string {
		const title = getSafe(() => this.bill.name);
		return title || 'Rachunek bez nazwy';
	}

	editBill() {
		this.editMode = true;
	}

	payBill() {
		alert('bill paid!');
	}

	saveBill() {
		this.setBill(this.form.value);
	}

	deleteBill() {
		if (!this.newBill) {
			this.confirmationService
				.confirm('Usuń rachunek', 'Czy na pewno chcesz usunąć bieżący rachunek wraz z historią płatności? Operacji nie będzie można cofnąć!', 'Nie', 'Tak')
				.subscribe((response) => {
					if (response) this.billsFirebaseService.delete(this.bill).then(() => this.router.navigate(['/zestawienie']));
				});
		}
	}

	cancel() {
		if (this.newBill) {
			this.router.navigate(['/zestawienie']);
		} else {
			this.editMode = false;
		}
	}

	setBill(bill: Bill) {
		if (bill.uid) {
			this.billsFirebaseService.update(bill);
		} else {
			this.billsFirebaseService.add(bill)
				.then((ref) => {
					console.log('Document successfully added!', ref, bill);
					this.router.navigate([bill.id], { relativeTo: this.route });
				}).catch((error) => console.error('Error adding document: ', error));
		}
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

	logout() {
		this.authService.logout().then(
			() => {
				this.router.navigate(['/login']);
				console.log('logged out');
			},
			rejected => console.error('logout:', rejected));
	}

}
