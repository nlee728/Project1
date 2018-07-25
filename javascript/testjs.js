const config = {
  apiKey: "AIzaSyCwQB5i43m4j4WfQ-XsyqggSLRZVLUtwSI",
  authDomain: "pickaflick-c5ed5.firebaseapp.com",
  databaseURL: "https://pickaflick-c5ed5.firebaseio.com",
  projectId: "pickaflick-c5ed5",
  storageBucket: "pickaflick-c5ed5.appspot.com",
  messagingSenderId: "440737258675"
};
firebase.initializeApp(config);

var database = firebase.database();

//moviesRef.set({movies: movieChoice});
//usersRef.set({users: userName});

var startDate = '2018-07-25';
var zipcode = '27615';
var api_key = 'seehjrjvumeesg8pe3e87j9j';
var url = 'http://data.tmsapi.com/v1.1/movies/showings?' +
        'startDate=' + startDate +
        '&zip=' + zipcode +
        '&api_key=' + api_key

console.log(url)

$.get(url).then(function(response) {
  getMovieData(response);
}); 

$("#submit-btn").on("click",function(e) {   
  e.preventDefault();
  var groupName = $('#add-group-input').val().trim();
  console.log(groupName);
  var zipcode = $('#zipcode-input').val().trim();
  
  var groupsRef = database.ref('/groups/' + groupName);
  console.log(groupsRef)
  groupsRef.set({movie: 'jaws',
                 zipcode});
});


function generateMovies(data) {
  for(let i = 0; i <= 5; i++) {
      var runTime = data[i].runTime;
      runTime = runTime.slice(3, runTime.length);
      var tr =  $('<tr>');
      $('#movie-table').append(tr);
      tr.append(`<th>${data[i].title}</th>`);
      tr.append(`<th>${data[i].genres[0]}, ${data[i].genres[1]}</th>`);
      tr.append(`<th>${runTime}</th>`);
      tr.append(`<th>${data[i].ratings[0].code}</th>`);
      tr.append(`<th><a href="${data[i].officialUrl}" target="_blank">Trailer</a></th>`);
      tr.append(`<th><input class="form-control" id="rank-input" placeholder="1-5" type="text"></th>`);
  }
}
function getMovieData(data) {
  var fiveMovies = []
  console.log(fiveMovies);
  for(let i = 0; i <= 5; i++) {
      var runTime = data[i].runTime.slice(3, data[i].runTime.length);
      fiveMovies.push({title: data[i].title, 
                      genre: data[i].genres[0],
                      runTime: runTime,
                      rating: data[i].ratings[0].code,
                      trailer: data[i].officialUrl
                      });
  }                    
  var groupName = 'TestGroup'
  var zipcode = '27615'
  var groupsRef = database.ref('/groups/' + groupName);
  groupsRef.set({movies: fiveMovies,
                 zipcode});
}
