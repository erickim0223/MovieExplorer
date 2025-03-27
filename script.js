/* Project: Movie Search App
   Author: Eric Kim
   Description: A simple web app that fetches movie data from the OMDb API.
*/

// TODO: Replace this with your own API key from https://www.omdbapi.com/
const API_KEY = '941460ed';

// TODO: These are the main DOM elements we'll be working with
const moviesDiv = document.getElementById('movies');
const detailsDiv = document.getElementById('movie-details');
const favoritesDiv = document.getElementById('favorites');
let currentMovie = null;

function searchMovies() {
    //Get the search query from the input field
    const query = document.getElementById('search').value;
    // TODO: Add correctly formated API Request URL to Fetch method 
    fetch("https://www.omdbapi.com/?apikey=" + API_KEY + "&s=" + query)
        //TODO: Format fetch response Promise as JSON
        .then(response => { console.log(response); return response.json()})
        .then(data => { 
            console.log(data);
            moviesDiv.innerHTML = '';
            if (data.Response == "False") {
                moviesDiv.innerHTML += `<p>${data.Error}<p/>`;
            } else {
                let movies = data.Search;
                for (let i = 0; i < movies.length; i++) {
                    // moviesDiv.innerHTML += `<div class="movie">`;
                    let movie = movies[i];
                    let movieHTML = `<div class="movie">`;
                    let imgTag = ``;
                    if (movie.Poster != 'N/A') {
                        imgTag = `<img src="${movie.Poster}" alt="Not available">`;
                    } else {
                        imgTag = `<p>Poster Not Available </p>`;
                    }
                    movieHTML += `${imgTag}<h3>${movie.Title} (${movie.Year})</h3> <input type="button" value="Details" onclick="getMovieDetails('${movie.imdbID}')"></div>`;
                    moviesDiv.innerHTML += movieHTML;
                    //Problem was adding html immediately to innerHTML.
                    //Need to build string out first, then assign.
                }
                // Secondary solution
                // for (let i = 0; i < movies.length; i++) {
                //     let movie = movies[i];
                //     const movieDiv = document.createElement('div');
                //     movieDiv.classList.add('movie');
                //     var imgTag;
                //     if (movie.Poster != 'N/A') {
                //         imgTag = document.createElement('img');
                //         imgTag.src = movie.Poster;
                //         imgTag.alt = 'Not available';
                //     } else {
                //         imgTag = document.createElement('p');
                //         imgTag.innerHTML = 'Poster Not Available';
                //     }
                //     const titleTag = document.createElement('h3');
                //     titleTag.innerHTML = `${movie.Title} (${movie.Year})`;

                //     const detailButton = document.createElement('input');
                //     detailButton.type = "button";
                //     detailButton.value = "Details";
                //     detailButton.onclick = function() {
                //         getMovieDetails(movie.imdbID);
                //     };

                //     movieDiv.appendChild(imgTag);
                //     movieDiv.appendChild(titleTag);
                //     movieDiv.appendChild(detailButton);

                //     moviesDiv.appendChild(movieDiv);
                // }
            }
        })
        //TODO: Handle JSON format Promise
                // TODO: Clear the current movies display (moviesDiv)
    
                // TODO: If search results exist, loop through them and:
                //       1. Create a movie element for each result
                //       2. Add the movie poster (if poster available), title, and year
                //       3. Add a details button that calls getMovieDetails() with the movie imdbID
                //       4. Append each movie element to the moviesDiv
                .catch(error => { console.log(error)});       
}

function getMovieDetails(imdbID) {
     // TODO: Add correctly formated API Request URL to Fetch method 
     fetch("https://www.omdbapi.com/?apikey=" + API_KEY + "&i=" + imdbID)
     .then(response => { console.log(response); return response.json()})
     .then(data => { 
         console.log(data);
         currentMovie = data;
            detailsDiv.style.display = "block";
            // detailsDiv.innerHTML = '';
            if (data.Response == "False") {
                detailsDiv.innerHTML += `<p>${data.Error}<p/>`;
            } else {
                // let detailsHTML = `<div class="movie">`;
                // let imgTag = ``;
                // if (currentMovie.Poster != 'N/A') {
                //     imgTag = `<img src="${currentMovie.Poster}" alt="Not available">`;
                // } else {
                //     imgTag = `<p>Poster Not Available </p>`;
                // }
                // detailsHTML += `${imgTag}<h3>${currentMovie.Title}</h3><p>${currentMovie.Plot}</p><input type="button" value="Go Back" onclick="goBack()"></div>`;
                // detailsDiv.innerHTML += detailsHTML;
                const title = document.getElementById('title');
                const poster = document.getElementById('poster');
                const info = document.getElementById('info');
                title.innerHTML = currentMovie.Title;
                poster.src = currentMovie.Poster;
                info.innerHTML = `Director: ${currentMovie.Director} <br/> Genre: ${currentMovie.Genre} <br/> Plot: ${currentMovie.Plot}`;
            }
            moviesDiv.style.display = "none";
            updateFavoriteButtonText();
        })
        .catch(error => { console.log(error)});       
        //TODO: Format fetch response Promise as JSON
        //TODO: Handle JSON format Promise
            // TODO: When the data returns:
            //       1. Store the movie data in the currentMovie variable
            //       2. Update the movie details section with the title, poster, and info
            //       3. Call updateFavoriteButtonText() to set the correct button text
            //       4. Hide the movies list and show the details view
}

function goBack() {
    // TODO: Hide the details view and show the movies list again
    moviesDiv.style.display = "grid";
    detailsDiv.style.display = "none";
}

/* Extra Challenge if time allows add "Favorites" feature*/

function toggleFavorite() {
    // TODO: Get the current favorites from localStorage
    var favorites = getFavorites();

    // TODO: Check if the current movie is already in favorites (use imdbID as unique identifier)
    
    // TODO: If it exists, remove it from favorites
    //       If it doesn't exist, add it to favorites
    
    var exists = favorites.some(item => item.id == currentMovie.imdbID);
    if (exists) {
        favorites = favorites.filter(item => item.id != currentMovie.imdbID);
    } else {
        favorites.push({id: currentMovie.imdbID, data: JSON.stringify(currentMovie)});
    }

    // console.log("here");
    // console.log(favorites);
    // console.log(window.localStorage);

    // TODO: Save the updated favorites back to localStorage
    window.localStorage.clear();
    for (let i = 0; i < favorites.length; i++) {
        currFav = favorites[i];
        window.localStorage.setItem(currFav.id, currFav.data);
    }

    // TODO: Update the favorite button text and re-render the favorites list
    updateFavoriteButtonText();
    renderFavorites();
}

function updateFavoriteButtonText() {
    // TODO: Get the current favorites from localStorage
    var favorites = getFavorites();

    favButton = document.getElementById('favorite-btn');

    // TODO: Check if the current movie is in favorites
    var exists = favorites.some(item => item.id == currentMovie.imdbID);
    if (exists) {
        favButton.innerText = "Remove from Favorites";
    } else {
        favButton.innerText = "Add to Favorites";
    }
    // TODO: Update the favorite button text based on whether the movie is in favorites
}

function renderFavorites() {
    // TODO: Clear the current favorites display
    favoritesDiv.innerHTML = '';

    // TODO: Get all favorites from localStorage
    var favorites = getFavorites();

    // console.log(favorites);
    // console.log(window.localStorage);

    // TODO: For each favorite movie:
    //       1. Create a movie element
    //       2. Add the movie poster, title, and year
    //       3. Add a details button that calls getMovieDetails() with the movie ID
    //       4. Append each movie element to the favoritesDiv

    for (let i = 0; i < favorites.length; i++) {
        let movie = JSON.parse(favorites[i].data);
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        var imgTag;
        if (movie.Poster != 'N/A') {
            imgTag = document.createElement('img');
            imgTag.src = movie.Poster;
            imgTag.alt = 'Not available';
        } else {
            imgTag = document.createElement('p');
            imgTag.innerHTML = 'Poster Not Available';
        }
        const titleTag = document.createElement('h3');
        titleTag.innerHTML = `${movie.Title} (${movie.Year})`;

        const detailButton = document.createElement('input');
        detailButton.type = "button";
        detailButton.value = "Details";
        detailButton.onclick = function() {
            getMovieDetails(movie.imdbID);
        };

        movieDiv.appendChild(imgTag);
        movieDiv.appendChild(titleTag);
        movieDiv.appendChild(detailButton);

        favoritesDiv.appendChild(movieDiv);
    }

}

// TODO: Call renderFavorites when the page loads to display any saved favorites
document.addEventListener('DOMContentLoaded', renderFavorites);

function getFavorites() {
    var favorites = [];
    for (let i = 0; i < window.localStorage.length; i++) {
        currKey = window.localStorage.key(i);
        favorites.push({id: currKey, data: window.localStorage.getItem(currKey)});
    }
    return favorites;
}
