const { Cashfree, CFEnvironment } = require("cashfree-pg");

// FIX 1: Hardcode to SANDBOX. 
// (Your original code inverted this logic, sending Test keys to Production, causing Auth Failure)
const env = CFEnvironment.SANDBOX;

// FIX 2: Create a new Instance 
// (The static method failed, so we go back to the instance which worked initially)
const cashfree = new Cashfree(
  env,
  'TEST430329ae80e0f32e41a393d78b923034',  
  'TESTaf195616268bd6202eeb3bf8dc458956e7192a85'
);

// Expire after 60 minutes
const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
const formattedExpiryDate = expiryDate.toISOString();

exports.createOrder = async (orderId, orderAmount, orderCurrency='INR', customerId, customerPhone) => {
    try {
        const request = {
            order_amount: orderAmount,
            order_currency: orderCurrency,
            order_id: orderId,
            customer_details: {
                customer_id: String(customerId),
                customer_phone: customerPhone,
            },
            payment_methods: "cc,nb,upi,paylater",
            order_meta: {
                return_url: `http://15.206.27.0:4000/payment/payment-status?order_id=${orderId}&user_id=${customerId}`,
            },
            order_expiry_time: formattedExpiryDate,
        };

        // FIX 3: Use the instance method (without the date string)
        const response = await cashfree.PGCreateOrder(request);
       
        console.log("Order Created:", response.data);
        return response.data.payment_session_id;

    } catch (error) {
        console.error("Error creating order:", error.response?.data?.message || error.message);
        throw error;
    }
};

exports.getPaymentStatusFromCF = async (orderId) => {
    try {
        console.log("Checking Status For:", orderId);

        // Use instance method
        const response = await cashfree.PGOrderFetchPayments(orderId);
        let payments = response.data;

        // If NOT array, wrap inside array
        if (!Array.isArray(payments)) {
            payments = [payments];
        }

        let orderStatus;

        if (payments.some(txn => txn.payment_status === "SUCCESS")) {
            orderStatus = "Success";
        } else if (payments.some(txn => txn.payment_status === "PENDING")) {
            orderStatus = "Pending";
        } else {
            orderStatus = "Failure";
        }

        return orderStatus;

    } catch (error) {
        console.error("Error fetching order status:", error.response?.data?.message || error.message);
        return "Failure";
    }
};