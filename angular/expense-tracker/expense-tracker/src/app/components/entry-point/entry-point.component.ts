import { Component, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseService } from '../expense/expense.service';

@Component({
  selector: 'app-entry-point',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './entry-point.component.html',
  styleUrl: './entry-point.component.css'
})
export class EntryPointComponent {
  budgetForm = new FormGroup({
    budget: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)]
    })
  })

  constructor(private router: Router, private expenseService: ExpenseService) {}

  submitBudget(): void {
    if (this.budgetForm.valid) {
      const budget = this.budgetForm.value.budget!;
      this.expenseService.setBudget(budget);
      this.router.navigate(['/expenses/monday']);
    }
  }

  onReset() {
    this.budgetForm.reset();
  }
}
