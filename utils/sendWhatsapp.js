// utils/sendWhatsapp.js
const axios = require('axios');

async function sendWhatsapp(to, message) {
  try {

    const ph = to.replace(/^\+91/, '').replace(/\D/g, '');

    const res = await axios.get('https://bhashsms.com/api/sendmsgutil.php', {
      params: {
        user: 'white_circle',
        pass: '123456',
        sender: 'BUZWAP',
        phone: ph,
        text: message,
        priority: 'wa',
        stype: 'normal',
        Params: '11,22'
      }
    });
    console.log('API Response:', res.data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

module.exports = sendWhatsapp;
