// This service object was adapted from here: 
 //  https://tylermcginnis.com/react-router-protected-routes-authentication/
 //
 // This version was modified to use real authentication implemented
 // in the backend api. It was also modified to return promises instead
 // of using callbacks `cb`.

 const auth = {
    isAuthenticated: false,
    authenticate(email, name, accessToken) {
      return fetch('/auth/login/', { 
        method: 'POST', //calls api
        body: JSON.stringify({ email, name, accessToken }),
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then((response) => {
          if(!response.ok) {
            throw new Error('Login Failed');
          }

          return response.json();
        })
        .then((body) => {
          this.isAuthenticated = true;
          return body;
        });
    },
    signout(cb) {
      return fetch('/api/auth/logout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then((response) => {
          if(!response.ok) {
            throw new Error('Logout Failed');
          }

          return response.json();
        })
        .then((body) => {
          this.isAuthenticated = false;
          return body;
        });
    }
  }

  export default auth;