export enum Category {
    Entertainment = 'Entertainment',
    Utilities = 'Utilities',
    Groceries = 'Groceries',
    Miscellaneous = 'Miscellaneous'
  }
  
  export interface Expense {
    category: Category;
    amount: number;
    day: string
  }