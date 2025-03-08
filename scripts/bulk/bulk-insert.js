const axios = require('axios');
require('dotenv').config();
const bulk = require('./bulk.json');

const apiUrl = 'http://localhost:3000/api/v1/masters/customers/v2';
const apiKey = process.env.GLOBAL_API_KEY;

async function bulkPost() {
  for (const customer of bulk) {
    try {
      const response = await axios.post(apiUrl, customer, {
        headers: {
          'X-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      });
      console.log(`Customer ${customer.customerName} created successfully:`);
    } catch (error) {
      console.error(
        `Error creating customer ${customer.customerName}:`,
        error.response ? error.response.data : error.message,
      );
      return;
    }
  }
}

bulkPost();
