// Get elements from the HTML page
let randomMealCard = document.getElementById("randomMeal");
let homeButton = document.getElementById("home-button");
let searchBar = document.getElementById("searchBar");
let searchButton = document.getElementById("SearchButton");
let searchInput = document.getElementById("searchInput");
let modal = document.getElementById("myModal");
let ingredients = document.getElementById("ingredients");
let span = document.getElementsByClassName("close")[0];
let mode = document.getElementsByClassName("CategoryButton"); 
let results = document.getElementById("results");

// Global variables
let mealCard;
let selectedMode;

async function randomMeal() {
  let arr;
  // Fetch data from the API
  await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((data) => data.json())
    .then((e) => {
      arr = e;
    })
    .catch((error) => console.log(error));
  randomMealCard.innerHTML = `<div class="meal">
  <img class="mealimg" src=${arr.meals[0].strMealThumb}>
  <h3>${arr.meals[0].strMeal}</h3> </div>`;

  randomMealCard.addEventListener("click", (e) => {
    const parent = e.target.parentNode;
    const h3 = parent.getElementsByTagName("h3")[0];
    ingredientListMaker(h3.innerText);
  });
};

searchButton.onclick = () => {
  let input = searchBar.value;
  if (selectedMode == undefined) {
    window.alert("Please select any mode of search.");
  } else if (input == "") {
    searchInput.innerText = "Please enter a keyword to search";
    results.innerHTML = "";
  } else {
    // Update the inner text of the searchInput element
    searchInput.innerText = `Search Results for "${input}"`;
    // Call the searchMealBasedOnInput function and pass the input and selectedMode as parameters
    searchMealBasedOnInput(input, selectedMode);
  };
};

async function searchMealBasedOnInput(input, mode) {
  if (mode == "1-mode") {
    await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${input}`)
      .then((data) => data.json())
      .then((e) => {
        // Check if the result is not null
        if (e.meals != null) {
          // Call function to give the result
          renderSearchResult(e);
        } else {
          // Clear the search result and show "Not found!" if result is null
          results.innerHTML = "";
          results.innerText = "Not found!";
        };
      });
  } else {
    // Mode 2 and Mode 3 functionality remains the same
  };
};

// Gives the search result 
function renderSearchResult(arrays) {
  results.innerHTML = "";
  arrays.meals.forEach((array) => {
    results.innerHTML += `<div class="meal">
    <img class="mealimg" src=${array.strMealThumb}>
    <h3>${array.strMeal}</h3> </div>`;
  });
  mealCard = document.querySelectorAll(".meal");
  eventListener();
};

// Add click event to meal cards
function eventListener() {
  for (let i = 0; i < mealCard.length; i++) {
    const element = mealCard[i];
    element.onclick = (e) => {
      const parent = e.target.parentNode;
      const h3 = parent.getElementsByTagName("h3")[0];
      // Show the ingredients list on meal card click
      ingredientListMaker(h3.innerText);
    };
  };
};

// Function to make ingredientList of any specific meal
async function ingredientListMaker(name) {
  let list;
  await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    .then((data) => data.json())
    .then((e) => {
      list = e;
    });

  // Clear the previous content in the ingredients container
  ingredients.innerHTML = "";

  // Loop through the ingredients and display them on the page
  for (let i = 1; i < 21; i++) {
    let ingredient = list.meals[0][`strIngredient${i}`];
    if (!ingredient) {
      break;
    };

    // Add the ingredient to the container
    ingredients.innerHTML += `${i}.${ingredient}<br>`;
  };

  // Display the modal
  modal.style.display = "block";
}

// Loop through each mode button and attach an event listener to it
for (let i = 0; i < mode.length; i++) {
  mode[i].onclick = (e) => {
    // Reset the color and background-color of all mode buttons
    for (let j = 0; j < mode.length; j++) {
      mode[j].style.color = "rgb(29, 26, 26)";
      mode[j].style.backgroundColor = "white";
    };
    // Change the color and background-color of mode button
    mode[i].style.color = "white";
    mode[i].style.backgroundColor = "black";
    selectedMode = e.target.id;
  };
};

// Event listener to the home button
homeButton.onclick = () => {
  window.location = "index.html";
};

// Event listener to the span (close button) of the modal
span.onclick = function () {
  modal.style.display = "none";
};

// Event listener to the window for closing the modal when clicking outside of it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Trigger the randomMeal function 
window.addEventListener("load", randomMeal);
