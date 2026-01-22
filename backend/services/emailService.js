const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const sendResetEmail = async (toEmail, resetLink) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const emailData = {
    to: [{ email: toEmail }],
    sender: { name: "Expense Tracker", email: "girishpatil621@gmail.com" },
    subject: "Reset your password",
    htmlContent: `
      <h3>Password Reset</h3>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `
  };

  await apiInstance.sendTransacEmail(emailData);
};

module.exports = { sendResetEmail };
