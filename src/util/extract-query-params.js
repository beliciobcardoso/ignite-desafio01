export function extractQueryParams(query) {
  const queryParams = query.split('&').reduce((queryParams, param) => {
    const [key, value] = param.split('=');
    queryParams[key] = value;

    return queryParams;
  }, {});
}
