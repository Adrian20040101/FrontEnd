import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ExpenseService } from '../expense/expense.service';
import { Expense, Category } from '../expense/expense.model';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-day',
  templateUrl: './daily-expense.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./daily-expense.component.css']
})
export class DailyExpenseComponent implements OnInit {
  @Input() selectedDay: string = 'Monday';
  @Output() dailyTotalUpdated = new EventEmitter<number>();
  @Output() addExpenseEvent = new EventEmitter<Expense>();
  @Output() editExpenseEvent = new EventEmitter<{ index: number, expense: Expense }>();
  @Output() deleteExpenseEvent = new EventEmitter<number>();

  expenses: Expense[] = [];
  categories = Category;
  showForm: boolean = false;
  editingIndex: number | null = null;
  totalExpenses: number = 0;

  expenseForm = new FormGroup({
    category: new FormControl<Category | null>(null, [Validators.required]),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)])
  });

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenses = this.expenseService.getExpensesByDay(this.selectedDay);
    this.calculateTotalExpenses();
  }

  onSubmit(): void {
    if (this.editingIndex !== null) {
      this.updateExpense();
    } else {
      this.addExpense();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDay'] && !changes['selectedDay'].isFirstChange()) {
      console.log(`DailyExpenseComponent: selectedDay changed to ${this.selectedDay}`);
      this.loadExpenses();
    }
  }

  addExpense(): void {
    if (this.expenseForm.valid) {
      const newExpense: Expense = {
        category: this.expenseForm.value.category as Category,
        amount: Number(this.expenseForm.value.amount),
        day: this.selectedDay
      };
      this.addExpenseEvent.emit(newExpense);
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
      amount: expense.amount
    });
    this.showForm = true;
  }

  updateExpense(): void {
    if (this.expenseForm.valid && this.editingIndex !== null) {
      const updatedExpense: Expense = {
        category: this.expenseForm.value.category as Category,
        amount: Number(this.expenseForm.value.amount),
        day: this.selectedDay
      };
      this.editExpenseEvent.emit({ index: this.editingIndex, expense: updatedExpense });
      this.editingIndex = null;
      this.expenseForm.reset();
      this.showForm = false;
    }
  }

  cancelEdit(): void {
    this.editingIndex = null;
    this.expenseForm.reset();
    this.showForm = false;
  }

  deleteExpense(index: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.deleteExpenseEvent.emit(index);
    }
  }

  calculateTotalExpenses(): void {
    this.totalExpenses = this.expenseService.getTotalExpenses(this.selectedDay);
    this.dailyTotalUpdated.emit(this.totalExpenses);
  }
}
