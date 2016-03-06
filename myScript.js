//TODO: maybe make a preservatives themed app? 
// eg: net wt: 34 songs, family owned since 2016 badge
// have a orange plaid background, times new roman text
// have a faq page?
//TODO: youtube playlist support?

SC.initialize({
  client_id: 'b5bb126d5842703cc49f079bdba92d29'
});

//GLOBAL VARIABLES
//set upon getUser being called on target id
//keeps track of what user we're talking about
var currUserName = '';
var currUserId = 0;
//keeps track of what playlist we're talking about
var currPlaylistName = '';
var currPlaylistId = 0;
//keeps track of searched users' names
var names = [];
//keeps track of the target user's favorited/liked songs
var myLikes = [];
//keeps track of the target user's playlist songs
var myPlists = {};


//gets a list of users from search query
function findUser() {
  var input = document.myForm.user.value;
  var list = document.getElementById('list');
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  };
  SC.get('/users', {
    q: input,
    limit: 10
  }).then(function(users) {
    displayUsers(users);
  });
};

//puts list of users into clickable list, onclick event
//calls getUser with index number, user id number
function displayUsers(users) {
  var list = document.getElementById('list');
  for (var i = 0; i < users.length; i++) {
    var user = document.createElement('li');
    if (users[i].full_name.length > 1) {
      names[i] = users[i].full_name;
    } else {
      names[i] = users[i].username;
    };
    user.appendChild(document.createTextNode(users[i].username));
    user.setAttribute('onclick', "getUser(" + i + ", " + users[i].id + ")");
    list.appendChild(user);
  };
};

//explores the playlists of a user given the user's sc id
//displays welcome message, this is not me button
function getUser(index, id) {
  currUserId = id;
  currUserName = names[index];
  document.getElementById('info').innerHTML = 'Welcome, ' + names[index];
  changeState(1);
  //clears the plists list and starts by adding the liked songs list
  var pLists = document.getElementById('playlists');
  pLists.innerHTML = '';
  var likes = document.createElement('li');
  likes.appendChild(document.createTextNode('liked songs'));
  likes.setAttribute('onclick', "getLikes()");
  pLists.appendChild(likes);

  SC.get('/users/' + id + '/playlists', {
    limit: 50
  }).then(function(playlists) {
    for (var i = 0; i < playlists.length; i++) {
      var pElem = document.createElement('li');
      var title = playlists[i].title;
      pElem.appendChild(document.createTextNode(title));
      var songList = [];
      var currTrack;
      for (var j = 0; j < playlists[i].tracks.length; j++) {
        currTrack = playlists[i].tracks[j];
        songList[j] = [currTrack.id, currTrack.title, currTrack.user.username, currTrack.duration];
      };
      myPlists[title] = songList;
      pElem.setAttribute('onclick', "getPlistSongs('" + title + "', " + playlists[i].id + ")");
      pLists.appendChild(pElem);
    };
  });
  SC.get('/users/' + currUserId + '/favorites', {
    limit: 200
  }).then(function(favorites) {
    for (var i = 0; i < favorites.length; i++) {
      currTrack = favorites[i];
      myLikes[i] = [currTrack.id, currTrack.title, currTrack.user.username, currTrack.duration];
    };
  });
};

//outputs the songlist of a given user's likes
//should call getUser first before ever calling this function
//TODO: incroporate get function into getUser function
function getLikes() {
  currPlaylistId = 0;
  currPlaylistName = 'likes';
  changeState(3);
  writeSongs(myLikes);
  //FIXME
};

//outputs the songlist of a given user's playlists
//this songlist should be stored internally
function getPlistSongs(title, id) {
  currPlaylistId = id;
  currPlaylistName = title;
  changeState(3);
  writeSongs(myPlists[title]);
  //FIXME
};

//given an array of songs, writes the songs to a textarea box
//always writes a alphanumeric id string for lookup purposes
//writes song title, artist, duration in minutes and seconds
function writeSongs(arr) {
  //id string always starts with user id, u, playlist id, p
  var str = '[' + currUserId + 'u' + currPlaylistId + 'p';
  //text output by line number 0 -> n
  var txt = '';
  var index = 1;
  for (var i = 0; i < arr.length; i++) {
    str += arr[i][0] + 'n';
    txt += index + ') ' + arr[i][1] + '\n';
    txt += 'uploaded by: ' + arr[i][2] + '\n';
    txt += 'duration: ' + getTime(arr[i][3]) + '\n\n';
    index += 1;
  };
  str += ']';
  document.getElementById('output').innerHTML = txt + str;
};

//given a time in milliseconds, return a string
//containing the time in minutes, seconds
function getTime(ms) {
  var sec = Math.floor(ms / 1000);
  return Math.floor(sec / 60) + 'm ' + (sec % 60) + 's';
};

//given a hide val of 0 or 1, hides or unhides elements of id's contained
//in elemArr via the style property display: none
function hideMultElem(hide, elemArr) {
  //0 = hide 1 = unhide
  if (hide) {
    for (var i = 0; i < elemArr.length; i++) {
      document.getElementById(elemArr[i]).style.display = "block";
    };
  } else {
    for (var i = 0; i < elemArr.length; i++) {
      document.getElementById(elemArr[i]).style.display = "none";
    };
  };
};


//given a state, hides and unhides elements
function changeState(state) {
  switch (state) {
    //initial state
    case 0:
      hideMultElem(0, ['info', 'bNotMe', 'inst2', 'playlists', 'inst2a', 'bUpdate', 'inst3', 'output']);
      hideMultElem(1, ['inst', 'fSearch', 'bSearch', 'list']);
      break;
      //post user selection
    case 1:
      hideMultElem(0, ['inst', 'fSearch', 'bSearch', 'list', 'inst3', 'output']);
      hideMultElem(1, ['info', 'bNotMe', 'inst2', 'playlists', 'inst2a', 'bUpdate']);
      break;
      //post playlist selection
    case 3:
      hideMultElem(0, ['inst', 'fSearch', 'bSearch', 'list', 'inst2a', 'bUpdate']);
      hideMultElem(1, ['info', 'bNotMe', 'inst2', 'playlists', 'inst3', 'output']);
      break;
      //post update selection
    case 4:
      hideMultElem(0, ['inst', 'fSearch', 'bSearch', 'list', 'inst2', 'playlists', 'inst2a', 'bUpdate', 'inst3', 'output']);
      hideMultElem(1, ['bNotMe', 'info']);
      break;
    case 5:
      break;
  };
};

//given a username, resolves a user json object
//currently no use for this function
var resolveUser = function(user) {
  var myUrl = 'https://soundcloud.com/' + user;
  SC.get('/resolve/?url=' + myUrl, {
    limit: 1
  }).then(function(result) {
    console.log(result);
  });
};
