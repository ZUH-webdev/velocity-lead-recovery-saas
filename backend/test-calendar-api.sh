#!/bin/bash

# Test Calendar Integration
# Provide a valid JWT in the TOKEN environment variable before running.
# Example: export TOKEN="$(cat token.txt)"
TOKEN="${TOKEN:-}"

echo ""
echo "=========================================="
echo "🔐 Google Calendar Integration Tests"
echo "=========================================="

echo ""
echo "[1] Calendar Status (Before Connection)"
echo "----------------------------------------"
curl -s -X GET "http://localhost:3001/api/calendar/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

echo ""
echo ""
echo "[2] Get OAuth Authorization URL"
echo "----------------------------------------"
curl -s -X GET "http://localhost:3001/api/calendar/auth-url" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | head -c 150
echo "..."

echo ""
echo ""
echo "[3] Test Availability Without Calendar (Should fail)"
echo "----------------------------------------"
curl -s -X GET "http://localhost:3001/api/calendar/availability?date=2026-05-06" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

echo ""
echo ""
echo "[4] Update Business Timezone"
echo "----------------------------------------"
curl -s -X PUT "http://localhost:3001/api/calendar/settings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "timezone": "America/New_York"
  }'

echo ""
echo ""
echo "=========================================="
echo "✓ Calendar API tests completed!"
echo "=========================================="
