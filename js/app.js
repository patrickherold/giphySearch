var topics = ["Cats", "dogs", "mice", "fish"];

// Get the existing data
if (localStorage.getItem("topics") !== null) {
    var existing = localStorage.getItem("topics").split(',');
}
else {
    var existing = [];
}


// Event listener for all button elements
function alertTopicName() {
    // In this case, the "this" keyword refers to the button that was clicked
    var topic = $(this).attr("data-name");

    // Constructing a URL to search Giphy for the name of the person who said the quote
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        topic + "&api_key=HWEgL4UenLdbS2M82D1rNQJpXwdGanX7&limit=10";

    // Performing our AJAX GET request
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // After the data comes back from the API
        .then(function(response) {
        // Storing an array of results in the results variable
        var results = response.data;

        // Looping over every result item
        for (var i = 0; i < results.length; i++) {

            // Creating a div for the gif
            var gifDiv = $("<div class='card'>");

            // Storing the result item's rating
            var rating = results[i].rating.toUpperCase();

            // Storing the result item's rating
            var title = results[i].title;

            // Creating a paragraph tag with the result item's rating
            var p = $("<p class='rating'>").text("Rating: " + rating);

            // Creating a paragraph tag with the result item's rating

            var shortText = jQuery.trim(title).substring(0, 15).split(" ").slice(0, -1).join(" ") + "...";

            var h = $("<h3 class='title'>").text(shortText);

            // Creating an image tag
            var gifImage = $("<img>");

            // Creating an download button
            var downLoad = $("<a href=" + results[i].images.fixed_width.url + " download=''> Download </a>");

            var downLoad = $("<form method='get' action=" + results[i].images.fixed_width.url + "><button type='submit' class='cardbutton'>Download!</button></form>");


            // Giving the image tag an src attribute of a proprty pulled off the
            // result item
            gifImage.attr("src", results[i].images.fixed_width_still.url);
            gifImage.attr("data-still", results[i].images.fixed_width_still.url);
            gifImage.attr("data-animate", results[i].images.fixed_width.url);
            gifImage.attr("data-state", "still");
            gifImage.addClass("gif");

            // Appending the paragraph and gifImage we created to the "gifDiv" div we created
            gifDiv.append(h);
            gifDiv.append(p);
            gifDiv.append(gifImage);
            gifDiv.append(downLoad);

            // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
            $("#gifs-appear-here").prepend(gifDiv);
        }
    });
};


$(document).on("click", ".gif", function() {
    // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
    var state = $(this).attr("data-state");
    event.preventDefault();
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
});


// Function for displaying topic data
function renderButtons() {

  // Deleting the topics prior to adding new topics
  // (this is necessary otherwise we will have repeat buttons)
  $("#buttons-view").empty();
  
  // Looping through the array of topics
  for (var i = 0; i < topics.length; i++) {

    // Then dynamicaly generating buttons for each topic in the array
    // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
    var a = $("<button>");
    // Adding a class of topic to our button
    a.addClass("topic");
    // Adding a data-attribute
    a.attr("data-name", topics[i]);
    // Providing the initial button text
    a.text(topics[i]);
    // Adding the button to the HTML
    $("#buttons-view").append(a);
  }

  if (existing) {
    for (var i = 0; i < existing.length; i++) {

        // Then dynamicaly generating buttons for each topic in the array
        // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
        var a = $("<button>");
        // Adding a class of topic to our button
        a.addClass("topic");
        // Adding a data-attribute
        a.attr("data-name", existing[i]);
        // Providing the initial button text
        a.text(existing[i]);
        // Adding the button to the HTML
        $("#buttons-view").append(a);
    }
    }
}

// This function handles events where one button is clicked
$("#add-topic").on("click", function(event) {
  // Preventing the buttons default behavior when clicked (which is submitting a form)
  event.preventDefault();
  // This line grabs the input from the textbox
  var topic = $("#topic-input").val().trim();

    // Add new data to localStorage Array
    existing.push(topic);

    // Save back to localStorage
    localStorage.setItem('topics', existing.toString());


  $('#topic-input').val('');
  // Calling renderButtons which handles the processing of our topic array
  renderButtons();

});

function clearLocal() {
    event.preventDefault();
    localStorage.setItem('topics', '');
    $('#topic-input').val('');
    $("#gifs-appear-here").clear();
    renderButtons();
};

$(document).on("click", ".topic", alertTopicName);

$(document).on("click", ".clear-topics", clearLocal);

// Calling the renderButtons function to display the intial buttons
renderButtons();