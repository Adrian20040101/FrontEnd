import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../expense/expense.service';
import { Expense } from '../expense/expense.model';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { AgChartsModule } from 'ag-charts-angular';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  standalone: true,
  imports: [AgGridModule, CommonModule, AgChartsModule],
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  expenses: Expense[] = [];
  chartData: { category: string; amount: number }[] = [];
  chartOptions: any;

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

  ngOnInit() {
    this.loadSummary();
  }

  private initializeChart(): void {
    this.chartOptions = {
      data: this.chartData,
      title: {
        text: 'Expense Distribution by Category',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
      },
      series: [{
        type: 'pie',
        angleKey: 'amount',
        strokeWidth: 2,
        tooltip: {
          renderer: (params: any) => {
            const percentage = ((params.datum.amount / this.getTotalAmount()) * 100).toFixed(2)
            return {
              title: params.datum.category + '\t' + percentage + '%',
            };
          }
        }
      }],
      background: {
        fill: 'transparent',
      },
    };
  }

  currencyFormatter(params: any): string {
    return `$${params.value.toFixed(2)}`;
  }

  private loadSummary(): void {
    const allExpenses = this.expenseService.getAllExpensesAsObject();
  
    if (typeof allExpenses !== 'object' || allExpenses === null) {
      this.rowData = [];
      return;
    }
  
    const validExpenses = Object.entries(allExpenses)
      .flatMap(([day, expenses]) => 
        Array.isArray(expenses) ? expenses.map(exp => ({ ...exp, day })) : []
      );
    
    this.rowData = validExpenses.map(exp => ({
      day: exp.day,
      category: exp.category,
      amount: exp.amount
    }));

    this.prepareChartData();

    this.initializeChart();
  }

  private getTotalAmount(): number {
    return this.chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }

  private prepareChartData(): void {
    const categoryTotals: { [key: string]: number } = {};
  
    this.rowData.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });
  
    this.chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount
    }));
  }  

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rowData);
    const workbook: XLSX.WorkBook = { Sheets: { 'Expenses Summary': worksheet }, SheetNames: ['Expenses Summary'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Expenses_Summary');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }
}
