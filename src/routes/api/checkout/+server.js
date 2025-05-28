import { createPayment } from '$lib/easypay';
import { createRegistrant } from '$lib/notion';

export async function POST({ request, cookies }) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const confirmationNumber = `DCN25-${day}${month}${minutes}`;

    try {
        const body = await request.json();
        const { name, email, amount, phone, vat, type } = body;
        if (!type) {
            return new Response("Payment type is required", { status: 400 });
        }

        console.log('Request Body:', body);

        console.log('Request Body:', body);
        body.confirmationNumber = confirmationNumber;
        body.status = 'Waiting';
        console.log('Request Body:', body);

        const paymentData = {
            capture: {
                descriptive: "DIS Registration"
            },
            currency: "EUR",
            value: amount,
            method: type,
            url_success: "https://dis-registration.travel-to-madeira.com/aftercheckout",
            
            customer: {
                name: name,
                email: email,
                phone: phone,
                key: confirmationNumber,
                fiscal_number: vat
            },
        };

        const response = await createPayment(paymentData);
        
        console.log("API Response:", JSON.stringify(response, null, 2));
        let responseBody;

        // Handle the response based on the payment method type
        if (response && response.method) {
            console.log("I am in");
            if (response.method.type === 'mb') {
                // Handle Multibanco response
                //nst { status, entity, reference } = response.method;
                responseBody = {
                    method: {
                    type: 'mb',
                    status: response.method.status,
                    entity: response.method.entity,
                    reference: response.method.reference
                    }
                };
            } else if (response.method.type === 'cc') {
                // Handle Credit Card response
                const { url, status } = response.method;
                responseBody = { method: 'cc', status, url };
            } if (response.method.type.toLowerCase() === 'vi') {
                // Handle IBAN response
                const { status, iban } = response.method;
                responseBody = { method: 'vi', status, iban };
            } else {
                responseBody = response;
            }

            const notionResponse = await createRegistrant(body);
            return new Response(JSON.stringify({easypay: responseBody, notion: notionResponse}), { status: 200 });

        } else {
            return new Response("An unexpected error occurred", { status: 500 });
        }
    } catch (err) {
        console.error("Error making payment:", err);
        if (err.response && err.response.status) {
            return new Response(err.response.data, { status: err.response.status });
        } else {
            return new Response("An unexpected error occurred 2", { status: 500 });
        }
    }
}