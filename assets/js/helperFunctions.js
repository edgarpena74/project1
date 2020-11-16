clearOutputDiv = (selector) => {
  var div = document.querySelector(selector);
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
};

//Function I borrowed from stackoverflow to deal with converting milliseconds the API returns for track runtime to a more readable format
function msToHMS(ms) {
  // 1- Convert to seconds:
  var seconds = ms / 1000;
  // 2- Extract hours:
  var hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  var minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = seconds % 60;
  return hours + ":" + minutes + ":" + parseInt(seconds);
}

albumArtFallbackHandler = (albumArtURL) => {
  if (albumArtURL === null || albumArtURL === "") {
    return "https://cataas.com/cat/says/No_Album_Art_Found";
  } else {
    return albumArtURL;
  }
};

//Used to grab all tracks in an album and then add together their runtime and return it as an integer
runtimeCounter = (album) => {
  var totalRuntime = 0;
  album.track.forEach((track) => {
    totalRuntime += parseInt(track.intDuration);
  });

  return msToHMS(totalRuntime);
};

//handles bad responses from the API
function handleErrors(response) {
  if (!response.ok) {
    alert("Unknown Album, please search again.");
    throw Error(response.statusText);
  }
  return response;
}

//grabs all tracks on an album and creates an array with their titles
trackListGetter = (album) => {
  var trackList = [];
  album.track.forEach((track) => {
    trackList.push(track.strTrack);
  });
  return trackList;
};
