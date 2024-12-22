import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Category, Expense } from './expense.model';
import { ExpenseService } from './expense.service';
import { DailyExpenseComponent } from '../daily-expense/daily-expense.component';
import { SummaryComponent } from "../summary/summary.component";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, DailyExpenseComponent, SummaryComponent],
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

  expenseForm = new FormGroup({
    category: new FormControl<Category | null>(null, [Validators.required]),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)])
  });

  @ViewChild(DailyExpenseComponent) dailyExpenseComponent!: DailyExpenseComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService
  ) {}
  
  ngOnInit(): void {
    this.budget = this.expenseService.getBudget();

    this.route.paramMap.subscribe((params: ParamMap) => {
      const param = params.get('day'); // 'day' parameter can be a day or 'summary'

      if (param === 'summary') {
        this.isSummary = true;
        this.totalWeeklyExpenses = this.expenseService.getTotalExpensesAllDays();
        this.calculateRemainingBudget();
        this.showForm = false;
      } else if (param) {
        const dayCapitalized = this.capitalizeFirstLetter(param);
        if (this.days.includes(dayCapitalized)) {
          this.isSummary = false;
          this.selectedDay = dayCapitalized;
          this.loadExpenses();
        } else {
          this.router.navigate(['/expenses/monday']);  // fallback to display expense list for monday if the url contains unknown params
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

  handleAddExpense(newExpense: Expense): void {
    this.expenseService.addExpense(this.selectedDay, newExpense);
    this.dailyExpenseComponent.loadExpenses();
    this.calculateRemainingBudget();
  }

  handleEditExpense(event: { index: number, expense: Expense }): void {
    this.expenseService.updateExpense(this.selectedDay, event.index, event.expense);
    this.dailyExpenseComponent.loadExpenses();
    this.calculateRemainingBudget();
  }

  handleDeleteExpense(index: number): void {
    this.expenseService.deleteExpense(this.selectedDay, index);
    this.dailyExpenseComponent.loadExpenses();
    this.calculateRemainingBudget();
  }

  handleExpensesAndBudgetTotalUpdated(): void {
    this.totalWeeklyExpenses = this.expenseService.getTotalExpensesAllDays();
    this.totalExpenses = this.expenseService.getTotalExpenses(this.selectedDay);
    this.calculateRemainingBudget();
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
}
