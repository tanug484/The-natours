import axios from 'axios';
// // import * as  Stripe  from '@stripe/stripe-js';

import { showAlert } from './alerts';

// // console.log(Stripe);
export const bookTour = async (tourId) => {
  console.log('tour id in stripe.js', tourId);

  const response = await axios({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`,
  });
  const url = response.data.url;
  console.log(url);
  window.location.href = `${url}`;
};
