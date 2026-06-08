const apiRoutes = {
  // ── Auth (/api/v1/user) ──────────────────────────────────────────
  auth: {
    register: process.env.NEXT_PUBLIC_BASE_URL + "v1/user/register",
    login:    process.env.NEXT_PUBLIC_BASE_URL + "v1/user/login",
    logout:   process.env.NEXT_PUBLIC_BASE_URL + "v1/user/logout",
  },

  // ── URL Shortener (/api/v1/url) ──────────────────────────────────
  url: {
    create:      process.env.NEXT_PUBLIC_BASE_URL + "v1/url",          // POST   – create short URL
    getAll:      process.env.NEXT_PUBLIC_BASE_URL + "v1/url",          // GET    – get all URLs for user
    // The backend now exposes /:shortCode directly on the root instead of under /api/v1/
    getByCode:   process.env.NEXT_PUBLIC_BASE_URL.replace(/\/api\/?$/, "/") + "",
    getById:     process.env.NEXT_PUBLIC_BASE_URL + "v1/url/id/",      // GET    – get URL details (append :id)
    delete:      process.env.NEXT_PUBLIC_BASE_URL + "v1/url/",         // DELETE – delete URL (append :id)
    update:      process.env.NEXT_PUBLIC_BASE_URL + "v1/url/",         // PATCH  – update URL (append :id)
  },
};

export default apiRoutes;
