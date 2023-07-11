export default () => ({
  jwtSecret: {
    access: process.env.JWT_ACCESS_SECRET,
  },
});
