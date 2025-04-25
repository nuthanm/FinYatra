# FinYatra
Your Journey to Smarter Finances Starts Here

## 🎯 Objective
**FinYatra** is a user-friendly, educational financial planning web application built using **Blazor WebAssembly**. It is designed to help individuals especially those **without a financial background** understand, plan, and achieve their financial goals through interactive calculators and tools.

**The goal of this project is to:**

- 🧠 Educate users with layman-friendly explanations, real-life examples, and illustrations for each financial concept.

- 🛠️ Provide tools like FIRE (Financial Independence, Retire Early) calculator, SIP, SWP, STP, FD Laddering, and Loan planners—all on a single, accessible page.

- 📚 Follow best coding practices using Microsoft naming conventions, SOLID principles, clean architecture, and reusable components for long-term maintainability.

- 🌐 Support localization, allowing users to understand in their own language.

- 🎨 Offer a clutter-free, highly interactive, and encouraging UI with gifs, quotes, and visual guides that make financial planning fun and positive.

- 🔁 Build a flexible and extensible foundation that can grow with additional tools over time.

This project aims to serve as both a personal finance guide for users and a reference-quality codebase for developers.

## Techonology Stack
1. Blazor WebAssembly
2. C-Sharp

## Project Structure Design
~~~
FinYatra.sln
│
├── FinYatra.Shared       // DTOs and common models (reused across client and backend)
├── FinYatra.Core         // Business logic, interfaces, rules
├── FinYatra.Client       // Blazor WebAssembly front-end
└── FinYatra.Tests        // Unit tests (xUnit or NUnit)
~~~

## Detailed Project Structure Design
~~~
FinYatra/
│
├── FinYatra.Client/            → Blazor WASM UI project
│   ├── Pages/                  → Razor components per tool
│   ├── Shared/                 → Shared UI components
│   ├── Assets/                 → Images, GIFs
│   ├── Services/               → Service interfaces for tools
│   ├── Models/                 → DTOs & ViewModels
│   ├── Extensions/             → Utility classes/helpers
│   └── Program.cs
│
├── FinYatra.Shared/            → Shared contracts (DTOs, Enums, etc.)
│
├── FinYatra.Core/              → Core logic (Calculation Engines, Domain models)
│   ├── Interfaces/
│   ├── Calculators/            → FIRECalculator.cs, SIPCalculator.cs, etc.
│   └── Helpers/
│
├── FinYatra.Tests/             → Unit tests using xUnit
│
└── FinYatra.Server/ (optional) → API Backend (for persistence or ML models later)

~~~
## References
We will update all the necessary tools
