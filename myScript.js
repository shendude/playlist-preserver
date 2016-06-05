SC.initialize({
  client_id: 'b5bb126d5842703cc49f079bdba92d29'
});

//GLOBAL VARIABLES
//set upon getUser being called on target id
//keeps track of what user we're talking about
var currUserName = '';
var currUserId = 0;
//keeps track of what playlist we're talking about
var currPlaylistId = 0;
//keeps track of searched users' names
var names = [];
//keeps track of the target user's favorited/liked songs
var myLikes = [];
//keeps track of the target user's playlist songs
var myPlists = {};
//keeps track of the target user's submitted playlist
var myUsrPlist = {};
//keeps track of target user's updated playlist
var myUpPlist = [];


//gets a list of users from search query
function findUser() {
  var input = document.myForm.user.value;
  var list = document.getElementById('lUsers');
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
  var list = document.getElementById('lUsers');
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
  //allows getUser to be called with a negative index, ignores welcome message, changestate
  if (index >= 0) {
    currUserName = names[index];
    document.getElementById('info').innerHTML = 'Welcome, ' + currUserName;
    changeState(1);
  };
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
      pElem.appendChild(document.createTextNode(playlists[i].title));
      var songList = [];
      var currTrack;
      for (var j = 0; j < playlists[i].tracks.length; j++) {
        currTrack = playlists[i].tracks[j];
        songList[j] = [currTrack.id, currTrack.title, currTrack.user.username, getTime(currTrack.duration), 'o'];
      };
      myPlists[playlists[i].id] = songList;
      pElem.setAttribute('onclick', "getPlistSongs(" + playlists[i].id + ")");
      pLists.appendChild(pElem);
    };
  });
  SC.get('/users/' + currUserId + '/favorites', {
    limit: 500
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
  changeState(3);
  writeSongs(myLikes);
};

//outputs the songlist of a given user's playlists
//this songlist should be stored internally
function getPlistSongs(id) {
  currPlaylistId = id;
  changeState(3);
  writeSongs(myPlists[id]);
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
//helper function for changeState
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
    case 0:
      //initial state, show username query bar
      hideMultElem(0, ['info', 'bNotMe', 'inst2', 'playlists', 'inst2a', 'bUpdate', 'inst2b', 'input', 'inst3', 'output', 'bSubUpdate', 'lUpdate', 'bSave', 'bCancel']);
      hideMultElem(1, ['inst', 'fSearch', 'bSearch', 'lUsers']);
      break;
    case 1:
      //post user selection -> propts playlist selection or update playlist
      myUsrPlist = {};
      document.getElementById('lUpdate').innerHTML = "";
      hideMultElem(0, ['inst', 'fSearch', 'bSearch', 'lUsers', 'inst2b', 'input', 'inst3', 'output', 'bSubUpdate', 'lUpdate', 'bSave', 'bCancel']);
      hideMultElem(1, ['info', 'bNotMe', 'inst2', 'playlists', 'inst2a', 'bUpdate']);
      break;
    case 3:
      //post playlist selection -> shows playlist raw text file, prompts user to save this file
      hideMultElem(0, ['inst', 'fSearch', 'bSearch', 'inst2', 'lUsers', 'playlists', 'inst2a', 'bUpdate', 'inst2b', 'input', 'bSubUpdate', 'lUpdate', 'bSave']);
      hideMultElem(1, ['info', 'bNotMe', 'inst3', 'output', 'bCancel']);
      break;
    case 4:
      //post update choice -> prompts user for playlist text input
      hideMultElem(0, ['inst', 'fSearch', 'bSearch', 'lUsers', 'inst2', 'playlists', 'inst2a', 'bUpdate', 'inst3', 'output', 'lUpdate', 'bSave']);
      hideMultElem(1, ['bNotMe', 'info', 'inst2b', 'input', 'bSubUpdate', 'bCancel']);
      break;
    case 5:
      //post update playlist text entry -> outputs user-friendly playlist view, prompts user to update text file
      playlistReader(document.getElementById('input').value);
      hideMultElem(0, ['inst', 'fSearch', 'bSearch', 'lUsers', 'inst2', 'playlists', 'inst2a', 'inst2b', 'input', 'inst3', 'bUpdate', 'bSubUpdate']);
      hideMultElem(1, ['bNotMe', 'info', 'lUpdate', 'bSave', 'bCancel']);
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
      //writes to the myUserPlaylist obj, fills in id data
      //ends the loop
      var code = arr.slice(i).join('').match(/[0-9]+[a-z]/g);
      currUserId = parseInt(code[0].slice(0, -1));
      currPlaylistId = parseInt(code[1].slice(0, -1));
      for (var j = 2; j < code.length; j++) {
        tempPlist[j - 2][0] = parseInt(code[j].slice(0, -1));
        tempPlist[j - 2][4] = code[j].slice(-1);
      }
      myUsrPlist.userId = parseInt(code[0].slice(0, -1));
      myUsrPlist.playlistId = parseInt(code[1].slice(0, -1));
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

//displays the updates to the input playlist in a user friendly way
//given id data, looks up sc playlist, compares to provided playlist
//in a stepwise fashion.
//TODO: does not accomidate song rearrangements
//does not consider song duration updates
//does not consider missing user/playlist id's
//FIXME: ADD CODES AUTOMATICALLY
function displayUpdates() {
  var target = document.getElementById('lUpdate');
  //initializes the user songlists, sc songlists, updated songlists
  getUser(-1, currUserId);
  var uList = myUsrPlist.list;
  var sList = [];
  if (currPlaylistId === 0) {
    sList = myLikes;
  } else {
    sList = myPlists[currPlaylistId];
  };
  myUpPlist = [];
  //uIdList, sIdList keeps track of provided song id's for easy refrencing
  //i, j index variables for user list, sc list
  var i = 0;
  var j = 0;
  var uIdList = uList.map(function(arr) {return arr[0]});
  var sIdList = sList.map(function(arr) {return arr[0]});
  var scCheckList = [];

  //loops over both songlists independently with index vars i, j for uList and sList respectively
  while ((i < uList.length) || (j < sList.length)) {
    var song = document.createElement('li');
    //checks if the songs match, if so increments both lists
    if ((i < uList.length)&&(j < sList.length)&&(uList[i][0] === sList[j][0])) {
      song.innerHTML = uList[i][1] + '</br>' + 'uploaded by: ' + uList[i][2] + '</br>' + uList[i][3];
      song.id = uList[i][0];
      myUpPlist.push(uList[i]);
      switch(uList[i][4]) {
        case 'o':
          //code o = original playlist song
          break;
        case 'a':
          //code a = user added song
          song.style.color = "#39f";
          break;
      };
      i++;
      j++;
    } else if ((j === sList.length)||(uIdList.indexOf(sList[j][0]) >= 0)){
      //check if missing sIdList entry is code s or u
      //otherwise assume song is recently either sc removed or user removed. adds song's id to check list
      song.innerHTML = uList[i][1] + '</br>' + 'uploaded by: ' + uList[i][2] + '</br>' + uList[i][3];
      song.id = uList[i][0];
      myUpPlist.push(uList[i]);
      if (uList[i][4] === 's') {
        //code s = previously soundcloud removed song
        song.style.color = "#f50";
        song.style.textDecoration = "line-through";
      } else if (uList[i][4] === 'u') {
        //code u = previousl user removed song
        song.style.color = "#39f";
        song.style.textDecoration = "line-through";
      } else {
        //add id to check list for later processing
        scCheckList.push(uList[i][0]);
      };
      i++;
    } else {
      //assume user newly added song
      song.innerHTML = sList[j][1] + '</br>' + 'uploaded by: ' + sList[j][2] + '</br>' + sList[j][3];
      song.id = sList[j][0];
      myUpPlist.push(sList[j]);
      myUpPlist[myUpPlist.length - 1][4] = 'a';
      song.style.color = "#39f";
      song.style.fontWeight = "bold";
      j++;
    };

    //display song list element
    target.appendChild(song);
  };
  //processes check list with helper function scCheck
  for (var elem in scCheckList) {
    scCheck(scCheckList[elem], sIdList);
  };
};

//helper function for displayUpdates, checks if song is
//misordered: in which case it is ignored
//extant in sc filesys but not sIdList which means recently user removed
//nonexhistant anywhere in sc, which means sc removed
function scCheck(id, sIdList) {
  var IdList = myUpPlist.map(function(arr) {return arr[0]});
  var index = IdList.indexOf(id);
  var song = document.getElementById(id.toString());
    SC.get('/tracks/' + id).then(function(result) {
      if (sIdList.indexOf(id) < 0) {
        myUpPlist[index][4] = 'u';
        song.style.color = "#39f";
        song.style.textDecoration = "line-through";
        song.style.fontWeight = "bold";
      };
  }).catch(function(error) {
    console.log('Error: ' + error.message);
    myUpPlist[index][4] = 's';
    song.style.color = "#f50";
    song.style.textDecoration = "line-through";
    song.style.fontWeight = "bold";
  });
};

//called when 'click here to save' button is pressed
//wrapper function for writeSongs, displays playlist text to output field
//changes state to 3
function writeUpdate() {
  writeSongs(myUpPlist);
  changeState(3);
};
