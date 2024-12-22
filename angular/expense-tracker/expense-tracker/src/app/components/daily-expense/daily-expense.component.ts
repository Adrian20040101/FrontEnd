/* not used yet, trying modularization */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Expense, Category } from '../expense/expense.model';
import { ExpenseService } from '../expense/expense.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-day',
  templateUrl: './daily-expense.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./daily-expense.component.css']
})
export class DayComponent implements OnInit, OnDestroy {
  day: string = 'Monday';
  expenses: Expense[] = [];
  budget: number | null = null;
  remainingBudget: number | null = null;

  editingIndex: number | null = null;
  showForm: boolean = false;
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  categories = Category;

  expenseForm = new FormGroup({
    category: new FormControl<Category | null>(null, [Validators.required]),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)])
  });

  private routeSubscription: Subscription | undefined;
  private budgetSubscription: Subscription | undefined;
  private expensesSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params: ParamMap) => {
      const dayParam = params.get('day');
      if (dayParam) {
        const dayCapitalized = this.capitalizeFirstLetter(dayParam);
        if (this.expenseService.getDays()?.includes(dayCapitalized)) {
          this.day = dayCapitalized;
          this.loadExpenses();
        } else {
          this.router.navigate(['/expenses/monday']);
        }
      }
    });

    this.budget = this.expenseService.getBudget();
    if (this.budget === null) {
      this.router.navigate(['/budget']);
    } else {
      this.calculateRemainingBudget();
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.budgetSubscription?.unsubscribe();
    this.expensesSubscription?.unsubscribe();
  }

  private capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  private loadExpenses(): void {
    this.expenses = this.expenseService.getExpensesByDay(this.day);
    this.calculateRemainingBudget();
  }

  private calculateRemainingBudget(): void {
    if (this.budget !== null) {
      const totalExpenses = this.expenseService.getTotalExpensesAllDays();
      this.remainingBudget = this.budget - totalExpenses;
    } else {
      this.remainingBudget = null;
    }
  }

  addExpense(): void {
    if (this.expenseForm.valid && !this.isSummary()) {
      const newExpense: Expense = {
        category: this.category?.value as Category,
        amount: Number(this.amount?.value),
        day: this.day
      };

      if (this.editingIndex !== null) {
        this.expenseService.updateExpense(this.day, this.editingIndex, newExpense);
        this.editingIndex = null;
      } else {
        this.expenseService.addExpense(this.day, newExpense);
      }

      this.expenseForm.reset();
      this.showForm = false;
    }
  }

  cancelAddExpense(): void {
    this.expenseForm.reset();
    this.showForm = this.expenses.length === 0;
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

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  deleteExpense(index: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(this.day, index);
      this.loadExpenses();
    }
  }

  get category() {
    return this.expenseForm.get('category');
  }

  get amount() {
    return this.expenseForm.get('amount');
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  isSummary(): boolean {
    return false;
  }
}
