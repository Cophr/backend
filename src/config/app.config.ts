export default () => ({
  appSecret: process.env.JWT_SECRET ?? "Cophr_appSecret",
});
