import axios from 'axios'
import store from '../store/index'

const AuthApi =  {
    login: (data) => {
      return axios.post(`/api/auth/login`, data).then(
        (response) => {
          return response
        },
        (error) => {
          return error
        }
      )
    },
    logout: (data) => {
        return axios.post(`/api/auth/logout`, data).then(
          (response) => {
            return response
          },
          (error) => {
            return error.response.data
          }
        )
      },
  }
export default AuthApi;
  