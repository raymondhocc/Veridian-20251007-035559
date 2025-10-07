# Veridian Dash
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raymondhocc/Veridian-20251007-024727)
Veridian Dash is a sophisticated, real-time analytics platform designed to provide institutional-grade insights into the stablecoin and Real-World Asset (RWA) ecosystem. The dashboard visualizes key performance indicators across leading blockchain platforms like Solana, Ethereum, and Binance Smart Chain. Core features include monitoring cross-border payment volumes, transaction processing speeds, gas fees, and related ETF price movements. The application is built as a visually stunning, information-dense interface with interactive charts, comparative analysis tools, and a focus on data clarity and user experience. It aims to be the definitive source for market participants to track the efficiency, cost, and market sentiment of stablecoin operations.
## Key Features
-   **Cross-Border Payment Volume:** Track and compare payment volumes across major blockchains with historical trends.
-   **Transaction Processing Speed:** Monitor real-time transaction settlement times with comparative gauges.
-   **Gas Fee Monitoring:** Analyze and compare transaction costs across platforms with historical data.
-   **ETF Price Monitoring:** Track related ETF prices to gauge market sentiment and information flow gaps.
-   **Comparative Analysis:** A dedicated dashboard for side-by-side platform comparisons using tables and radar charts.
-   **Alerts & Notifications:** Customizable alerts for significant metric changes.
-   **Regional Insights:** Geographic breakdowns of cross-border payment activity on an interactive map.
## Technology Stack
-   **Frontend:** React, Vite, React Router, Tailwind CSS
-   **UI Components:** shadcn/ui, Radix UI, Lucide React
-   **State Management:** Zustand
-   **Data Visualization:** Recharts
-   **Animations:** Framer Motion
-   **Backend:** Hono on Cloudflare Workers
-   **Storage:** Cloudflare Durable Objects
-   **Language:** TypeScript
-   **Package Manager:** Bun
## Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites
-   Node.js (v18 or later)
-   Bun
-   A Cloudflare account and the Wrangler CLI, authenticated on your machine.
### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/veridian_dash.git
    cd veridian_dash
    ```
2.  **Install dependencies:**
    This project uses Bun as the package manager.
    ```bash
    bun install
    ```
## Development
To start the local development server, which includes both the Vite frontend and the Hono backend on Cloudflare Workers, run:
```bash
bun dev
```
This will start the development server, typically on `http://localhost:3000`. The frontend will automatically reload on changes, and the worker will be rebuilt.
### Project Structure
-   `src/`: Contains all the frontend React application code, including pages, components, hooks, and styles.
-   `worker/`: Contains the backend Hono application code that runs on Cloudflare Workers.
-   `shared/`: Contains TypeScript types and mock data shared between the frontend and backend.
-   `public/`: Static assets for the frontend.
## Deployment
This application is designed to be deployed to Cloudflare's global network.
1.  **Build the application:**
    This command bundles the React frontend and the Hono worker for production.
    ```bash
    bun run build
    ```
2.  **Deploy to Cloudflare:**
    This command deploys the application using the Wrangler CLI.
    ```bash
    bun run deploy
    ```
Alternatively, you can deploy this project with a single click.
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raymondhocc/Veridian-20251007-024727)
## License
This project is licensed under the MIT License - see the `LICENSE` file for details.
## A Note on Live Data Integration (e.g., `ib-insync`)
A key requirement for a production-ready version of this dashboard is the integration of live, real-time data feeds. The request to use `ib-insync` for data from Interactive Brokers has been noted. It's important to clarify the technical architecture required for such an integration.
### Technical Constraints
-   **Environment Mismatch:** The application's backend is built on Cloudflare Workers, which run a JavaScript/TypeScript environment based on V8 isolates. The `ib-insync` library is a Python package and requires a Python runtime to operate. It is not possible to run Python code directly within a Cloudflare Worker.
### Recommended Architecture
To integrate a Python-based data source like `ib-insync`, the recommended approach is to use a microservice architecture:
1.  **Create a Separate Data Feed Service:**
    -   This would be a standalone service written in Python.
    -   It would be responsible for running the `ib-insync` library, connecting to the Interactive Brokers API, fetching the necessary data, and processing it into a clean format.
    -   This service can be hosted on any platform that supports Python applications (e.g., a virtual machine, a container service like Docker, or a serverless platform for Python).
2.  **Expose a REST API:**
    -   The Python service would expose the data it collects via a simple, secure REST API. For example, an endpoint like `https://your-data-feed.com/api/etf/sol` could return the latest price data for a Solana-related ETF.
3.  **Integrate with the Cloudflare Worker:**
    -   The existing Hono backend (running on Cloudflare Workers) would then act as a consumer of this new API.
    -   It would make standard `fetch` requests to the Python service's API endpoints to get the live data.
    -   The worker can then cache this data, combine it with data from other sources (like blockchain explorers), and serve it to the frontend dashboard.
This approach is robust, scalable, and uses the correct technology for each part of the system, ensuring that the core application remains fast and secure on the Cloudflare network while leveraging specialized data sources running in their appropriate environments.