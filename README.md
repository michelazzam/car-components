# Project Setup

This project consists of three main directories:

- `client` - The web application.
- `server` - The backend server.

## Server Setup

1. **Install MongoDB** on your system if not already installed:  
   Download and install MongoDB Community Server from the official website:  
   [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

2. **Install MongoDB Tools** (optional, but required for local database backup operations):  
   Download MongoDB Database Tools from:  
   [https://www.mongodb.com/try/download/database-tools](https://www.mongodb.com/try/download/database-tools)

3. Install dependencies:
   ```sh
   cd server
   npm install
   ```
4. Create a `.env` file with the following content:

   ```env
   NODE_ENV=development
   PORT=8000

   DATABASE_URL=<HASHED_VALUE>
   BACKUP_DATABASE_URL=<HASHED_VALUE>
   ```

   _Note: Replace `<HASHED_VALUE>` with the appropriately secured value._

5. Build and run the server:
   ```sh
   npm run build
   npm run dev
   ```
6. The server exposes two APIs:
   - Swagger documentation.
   - API access for the client application.

## Client Setup

1. Install dependencies:
   ```sh
   cd client
   npm install
   ```
2. Create a `.env` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Build and run the client:
   ```sh
   npm run build
   npm run dev
   ```
4. The terminal will display the access URL for the web application.
