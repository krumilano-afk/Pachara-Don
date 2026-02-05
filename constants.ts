
import type { Question } from './types';

export const schemas: { [key: string]: string } = {
    main: `
<div class="bg-slate-800 p-3 rounded border border-slate-700">
    <div class="text-blue-400 font-bold mb-2">orders</div>
    <div class="text-slate-400">order_id (PK)</div>
    <div class="text-slate-400">customer_id (FK)</div>
    <div class="text-slate-400">product_id (FK)</div>
    <div class="text-slate-400">order_date <span class="text-slate-600">// YYYY-MM-DD</span></div>
    <div class="text-slate-400">value <span class="text-slate-600">// Float</span></div>
</div>
<div class="bg-slate-800 p-3 rounded border border-slate-700">
    <div class="text-blue-400 font-bold mb-2">returns</div>
    <div class="text-slate-400">order_id (PK)</div>
    <div class="text-slate-400">return_reason</div>
</div>
<div class="bg-slate-800 p-3 rounded border border-slate-700">
    <div class="text-blue-400 font-bold mb-2">customers</div>
    <div class="text-slate-400">customer_id (PK)</div>
    <div class="text-slate-400">first_name</div>
    <div class="text-slate-400">last_name</div>
    <div class="text-slate-400">signup_date <span class="text-slate-600">// YYYY-MM-DD</span></div>
</div>
    `
};

export const questions: Question[] = [
    {
        id: 1,
        difficulty: "Warm Up",
        title: "Basic Filtering & Sorting",
        desc: "Retrieve all columns from the `orders` table for orders with a value greater than $500, ordered by the `order_date` from newest to oldest.",
        schema: "main",
        solution: `SELECT * \nFROM orders \nWHERE value > 500 \nORDER BY order_date DESC;`,
        logic: "1. <strong>Filter:</strong> <code>WHERE value > 500</code> removes low value orders.<br>2. <strong>Sort:</strong> <code>ORDER BY ... DESC</code> puts the most recent dates at the top."
    },
    {
        id: 2,
        difficulty: "Intermediate",
        title: "Joining Returned Orders",
        desc: "We only want to see orders that were returned. Write a query to select the `order_id` and `value` for all returned orders.",
        schema: "main",
        solution: `SELECT o.order_id, o.value \nFROM orders o \nJOIN returns r ON o.order_id = r.order_id;`,
        logic: "1. <strong>JOIN:</strong> An <code>INNER JOIN</code> (or just JOIN) only keeps rows that exist in BOTH tables.<br>2. Since we only want returned orders, joining <code>orders</code> with <code>returns</code> automatically filters out non-returned orders."
    },
    {
        id: 3,
        difficulty: "Exam Level",
        title: "The 'Last 15 Returned' (Target Question 1)",
        desc: "<strong>Goal:</strong> Retrieve `order_id`, `customer_id`, and `product_id`.<br><strong>Filter:</strong> Only returned orders.<br><strong>Sort:</strong> Latest `order_date` first. If dates are same, sort by `value` (highest first).<br><strong>Limit:</strong> Top 15 rows.",
        schema: "main",
        solution: `SELECT \n  o.order_id, \n  o.customer_id, \n  o.product_id\nFROM orders o\nJOIN returns r \n  ON o.order_id = r.order_id\nORDER BY \n  o.order_date DESC, \n  o.value DESC\nLIMIT 15;`,
        logic: "1. <strong>JOIN:</strong> Filter for returns.<br>2. <strong>ORDER BY X DESC, Y DESC:</strong> This is the tie-breaker. It sorts by Date first. If Date is equal, it looks at Value.<br>3. <strong>LIMIT 15:</strong> Cuts the result list."
    },
    {
        id: 4,
        difficulty: "String Logic",
        title: "The 'Z' Names Pattern (Target Question 2)",
        desc: "Find all customers whose <strong>First Name</strong> OR <strong>Last Name</strong> starts with the letter 'Z'. Return the `customer_id`, `first_name`, and `last_name`.",
        schema: "main",
        solution: `SELECT customer_id, first_name, last_name\nFROM customers\nWHERE first_name LIKE 'Z%'\n   OR last_name LIKE 'Z%';`,
        logic: "1. <strong>LIKE 'Z%':</strong> The <code>%</code> is a wildcard. 'Z%' means starts with Z.<br>2. <strong>OR:</strong> Crucial! If you used AND, they would need to have BOTH names starting with Z (e.g. Zack Zuckerberg). The question asked for EITHER."
    },
    {
        id: 5,
        difficulty: "Boss Level",
        title: "Complex Filtering (Z-Names + Dates)",
        desc: "<strong>Goal:</strong> Show one column (combined name) for customers where First OR Last name starts with 'Z', AND they signed up in <strong>January 2024</strong>.",
        schema: "main",
        solution: `SELECT \n  first_name || ' ' || last_name as full_name\nFROM customers\nWHERE \n  (first_name LIKE 'Z%' OR last_name LIKE 'Z%')\n  AND signup_date BETWEEN '2024-01-01' AND '2024-01-31';`,
        logic: "1. <strong>Parentheses ():</strong> CRITICAL. You must wrap the <code>(A OR B)</code> logic in brackets. Without them, SQL might read it as: <i>(First is Z) OR (Last is Z AND Date is Jan)</i>.<br>2. <strong>Date Filter:</strong> <code>BETWEEN</code> is standard for date ranges."
    }
];
