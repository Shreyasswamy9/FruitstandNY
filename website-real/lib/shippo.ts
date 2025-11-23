const Shippo = require('shippo');

const client = new Shippo({
    apiKeyHeader: process.env.SHIPPO_API_TOKEN!,
});
// Your warehouse/sender address
const FROM_ADDRESS = {
    name: 'Fruitstand NY',
    street1: '123 Your Warehouse Street', // UPDATE THIS
    city: 'New York',
    state: 'NY',
    zip: '10001', // UPDATE THIS
    country: 'US',
    phone: '+1234567890', // UPDATE THIS
    email: 'shipping@fruitstand.com', // UPDATE THIS
};

export interface ShippoAddress {
    name: string;
    street1: string;
    street2?: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string | null;
    email?: string;
}

export interface ShippoParcel {
    length: string;
    width: string;
    height: string;
    weight: string;
    distance_unit: 'in' | 'cm';
    mass_unit: 'lb' | 'kg';
}

export interface ShippoShipmentResult {
    object_id: string;
    rates: any[];
}

export interface ShippoLabelResult {
    tracking_number: string;
    tracking_url_provider: string;
    label_url: string;
    carrier: string;
    service_level: string;
}

/**
 * Create a shipment in Shippo
 */
export async function createShippoShipment(
    toAddress: ShippoAddress,
    parcel: ShippoParcel = {
        length: '10',
        width: '8',
        height: '4',
        weight: '1',
        distance_unit: 'in',
        mass_unit: 'lb',
    }
): Promise<ShippoShipmentResult> {
    try {
        const shipment = await client.shipments.create({
            address_from: FROM_ADDRESS,
            address_to: {
                name: toAddress.name,
                street1: toAddress.street1,
                street2: toAddress.street2 || '',
                city: toAddress.city,
                state: toAddress.state,
                zip: toAddress.zip,
                country: toAddress.country,
                phone: toAddress.phone || '',
                email: toAddress.email || '',
            },
            parcels: [parcel],
            async: false, // Wait for rates synchronously
        });

        console.log('Shippo shipment created:', shipment.object_id);
        return {
            object_id: shipment.object_id!,
            rates: shipment.rates || [],
        };
    } catch (error) {
        console.error('Error creating Shippo shipment:', error);
        throw error;
    }
}

/**
 * Get the cheapest shipping rate
 */
export function getCheapestRate(rates: any[]) {
    if (!rates || rates.length === 0) {
        throw new Error('No shipping rates available');
    }

    // Filter out invalid rates
    const validRates = rates.filter(
        (rate) => rate.available && rate.amount && rate.amount !== '0.00'
    );

    if (validRates.length === 0) {
        throw new Error('No valid shipping rates available');
    }

    // Sort by price and return cheapest
    const sorted = validRates.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    return sorted[0];
}

/**
 * Purchase a shipping label
 */
export async function purchaseShippoLabel(
    shipmentId: string,
    rateId?: string
): Promise<ShippoLabelResult> {
    try {
        // If no rate ID provided, get the shipment and find cheapest rate
        if (!rateId) {
            const shipment = await client.shipments.get(shipmentId);
            const cheapestRate = getCheapestRate(shipment.rates || []);
            rateId = cheapestRate.object_id;
        }

        // Purchase the label
        const transaction = await client.transactions.create({
            rate: rateId,
            async: false,
            label_file_type: 'PDF',
        });

        if (transaction.status !== 'SUCCESS') {
            throw new Error(`Label purchase failed: ${transaction.messages}`);
        }

        console.log('Shippo label purchased:', transaction.tracking_number);

        return {
            tracking_number: transaction.tracking_number!,
            tracking_url_provider: transaction.tracking_url_provider!,
            label_url: transaction.label_url!,
            carrier: transaction.rate?.carrier_account || 'unknown',
            service_level: transaction.rate?.servicelevel?.name || 'unknown',
        };
    } catch (error) {
        console.error('Error purchasing Shippo label:', error);
        throw error;
    }
}

/**
 * Create shipment and purchase label in one step
 */
export async function createAndPurchaseLabel(
    toAddress: ShippoAddress,
    parcel?: ShippoParcel
): Promise<ShippoLabelResult> {
    try {
        // 1. Create shipment
        const shipment = await createShippoShipment(toAddress, parcel);

        // 2. Get cheapest rate
        const cheapestRate = getCheapestRate(shipment.rates);
        console.log(`Selected shipping rate: ${cheapestRate.provider} - $${cheapestRate.amount}`);

        // 3. Purchase label
        const label = await purchaseShippoLabel(shipment.object_id, cheapestRate.object_id);

        return label;
    } catch (error) {
        console.error('Error in createAndPurchaseLabel:', error);
        throw error;
    }
}
