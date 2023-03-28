/**
 * CORS 우회 용도 외엔 최소한으로 사용할 것
 */
export function httpRequest(
  url,
  {
    method = 'GET',
    timeout = 0,
    responseType = 'document',
    data = null,
    onprogress = null,
  } = {},
) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method,
      timeout,
      responseType,
      data,
      onprogress,
      onload: (response) => {
        if (responseType === 'document') {
          resolve({
            ...response,
            response: new DOMParser().parseFromString(
              response.responseText,
              'text/html',
            ),
          });
          return;
        }
        resolve(response);
      },
      ontimeout: (error) => {
        reject(error);
      },
      onerror: (error) => {
        reject(error);
      },
    });
  });
}
