import axios from 'axios';

// const baseUrlApi = 'http://saasbons.wedowebdev.site/';
const baseUrlApi = 'https://app.receipt.be';

axios.defaults.baseURL = baseUrlApi;

export const init = () => {
  axios.defaults.baseURL = baseUrlApi;
};

export default {
  baseUrlApi,
};
