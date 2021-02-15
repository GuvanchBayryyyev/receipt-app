import axios from 'axios';

export default {
  getCurrentUser: (token) => {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    return axios.get(`/api/auth/user`, config).then(
      (response) => {
        return response;
      },
      (error) => {
        return error;
      },
    );
  },
  getBons: (token) => {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
      params: {
        page: 1,
        limit: 1000,
        sort_column: 'id',
        sort_type: 'desc',
        keyword: '',
      },
    };
    return axios.get(`/api/bons`, config).then(
      (response) => {
        return response;
      },
      (error) => {
        console.warn(error.message);
        return error;
      },
    );
  },
  getSuppliers: (token) => {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    return axios.get(`/api/suppliers`, config).then(
      (response) => {
        return response;
      },
      (error) => {
        console.warn(error.message);
        return error;
      },
    );
  },
  ////////////////////////////////////    This method is used in HomeScreen and Search Receipt screen
  createBons: (token, data) => {
    // console.warn(token, data)
    // const config = {
    //   headers: { Authorization: `Bearer ${token}`, 'Accept': 'application/json', 'Content-Type' : 'multipart/form-data','X-Requested-With':'XMLHttpRequest'},
    //   params: data
    // };
    // return axios.post(`/api/bons`, config).then(
    //   (response) => {
    //     console.log(response)
    //     return response
    //   },
    //   (error) => {
    //     console.log(error.response.data)
    //     return error
    //   }
    // )
  },
};
