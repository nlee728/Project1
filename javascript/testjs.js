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
var singleGroupRef = database.ref('/groups/TestGroup/movies');

var startDate = '2018-07-26';
var zipcode = '27615';
var api_key = 'seehjrjvumeesg8pe3e87j9j';
var url = 'http://data.tmsapi.com/v1.1/movies/showings?' +
        'startDate=' + startDate +
        '&zip=' + zipcode +
        '&api_key=' + api_key

console.log(url)

/*           $.get(url).then(function(response) {
            getMovieData(response);
          });  */

singleGroupRef.on('child_added', function(snapshot) {
  console.log(snapshot.val())
  generateMovies(snapshot.val());
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
      var tr =  $('<tr>');
      $('#movie-table').append(tr);
      tr.append(`<th>${data.title}</th>`);
      tr.append(`<th>${data.genre}</th>`);
      tr.append(`<th>${data.runTime}min</th>`);
      tr.append(`<th>${data.rating}</th>`);
      tr.append(`<th><a href="${data.trailer}" target="_blank">Trailer</a></th>`);
      tr.append(`<th><input class="form-control" id="rank-input" placeholder="1-5" type="text"></th>`);
}

function getMovieData(data) {
  var fiveMovies = []
  console.log(fiveMovies);
  for(let i = 0; i <= 5; i++) {
      var runTime = parseRunTime(data[i].runTime);
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

function parseRunTime(runTime) {
  var hours = parseInt(runTime.slice(3, runTime.length - 4));
  var minutes = parseInt(runTime.slice(5, runTime.length - 1));
  var formatedRunTime = (hours * 60) + minutes;
  return formatedRunTime;
}
