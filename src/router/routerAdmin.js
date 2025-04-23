import Vue from 'vue';
import Router from 'vue-router';

import AdminDashboard from '@/pages/admin/HomePageAdmin.vue';

import Devices from '@/pages/admin/Device/Devices.vue';
import ShowDevice from '@/pages/admin/Device/ShowDevice.vue';
import AddDevice from "../components/Device/AddDevice.vue";
import EditDevice from "../components/Device/EditDevice.vue";


import Packages from '@/pages/admin/Package/Packages.vue';
import ShowPackage from '@/pages/admin/Package/ShowPackage.vue';
import AddPackage from "../components/Package/AddPackage.vue";
import EditPackage from "../components/Package/EditPackage.vue";

import Combos from '@/pages/admin/Combo/Combos.vue';
import ShowCombo from '@/pages/admin/Combo/ShowCombo.vue';
import AddCombo from "../components/Combo/AddCombo.vue";
import EditCombo from "../components/Combo/EditCombo.vue";


import Users from '@/pages/admin/User/UserList.vue';
import ShowUserInfo from '@/pages/admin/User/ShowUserInfo.vue';
import AddUser from "../components/User/AddUser.vue";
import EditUser from "../components/User/EditUser.vue";

import OrderManagement from '@/pages/admin/OrderManagement.vue';
import SeeOrderDetail from '@/pages/admin/SeeOrderDetail.vue';

Vue.use(Router);

// ✅ Khởi tạo router trước
const adminRouter = new Router({
  mode: 'history',
  routes: [

    // Admin Dashboard
    {
      path: '/admin',
      name: 'AdminHome',
      component: AdminDashboard,
    },

    // Device Management
    {
      path: '/admin/devices',
      name: 'ManageDevices',
      component: Devices,
    },
    {
      path: '/admin/devices/view/:id',
      name: 'ViewDevice',
      component: ShowDevice
    },
    {
      path: "/admin/devices/add",
      name: "AddDevice",
      component: AddDevice
    },
    {
      path: '/admin/devices/edit/:id',
      name: 'EditDevice',
      component: EditDevice
    },

    // Package Management
    {
      path: '/admin/packages',
      name: 'ManagePackages',
      component: Packages
    },
    {
      path: '/admin/packages/view/:id',
      name: 'ViewPackage',
      component: ShowPackage
    },
    {
      path: '/admin/packages/add',
      name: 'AddPackage',
      component: AddPackage
    },
    {
      path: '/admin/packages/edit/:id',
      name: 'EditPackage',
      component: EditPackage
    },

    // Combo Management
    {
      path: '/admin/combos',
      name: 'ManageCombos',
      component: Combos
    },
    {
      path: '/admin/combos/view/:id',
      name: 'ViewCombo',
      component: ShowCombo
    },
    {
      path: '/admin/combos/add',
      name: 'AddCombo',
      component: AddCombo
    },
    {
      path: '/admin/combos/edit/:id',
      name: 'EditCombo',
      component: EditCombo
    },


    // User Management
    {
      path: '/admin/users',
      name: 'ManageUsers',
      component: Users

    },
    {
      path: '/admin/users/view/:id',
      name: 'ViewUser',
      component: ShowUserInfo
    },
    {
      path: '/admin/users/add',
      name: 'AddUser',
      component: AddUser
    },
    {
      path: '/admin/users/edit/:id',
      name: 'EditUser',
      component: EditUser
    },

    // Order Management
    {
      path: '/admin/orders',
      name: 'OrderManagement',
      component: OrderManagement
    },
    {
      path: '/admin/order/:id',
      name: 'SeeOrderDetail',
      component: SeeOrderDetail
    }
  
    


  ]
});

// ✅ Navigation Guard: kiểm tra quyền admin
adminRouter.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const isAdminRoute = to.path.startsWith("/admin");

  if (isAdminRoute) {
    if (!token || !user || user.role !== "admin") {
      alert("🚫 Access denied. Admins only.");
      next("/");
      window.location.reload();
      return;
    }
  }

  next();
});

export default adminRouter;
