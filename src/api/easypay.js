// Environment variables
const { EASY_PAY_API_KEY, API_BASE_URL, EASY_PAY_ACCOUNT_ID } = process.env;

/**
 * Create a payment with EasyPay.
 * @param {Object} paymentDetails - The payment data to send to EasyPay.
 * @returns {Promise<Object>} - The API response from EasyPay.
 */
const createPayment = async (paymentDetails) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            headers: {
                'Content-Type': 'application/json',
                AccountId: EASY_PAY_ACCOUNT_ID,
                ApiKey: EASY_PAY_API_KEY
              },
              paymentDetails,
        });
        
        if (!response.ok) {
            const errorData = await response.json(); // Extract error response data
            console.log(response)
            throw new Error(errorData.error || response.statusText);
        }

        const data = await response.json(); // Extract success response data
        return data;
    } catch (error) {
        console.error("EasyPay API Error:", error.message);
        throw new Error(error.message || "Failed to create payment");
    }
};

module.exports = {
    createPayment,
};