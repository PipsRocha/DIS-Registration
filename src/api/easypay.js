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
                Authorization: `Bearer ${EASY_PAY_API_KEY}`
              },
              paymentDetails,
        });
        return response.data;
    } catch (error) {
        console.error("EasyPay API Error:", error.response?.data || error.message);
        console.error("Error Status Code:", error.response?.status);
        throw new Error(error.response?.data?.error || "Failed to create payment");
    }
};


module.exports = {
    createPayment,
};