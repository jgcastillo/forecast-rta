# Product Requirements Document (PRD) — forecast_rta

## 1. Executive Summary
RTA currently manages its inventory forecast via a highly complex and manual Excel spreadsheet. This process is prone to human error, lacks real-time updates, and depends on a single person's knowledge. **forecast_rta** aims to digitize this intelligence into a robust web application.

## 2. Business Objectives
- **Automate Calculations:** Replace manual entry with an engine that calculates 12m and 6m sales averages automatically.
- **Dynamic Reactivity:** Enable retroactive recalculations when historical data is updated.
- **Optimized Procurement:** Provide purchase order suggestions based on specific target availability (5 months for Maritime, 3.5 for Air).
- **Multi-Warehouse Support:** Manage inventory for Miami and Puerto Rico independently but integrated.

## 3. Key Stakeholders
- **Administrator:** Manages users and system configuration.
- **Analyst:** Enters data, runs forecasts, and confirms purchase orders.
- **Reviewer:** Consults reports and visualizes dashboards.

## 4. Success Metrics
- 100% elimination of manual formulas in Excel.
- Reduction of procurement decision time from days to minutes.
- Real-time visibility of "Inventory Value" and "Stock-out Alarms".