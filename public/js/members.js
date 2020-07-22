// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const btn = document.getElementById("cardSearch");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.username);
    document.title = data.username + "'s Collector Cache";
  });

  $("#cardSearch").on("click", event =>{

    event.preventDefault();
    const queryURL = buildQueryURL();
    clearSec("#cardSearchIn");

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(data => console.log(data));
  });

  const buildQueryURL = () => {
    const queryURL = "https://api.scryfall.com/cards/search/?q=";
    const queryParam = $("#cardSearchIn").val().trim();
    return queryURL + queryParam;
  };

  const clearSec = section => {
    $(section).val("");
  };
});
