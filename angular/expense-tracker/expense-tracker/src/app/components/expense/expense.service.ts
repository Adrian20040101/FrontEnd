import { Injectable } from '@angular/core';
import { Expense, Category } from './expense.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expensesKey = 'expenses';
  private budgetKey = 'budget';

  constructor() { }

  getAllExpenses(): { [day: string]: Expense[] } {
    const savedExpenses = localStorage.getItem(this.expensesKey);
    return savedExpenses ? JSON.parse(savedExpenses) : {};
  }

  getDays(): string[] | null {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  }

  getAllExpensesAsObject(): { [day: string]: Expense[] } {
    const savedExpenses = localStorage.getItem(this.expensesKey);
    try {
      const parsedExpenses = savedExpenses ? JSON.parse(savedExpenses) : {};
      if (typeof parsedExpenses === 'object' && parsedExpenses !== null) {
        const days = this.getDays();
        if (days) {
          for (const day of days) {
            if (!Array.isArray(parsedExpenses[day])) {
              parsedExpenses[day] = [];
            }
          }
        }
        return parsedExpenses;
      } else {
        console.warn('Expenses data is not an object. Resetting to empty object.');
        return {};
      }
    } catch (error) {
      console.error('Error parsing expenses from localStorage:', error);
      return {}; 
    }
  }

  saveAllExpenses(expenses: { [day: string]: Expense[] }): void {
    localStorage.setItem(this.expensesKey, JSON.stringify(expenses));
  }

  getExpensesByDay(day: string): Expense[] {
    const allExpenses = this.getAllExpenses();
    return allExpenses[day] || [];
  }

  addExpense(day: string, expense: Expense): void {
    const allExpenses = this.getAllExpenses();
    if (!allExpenses[day]) {
      allExpenses[day] = [];
    }
    allExpenses[day].push(expense);
    this.saveAllExpenses(allExpenses);
  }

  updateExpense(day: string, index: number, updatedExpense: Expense): void {
    const allExpenses = this.getAllExpenses();
    if (allExpenses[day] && allExpenses[day][index]) {
      allExpenses[day][index] = updatedExpense;
      this.saveAllExpenses(allExpenses);
    }
  }

  deleteExpense(day: string, index: number): void {
    const allExpenses = this.getAllExpenses();
    if (allExpenses[day] && allExpenses[day][index] !== undefined) {
      allExpenses[day].splice(index, 1);
      this.saveAllExpenses(allExpenses);
    }
  }

  getTotalExpenses(day: string): number {
    return this.getExpensesByDay(day).reduce((sum, expense) => sum + expense.amount, 0);
  }

  getTotalExpensesAllDays(): number {
    const allExpenses = this.getAllExpenses();
    return Object.values(allExpenses).flat().reduce((sum, expense) => sum + expense.amount, 0);
  }

  setBudget(budget: number): void {
    localStorage.setItem(this.budgetKey, JSON.stringify(budget));
  }

  getBudget(): number | null {
    const budget = localStorage.getItem(this.budgetKey);
    return budget ? JSON.parse(budget) : null;
  }
}
