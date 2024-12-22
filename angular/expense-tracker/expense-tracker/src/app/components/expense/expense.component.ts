import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Category, Expense } from './expense.model';
import { ExpenseService } from './expense.service';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { AgChartsModule } from 'ag-charts-angular';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AgGridModule, AgChartsModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent implements OnInit {
  budget: number | null = null;
  expenses: Expense[] = [];
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDay: string = 'Monday';  // i initially set the default day to be the first of the week, the user can then change it by clicking on another day of the week
  showForm: boolean = false;
  isSummary: boolean = false;
  editingIndex: number | null = null;
  categories = Category;
  totalExpenses: number = 0;
  remainingBudget: number | null = null;
  totalWeeklyExpenses: number = 0;
  chartData: { category: string; amount: number }[] = [];
  chartOptions: any;

  expenseForm = new FormGroup({
    category: new FormControl<Category | null>(null, [Validators.required]),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)])
  });

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService
  ) {}

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
  

  ngOnInit(): void {
    this.budget = this.expenseService.getBudget();

    this.route.paramMap.subscribe((params: ParamMap) => {
      const param = params.get('day'); // 'day' parameter can be a day or 'summary'

      if (param === 'summary') {
        this.isSummary = true;
        this.selectedDay = ''; 
        this.expenses = [];
        this.totalExpenses = 0;
        this.totalWeeklyExpenses = this.expenseService.getTotalExpensesAllDays();
        this.calculateRemainingBudget();
        this.showForm = false;
        this.populateSummaryData();
      } else if (param) {
        const dayCapitalized = this.capitalizeFirstLetter(param);
        if (this.days.includes(dayCapitalized)) {
          this.isSummary = false;
          this.selectedDay = dayCapitalized;
          this.loadExpenses();
        } else {
          this.router.navigate(['/expenses/monday']);
        }
      } else {
        this.router.navigate(['/expenses/monday']);
      }
    });
  }

  private calculateRemainingBudget(): void {
    if (this.budget !== null) {
      this.remainingBudget = this.budget - this.totalWeeklyExpenses;
    } else {
      this.remainingBudget = null;
    }
  }

  private capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  private loadExpenses(): void {
    this.expenses = this.expenseService.getExpensesByDay(this.selectedDay);
    this.totalExpenses = this.expenseService.getTotalExpenses(this.selectedDay);
    this.totalWeeklyExpenses = this.expenseService.getTotalExpensesAllDays();
    this.calculateRemainingBudget();
    this.showForm = this.expenses.length === 0;
  }

  addExpense(): void {
    if (this.expenseForm.valid) {
      const newExpense: Expense = {
        category: this.category?.value as Category,
        amount: Number(this.amount?.value),
        day: this.selectedDay
      };

      if (this.editingIndex !== null) {
        this.expenseService.updateExpense(this.selectedDay, this.editingIndex, newExpense);
        this.editingIndex = null;
      } else {
        this.expenseService.addExpense(this.selectedDay, newExpense);
      }

      this.loadExpenses();
      this.expenseForm.reset();
    }
  }

  editExpense(index: number): void {
    this.editingIndex = index;
    const expense = this.expenses[index];
    this.expenseForm.setValue({
      category: expense.category,
      amount: expense.amount,
    });
    this.showForm = true;
  }

  cancelEdit(): void {
    this.editingIndex = null;
    this.expenseForm.reset();
    this.showForm = this.expenses.length === 0;
  }

  cancelAddExpense(): void {
    this.expenseForm.reset();
    this.showForm = this.expenses.length === 0;
  }

  deleteExpense(index: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(this.selectedDay, index);
      this.loadExpenses();
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  hasPreviousDay(): boolean {
    if (this.isSummary) {
      return true;
    }

    const currentIndex = this.days.indexOf(this.selectedDay);
    return currentIndex > 0;
  }

  hasNextDay(): boolean {
    if (this.isSummary) {
      return false;
    }

    const currentIndex = this.days.indexOf(this.selectedDay);
    return currentIndex < this.days.length;
  }

  goToPreviousDay(): void {
    if (this.isSummary) {
      this.router.navigate(['/expenses', 'sunday']);
      return;
    }
  
    if (this.hasPreviousDay()) {
      const currentIndex = this.days.indexOf(this.selectedDay);
      const previousDay = this.days[currentIndex - 1];
      this.router.navigate(['/expenses', previousDay.toLowerCase()]);
    }
  }

  goToNextDay(): void {  
    if (this.selectedDay === 'Sunday') {
      this.router.navigate(['/expenses', 'summary']);
    } else if (this.hasNextDay()) {
      const currentIndex = this.days.indexOf(this.selectedDay);
      const nextDay = this.days[currentIndex + 1];
      this.router.navigate(['/expenses', nextDay.toLowerCase()]);
    }
  }

  get category() {
    return this.expenseForm.get('category');
  }

  get amount() {
    return this.expenseForm.get('amount');
  }

  isSummaryTab(): boolean {
    return this.isSummary;
  }

  currencyFormatter(params: any): string {
    return `$${params.value.toFixed(2)}`;
  }

  private populateSummaryData(): void {
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
}
