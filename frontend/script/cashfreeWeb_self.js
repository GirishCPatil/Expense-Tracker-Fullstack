
document.getElementById("renderBtn").addEventListener("click", async () => {
    try {
        let token = localStorage.getItem("token");
        //  Send token in Authorization header
        const response = await fetch("http://15.206.27.0:4000/payment/pay", {
            method: "POST",
            headers: {
        "Content-Type": "application/json",
        "Authorization":  token
    }

        });

        const data = await response.json();

        const paymentSessionId = data.paymentSessionId;

        let checkoutOptions = {
            paymentSessionId: paymentSessionId,
            redirectTarget: "_self",
        };

        await cashfree.checkout(checkoutOptions);

    } catch (err) {
        console.error("Error:", err);
    }
});