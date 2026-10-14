export const criteria = (init = {}) => ({
  page: 1,
  pageSize: 10,
  total: 0,
  ...init,
});
