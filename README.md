# Convex Paginated Data Table

A modern Next.js application demonstrating Convex's powerful pagination features with a shadcn/ui data table component. This project showcases real-time data synchronization, server-side pagination, and a clean, responsive UI for managing product inventory.

## Features

- **Real-time Data Sync**: Powered by Convex's reactive database
- **Server-side Pagination**: Efficient data loading with Convex's built-in pagination
- **Advanced Filtering**: Filter products by category and status
- **Responsive Design**: Built with Tailwind CSS and shadcn/ui components
- **Type-safe**: Full TypeScript support with Convex's generated types
- **Modern UI**: Clean and professional interface with proper loading states

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex (serverless backend platform)
- **UI Components**: shadcn/ui, Tailwind CSS
- **Data Table**: Custom implementation with pagination controls
- **Icons**: Lucide React

## Project Structure

```
.
├── app/
│   ├── globals.css         # Global styles and Tailwind configuration
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Main page with products table
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   └── table.tsx
│   ├── ConvexClientProvider.tsx
│   └── products-table.tsx  # Main data table component
├── convex/
│   ├── products.ts         # Product queries and mutations
│   ├── schema.ts           # Database schema definition
│   └── seed.ts             # Database seeding function
├── lib/
│   └── utils.ts            # Utility functions
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── README.md
└── DIRECTIONS.md           # Instructions for seeding data
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Convex account (sign up at [convex.dev](https://convex.dev))

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Set up Convex:
```bash
npx convex dev
```
This will prompt you to log in to Convex and create a new project or link to an existing one.

4. In a new terminal, run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Seeding the Database

Follow the instructions in `DIRECTIONS.md` to populate the database with sample data.

## Usage

Once the application is running:

1. **View Products**: The main page displays a paginated list of products
2. **Filter by Category**: Use the category dropdown to filter products
3. **Filter by Status**: Use the status dropdown to show active, inactive, or discontinued products
4. **Load More Data**: Click the "Load More" button to fetch additional products
5. **Real-time Updates**: Any changes to the data will automatically reflect in the UI

## Key Features Demonstrated

### Paginated Queries

The application uses Convex's `usePaginatedQuery` hook to efficiently load data in chunks:

```typescript
const { results, status, loadMore } = usePaginatedQuery(
  api.products.list,
  { category, status },
  { initialNumItems: 10 }
);
```

### Server-side Filtering

Filters are applied on the server using Convex indexes for optimal performance:

```typescript
if (args.status) {
  query = query.withIndex("by_status", (q) => q.eq("status", args.status));
}
```

### Type Safety

Full TypeScript support with generated types from Convex schema ensures type safety across the entire application.

## Development

- `npm run dev` - Start the development server with hot reload
- `npx convex dev` - Start the Convex development server
- `npx convex dashboard` - Open the Convex dashboard to manage your data

## Contributing

Feel free to submit issues and enhancement requests!
