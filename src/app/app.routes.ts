import { Routes } from '@angular/router';

import { BillComponent } from './components/bill/bill.component';
import { OverviewComponent } from './components/overview/overview.component';

export const routes: Routes = [
	{ path: 'zestawienie', component: OverviewComponent },
	{
		path: 'rachunek',
		component: BillComponent,
		data: { title: 'Nowy rachunek' },
	},
	{
		path: 'rachunek/:id',
		component: BillComponent,
		data: { title: 'Rachunek' },
	},
	{
		path: '',
		redirectTo: '/zestawienie',
		pathMatch: 'full',
	},
];
