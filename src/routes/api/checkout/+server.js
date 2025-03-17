import { createPayment } from '$lib/easypay';
import { createRegistrant } from '$lib/notion';

export async function POST({ request, cookies }) {
    try {
        const body = await request.json();
        const { name, email, amount, phone, vat, type } = body;
        if (!type) {
            return new Response("Payment type is required", { status: 400 });
        }

        console.log('Request Body:', body);

        const paymentData = {
            capture: {
                descriptive: "DIS Registration"
            },
            currency: "EUR",
            value: amount,
            method: type,
            customer: {
                name: name,
                email: email,
                phone: phone,
                key: `${name}-${amount}`,
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
                const { status, entity, reference } = response.method;
                responseBody = { method: 'mb', status, entity, reference };
            } else if (response.method.type === 'cc') {
                // Handle Credit Card response
                const { url, status } = response.method;
                responseBody = { method: 'cc', status, url };
            } else if (response.method.type === 'vi') {
                // Handle Virtual IBAN response
                const { iban, status } = response.method;
                responseBody = { method: 'vi', status, iban };
            } else {
                responseBody = response;
            }
            createRegistrant(body);
            return new Response(JSON.stringify(responseBody), { status: 200 });

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