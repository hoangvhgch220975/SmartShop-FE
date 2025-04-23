import Vue from 'vue';
import Router from 'vue-router';

// Import the HomePage component
import HomePage from '@/pages/client/HomePage.vue';

// Import the LoginForm and SignupForm components
import LoginForm from '@/components/LoginForm.vue';
import SignupForm from '@/components/SignupForm..vue';
import RegistInfo from "@/components/RegistInfo.vue";


// Import pages for the client-side routes
import DeviceList from '@/pages/client/Device/DeviceList.vue';
import DeviceDetail from '@/pages/client/Device/DeviceDetail.vue';


import PackageList from '@/pages/client/Package/PackageList.vue';
import PackageDetail from '@/pages/client/Package/PackageDetail.vue';

import ComboList from '@/pages/client/Combo/ComboList.vue';
import ComboDetail from '@/pages/client/Combo/ComboDetail.vue';

import Profile from '@/pages/client/User/Profile.vue';
import EditProfile from '@/pages/client/User/EditProfile.vue';
import ChangePassword from '@/pages/client/User/ChangePassword.vue';
import Contact from '@/pages/client/User/Contact.vue';
import OrderHistory from '@/pages/client/OrderHistory.vue';
import OrderHistoryDetail from '@/pages/client/OrderHistoryDetail.vue';

import SearchResult from '@/pages/client/SearchResult.vue';
import Cart from '@/pages/client/Cart.vue';
import Checkout from '@/pages/client/Checkout.vue';
import Thanks from '@/pages/client/Thanks.vue';


Vue.use(Router);  // Ensure Vue Router is used

const router = new Router({
  mode: 'history',  // Use history mode to remove the hash (#)
  routes: [

    // Authentication routes
    {
      path: '/login',
      name: 'Login',
      component: LoginForm // Use LoginForm component for the login route
    },
    {
      path: '/signup',
      name: 'Signup',
      component: SignupForm // Use SignupForm component for the signup route
    },
    {
      path: '/regist-info',
      name: 'RegistInfo',
      component: RegistInfo // Use RegistInfo component for the registration info route
    },
    

    // User routes
    {
      path: '/',
      name: 'Home',
      component: HomePage // Use HomePage component for the root route
    },

    // Device  route
    {
      path: '/shop/device',
      name: 'DeviceList',
      component: DeviceList // Use DeviceList component for the device list route
    },
    {
      path: '/device/:id',
      name: 'DeviceDetail',
      component: DeviceDetail, // Use DeviceDetail component for the device detail route
    },


    // Package route
    {
      path: '/shop/package',
      name: 'PackageList',
      component: PackageList // Use PackageList component for the package list route
    },
    {
      path: '/package/:id',
      name: 'PackageDetail',
      component: PackageDetail, // Use PackageDetail component for the package detail route
    },


    
    // Combo route
    {
      path: '/shop/combo',
      name: 'ComboList',
      component: ComboList // Use ComboList component for the combo list route
    },
    {
      path: '/combo/:id',
      name: 'ComboDetail',
      component: ComboDetail, // Use ComboDetail component for the combo detail route
    },


    // Contact route
    { 
      path: '/contact',
      name: 'Contact',
      component: Contact // Use Contact component for the contact route

    },
    // Profile route
    {
      path: '/profile/:id',
      name: 'Profile',
      component: Profile // Use Profile component for the profile route
    },
    {
      path: '/profile/edit/:id',
      name: 'EditProfile',
      component: EditProfile // Use EditProfile component for the edit profile route
    },
    {
      path: '/profile/change-password/:id',
      name: 'ChangePassword',
      component: ChangePassword // Use ChangePassword component for the change password route
    },

    // Order history route
    {
      path: '/order-history',
      name: 'OrderHistory',
      component: OrderHistory // Use OrderHistory component for the order history route
    },

    {
      path: '/order/:id',
      name: 'OrderHistoryDetail',
      component: OrderHistoryDetail // Use OrderHistoryDetail component for the order history detail route
    },

    // Search route
    {
      path: '/search',
      name: 'SearchResult',
      component: SearchResult // Use SearchResult component for the search result route
    },

    // Cart route
    {
      path: '/cart',
      name: 'Cart',
      component: Cart // Use Cart component for the cart route
    },

    // Checkout route
    {
      path: '/checkout',
      name: 'Checkout',
      component: Checkout // Use Checkout component for the checkout route
    },
    // Thanks route
    {
      path: '/thanks',
      name: 'Thanks',
      component: Thanks // Use Thanks component for the thanks route
    }
    

    
  ]
});

export default router;
