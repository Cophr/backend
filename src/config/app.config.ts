export default () => ({
  app: {
    url: process.env.APP_URL,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    scope: process.env.GOOGLE_SCOPE,
  },
  jwtSecret: {
    access: process.env.JWT_ACCESS_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
  },
});
