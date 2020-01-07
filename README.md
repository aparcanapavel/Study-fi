# Study-fi

## Members:

Brennan Flood, Pavel Aparcana

*** 

## App Clone:
Study-fi
-clone of spotify
-our twist: Library filled with study lo-fi beats
-bonus: integrate a live chat per playlist that deletes in 24h.

*** 

## Live Site
 [Study-fi](https://study-fi.herokuapp.com/)

*** 

## Overview:
Study-fi is an app that is targeted towards students or professionals wanting to listen to calm beats to improve their focus and productivity. We will accomplish this by using the spotify api to get songs, albums, and album covers from their library.

*** 

## Functionality:
Features included in our study-fi version are based on the original spotify features where users are able to listen to lo-fi music, create playlists, like songs, queue(bonus) songs and search songs.

*** 

### MVP:

#### Day 1
- User-Authentication backend - Brennan and Pavel
- User-Authentication frontend:
  - Add Apollo and write Auth queries for frontend - Brennan and Pavel
  - User-Registration component and functionality - Pavel
  - Nav component with Logout functionality - Brennan
  - Login frontend functionality - Pavel
  - Protected-Routes - Pavel
  - Auth-Routes - Brennan
- Implement skeletal frontend structure - Brennan and Pavel

#### Day 2 
- App styling - Brennan and Pavel
- Explore APIs to use with Studify - Brennan and Pavel
- Implement backend functionality: 
  - Create Songs - Brennan and Pavel
  - Create Albums - Brennan
  - Create Artists - Pavel
- Implement basic frontend components for Home Page: 
  - Artist Index component - Brennan
  - Album Index component - Pavel
- Style Main Page - Pavel
- Add basic HTML audio player for testing - Brennan

#### Day 3
- Styling - Brennan and Pavel
- Seed Database with Song, Artist and Album Objects - Brennan and Pavel
- Write backend Mutations for adding Artist, Song and Album Associations - Brennan and Pavel
- Add Query associations between Artists, Albums and Songs - Brennan and Pavel
- Frontend skeletal structuring for Artist/Album Show, and Search - Brennan and Pavel


#### Day 4
- Styling - Brennan and Pavel
- Implement custom Music Player with styling: 
  - Functional Progress Bar - Pavel
  - Functional Queue - Pavel
  - Functional Volume Slider - Pavel
  - Functional Misc Audio Controls - Pavel
  - Functional Song info display - Pavel
  - Implement continous music playing regardless of page location - Pavel
- Work on backend and backend Playlist CRUD - Brennan
- Implement Song Options Modal - Brennan
- Make Song to Playlist addition universal - Brennan
- Implement Webspeech API for Voice to Text translation - Brennan
- Implement Search for Songs, Artists and Albums - Pavel
- Utilize Webspeeech API for voice-based-search - Brennan
- Update Playlist creation Modal - Pavel

 #### Day 5
- Implement Loader API for transition effects - Pavel
- Implement Add Image to Artist and Album backend functionality - Brennan
- Seed Database with Images - Brennan and Pavel
- Implement Add Album to Queue functionality - Pavel
- Implement Song Liking backend and frontend functionality - Pavel
- Implement Show page for Liked Songs - Brennan
- Implement Library Show page - Brennan
- Debugging - Brennan and Pavel
- Heroku Hosting - Brennan
- Finish Styling - Brennan and Pavel
 
*** 

## Technologies Used:
- Mongo DB for storing user information
- Express
- GraphQL
- Apollo
- Node
- React
- Web Speech API for voice-to-text search
- Loader API for transition effects
- AWS S3 buckets for mp3 and image storage

*** 

## Challenges:
- Creation of a working Queue
- Continuous play of music when navigating pages
- Utilizing Voice to Text API 
