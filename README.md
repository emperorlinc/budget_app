Personal Finance Tracker

A finance application built with JavaScript. Track your monthly income and expenses, visualize spending patterns, and manage budgets—all in your browser.

Features

· Transaction Management: Add income and expense transactions with amount, category, description, and date
· Visual Spending Analysis: Horizontal bar chart shows relative spending across expense categories
· Budget Tracking: Set monthly limits for each expense category with visual over/under indicators
· Persistent Storage: All data saved in browser's localStorage, your information stays even after closing the tab
· Real-time Updates: UI updates instantly as you add or delete transactions
· Responsive Design: Clean, modern interface that works on desktop and mobile.

Categories

The tracker includes these preset categories:

· Income (separate from expense tracking)
· Housing (rent/mortgage, maintenance)
· Food (groceries, dining out)
· Transport (gas, public transit, rideshares)
· Entertainment (streaming, events, hobbies)
· Utilities (electricity, water, internet)

How to Use

1. Add a Transaction
   · Enter the amount
   · Select a category (Income or any expense type)
   · Add a description
   · Pick a date
   · Click "Add Entry"
2. View Your Spending
   · The bar chart shows how much you've spent in each expense category
   · Bars are proportional to your highest spending category
   · Recent transactions appear in the left panel
3. Set Budget Limits
   · Scroll to the Budget card at the bottom right
   · Adjust any expense category limit (numbers update in real-time)
   · The alert shows if you're over or under budget overall
4. Remove Transactions
   · Click the "✕" button next to any transaction in the list
   · Charts and totals update automatically

Data Storage

All data is stored locally using the browser's localStorage:

· Transaction data: Saved under finance_tracker_v1
· Budget limits: Saved under finance_budgets_v1

No data is sent to any server—your financial information stays on your device.

Demo Data

The app comes pre-loaded with sample transactions to demonstrate functionality:

· Salary income
· Rent payment
· Groceries and dining
· Utilities and transportation
· Entertainment expenses
