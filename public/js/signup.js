import axios from 'axios';
import { showAlert } from './alerts';
export const signup = async (name, email, password, passwordConfirm) => {
  console.log(name, email, password, passwordConfirm);
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    console.log(res);
    showAlert('success', 'Signed up successfully!');
    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};