let searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearOutputDiv("#parentCard");
  var userSearchInput = document.querySelector("#searchInput");
  theAudioDBAPIQuery(userSearchInput.value);
});

///////

albumCardGenerator = (returnObject) => {
  let parentCard = document.getElementById("parentCard");
  let cardDiv = document.createElement("div");
  cardDiv.className = "card";
  //card content
  let cardContent = document.createElement("div");
  cardContent.className = "card-content";
  //span inside of card content
  let spanCC = document.createElement("span");
  spanCC.className = "card-title activator grey-text text-darken-4";
  let tracklistContainer = document.createElement("div");
  tracklistContainer.className = "container";
  let trackListRow = document.createElement("div");
  trackListRow.className = "row";

  //card reveal
  let cardReveal = document.createElement("div");
  cardReveal.className = "card-reveal";

  //span inside of card reveal
  let spanCR = document.createElement("span");
  spanCR.className = "card-title grey-text text-darken-4";

  //i inside of span
  let iCR = document.createElement("i");
  iCR.className = "material-icons right";

  //div inside of card reveal
  let divCR = document.createElement("div");
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
  iSpan.textContent = "...";

  //Info
  //artist name
  let artistCard = document.createElement("div");
  artistCard.setAttribute("class", "card-text")
  artistCard.textContent = "Artist: " + returnObject.artist;
  //album name
  let albumCard = document.createElement("div");
  albumCard.setAttribute("class", "card-text")
  albumCard.textContent = "Album Title: " + returnObject.album;
  //album desccription

  let albumDescCard = document.createElement("div");
  albumDescCard.setAttribute("class", "description-text")
  if (returnObject.albumDesc != undefined) {
    albumDescCard.textContent = "Album Description: " + returnObject.albumDesc;
  }
  //album runtime
  let runtimeCard = document.createElement("div");
  runtimeCard.setAttribute("class", "card-text")
  runtimeCard.textContent = "Album Duration: " + returnObject.runtime;

  //crad image
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
  cardDiv.appendChild(cardReveal);
  cardReveal.appendChild(spanCR);
  spanCR.appendChild(iCR);
  spanCR.appendChild(albumDescCard);
  //parent card
  parentCard.appendChild(cardDiv);

  //main card
  //artist name
  //album
  //duration

  let trackListUL = document.createElement("ol");
  trackListUL.innerHTML = "Tracklist: ";
  for (let index = 0; index < returnObject.tracklist.length; index++) {
    //Track List
    let tracklistLI = document.createElement("li");
    tracklistLI.setAttribute("id", "tracks-text")
    tracklistLI.textContent = returnObject.tracklist[index];
    console.log("arr data  " + returnObject.tracklist[index]);

  
    cardDiv.appendChild(cardReveal);
    cardReveal.appendChild(divCR);
    divCR.appendChild(tracklistContainer);
    tracklistContainer.appendChild(trackListRow);
    trackListRow.appendChild(trackListUL);
    trackListUL.appendChild(tracklistLI);
  }
};
