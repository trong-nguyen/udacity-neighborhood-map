# Xplore-It - Neighborhood Explorer App
This app represents my essential thinking in designing the front-end side of web apps: minimal (yet meet all design requirements), well-written (code quality), and performant.
A single page web app features interesting places around a selected neighborhood. The app pull data from multiple resources (Yelp, Foursquare and Twitter) to provide users with an insightful view of the surrounding neighborhood. The app is fully responsive for all display types: mobiles, tablets and monitors. The tech stack includes Knockout.js for MVVM pattern, Bootstrap for UI and Google API for maps and locations. The app is a pleasure to checkout: minimal design, performant and fully functional.

## Dependencies
- MVVM pattern by KnockoutJS
- Layout by Bootstrap 4 Beta 2
- Functionalities:
    + Google Maps and Places
    + Twitter JS Widgets
    + Yelp API
    + Foursquare API
    + Twitter API
- Utilities:
    + jQuery 3.2.1
    + Underscore
    + RequireJS

All Javascript libraries are loaded from content network providers.

## Usage
- Clone the app from [Github](https://github.com/trong-nguyen/udacity-neighborhood-map.git)
- Change directory to the app folder.
- To run app locally, Node (tested with v7.6.0, earlier versions should work) and Express.js is required. Run the following commands to install Express and run local server (the default port is 8080, change it in the `server.js` file if you'd like).
```shell
npm install express
node server.js
```
- Access the app at `http://localhost:8080`.

## Attributions
Third party APIs used:
- [Google Map JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Google Place API](https://developers.google.com/places/javascript)
- [Yelp API](https://www.yelp.com/developers)
- [Foursquare API](https://developer.foursquare.com)
- [Twitter API](https://developer.twitter.com/en.html)
- [Wikipedia Search Place Icon](https://wikipedia.com)