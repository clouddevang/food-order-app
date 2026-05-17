# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Start development server
npm run build    # Create production build
npm test         # Run tests
```

## Architecture

React 18 app (functional components + hooks) with Firebase Realtime Database as backend. No external state library — uses Context API + `useReducer`.

### Key Data Flows

**Meal data (read):** `AvailableMeals` fetches from Firebase on mount, transforms the key-based response object into an array, and renders `MealItem` components. Firebase URL is hardcoded in `src/Components/Meals/AvailableMeals.js`.

**Cart state:** `CartProvider` (`src/store/`) wraps the whole app and exposes `CartContext` with `items`, `totalAmount`, `addItem()`, `removeItem()`, `clearCart()`. The reducer handles three actions: `ADD` (add or increment), `REMOVE` (decrement or delete), `CLEAR` (on order submission).

**Order submission (write):** `Cart` POSTs `{ user, orderedItems }` to Firebase `/orders.json`, then calls `clearCart()` on success. Firebase URL is hardcoded in `src/Components/Cart/Cart.js`.

**Modal:** Rendered via `ReactDOM.createPortal` into `#overlays` div in `public/index.html`. Visibility controlled by `cartIsShown` state in `App.js`.

### Component Tree

```
App (modal visibility state)
├── CartProvider  ← wraps everything, owns cart reducer
├── Header
│   └── HeaderCartButton  ← reads cart item count, triggers bump animation
├── Meals
│   ├── MealsSummary  (static)
│   └── AvailableMeals  ← fetches Firebase meals
│       └── MealItem → MealItemForm  (amount: 1–5, adds to cart)
└── Cart  (modal, portal into #overlays)
    ├── CartItem list
    ├── Checkout  ← ref-based form validation
    └── POST to Firebase on submit
```

### Firebase

- **Project:** `food-order-app-83d2b` (asia-southeast1)
- **Meals:** `/meals.json` — read on app load
- **Orders:** `/orders.json` — written on checkout
- URLs are hardcoded (no `.env`); update both files if the Firebase project changes.
