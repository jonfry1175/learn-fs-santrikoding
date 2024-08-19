//import vue router
import { createRouter, createWebHistory } from 'vue-router'

//import cookies
import Cookies from 'js-cookie'


//define a routes
const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import( /* webpackChunkName: "home" */ '../views/home/index.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import( /* webpackChunkName: "index" */ '../views/auth/register.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import( /* webpackChunkName: "create" */ '../views/auth/login.vue')
    },
    {
        path: '/admin/dashboard',
        name: 'dashboard',
        component: () => import( /* webpackChunkName: "dashboard" */ '../views/admin/dashboard/index.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/admin/users',
        name: 'admin.users.index',
        component: () => import( /* webpackChunkName: "admin.users.index" */ '../views/admin/users/index.vue'),
        meta: {
            requiresAuth: true
        }
    }, 
    {
        path: '/admin/users/create',
        name: 'admin.users.create',
        component: () => import( /* webpackChunkName: "admin.users.create" */ '../views/admin/users/create.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/admin/users/:id',
        name: 'admin.users.edit',
        component: () => import( /* webpackChunkName: "admin.users.edit" */ '../views/admin/users/edit.vue'),
        meta: {
            requiresAuth: true
        }
    }
]

//create router
const router = createRouter({
    history: createWebHistory(),
    routes // <-- routes,
})

// Global navigation guard
router.beforeEach((to, from, next) => {
    // Ambil token otentikasi pengguna
    const token = Cookies.get('token');

    // Jika rute tujuan membutuhkan otentikasi dan pengguna tidak memiliki token
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
        // Alihkan pengguna ke halaman login
        next({ name: 'login' });
    }
    // Jika rute tujuan adalah halaman login atau register dan pengguna sudah login
     else if ((to.name === 'login' || to.name === 'register') && token) {
        // Alihkan pengguna ke halaman dashboard
        next({ name: 'dashboard' });
    }
    // Jika tidak ada kondisi khusus, izinkan navigasi ke rute tujuan
    else {
        next();
    }
});


export default router