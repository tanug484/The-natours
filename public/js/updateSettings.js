import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  console.log(data, type);
  const url =
    type === 'password'
      ? 'http://127.0.0.1:8000/api/v1/users/updateMyPassword'
      : 'http://127.0.0.1:8000/api/v1/users/updateMe';
  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      console.log('i am in success');
      showAlert('success', `${type} updated successfully`);
      // showAlert('success','Data updated successfully')
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
