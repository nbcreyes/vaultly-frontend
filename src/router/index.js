import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

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
  const auth = useAuthStore();

  // Restore session on first load if token exists but user is not loaded
  if (auth.token && !auth.user) {
    await auth.fetchUser();
  }

  // Guests only — redirect logged in users away from auth pages
  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return next({ name: "home" });
  }

  // Auth required — redirect guests to login
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  // Seller required
  if (to.meta.requiresSeller && !auth.isSeller) {
    return next({ name: "home" });
  }

  // Admin required
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return next({ name: "home" });
  }

  next();
});

export default router;
