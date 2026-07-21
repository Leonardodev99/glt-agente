import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// ⚠️ Troque pelo IP local do seu PC na rede Wi-Fi (ex: 192.168.1.50)
// Descubra com `hostname -I` (Linux/WSL) ou `ipconfig` (Windows, campo IPv4)
const API_URL = "http://10.52.196.172:3001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Injeta o token automaticamente em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
