import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.5:3000',
  withCredentials: true,
})
  