# Product Requirements Document: Trading Dashboard

## 1. Introduction

### 1.1. Purpose

This document outlines the product requirements for the Trading Dashboard application. It serves as a comprehensive guide for the development team, defining the project's vision, features, and technical specifications.

### 1.2. Project Overview & Vision

The Trading Dashboard is a web-based application designed to provide a centralized and efficient platform for a trader to build a macro and intraday narrative, determine high-probability trading conditions, and manage their trading workflow. The application will feature a customizable grid-based layout with AI-powered analysis, data input cards for journaling, and performance tracking tools.

### 1.3. Target Audience

The primary target audience for this application is a single, dedicated trader who requires a tailored solution to support their specific trading models and strategies.

## 2. System Architecture

### 2.1. High-Level Architecture

The system is designed with a modern, decoupled architecture, featuring a React frontend, an n8n backend for automation and logic, and a hybrid storage solution with Supabase and Xata.

```mermaid
graph TD
    subgraph Frontend (React App)
        A[Input Cards]
        B[File Upload Buttons]
        C[Performance & Reflection Tabs]
    end

    subgraph Backend (n8n on Render)
        D[Save-Data Workflow]
        E[Upload-File Workflow]
        F[Get-Data Workflow]
    end

    subgraph Storage
        G[Supabase Database (Structured Data)]
        H[Xata Database (File Storage)]
    end

    A -- "POST (Card Data)" --> D
    B -- "POST (File Data)" --> E
    C -- "GET (Request for Data)" --> F

    D -- "INSERT/UPDATE to Insights/Journal" --> G
    E -- "Process CSV" --> G
    E -- "Upload File" --> H
    F -- "SELECT from Insights/Journal" --> G

    F -- "Return Data/Insights" --> C
```

### 2.2. Component Descriptions

*   **Frontend:** A single-page application built with **React, TypeScript, and Vite**, providing a dynamic and responsive user interface.
*   **Backend:** **n8n hosted on Render** will serve as the backend, handling all business logic, data processing, and communication with the storage layer through a series of automated workflows.
*   **Storage:**
    *   **Supabase:** A PostgreSQL database used for storing structured data (e.g., `PositionsJournal`) and semi-structured data (e.g., `Insights`).
    *   **Xata:** A serverless data platform used for storing binary files, such as images, documents, and CSVs.

## 3. Features and Functionality

### 3.1. Dashboard Home Screen

The home screen will feature a grid-based layout displaying a series of cards.

#### 3.1.1. AI-Powered Cards

*   **COT Analyst Agent:**
    *   Provides a bias and sentiment analysis for the upcoming week based on a user-selected commodity.
    *   Includes market implications in its analysis.
    *   Data will be sourced from either the `NDelventhal/cot_reports` GitHub repository or by scraping one of the following sites:
        *   [https://www.barchart.com/futures/cot-reports/all?view=noncommercial&report=summary](https://www.barchart.com/futures/cot-reports/all?view=noncommercial&report=summary)
        *   [https://www.tradingster.com/cot](https://www.tradingster.com/cot)
        *   [https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm](https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm)
*   **News Agent:**
    *   Displays an analysis of positioning for the week based on high-impact news events.
    *   Summarizes insights from the Event Calendar.
    *   Allows for interactive chat for additional insights.
    *   Data will be sourced from either [https://www.forexfactory.com/](https://www.forexfactory.com/) or the JBlanked News API.

#### 3.1.2. Data Input Cards

These cards will allow the user to input text based on a series of questions. The data will be saved to the appropriate database, and the cards will be cleared at the end of each day.

*   **Sunday Review:** For macro-level market analysis.
*   **Pre-market Game Plan:** For daily market analysis.
*   **Trading Session Plan:** For intraday planning and real-time trade data capture.
*   **Review:** For post-trade analysis.
*   **Daily Score:** For self-assessment and performance tracking.

### 3.2. Tabs

*   **Dashboard:** The main home screen.
*   **Positions:** Displays the `PositionsJournal` data.
*   **Event Calendar:** Displays upcoming market events.
*   **Performance:** Mimics the Tradovate performance summary.
*   **Data Reflection:**
    *   Displays the Daily Score.
    *   Summarizes key insights from the captured data.
    *   Includes AI chat functionality.

### 3.3. Buttons

*   **Upload for Positions Journal:** Allows the user to upload an Excel or CSV file from Tradovate, which will be parsed and stored in the `PositionsJournal` table.
*   **Upload for Data Collection:** Allows the user to upload screenshots, images, or documents related to their trading sessions and strategies.

## 4. Data Management

### 4.1. Databases

*   **Supabase:** Will host the `PositionsJournal` and `Insights` tables.
*   **Xata:** Will host the `Files` table for all binary data.

### 4.2. Data Schemas

*   **Supabase `PositionsJournal` Table:**
    *   `qty`
    *   `buyPrice`
    *   `sellPrice`
    *   `pnl`
    *   `boughtTimestamp`
    *   `soldTimestamp`
    *   `duration`
    *   `bias`
    *   `commodity`
    *   `stop`
    *   `target`
    *   `entry class`
    *   `execution model`
    *   `variables used`
    *   `loss/win`
    *   `percent return`
    *   `$ risk`
    *   `risk to reward`
*   **Supabase `Insights` Table:**
    *   Will store all data from the input cards that is not sent to the `PositionsJournal`.
*   **Xata `Files` Table:**
    *   `id` (auto-generated)
    *   `createdAt` (auto-generated)
    *   `file` (File/Attachment type)
    *   `fileName` (string)

## 5. Technical Stack

*   **Frontend:** React, TypeScript, Vite
*   **Backend:** n8n on Render
*   **Storage:** Supabase, Xata

## 6. Non-Functional Requirements

*   **Performance:** The application should be fast and responsive, with minimal loading times.
*   **Scalability:** The architecture should be scalable to handle increasing amounts of data and user activity.
*   **Security:** All data transmission should be encrypted, and access to the backend and databases should be secured.
*   **Usability:** The user interface should be intuitive and easy to use, providing a seamless user experience.