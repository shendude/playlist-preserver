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
//keeps track of the target user's submitted playlist
var myUsrPlist = {};


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
        songList[j] = [currTrack.id, currTrack.title, currTrack.user.username, getTime(currTrack.duration), 'o'];
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
      myLikes[i] = [currTrack.id, currTrack.title, currTrack.user.username, getTime(currTrack.duration), 'o'];
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
};

//outputs the songlist of a given user's playlists
//this songlist should be stored internally
function getPlistSongs(title, id) {
  currPlaylistId = id;
  currPlaylistName = title;
  changeState(3);
  writeSongs(myPlists[title]);
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
    str += arr[i][0] + arr[i][4];
    txt += index + ') ' + arr[i][1] + '\n';
    txt += 'uploaded by: ' + arr[i][2] + '\n';
    txt += 'duration: ' + arr[i][3] + '\n\n';
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
      hideMultElem(0, ['info', 'bNotMe', 'inst2', 'playlists', 'inst2a', 'bUpdate', 'inst2b', 'input', 'inst3', 'output', 'bSubUpdate', 'lUpdate', 'bCancel']);
      hideMultElem(1, ['inst', 'fSearch', 'bSearch', 'list']);
      break;
      //post user selection
    case 1:
      hideMultElem(0, ['inst', 'fSearch', 'bSearch', 'list', 'inst2b', 'input', 'inst3', 'output', 'bSubUpdate', 'lUpdate', 'bCancel']);
      hideMultElem(1, ['info', 'bNotMe', 'inst2', 'playlists', 'inst2a', 'bUpdate']);
      break;
      //post playlist selection
    case 3:
      hideMultElem(0, ['inst', 'fSearch', 'bSearch', 'list', 'inst2a', 'bUpdate', 'inst2b', 'input', 'bSubUpdate', 'lUpdate']);
      hideMultElem(1, ['info', 'bNotMe', 'inst2', 'playlists', 'inst3', 'output', 'bCancel']);
      break;
      //post update selection
    case 4:
      hideMultElem(0, ['inst', 'fSearch', 'bSearch', 'list', 'inst2', 'playlists', 'inst2a', 'bUpdate', 'inst3', 'output', 'lUpdate']);
      hideMultElem(1, ['bNotMe', 'info', 'inst2b', 'input', 'bSubUpdate', 'bCancel']);
      break;
      //post playlist user submission
    case 5:
      playlistReader(document.getElementById('input').value);
      hideMultElem(0, ['inst', 'fSearch', 'bSearch', 'list', 'inst2', 'playlists', 'inst2a', 'inst2b', 'input', 'inst3', 'bUpdate', 'bSubUpdate']);
      hideMultElem(1, ['bNotMe', 'info', 'lUpdate', 'bCancel']);
      displayUpdates();
      break;
  };
};

//given a playlist, reads playlist into myUsrPlaylist obj
//uses regex to parse raw text data
function playlistReader(txt) {
  var arr = txt.split(/\n/g);
  var lastEntry = 3;
  var tempPlist = [];
  var tempSong = [];
  for (var i = 0; i < arr.length; i++) {
    if ((/^[0-9]+\)/).test(arr[i]) && (lastEntry === 3)) {
      //designates a number, aka, title of song
      tempSong[1] = arr[i].split(' ').slice(1).join(' ');
      lastEntry = 1;
    } else if ((arr[i].slice(0, 13) === 'uploaded by: ') && (lastEntry === 1)) {
      //designates the uploaded by info line
      tempSong[2] = arr[i].slice(13);
      lastEntry = 2;
    } else if ((arr[i].slice(0, 10) === 'duration: ') && (lastEntry === 2)) {
      //designates the duration info line
      //also completes the song array, pushes to playlist
      tempSong[3] = arr[i].slice(10);
      tempPlist.push(tempSong.slice(0));
      tempSong = [];
      lastEntry = 3;
    } else if ((/^\[[0-9]+/).test(arr[i])) {
      //designates reading the id code into the code var
      //writes to the myUserPlaylist obj
      //ends the loop
      var code = arr.slice(i).join('').match(/[0-9]+[a-z]/g);
      for (var j = 2; j < code.length; j++) {
        tempPlist[j - 2][0] = code[j].slice(0, -1);
        tempPlist[j - 2][4] = code[j].slice(-1);
      }
      myUsrPlist.userId = code[0].slice(0, -1);
      myUsrPlist.playlistId = code[1].slice(0, -1);
      myUsrPlist.list = tempPlist;
      i = arr.length;
    } else if (arr[i].length > 0) {
      //if there's an additional unexpected newline
      //for title author or duration data
      switch(lastEntry) {
        case 1:
          tempSong[1] += arr[i];
          break;
        case 2:
          tempSong[2] += arr[i];
          break;
        case 3:
          tempPlist[tempPlist.length - 1][3] += arr[i];
          break;
      };
    };
  };
};

//displays the updates to the input playlist
//in a user friendly way
//dark blue text designates user added songs
//dard red text designates soundcloud removed songs
//light blue text designates past user added songs
//light red text designates past sc removed songs
function displayUpdates() {
  var tar = document.getElementById('lUpdate');
  var songId = 0;
  var songList = myUsrPlist.list
  for (var i = 0; i < songList.length; i++) {
    var song = document.createElement('li');
    song.id = 'song' + i;
    song.innerHTML = songList[i][1] + '</br>' + 'uploaded by: ' + songList[i][2] + '</br>' + songList[i][3];
    switch(songList[i][4]) {
        //code o = original playlist song
      case 'o':
        //FIXME CHECK FOR SC REMOVAL
        //FIXME CHECK FOR NEW ADDITIONAL SONGS
        break;
        //code s = sc removed song, old
      case 's':
        song.style.color = "#f80";
        song.style.text-decoration = "line-through";
        break;
        //code a = user added song, old
      case 'a':
        song.style.color = "#39f";
        break;
        //code r = user removed song, old
      case 'r':
        song.style.color = "#39f";
        song.style.text-decoration = "line-through";
        break;
    };
    tar.appendChild(song);
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
