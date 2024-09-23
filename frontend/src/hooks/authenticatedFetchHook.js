export default function useAuthFetch() {
  
  const authenticatedFetch = async (url, options) => {
    return fetch(url, {
      ...options,
      headers: {
        ...(options ? options.headers : {}),
        Authorization: `Bearer ${await Clerk.session.getToken()}` 
      },
    })
  }

  return authenticatedFetch
}