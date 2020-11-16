/*
This is the main API function for the primary album data. 
The user can search for an Album name and it will either return the data as an array of objects or will display an error 
The returned array will look like this: 
[0: {
  album: "Album Name"
  albumArt: URL or null if not found
  AlbumDesc: String or undefined if not found
  Artist: "Artist Name"
  runtime: "0:00:00" as a String
  tracklist: ["Name", "Of", "Tracks"]
}
1: {
  album: "Second Album Name"
  albumArt: URL or null if not found
  AlbumDesc: String or undefined if not found
  Artist: "Second Artist Name"
  runtime: "0:00:00" as a String
  tracklist: ["Name", "Of", "Tracks", "On", "Second", "Album"]
}
]
*/
let searchForm = document.getElementById("searchForm");
let submitSearchBtn = document.getElementById("searchButton");
let parentCard = document.getElementById("parentCard");

//card content
let cardContent = document.createElement("div");
  cardContent.className = "card-content";
//span inside of card content
let spanCC = document.createElement("span");
  spanCC.className = "card-title activator grey-text text-darken-4";
let tracklistContainer = document.createElement("div")
  tracklistContainer.className = "container"
let trackListRow = document.createElement("div")
  trackListRow.className = "row"

  //card reveal
  let cardReveal = document.createElement("div")
    cardReveal.className = "card-reveal"
  
  //span inside of card reveal
  let spanCR = document.createElement("span")
    spanCR.className = "card-title grey-text text-darken-4"

  //i inside of span
  let iCR = document.createElement("i")
    iCR.className = "material-icons right"
  
  //div inside of card reveal
  let divCR = document.createElement("div")

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearOutputDiv("#parentCard");
  var userSearchInput = document.querySelector("#searchInput");
  theAudioDBAPIQuery(userSearchInput.value);
});

// Main worker function for API calls
function theAudioDBAPIQuery(search) {
  //API URL for searching for the album
  var apiURL = `https://www.theaudiodb.com/api/v1/json/1/searchalbum.php?a=${search}`;
  //Create the empty array to return at the end of the process
  //Function to fetch the album and then call fetching the Album track information
  fetchAlbum = (apiURL) => {
    fetch(apiURL)
      .then(handleErrors)
      .then((response) => response.json())
      .then((responseJson) => fetchTrackInfo(responseJson));
  };
  //Helper function to grab the track info and return it to the return object
  function fetchTrackInfo(response) {
    if (response.album != null) {
      response.album.forEach((album) => {
        //calls fetch on all album names returned from primary function
        fetch(
          `https://www.theaudiodb.com/api/v1/json/1/track.php?m=${album.idAlbum}`
        )
          .then(handleErrors)
          .then((response) => response.json())
          .then(function (data) {
            //This is the return object format
            albumCardGenerator({
              artist: album.strArtist,
              album: album.strAlbum,
              albumDesc: album.strDescriptionEN,
              albumArt: album.strAlbumCDart,
              runtime: runtimeCounter(data),
              tracklist: trackListGetter(data),
            });
          });
      });
    } else {
      alert("Unknown Album, Please Search Again.");
    }
  }

  fetchAlbum(apiURL);
}

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
  
  for (let index = 0; index < trackList.length; index++) {
    
    //Track List
    let trackListUL = document.createElement("ul");
    let tracklistLI = document.createElement("li");
        tracklistLI.textContent = trackList[index]
    console.log("arr data  " + trackList[index])
    
    // cardDiv.appendChild(cardReveal);
    cardReveal.appendChild(divCR);
    divCR.appendChild(tracklistContainer)
    tracklistContainer.appendChild(trackListRow)
    trackListRow.appendChild(trackListUL);
    trackListUL.appendChild(tracklistLI);
    

    
  }
  return trackList;
  
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

albumCardGenerator = (returnObject) => {
  let cardDiv = document.createElement("div");
  cardDiv.className = "card";
  //Image info
  let imgDiv = document.createElement("div");
  let imgURL = albumArtFallbackHandler(returnObject.albumArt);
  let img = document.createElement("img");
  img.className = "albumArt activator";
  imgDiv.className = "card-image waves-effect waves-block waves-light";
  img.src = imgURL;
  
  
  //i content inside of span
  let iSpan = document.createElement("i");
  iSpan.className = "material-icons right iMaincard";
  iSpan.textContent = "..."
  



  //Info
  //artist name
  let artistCard = document.createElement("p");
  artistCard.textContent = "Artist: " + returnObject.artist;
  //album name
  let albumCard = document.createElement("p");
  albumCard.textContent = "Album Title: " + returnObject.album;
  //album desccription
  let albumDescCard = document.createElement("p");
  albumDescCard.textContent = "Album Description: " + returnObject.albumDesc;
  //album runtime
  let runtimeCard = document.createElement("p");
  runtimeCard.textContent = "Album Runtime: " + returnObject.runtime;

  
  //card image
  cardDiv.appendChild(imgDiv);
  imgDiv.appendChild(img);
  //card content
  cardDiv.appendChild(cardContent);
  cardContent.appendChild(spanCC);
  spanCC.appendChild(artistCard);
  spanCC.appendChild(albumCard);
  spanCC.appendChild(runtimeCard);
  spanCC.appendChild(iSpan);
  //card reveal
  cardDiv.appendChild(cardReveal)
  cardReveal.appendChild(spanCR);
  spanCR.appendChild(iCR);
  spanCR.appendChild(albumDescCard);
  //parent card
  parentCard.appendChild(cardDiv);

 
};

clearOutputDiv = (selector) => {
  var div = document.querySelector(selector);
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
};
