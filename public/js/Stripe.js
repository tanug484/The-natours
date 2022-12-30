import axios from 'axios';
// // import * as  Stripe  from '@stripe/stripe-js';

import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const response = await axios({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `/api/v1/bookings/checkout-session/${tourId}`,
  });
  const url = response.data.url;
  window.location.href = `${url}`;
};
