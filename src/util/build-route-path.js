export function buildRoutePath(path) {
  const routeParamrtersRegex = /:([a-zA-Z]+)/g;
  const pathWithParams = path.replace(
    routeParamrtersRegex,
    '(?<$1>[a-z0-9-_]+)'
  );

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

  return pathRegex;
}
