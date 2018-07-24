// Initialize Firebase
var config = {
    apiKey: "AIzaSyDcOgkAFmBgn9al1Rg86zHDWkZXcRqnNHY",
    authDomain: "projectaa-f52e9.firebaseapp.com",
    databaseURL: "https://projectaa-f52e9.firebaseio.com",
    projectId: "projectaa-f52e9",
    storageBucket: "projectaa-f52e9.appspot.com",
    messagingSenderId: "183327529266"
  };

firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();