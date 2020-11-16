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
