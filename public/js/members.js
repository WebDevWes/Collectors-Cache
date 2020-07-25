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
            let nameRow = $("<td class='text-yellow'>");
            let descriptionRow = $("<td class='text-yellow'>");
            let quantityRow = $("<td class='text-yellow'>");
            let conditionRow = $("<td class='text-yellow'>");
            let priceRow = $("<td class='text-yellow'>");
            let deleteRow = $("<td>");

            let newImg = $("<img>");
            newImg.attr("src", newCard.img);
            let deleteButton = $(
              "<button type='button' class='btn btn-danger'>"
            );
            nameRow.text(newCard.name);
            descriptionRow.text(newCard.description);
            quantityRow.text(newCard.quantity);
            quantityRow.attr("data-value", newCard.quantity);
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
            let nameRow = $("<td class='text-yellow'>");
            let descriptionRow = $("<td class='text-yellow'>");
            let quantityRow = $("<td class='text-yellow'>");
            let conditionRow = $("<td class='text-yellow'>");
            let priceRow = $("<td class='text-yellow'>");
            let deleteRow = $("<td>");

            let newImg = $("<img>");
            newImg.attr("src", newCard.img);
            let deleteButton = $(
              "<button type='button' class='btn btn-danger'>"
            );
            nameRow.text(newCard.name);
            descriptionRow.text(newCard.description);
            quantityRow.text(newCard.quantity);
            quantityRow.attr("data-value", newCard.quantity)
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
    const card = $("#cardCollectIn").val();
    searchCards(card);
  });

  $("#pdfmake").on("click", (event) => {

    $.get("/api/user_data").then((data) => {
      const test = {name:"narset",price:4.50,quantity:"3"}
      console.log(test)
      window.open("https://service.pdfgun.online/pdf/api/v1/0a223ee4e3984778d68a1b70ddc31e6160de18e1f0facc7c6a3d9c4335c49aff9b78dccf8add1a4521af4c9813b0a4c1/985f3bfb77cd7d30493ef4c7fc72eb808a557b66aaab5e76eb445c354a4a4fb42a414cb2670017dbc568ed06bed1c0ea/Cards?param1=" + data.username + "&content=" + test, "_blank")

    });

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
          quantity = $("#quantity").val();
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
