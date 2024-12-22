import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../expense/expense.service';
import { Expense } from '../expense/expense.model';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  standalone: true,
  imports: [AgGridAngular, CommonModule],
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  expenses: Expense[] = [];
  columnDefs: ColDef[] = [
    { headerName: 'Day', field: 'day', sortable: true, filter: true },
    { headerName: 'Category', field: 'category', sortable: true, filter: true },
    { headerName: 'Amount', field: 'amount', sortable: true, filter: true, valueFormatter: this.currencyFormatter }
  ];
  defaultColDef: ColDef = {
    resizable: true,
    flex: 1
  };
  rowData: any[] = [];

  constructor(private expenseService: ExpenseService) { }

  ngOnInit(): void {
  }

  currencyFormatter(params: any): string {
    return `$${params.value.toFixed(2)}`;
  }
}
