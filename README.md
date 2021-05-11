# instagram-api

REST API with all basic features real Instagram has.

## Features:

-   registering and logging to user account
-   posting photos
-   commenting and liking photos
-   following system
-   all CRUD operations on posts, comments, follows and likes with relevant permissions

## Technology Stack:

-   Node js
-   Express Js
-   MongoDB
-   JWT

## Default urls:

-   Login User : <br/>
    localhost:5000/api/v1/auth/login
-   Register User : <br/>
    localhost:5000/api/v1/user/register
-   Get Logged in User : <br/>
    localhost:5000/api/v1/auth/me/
-   Update User Details : <br/>
    localhost:5000/api/v1/auth/updatedetails
-   Update Password : <br/>
    localhost:5000/api/v1/auth/updatepassword
-   Forgot Password : <br/>
    localhost:5000/api/v1/auth/forgotpassword
-   Reset Password : <br/>
    localhost:5000/api/v1/auth/resetpassword/:resetToken
-   Follow User : <br/>
    localhost:5000/api/v1/auth/follow/:userId
-   Unfollow User : <br/>
    localhost:5000/api/v1/auth/unfollow/:userId

-   Get All Posts : <br/>
    localhost:5000/api/v1/posts
-   Get Single Post : <br/>
    localhost:5000/api/v1/posts/:postId
-   Create Post : <br/>
    localhost:5000/api/v1/posts
-   Update Post : <br/>
    localhost:5000/api/v1/posts/:postId
-   Delete Post : <br/>
    localhost:5000/api/v1/posts/:postId
-   Like Post : <br/>
    localhost:5000/api/v1/posts/:postId/likes
-   Unlike Post : <br/>
    localhost:5000/api/v1/posts/:postId/unlike

-   Get All Comments : <br/>
    localhost:5000/api/v1/comments
-   Add Comment : <br/>
    localhost:5000/api/v1/posts/:postId/comments
-   Update Comment : <br/>
    localhost:5000/api/v1/comments/:commentId
-   Delete Post : <br/>
    localhost:5000/api/v1/comments/:commentId

-   Get All Users :<br/>
    localhost:5000/api/v1/users
-   Get Single User :<br/>
    localhost:5000/api/v1/users/:userId
-   Search User :<br/>
    localhost:5000/api/v1/users?search=john

## Usage

"/.env" update the values/settings to your own

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run server

```

## Database Seeder

To seed the database with users, posts, and comments with data from the "\data" folder, run

```
# Destroy all data
npù run deleteData

# Import all data
npm run insertData
```

-   Version: 1.0.0
-   License: MIT
-   Author: Said Mounaim
