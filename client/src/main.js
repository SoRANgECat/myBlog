import "./assets/main.scss";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { router, routes } from "./common/router";
import naive from "naive-ui";
import { createDiscreteApi } from "naive-ui";
import App from "./App.vue";
import axios from "axios";
import { AdminStore } from "./stores/AdminStore";

axios.defaults.baseURL = "http://127.0.0.1:8000";

const { message, notification, dialog } = createDiscreteApi([
  "message",
  "dialog",
  "notification",
]);
const app = createApp(App);
app.provide("axios", axios);
app.provide("message", message);
app.provide("notification", notification);
app.provide("dialog", dialog);
app.provide("server_url", axios.defaults.baseURL);

app.use(naive);
app.use(createPinia());
app.use(router);

const useAdminStore = AdminStore();
axios.interceptors.request.use((config) => {
  config.headers.token = useAdminStore.token;
  return config;
});

app.mount("#app");
