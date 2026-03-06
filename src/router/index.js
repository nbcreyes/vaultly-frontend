import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false, speed: 300 })

/**
 * Vaultly Router
 *
 * Route meta fields:
 *   requiresAuth  - must be logged in
 *   requiresGuest - must NOT be logged in (auth pages)
 *   requiresSeller - must have seller role
 *   requiresAdmin  - must have admin role
 *   requiresVerified - must have verified email
 */
const routes = [
  // -------------------------------------------------------------------------
  // Public pages
  // -------------------------------------------------------------------------
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/public/HomePage.vue"),
  },
  {
    path: "/browse",
    name: "browse",
    component: () => import("@/pages/public/BrowsePage.vue"),
  },
  {
    path: "/browse/:category",
    name: "category",
    component: () => import("@/pages/public/CategoryPage.vue"),
  },
  {
    path: "/product/:slug",
    name: "product",
    component: () => import("@/pages/public/ProductPage.vue"),
  },
  {
    path: "/store/:slug",
    name: "store",
    component: () => import("@/pages/public/StorePage.vue"),
  },

  // -------------------------------------------------------------------------
  // Auth pages — guests only
  // -------------------------------------------------------------------------
  {
    path: "/register",
    name: "register",
    component: () => import("@/pages/auth/RegisterPage.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/auth/LoginPage.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/verify-email",
    name: "verify-email",
    component: () => import("@/pages/auth/VerifyEmailPage.vue"),
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("@/pages/auth/ForgotPasswordPage.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("@/pages/auth/ResetPasswordPage.vue"),
    meta: { requiresGuest: true },
  },

  // -------------------------------------------------------------------------
  // Buyer pages
  // -------------------------------------------------------------------------
  {
    path: "/purchases",
    name: "purchases",
    component: () => import("@/pages/buyer/PurchasesPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: () => import("@/pages/buyer/CheckoutPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/notifications",
    name: "notifications",
    component: () => import("@/pages/buyer/NotificationsPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/messages",
    name: "messages",
    component: () => import("@/pages/buyer/MessagesPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/messages/:orderId",
    name: "message-thread",
    component: () => import("@/pages/buyer/MessageThreadPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/refunds",
    name: "refunds",
    component: () => import("@/pages/buyer/RefundsPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/pages/buyer/SettingsPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/become-seller",
    name: "become-seller",
    component: () => import("@/pages/buyer/BecomeSellerPage.vue"),
    meta: { requiresAuth: true },
  },

  // -------------------------------------------------------------------------
  // Seller pages
  // -------------------------------------------------------------------------
  {
    path: "/seller/dashboard",
    name: "seller-dashboard",
    component: () => import("@/pages/seller/DashboardPage.vue"),
    meta: { requiresAuth: true, requiresSeller: true },
  },
  {
    path: "/seller/products",
    name: "seller-products",
    component: () => import("@/pages/seller/ProductsPage.vue"),
    meta: { requiresAuth: true, requiresSeller: true },
  },
  {
    path: "/seller/products/create",
    name: "seller-product-create",
    component: () => import("@/pages/seller/ProductCreatePage.vue"),
    meta: { requiresAuth: true, requiresSeller: true },
  },
  {
    path: "/seller/products/:id/edit",
    name: "seller-product-edit",
    component: () => import("@/pages/seller/ProductEditPage.vue"),
    meta: { requiresAuth: true, requiresSeller: true },
  },
  {
    path: "/seller/store",
    name: "seller-store",
    component: () => import("@/pages/seller/StorePage.vue"),
    meta: { requiresAuth: true, requiresSeller: true },
  },
  {
    path: "/seller/payouts",
    name: "seller-payouts",
    component: () => import("@/pages/seller/PayoutsPage.vue"),
    meta: { requiresAuth: true, requiresSeller: true },
  },

  // -------------------------------------------------------------------------
  // Admin pages
  // -------------------------------------------------------------------------
  {
    path: "/admin/dashboard",
    name: "admin-dashboard",
    component: () => import("@/pages/admin/DashboardPage.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/users",
    name: "admin-users",
    component: () => import("@/pages/admin/UsersPage.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/products",
    name: "admin-products",
    component: () => import("@/pages/admin/ProductsPage.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/applications",
    name: "admin-applications",
    component: () => import("@/pages/admin/ApplicationsPage.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/refunds",
    name: "admin-refunds",
    component: () => import("@/pages/admin/RefundsPage.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/payouts",
    name: "admin-payouts",
    component: () => import("@/pages/admin/PayoutsPage.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  // -------------------------------------------------------------------------
  // Catch-all 404
  // -------------------------------------------------------------------------
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/pages/public/NotFoundPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

/**
 * Navigation guard — runs before every route change.
 */
router.beforeEach(async (to, from, next) => {
  NProgress.start();

  const auth = useAuthStore();

  if (auth.token && !auth.user) {
    await auth.fetchUser();
  }

  if (to.meta.requiresGuest && auth.isAuthenticated) {
    NProgress.done();
    return next({ name: "home" });
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    NProgress.done();
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  if (to.meta.requiresSeller && !auth.isSeller) {
    NProgress.done();
    return next({ name: "home" });
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    NProgress.done();
    return next({ name: "home" });
  }

  NProgress.done();
  next();
});

router.afterEach((to) => {
  const titleMap = {
    'home':                'Vaultly — Digital Marketplace',
    'browse':              'Browse Products — Vaultly',
    'login':               'Log In — Vaultly',
    'register':            'Create Account — Vaultly',
    'verify-email':        'Verify Email — Vaultly',
    'forgot-password':     'Forgot Password — Vaultly',
    'reset-password':      'Reset Password — Vaultly',
    'purchases':           'My Purchases — Vaultly',
    'checkout':            'Checkout — Vaultly',
    'notifications':       'Notifications — Vaultly',
    'messages':            'Messages — Vaultly',
    'settings':            'Settings — Vaultly',
    'become-seller':       'Become a Seller — Vaultly',
    'seller-dashboard':    'Seller Dashboard — Vaultly',
    'seller-products':     'My Products — Vaultly',
    'seller-product-create': 'New Product — Vaultly',
    'seller-store':        'Store Settings — Vaultly',
    'seller-payouts':      'Payouts — Vaultly',
    'admin-dashboard':     'Admin Dashboard — Vaultly',
    'admin-users':         'Users — Vaultly Admin',
    'admin-products':      'Products — Vaultly Admin',
    'admin-applications':  'Applications — Vaultly Admin',
    'admin-refunds':       'Refunds — Vaultly Admin',
    'admin-payouts':       'Payouts — Vaultly Admin',
  }

  document.title = titleMap[to.name] || 'Vaultly'
})

export default router;