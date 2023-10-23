const Spotify = {
    accessToken: '',
  
    getAccessToken() {
      if (this.accessToken) {
        return this.accessToken;
      }
  
      // Check if the access token is in the URL
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
  
      if (accessTokenMatch && expiresInMatch) {
        this.accessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);
  
        // Clear the access token from the URL after it expires
        window.setTimeout(() => {
          this.accessToken = '';
        }, expiresIn * 1000);
  
        // Clear the URL parameters
        window.history.pushState('Access Token', null, '/');
  
        return this.accessToken;
      } else {
        // Redirect the user to the Spotify authorization page
        const clientId = '6502ca3c645d42428afcdf33527dc802';
        const redirectUri = 'http://localhost:3000/callback'; // Replace with your redirect URI
  
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      }
    },
  
    // Use the access token to make Spotify API requests
    async search(term) {
      const accessToken = this.getAccessToken();
  
      try {
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
  
        if (response.ok) {
          const jsonResponse = await response.json();
          // Process the response data
          return jsonResponse;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  export default Spotify;
  