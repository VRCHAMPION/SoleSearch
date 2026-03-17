# SoleSearch

A modern full-stack web application designed to track products, manage portfolios, and monitor market trends.

## Description

SoleSearch is an advanced platform tailored for monitoring dynamic markets such as sneakers or stocks. It provides users with the tools to track their personal portfolios, maintain watchlists of interested items, and receive real-time alerts on price fluctuations. By combining a robust backend architecture with a highly responsive frontend, SoleSearch delivers a seamless and data-rich user experience for market enthusiasts and investors.

## Features

- **User Authentication**: Secure sign-in and sign-up flows.
- **Portfolio Tracking**: Manage and monitor personal assets and their real-time values.
- **Watchlist Management**: Keep track of specific items without adding them to a portfolio.
- **Alerts System**: Automated notifications based on price targets and market movements.
- **Trending & Search Functionality**: Discover popular items and search across the entire database.
- **RESTful API**: Custom backend infrastructure to handle complex queries, data synchronization, and third-party integrations.

## Tech Stack

**Client:**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Redux / Zustand (State Management)

**Server:**
- Node.js
- Express (Custom server for background tasks and external API proxying)
- Next.js API Routes

**Database & Modeling:**
- PostgreSQL
- Prisma ORM
- Zod (Schema validation)

**Utilities:**
- Axios

## Folder Structure

```text
solesearch/
├── prisma/                 # Database schema and migrations
├── server/                 # Custom Express backend and cron jobs
│   ├── routes/             # Express API routes
│   └── utils/              # Backend helper functions
├── src/
│   ├── app/                # Next.js App Router (pages and layouts)
│   │   ├── api/            # Next.js Serverless API routes
│   │   ├── portfolio/      # Portfolio feature pages
│   │   ├── product/        # Product detail pages
│   │   ├── search/         # Search and trending logic
│   │   └── watchlist/      # Watchlist feature pages
│   ├── components/         # Reusable React UI components
│   └── services/           # Frontend API and data services
└── package.json            # Project dependencies and scripts
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VRCHAMPION/SoleSearch.git
   cd SoleSearch
   ```

2. Install dependencies for the main application:
   ```bash
   npm install
   ```

3. Install dependencies for the custom Express server:
   ```bash
   cd server
   npm install
   cd ..
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the development servers:
   ```bash
   # In one terminal window, start the Next.js frontend
   npm run dev

   # In a second terminal window, start the Express backend
   cd server
   node index.js
   ```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the root directory and the `server/.env` file.

**Root `.env` (Next.js):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/solesearch"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
CLERK_WEBHOOK_SECRET="your_clerk_webhook_secret"
RESEND_API_KEY="your_resend_api_key"
CRON_SECRET="your_cron_secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Server `server/.env` (Express):**
```env
PORT=4000
CLIENT_URL="http://localhost:3000"
KICKSDB_API_KEY="your_kicksdb_api_key"
```

## Usage

Once the servers are running, navigate to `http://localhost:3000` in your browser. Users can create an account, browse trending products, search for specific items, and add them to either a watchlist or a portfolio to begin tracking prices.

## Screenshots

*[Add screenshots of the dashboard, search interface, and portfolio manager here]*

## Future Improvements

- Integration with additional third-party market data providers
- Advanced charting features with historical price comparisons
- Mobile application using React Native
- Enhanced notification channels (SMS, Web Push)
- Machine learning-based price predictions

## Contributing

Contributions are welcome. Please adhere to the following steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a Pull Request.

Ensure that all code changes are linted and formatted properly before submitting a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
