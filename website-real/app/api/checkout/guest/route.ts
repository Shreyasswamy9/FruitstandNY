import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderData,
      guestData: {
        email,
        firstName,
        lastName,
        phone,
        address,
        marketing
      }
    } = body;

    // Calculate analytics data from guest information
    const analyticsData = {
      customerType: 'guest',
      email,
      name: `${firstName} ${lastName}`,
      phone,
      location: {
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country
      },
      marketing: {
        emailOptIn: marketing.emailUpdates,
        analyticsOptIn: marketing.analytics
      },
      order: {
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        tax: orderData.tax,
        total: orderData.total,
        timestamp: new Date().toISOString()
      },
      demographics: {
        // You can add demographic analysis based on location, etc.
        region: getRegionFromState(address.state),
        zipType: getZipType(address.zipCode)
      }
    };

    // Here you would:
    // 1. Save guest data to your database for order fulfillment
    // 2. Send analytics data to your analytics platform
    // 3. Add email to marketing list if opted in
    // 4. Process the order

    console.log("Guest checkout data received:", analyticsData);

    // Example integrations:
    /*
    // Save to database
    await GuestOrder.create({
      email,
      customerInfo: { firstName, lastName, phone, address },
      orderData,
      marketingPreferences: marketing,
      analyticsData
    });

    // Send to analytics (Google Analytics, Mixpanel, etc.)
    if (marketing.analytics) {
      await sendToAnalytics('guest_checkout', analyticsData);
    }

    // Add to email marketing list
    if (marketing.emailUpdates) {
      await addToEmailList(email, { firstName, lastName, source: 'guest_checkout' });
    }
    */

    return NextResponse.json({ 
      success: true, 
      message: "Guest checkout data processed successfully",
      analytics: {
        customerType: 'guest',
        location: `${address.city}, ${address.state}`,
        marketingOptIn: marketing.emailUpdates,
        analyticsOptIn: marketing.analytics,
        orderValue: orderData.total
      }
    });

  } catch (error) {
    console.error("Guest checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process guest checkout" },
      { status: 500 }
    );
  }
}

function getRegionFromState(state: string): string {
  const regions: { [key: string]: string } = {
    // Northeast
    'ME': 'Northeast', 'NH': 'Northeast', 'VT': 'Northeast', 'MA': 'Northeast',
    'RI': 'Northeast', 'CT': 'Northeast', 'NY': 'Northeast', 'NJ': 'Northeast',
    'PA': 'Northeast',
    
    // Southeast
    'DE': 'Southeast', 'MD': 'Southeast', 'DC': 'Southeast', 'VA': 'Southeast',
    'WV': 'Southeast', 'KY': 'Southeast', 'TN': 'Southeast', 'NC': 'Southeast',
    'SC': 'Southeast', 'GA': 'Southeast', 'FL': 'Southeast', 'AL': 'Southeast',
    'MS': 'Southeast', 'AR': 'Southeast', 'LA': 'Southeast',
    
    // Midwest
    'OH': 'Midwest', 'MI': 'Midwest', 'IN': 'Midwest', 'WI': 'Midwest',
    'IL': 'Midwest', 'MN': 'Midwest', 'IA': 'Midwest', 'MO': 'Midwest',
    'ND': 'Midwest', 'SD': 'Midwest', 'NE': 'Midwest', 'KS': 'Midwest',
    
    // Southwest
    'TX': 'Southwest', 'OK': 'Southwest', 'NM': 'Southwest', 'AZ': 'Southwest',
    
    // West
    'CO': 'West', 'WY': 'West', 'MT': 'West', 'ID': 'West', 'UT': 'West',
    'NV': 'West', 'WA': 'West', 'OR': 'West', 'CA': 'West', 'AK': 'West',
    'HI': 'West'
  };
  
  return regions[state.toUpperCase()] || 'Unknown';
}

function getZipType(zipCode: string): string {
  if (!zipCode) return 'Unknown';
  
  const firstDigit = zipCode.charAt(0);
  
  // Basic ZIP code analysis
  const zipTypes: { [key: string]: string } = {
    '0': 'Northeast',
    '1': 'Northeast', 
    '2': 'Southeast',
    '3': 'Southeast',
    '4': 'Midwest',
    '5': 'Midwest',
    '6': 'Southwest',
    '7': 'Southwest',
    '8': 'West',
    '9': 'West'
  };
  
  return zipTypes[firstDigit] || 'Unknown';
}