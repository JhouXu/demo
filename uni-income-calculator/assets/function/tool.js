export const getRouteTitle = (routes, path) => {
  const arr = routes.filter((item) => {
    return item.path.indexOf(path) > -1;
  });

  return arr[0].title;
};
