# AgriAI Africa MVP

AgriAI Africa is an intelligent agriculture management platform that helps farmers monitor their farms, track fields, and get AI‑driven yield predictions based on soil type and field data. The MVP includes user authentication, farm/field management, and a mock AI prediction endpoint, built with modern technologies on both backend and frontend.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Frontend Overview](#frontend-overview)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Farmers often lack easy‑to‑use tools to digitise their field data and receive actionable insights. AgriAI Africa provides a simple interface to:

- Register and manage user accounts.
- Create farms and fields with details such as area, soil type, and current crop.
- Get AI‑powered yield predictions based on soil and area (mock version for MVP, ready to integrate a real model).

The project is split into two main parts:

- **Backend** – RESTful API built with Node.js, Express, TypeScript, Prisma, and SQL Server.
- **Frontend** – React single‑page application using TypeScript, Tailwind CSS, shadcn/ui, Zustand, React Query, and React Router.

---

## Key Features

- **User Authentication** – Register, login, and JWT‑based protected routes.
- **Farm Management** – Create, view, update, and delete farms.
- **Field Management** – Within each farm, manage fields with name, area, soil type, and crop.
- **AI Predictions** – Submit soil type and area to receive a mock yield prediction (confidence and recommendation).
- **Responsive UI** – Mobile‑friendly design with shadcn/ui components.
- **State Management** – Zustand for auth, React Query for server state.
- **Type Safety** – Full TypeScript support on both ends.

---

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **ORM**: Prisma with SQL Server
- **Authentication**: bcrypt + JWT
- **Validation**: express‑validator + zod (for frontend)
- **Password Strength**: zxcvbn
- **Environment**: dotenv

### Frontend
- **Build Tool**: Vite
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**:
  - Zustand (client state – auth)
  - React Query (server state – caching, mutations)
- **Routing**: React Router v6
- **Forms**: React Hook Form + zod
- **HTTP Client**: Axios with interceptors
- **Toasts**: shadcn/ui toast (Radix UI)

---

## Architecture

The backend follows a typical MVC pattern:

- **Routes** – define endpoints and attach middleware (auth, validation).
- **Controllers** – handle business logic and database operations via Prisma.
- **Middleware** – protect routes, validate input, handle errors.
- **Database** – SQL Server with Prisma schema defining `User`, `Farm`, `Field`.

The frontend is organised by feature:

- **api/** – Axios client and typed endpoint functions.
- **components/** – Reusable UI components (shadcn) and layout elements.
- **pages/** – Route‑level components (auth, dashboard, AI).
- **store/** – Zustand store for authentication.
- **types/** – Shared TypeScript interfaces.
- **hooks/** – Custom hooks (optional).
- **utils/** – Helper functions (e.g., password strength).

Data flows: React components use React Query hooks to fetch data via API functions. The auth store holds user/token and is used for conditional rendering and attaching tokens to requests.

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or newer)
- **npm** or **yarn**
- **SQL Server** (local or remote) – ensure it’s running and you have credentials.
- **Git**

### Backend Setup

1. Clone the repository and navigate to the backend folder (e.g., `agriai-backend`).
2. Install dependencies:
   ```bash
   npm install
