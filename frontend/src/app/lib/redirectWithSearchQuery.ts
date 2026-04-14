/**
 * Handles redirect logic with pending search query support
 * Used after authentication (login/register) to preserve search context
 */
export const handleRedirectWithSearchQuery = (
  navigate: any,
  delay: number = 1500
) => {
  const pendingQuery = localStorage.getItem('pendingSearchQuery');
  const redirectUrl = pendingQuery 
    ? `/search?q=${encodeURIComponent(pendingQuery)}`
    : '/search';
  
  localStorage.removeItem('pendingSearchQuery');
  
  setTimeout(() => navigate(redirectUrl), delay);
};
