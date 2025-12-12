# Quick Test Guide

## Testing the Dynamic API Integration

### 1. Check json-server is running
Open browser to: `http://localhost:3000/risks`
You should see the 3 sample risks in JSON format.

### 2. Check frontend is running
The frontend should be on: `http://localhost:5173`

### 3. Test the Risk List
Navigate to: `http://localhost:5173/risks`
You should see:
- 3 risks from db.json
- Risk R1: "Energy Transition..."
- Risk R2: "Cybersecurity Threats..."
- Risk R3: "Supply Chain Disruptions"

### 4. Test the Heat Map
Navigate to: `http://localhost:5173/heatmap`
You should see:
- Interactive 5×5 grid
- Risks plotted based on their ratings
- Statistics showing risk counts

### 5. Check Browser Console
Open DevTools (F12) and check:
- Network tab: Should see GET requests to `http://localhost:3000/risks`
- Console: Should not have errors (except notification store warnings which are expected)

### Common Issues

**No risks showing:**
- Check json-server is running on port 3000
- Check browser console for CORS errors
- Check Network tab for failed requests

**CORS errors:**
- json-server should handle CORS automatically
- If issues persist, check axios baseURL is correct

**Loading forever:**
- Check if API request is pending in Network tab
- Check console for JavaScript errors
