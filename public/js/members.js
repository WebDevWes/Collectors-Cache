// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const btn = document.getElementById("cardSearch");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// Variable to be called
let searchCall;

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

// Used to format number into US Currency upon display
var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

$(document).ready(() => {
  const renderCards = () => {

    $.get("/api/user_data").then((data) => {
      const queryURL = "/api/cards/" + data.id;
      $.get(queryURL).then((data) => {
        const cards = [];
        
        $("#database-container").empty();

        data.forEach((card) => {
          const queryURL =
            "https://api.scryfall.com/cards/search/?q=" + card.name;

          $.ajax({
            url: queryURL,
            method: "GET",
          }).then((response) => {
            const newCard = {
              id: card.id,
              name: response.data[0].name,
              img: response.data[0].image_uris.small,
              description: response.data[0].oracle_text,
              quantity: card.quantity,
              condition: card.condition,
              price: response.data[0].prices.usd,
            };
            cards.push(newCard);

            let newRow = $("<tr>");

            let imgRow = $("<th>");
            let nameRow = $("<td>");
            let descriptionRow = $("<td>");
            let quantityRow = $("<td>");
            let conditionRow = $("<td>");
            let priceRow = $("<td>");
            let deleteRow = $("<td>");

            let newImg = $("<img>");
            newImg.attr("src", newCard.img);
            let deleteButton = $(
              "<button type='button' class='btn btn-danger'>"
            );
            nameRow.text(newCard.name);
            descriptionRow.text(newCard.description);
            quantityRow.text(newCard.quantity);
            conditionRow.text(newCard.condition);
            priceRow.text(formatter.format(newCard.price));

            deleteButton.text("Delete");
            deleteButton.attr("data-id", newCard.id);

            deleteButton.on("click", function deletePost() {
              $.ajax({
                method: "DELETE",
                url: "/api/cards/" + newCard.id,
              }).then(function() {
                location.reload();
              });
            });

            deleteRow.append(deleteButton);
            imgRow.append(newImg);
            newRow.append(imgRow);
            newRow.append(nameRow);
            newRow.append(descriptionRow);
            newRow.append(quantityRow);
            newRow.append(conditionRow);
            newRow.append(priceRow);
            newRow.append(deleteRow);

            $("#database-container").append(newRow);
          });
        });
      });
    });
  };

  renderCards();

  const searchCards = (query) => {

    $.get("/api/user_data").then((data) => {
      const queryURL = "/api/cards/" + data.id + "/" + query;

      $.get(queryURL).then((data) => {
        const cards = [];

        $("#database-container").empty();

        data.forEach((card) => {
          const queryURL =
            "https://api.scryfall.com/cards/search/?q=" + card.name;

          $.ajax({
            url: queryURL,
            method: "GET",
          }).then((response) => {
            const newCard = {
              name: response.data[0].name,
              img: response.data[0].image_uris.small,
              description: response.data[0].oracle_text,
              quantity: card.quantity,

              condition: card.condition,
              price: response.data[0].prices.usd,
            };
            cards.push(newCard);

            let newRow = $("<tr>");

        let imgRow = $("<th>");
        let nameRow = $("<td>");
        let descriptionRow = $("<td>");
        let quantityRow = $("<td>");
        let conditionRow = $("<td>");
        let priceRow = $("<td>");
        let deleteRow = $("<td>");

        let newImg = $("<img>");
        newImg.attr("src", newCard.img);
        let deleteButton = $(
          "<button type='button' class='btn btn-danger'>"
        );
        nameRow.text(newCard.name);
        descriptionRow.text(newCard.description);
        quantityRow.text(newCard.quantity);
        conditionRow.text(newCard.condition);
        priceRow.text(formatter.format(newCard.price));

        deleteButton.text("Delete");
        deleteButton.attr("data-id", newCard.id);

        deleteButton.on("click", function deletePost() {
          $.ajax({
            method: "DELETE",
            url: "/api/cards/" + newCard.id,
          }).then(function() {
            location.reload();
          });
        });

        deleteRow.append(deleteButton);
        imgRow.append(newImg);
        newRow.append(imgRow);
        newRow.append(nameRow);
        newRow.append(descriptionRow);
        newRow.append(quantityRow);
        newRow.append(conditionRow);
        newRow.append(priceRow);
        newRow.append(deleteRow);

        $("#database-container").append(newRow);
          });
        });
      });
    });
  };

  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page

  $.get("/api/user_data").then((data) => {
    $(".member-name").text(data.username);
    document.title = data.username + "'s Collector Cache";
  });

  $("#cardCollect").on("click", (event) => {

    event.preventDefault();
    const card = $("#cardCollectIn").val()
    searchCards(card)

  })

  $("#cardSearch").on("click", (event) => {
    event.preventDefault();
    const queryURL = buildQueryURL();
    clearSec("#cardSearchIn");

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function ajaxCall(response) {
      //console.log(response);
      searchCall = response;
      // console.log(searchCall);
      callAPI(searchCall);
    });
  });

  const callAPI = () => {
    $(".modal-body").empty();
    for (let i = 0; i < searchCall.data.length; i++) {
      const modalSelect = $("<img>");
      modalSelect.attr("class", "clickCard");
      modalSelect.attr("src", searchCall.data[i].image_uris.small);
      modalSelect.attr("data-name", searchCall.data[i].name);
      $(".modal-body").append(modalSelect);

      modalSelect.on("click", function selectedCard() {
        if (modalSelect.hasClass("selectedCard") === false) {
          modalSelect.addClass("selectedCard");
        }

        let quantity;
        if ($("#quantity").val() == "") {
          quantity = $("#quantity").attr("placeholder");
        } else {
          quantity = $("#quantity").attr("value");
        }

        const condition = $("#condition").val();
        console.log("quantity", quantity);
        console.log("typeof", typeof quantity);
        // console.log(typeof quantity)

        $.get("/api/user_data").then((data) => {
          const newCard = {
            name: modalSelect.data("name"),
            quantity: quantity,
            condition: condition,
            UserId: data.id,
          };

          submitCard(newCard);
        });
      });
    }
  };

  const buildQueryURL = () => {
    const queryURL = "https://api.scryfall.com/cards/search/?q=";
    const queryParam = $("#cardSearchIn")
      .val()
      .trim();
    return queryURL + queryParam;
  };

  const clearSec = (section) => {
    $(section).val("");
  };

  const submitCard = (card) => {
    console.log("posting");
    $.post("/api/cards", card, function() {
      location.reload();
    });
  };
});
