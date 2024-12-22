import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { inject } from '@angular/core';
import { SummaryComponent } from './components/summary/summary.component';

export const routes: Routes = [
    { path: '', redirectTo: '/budget', pathMatch: 'full' },
    { path: 'budget', component: EntryPointComponent },
    { path: 'expenses/:day', component: ExpenseComponent },
    { path: 'expenses/summary', component: SummaryComponent },
    { path: '**', redirectTo: '/budget' }
];
