# JSON Server Mock API

This project uses json-server to provide a mock REST API for development and testing.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the mock API server:
```bash
npm run server
```

The server will run on `http://localhost:3000`

## Available Endpoints

### Risks
- `GET /risks` - Get all risks
- `GET /risks/:id` - Get a specific risk
- `POST /risks` - Create a new risk
- `PUT /risks/:id` - Update a risk
- `DELETE /risks/:id` - Delete a risk
- `PATCH /risks/:id` - Partially update a risk

### Versions
- `GET /versions` - Get all versions
- `GET /versions/:id` - Get a specific version

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get a specific user

### Threads
- `GET /threads` - Get all threads
- `GET /threads/:id` - Get a specific thread

### Heat Map
- `GET /heatmap` - Get heat map matrix data

## Query Parameters

json-server supports various query parameters:

### Filtering
```
GET /risks?status=Published
GET /risks?version=2025 Q4
GET /risks?refNo=R1
```

### Pagination
```
GET /risks?_page=1&_limit=10
```

### Sorting
```
GET /risks?_sort=refNo&_order=asc
```

### Full-text Search
```
GET /risks?q=energy
```

### Relationships
```
GET /risks?_embed=ratings
```

## Sample Data

The `db.json` file contains:
- **3 sample risks** with different risk levels (Very High, High)
- **Ratings** from risk owners
- **Mitigations** with different statuses (Ongoing, Not Started, Completed)
- **Questions** and threads
- **2 versions** (Active and Locked)
- **Sample users** with different roles

## Configuration

### Update API Base URL

Update the axios base URL in your frontend to point to the mock server:

```typescript
// In src/plugins/axios.ts or similar
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### CORS

json-server automatically handles CORS, so you can make requests from your Vue app running on a different port.

## Custom Routes

The `routes.json` file defines custom route mappings for nested resources. This allows endpoints like:
- `/api/risks` → `/risks`
- `/risks/:id/ratings` → `/risks/:id`

## Tips

1. **Reset Data**: To reset to original data, restore from `db.json.backup` or re-run the setup
2. **Watch Mode**: The server automatically watches `db.json` for changes
3. **Delay Responses**: Add `--delay 1000` to simulate network latency
4. **Static Files**: Place files in `public/` directory to serve them

## Running Both Servers

To run both the frontend and mock API:

```bash
# Terminal 1 - Mock API
npm run server

# Terminal 2 - Frontend
npm run dev
```

## Example Requests

### Get all published risks
```bash
curl http://localhost:3000/risks?status=Published
```

### Get a specific risk
```bash
curl http://localhost:3000/risks/risk-001
```

### Create a new risk
```bash
curl -X POST http://localhost:3000/risks \
  -H "Content-Type: application/json" \
  -d '{"refNo":"R4","title":"New Risk","status":"Draft"}'
```

### Update a risk
```bash
curl -X PUT http://localhost:3000/risks/risk-001 \
  -H "Content-Type: application/json" \
  -d '{"status":"Locked"}'
```
