import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://registro-pediatrico.herokuapp.com/'
});

export default axiosClient;