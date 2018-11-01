import axios from "axios";
import config from "./config/backend";
import { retrieveToken } from "./utils";

const api = axios.create({
  baseURL: config.url,
  timeout: 5000
});

const auth = token => ({ headers: { Authorization: "Bearer " + token } });

const backend = {};

backend.login = (username, password) =>
  api.post("/login", { username, password });

backend.account = (token = retrieveToken()) => api.get("/account", auth(token));

backend.signup = (email, password, language) =>
  api.post("/signup", { email, password, language });

backend.confirm = confirmId => api.post("/confirm", { id: confirmId });

backend.createAccount = confirmId => api.post("/user", { id: confirmId });

export default backend;
