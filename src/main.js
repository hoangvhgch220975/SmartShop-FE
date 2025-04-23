import Vue from 'vue';
import Client from './Client.vue';  // Import the Client layout
import Admin from './Admin.vue';    // Import the Admin layout
import router from './router/router';  // Client router
import routerAdmin from './router/routerAdmin';  // Admin router

// Import external libraries
import 'semantic-ui-css/semantic.css';  // Semantic UI CSS
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap CSS
import "vue-toastification/dist/index.css";
import Toast from "vue-toastification"; // Toast notifications
Vue.use(Toast);


// Import and configure Vue Flash Message plugin
import VueFlashMessage from 'vue-flash-message';
import 'vue-flash-message/dist/vue-flash-message.min.css';
import "@fortawesome/fontawesome-free/css/all.css";


Vue.use(VueFlashMessage, {  
  messageOptions: {
    timeout: 5000 // Time unit: milliseconds (5000 ms = 5 seconds)
  }
});

Vue.config.productionTip = false;

// Conditionally set router based on the URL path
const currentRouter = window.location.pathname.startsWith('/admin') ? routerAdmin : router;

new Vue({
  render: h => h(window.location.pathname.startsWith('/admin') ? Admin : Client), // Dynamically choose between Admin and Client layout
  router: currentRouter,  // Dynamically use the correct router (client or admin)
}).$mount('#app');
