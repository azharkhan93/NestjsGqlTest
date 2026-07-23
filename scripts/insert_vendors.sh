#!/usr/bin/env bash
# ==============================================================================
# Script: insert_vendors.sh
# Usage:
#   ./scripts/insert_vendors.sh local       # Targets local dev endpoint (http://localhost:4000/graphql)
#   ./scripts/insert_vendors.sh prod        # Targets production VPS endpoint (https://27.100.38.251.sslip.io/graphql)
#   ./scripts/insert_vendors.sh <CUSTOM_URL>
# ==============================================================================

ENV_ARG="${1:-local}"

if [ "${ENV_ARG}" = "local" ]; then
  TARGET_URL="http://localhost:4000/graphql"
  ENV_NAME="Local Development"
elif [ "${ENV_ARG}" = "prod" ] || [ "${ENV_ARG}" = "production" ]; then
  TARGET_URL="https://27.100.38.251.sslip.io/graphql"
  ENV_NAME="Production VPS"
else
  TARGET_URL="${ENV_ARG}"
  ENV_NAME="Custom URL"
fi

echo "========================================================"
echo "🚀 Environment: ${ENV_NAME}"
echo "🌐 Target Endpoint: ${TARGET_URL}"
echo "========================================================"

# Helper function to get token for a phone number
get_token() {
  local PHONE="$1"
  local LOGIN_RESP
  LOGIN_RESP=$(curl -s -k -X POST "${TARGET_URL}" \
    -H "Content-Type: application/json" \
    -d "{
      \"query\": \"mutation LoginByPhone(\$phoneNumber: String!, \$code: String!, \$role: UserRole!) { loginByPhone(phoneNumber: \$phoneNumber, code: \$code, role: \$role) { token user { id phoneNumber } } }\",
      \"variables\": {
        \"phoneNumber\": \"${PHONE}\",
        \"code\": \"111111\",
        \"role\": \"PROVIDER\"
      }
    }")
  echo "${LOGIN_RESP}" | grep -o '"token":"[^"]*' | cut -d'"' -f4
}

# Test initial connection
TEST_TOKEN=$(get_token "+919876543210")
if [ -z "${TEST_TOKEN}" ]; then
  echo "❌ Error: Could not connect to API or authenticate at ${TARGET_URL}."
  if [ "${ENV_ARG}" = "local" ]; then
    echo "💡 Tip: Make sure the local NestJS server is running on http://localhost:4000/graphql."
  elif [ "${ENV_ARG}" = "prod" ] || [ "${ENV_ARG}" = "production" ]; then
    echo "💡 Tip: Check if the production VPS (27.100.38.251) is powered on and port 443/80 is open."
  fi
  exit 1
fi

echo "--------------------------------------------------------"
echo "📦 Step 1: Inserting Vendor 1 - AutoShine Detailing Studio (+919876543210)..."
TOKEN_1=$(get_token "+919876543210")

curl -s -k -X POST "${TARGET_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_1}" \
  -d '{
    "query": "mutation CreateVendor($input: CreateVendorProfileInput!) { createVendorProfile(input: $input) { id userId businessName contactNumber address serviceRadius operatingHours description whyChooseMe gstNumber imageUri images createdAt } }",
    "variables": {
      "input": {
        "businessName": "AutoShine Detailing Studio",
        "contactNumber": "+919876543210",
        "address": "102 MG Road, Indiranagar, Bengaluru, Karnataka 560038",
        "serviceRadius": "15 km",
        "operatingHours": "08:00 AM - 08:00 PM (Mon-Sat)",
        "description": "Premium eco-friendly hand wash, ceramic coating, paint protection film (PPF), and high-end interior restoration for luxury cars and SUVs.",
        "whyChooseMe": "Certified ceramic coating specialists, 100% scratch-free microfiber washing, bio-degradable foam shampoo, and 5-star customer ratings.",
        "gstNumber": "29ABCDE1234F1Z5",
        "imageUri": "https://images.unsplash.com/photo-1520340356584-f9917d1beb6d?q=80&w=800",
        "images": [
          "https://images.unsplash.com/photo-1520340356584-f9917d1beb6d?q=80&w=800",
          "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=800"
        ]
      }
    }
  }' | jq . || true

echo -e "\n--------------------------------------------------------"
echo "📦 Step 2: Inserting Vendor 2 - SparkleDrive Doorstep Wash (+919876543211)..."
TOKEN_2=$(get_token "+919876543211")

curl -s -k -X POST "${TARGET_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_2}" \
  -d '{
    "query": "mutation CreateVendor($input: CreateVendorProfileInput!) { createVendorProfile(input: $input) { id userId businessName contactNumber address serviceRadius operatingHours description whyChooseMe gstNumber imageUri images createdAt } }",
    "variables": {
      "input": {
        "businessName": "SparkleDrive Doorstep Wash",
        "contactNumber": "+919876543211",
        "address": "Sector 18, Noida, Uttar Pradesh 201301",
        "serviceRadius": "25 km",
        "operatingHours": "07:00 AM - 07:00 PM (Daily)",
        "description": "Convenient mobile doorstep car wash & steam sanitization using waterless eco-friendly technology right in your apartment parking.",
        "whyChooseMe": "On-demand doorstep service, zero water wastage technology, professional battery-operated high-pressure washers, and trained technicians.",
        "gstNumber": "07AAACB5678G2Z1",
        "imageUri": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800",
        "images": [
          "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800",
          "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=800"
        ]
      }
    }
  }' | jq . || true

echo -e "\n--------------------------------------------------------"
echo "📦 Step 3: Inserting Vendor 3 - Royal Care Auto Spa (+919876543212)..."
TOKEN_3=$(get_token "+919876543212")

curl -s -k -X POST "${TARGET_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_3}" \
  -d '{
    "query": "mutation CreateVendor($input: CreateVendorProfileInput!) { createVendorProfile(input: $input) { id userId businessName contactNumber address serviceRadius operatingHours description whyChooseMe gstNumber imageUri images createdAt } }",
    "variables": {
      "input": {
        "businessName": "Royal Care Auto Spa",
        "contactNumber": "+919876543212",
        "address": "Plot 45, Jubilee Hills, Hyderabad, Telangana 500033",
        "serviceRadius": "20 km",
        "operatingHours": "09:00 AM - 09:00 PM (Mon-Sun)",
        "description": "Full-suite automated express wash, underbody rust protection, engine bay degreasing, and leather conditioning.",
        "whyChooseMe": "State-of-the-art Italian automated wash bays, Swiss-imported waxes, lounge with free WiFi, and express 20-minute turnaround.",
        "gstNumber": "36AAAAA0000A1Z5",
        "imageUri": "https://images.unsplash.com/photo-1552930294-6b595f4c2974?q=80&w=800",
        "images": [
          "https://images.unsplash.com/photo-1552930294-6b595f4c2974?q=80&w=800",
          "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=800"
        ]
      }
    }
  }' | jq . || true

echo -e "\n--------------------------------------------------------"
echo "📦 Step 4: Inserting Vendor 4 - EcoClean Mobile Car Care (+919876543213)..."
TOKEN_4=$(get_token "+919876543213")

curl -s -k -X POST "${TARGET_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_4}" \
  -d '{
    "query": "mutation CreateVendor($input: CreateVendorProfileInput!) { createVendorProfile(input: $input) { id userId businessName contactNumber address serviceRadius operatingHours description whyChooseMe gstNumber imageUri images createdAt } }",
    "variables": {
      "input": {
        "businessName": "EcoClean Mobile Car Care",
        "contactNumber": "+919876543213",
        "address": "Link Road, Andheri West, Mumbai, Maharashtra 400053",
        "serviceRadius": "18 km",
        "operatingHours": "08:30 AM - 07:30 PM (Tue-Sun)",
        "description": "Specialized chemical-free steam interior deep cleaning, AC duct ozone disinfection, headlight restoration, and hydrophobic glass treatment.",
        "whyChooseMe": "140°C high-pressure dry steam, 99.9% bacterial kill rate, anti-allergen upholstery shampooing, and transparent upfront pricing.",
        "gstNumber": "27BBBBB1111B2Z3",
        "imageUri": "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=800",
        "images": [
          "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=800",
          "https://images.unsplash.com/photo-1520340356584-f9917d1beb6d?q=80&w=800"
        ]
      }
    }
  }' | jq . || true

echo -e "\n========================================================"
echo "🎉 Vendor Insertion Completed for ${ENV_NAME}!"
echo "========================================================"
