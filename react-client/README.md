## Social Media App React client

Tutorial: https://www.youtube.com/playlist?list=PLMhAeHCz8S38ryyeMiBPPUnFAiWnoPvWP

Code: https://github.com/hidjou/classsed-react-firebase-client

TODO: Start of: #24 Like and Unlike Actions


Run frontend:
    - npm run start

Run backend:
    - firebase serve


TODOs:
- Add proptypes to everything.
- Error tracking problematic as UI error in fetching users will show error on login page
- Cant show like count as not getting it in data reducer
- When like a post, profile pic of post goes away. This is because when sending a like request, it does not return 
  the profile image. So add profile image to both like and unlike routes in firebase backend code.
  

