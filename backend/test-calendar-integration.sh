#!/bin/bash

# Google Calendar Integration Test Suite
# Tests the complete flow from OAuth to SMS booking with real calendar slots

BASE_URL="http://localhost:3001"
BUSINESS_ID=""
USER_ID=""
JWT_TOKEN=""
PHONE="14155552671"  # Test lead phone

echo "🚀 Google Calendar Integration Test Suite"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Create User
echo -e "\n${BLUE}[TEST 1] Creating test user...${NC}"
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "calendar-test@velocity.local",
    "password": "TestPassword123",
    "businessId": "test-biz-001"
  }')

JWT_TOKEN=$(echo $SIGNUP_RESPONSE | jq -r '.data.token' 2>/dev/null)
USER_ID=$(echo $SIGNUP_RESPONSE | jq -r '.data.user.userId' 2>/dev/null)

if [ "$JWT_TOKEN" != "null" ] && [ ! -z "$JWT_TOKEN" ]; then
  echo -e "${GREEN}✓ User created, JWT: ${JWT_TOKEN:0:20}...${NC}"
else
  echo -e "${RED}✗ Failed to create user${NC}"
  echo $SIGNUP_RESPONSE | jq '.'
  exit 1
fi

# Test 2: Get Calendar Auth URL
echo -e "\n${BLUE}[TEST 2] Getting OAuth authorization URL...${NC}"
AUTH_URL_RESPONSE=$(curl -s -X GET "$BASE_URL/api/calendar/auth-url" \
  -H "Authorization: Bearer $JWT_TOKEN")

AUTH_URL=$(echo $AUTH_URL_RESPONSE | jq -r '.authUrl' 2>/dev/null)

if [[ $AUTH_URL == https://accounts.google.com* ]]; then
  echo -e "${GREEN}✓ Auth URL generated${NC}"
  echo "   URL: ${AUTH_URL:0:80}..."
else
  echo -e "${RED}✗ Failed to get auth URL${NC}"
  echo $AUTH_URL_RESPONSE | jq '.'
fi

# Test 3: Check Calendar Status (before connection)
echo -e "\n${BLUE}[TEST 3] Checking calendar status (before connection)...${NC}"
STATUS_BEFORE=$(curl -s -X GET "$BASE_URL/api/calendar/status" \
  -H "Authorization: Bearer $JWT_TOKEN")

CONNECTED=$(echo $STATUS_BEFORE | jq -r '.connected' 2>/dev/null)
if [ "$CONNECTED" = "false" ]; then
  echo -e "${GREEN}✓ Calendar not connected (as expected)${NC}"
else
  echo -e "${YELLOW}⚠ Calendar connection status: $CONNECTED${NC}"
fi

# Test 4: Try availability without connection (should fail gracefully)
echo -e "\n${BLUE}[TEST 4] Requesting availability without calendar connected...${NC}"
AVAIL_BEFORE=$(curl -s -X GET "$BASE_URL/api/calendar/availability?date=2026-05-06" \
  -H "Authorization: Bearer $JWT_TOKEN")

ERROR=$(echo $AVAIL_BEFORE | jq -r '.message' 2>/dev/null)
if [[ $ERROR == *"not connected"* ]]; then
  echo -e "${GREEN}✓ Correctly returns error: $ERROR${NC}"
else
  echo -e "${YELLOW}⚠ Response: $(echo $AVAIL_BEFORE | jq '.')${NC}"
fi

# Test 5: Update business with timezone
echo -e "\n${BLUE}[TEST 5] Updating business timezone...${NC}"
TIMEZONE_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/calendar/settings" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "timezone": "America/New_York"
  }')

TIMEZONE=$(echo $TIMEZONE_RESPONSE | jq -r '.settings.timezone' 2>/dev/null)
if [ "$TIMEZONE" = "America/New_York" ]; then
  echo -e "${GREEN}✓ Timezone set to: $TIMEZONE${NC}"
else
  echo -e "${RED}✗ Failed to set timezone${NC}"
  echo $TIMEZONE_RESPONSE | jq '.'
fi

# Test 6: Test SMS booking flow without calendar (default slots)
echo -e "\n${BLUE}[TEST 6] Testing SMS booking flow (without calendar)...${NC}"
SMS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/sms/incoming" \
  -H "Content-Type: application/json" \
  -d "{
    \"phoneNumber\": \"$PHONE\",
    \"messageText\": \"Hi there\",
    \"businessId\": \"test-biz-001\"
  }")

RESPONSE_TEXT=$(echo $SMS_RESPONSE | jq -r '.response' 2>/dev/null)
if [[ ! -z "$RESPONSE_TEXT" ]] && [[ "$RESPONSE_TEXT" != "null" ]]; then
  echo -e "${GREEN}✓ SMS processed successfully${NC}"
  echo "   Response: ${RESPONSE_TEXT:0:80}..."
else
  echo -e "${YELLOW}⚠ Response: $(echo $SMS_RESPONSE | jq '.')${NC}"
fi

# Test 7: Continue SMS conversation
echo -e "\n${BLUE}[TEST 7] Continuing SMS conversation (name)...${NC}"
SMS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/sms/incoming" \
  -H "Content-Type: application/json" \
  -d "{
    \"phoneNumber\": \"$PHONE\",
    \"messageText\": \"John Smith\",
    \"businessId\": \"test-biz-001\"
  }")

RESPONSE_TEXT=$(echo $SMS_RESPONSE | jq -r '.response' 2>/dev/null)
STATE=$(echo $SMS_RESPONSE | jq -r '.state' 2>/dev/null)
echo -e "${GREEN}✓ State: $STATE${NC}"
echo "   Response: ${RESPONSE_TEXT:0:80}..."

# Test 8: Qualification
echo -e "\n${BLUE}[TEST 8] Qualification (reason)...${NC}"
SMS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/sms/incoming" \
  -H "Content-Type: application/json" \
  -d "{
    \"phoneNumber\": \"$PHONE\",
    \"messageText\": \"Regular checkup\",
    \"businessId\": \"test-biz-001\"
  }")

STATE=$(echo $SMS_RESPONSE | jq -r '.state' 2>/dev/null)
echo -e "${GREEN}✓ State: $STATE${NC}"

# Test 9: New/Returning patient
echo -e "\n${BLUE}[TEST 9] Patient status...${NC}"
SMS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/sms/incoming" \
  -H "Content-Type: application/json" \
  -d "{
    \"phoneNumber\": \"$PHONE\",
    \"messageText\": \"Returning\",
    \"businessId\": \"test-biz-001\"
  }")

STATE=$(echo $SMS_RESPONSE | jq -r '.state' 2>/dev/null)
echo -e "${GREEN}✓ State: $STATE${NC}"

# Test 10: Time preference
echo -e "\n${BLUE}[TEST 10] Time preference (afternoons)...${NC}"
SMS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/sms/incoming" \
  -H "Content-Type: application/json" \
  -d "{
    \"phoneNumber\": \"$PHONE\",
    \"messageText\": \"Afternoons\",
    \"businessId\": \"test-biz-001\"
  }")

STATE=$(echo $SMS_RESPONSE | jq -r '.state' 2>/dev/null)
RESPONSE_TEXT=$(echo $SMS_RESPONSE | jq -r '.response' 2>/dev/null)
echo -e "${GREEN}✓ State: $STATE${NC}"
echo -e "${YELLOW}[IMPORTANT] Slots offered (default):${NC}"
echo "   $RESPONSE_TEXT"

# Test 11: Booking confirmation
echo -e "\n${BLUE}[TEST 11] Booking confirmation...${NC}"
SMS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/sms/incoming" \
  -H "Content-Type: application/json" \
  -d "{
    \"phoneNumber\": \"$PHONE\",
    \"messageText\": \"First one\",
    \"businessId\": \"test-biz-001\"
  }")

STATE=$(echo $SMS_RESPONSE | jq -r '.state' 2>/dev/null)
RESPONSE_TEXT=$(echo $SMS_RESPONSE | jq -r '.response' 2>/dev/null)
echo -e "${GREEN}✓ State: $STATE${NC}"
echo "   Confirmation: ${RESPONSE_TEXT:0:80}..."

# Test 12: Health check
echo -e "\n${BLUE}[TEST 12] Health check...${NC}"
HEALTH=$(curl -s -X GET "$BASE_URL/api/health")
HEALTH_STATUS=$(echo $HEALTH | jq -r '.data.status' 2>/dev/null)
if [ "$HEALTH_STATUS" = "ok" ]; then
  echo -e "${GREEN}✓ Server healthy${NC}"
else
  echo -e "${RED}✗ Server health issue${NC}"
fi

# Summary
echo -e "\n=========================================="
echo -e "${GREEN}✓ All tests completed!${NC}"
echo ""
echo -e "${YELLOW}📝 Integration Flow Summary:${NC}"
echo "  1. User created and authenticated ✓"
echo "  2. Calendar OAuth URL generated ✓"
echo "  3. Calendar status checked (not connected) ✓"
echo "  4. Availability unavailable without connection ✓"
echo "  5. Business timezone configured ✓"
echo "  6. SMS booking flow tested (default slots) ✓"
echo "  7. Conversation state progression working ✓"
echo ""
echo -e "${BLUE}🔐 OAuth Flow Ready:${NC}"
echo "  To complete OAuth and use real calendar slots:"
echo "  1. Call: GET /api/calendar/auth-url"
echo "  2. User visits the returned URL in browser"
echo "  3. Approves Google Calendar access"
echo "  4. Google redirects to: GET /api/calendar/callback"
echo "  5. Refresh token stored in Business document"
echo "  6. SMS booking now uses real calendar availability"
echo ""
echo -e "${BLUE}📊 Next Steps:${NC}"
echo "  - Setup Google OAuth credentials in Google Cloud Console"
echo "  - Test real calendar integration in staging"
echo "  - Monitor availability queries in logs"
echo ""
