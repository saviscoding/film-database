/*
* DISPLAY ALL FILMS
*/

var currentPage = 1;

function getFilms(page) {

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {

			var films = JSON.parse(this.responseText);
			var filmTable = document.getElementById("film-table");

			// empty table
			filmTable.innerHTML = "";

			//table headings
			var tableHeading = document.createElement("thead");
			tableHeading.classList.add("border-b-2", "font-semibold", "text-center", "text-xs", "uppercase", "tracking-wider");
			tableHeading.innerHTML = "<tr><th>Title</th><th>Released</th><th>Director</th><th>Stars</th><th>Review</th><th>Edit</th></tr>";
			filmTable.appendChild(tableHeading);

			//table rows
			films.forEach(function(film) {
				var tableRow = document.createElement("tr");
				tableRow.innerHTML = "<td class=\"border border-slate-300 py-2 px-4\">" + film.title + "</td><td class=\"border border-slate-300 py-2 px-4\">" + film.year + "</td><td class=\"border border-slate-300 py-2 px-4\">"
					+ film.director + "</td><td class=\"border border-slate-300 py-2 px-4\">" + film.stars + "</td><td class=\"border border-slate-300 py-2 px-4\">" + film.review + "</td>" + "</td><td class=\"border border-slate-300 py-2 px-4\">"
					+ "<button class='delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full' onclick='deleteFilm(" + film.id + ")'><i class='fas fa-trash-alt'></i></button>"
					+ "<button class='update-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full' onclick='updateForm(" + film.id + ")'><i class='fas fa-edit'></i></button>"
					+ "</td>";
				filmTable.appendChild(tableRow);
			});
		}
	};

	//send GET request
	xhttp.open("GET", "http://localhost:8080/a-film-database/film-api?searchType=show-all-films&format=json&page=" + page, true);
	xhttp.send();
	currentPage = page;
}

/*
* Scroll functions
*/

function nextPage() {
	if (currentPage < 25) {
		getFilms(currentPage + 1);
	}
}

function previousPage() {
	if (currentPage > 1) {
		getFilms(currentPage - 1);
	}
}

/*
* SEARCH
*/
function searchForm() {
	var searchFilm = document.getElementById("form");

	searchFilm.innerHTML = '<form class="grid justify-center py-2 px-4"><h2 class="underline px-12 py-5">SEARCH</h2><input type="text" id="search-text" placeholder="Enter title, director, or stars" class="border">'
		+ '<br><button type="button" onclick="searchFilms()" class="inline-block px-4 py-2 mx-0 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out">Submit</button><br>'
		+ '<button type="button" onclick="cancelForm()" class="inline-block px-4 py-2 bg-red-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-600 hover:shadow-lg focus:bg-red-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out">Cancel</button>'
		+ '<form>';

	searchFilm.style.display = "block";

}

function searchFilms() {
	//get the search word from the text box
	var keyword = document.getElementById("search-text").value;

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {

			var films = JSON.parse(this.responseText);
			var filmTable = document.getElementById("film-table");

			// empty table
			filmTable.innerHTML = "";

			//table headings
			var tableHeading = document.createElement("thead");
			tableHeading.classList.add("border-b-2", "font-semibold", "text-left", "text-xs", "uppercase", "tracking-wider");
			tableHeading.innerHTML = "<tr><th>Title</th><th>Released</th><th>Director</th><th>Stars</th><th>Review</th><th>Edit</th></tr>";
			filmTable.appendChild(tableHeading);

			//table rows
			films.forEach(function(film) {
				var tableRow = document.createElement("tr");
				tableRow.innerHTML = "<td class=\"border border-slate-300 py-2 px-4\">" + film.title + "</td><td class=\"border border-slate-300 py-2 px-4\">" + film.year + "</td><td class=\"border border-slate-300 py-2 px-4\">"
					+ film.director + "</td><td class=\"border border-slate-300 py-2 px-4\">" + film.stars + "</td><td class=\"border border-slate-300 py-2 px-4\">" + film.review + "</td>" + "</td><td class=\"border border-slate-300 py-2 px-4\">"
					+ "<button class='delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full' onclick='deleteFilm(" + film.id + ")'><i class='fas fa-trash-alt'></i></button>"
					+ "<button class='update-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full' onclick='updateForm(" + film.id + ")'><i class='fas fa-edit'></i></button>"
					+ "</td>";
				filmTable.appendChild(tableRow);
			});
		}
	};

	// Send a GET request to the API with the search keyword
	xhttp.open("GET", "http://localhost:8080/a-film-database/film-api?searchType=search-by-keyword&format=json&searchText=" + keyword, true);
	xhttp.send();

}

/*
* DELETE
*/

function deleteFilm(id) {
	Swal.fire({
		title: 'Are you sure you want to delete this film?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Confirm'
	}).then((result) => {
		if (result.value) {
			axios.delete(`http://localhost:8080/a-film-database/film-api?id=${id}`)
				.then((response) => {
					// Refresh the film table
					getFilms(currentPage);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	});
}

/*
* UPDATE
*/

function updateForm(id) {
	getFilmByID(id).then(function(response) {
		var film = response.data;
		console.log(film);
		var updateFilm = document.getElementById("form");
		updateFilm.innerHTML = `
	      <form id="filmForm" class="grid justify-center">
     		<h2 class="underline px-12 py-5">UPDATE FILM</h2>
	        <label for="id">Film ID:</label>
	        <input id="film-id" type="text" name="id" class="border bg-grey" value="${film[0].id}" disabled><br>
	        <label for="title">Title:</label>
	        <input id="film-title" type="text" name="title" class="border" value="${film[0].title}"><br>
	        <label for="year">Release Year:</label>
	        <input type="text" id="film-year" name="year" class="border" value="${film[0].year}"><br>
	        <label for="director">Director:</label>
	        <input type="text" id="film-director" name="director" class="border" value="${film[0].director}"><br>
	        <label for="stars">Stars:</label>
	        <input type="text" id="film-stars" name="stars" class="border" value="${film[0].stars}"><br>
	        <label for="review">Review:</label>
	        <input type="text" id="film-review" name="review" class="border" value="${film[0].review}"><br>
	        <button type="button" onclick="updateFilm()" class="inline-block px-6 py-2.5 mx-0 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out">Submit</button><br>
	        <button type="button" onclick="cancelForm()" class="inline-block px-6 py-2.5 bg-red-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-600 hover:shadow-lg focus:bg-red-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out">Cancel</button>
	      </form>
	      `;
		updateFilm.style.display = "block";
	}).catch(function(error) {
		console.log("Error getting film:", error);
	});
}

function updateFilm() {
	var id = document.getElementById("film-id").value || "";
	var title = document.getElementById("film-title").value || "";
	var year = document.getElementById("film-year").value || "";
	var director = document.getElementById("film-director").value || "";
	var stars = document.getElementById("film-stars").value || "";
	var review = document.getElementById("film-review").value || "";
	console.log(id, title, year, director, stars, review);

	axios.put('http://localhost:8080/a-film-database/film-api?id=' + id + '&title=' + title + '&year=' + year + '&director=' + director + '&stars=' + stars + '&review=' + review)
		.then(function(response) {
			console.log(response);
			Swal.fire({
				title: 'Film updated successfully',
				icon: 'success'
			});
			form.style.display = "none";
			getFilms(currentPage);
		})
		.catch(function(error) {
			console.error(error);
			Swal.fire({
				title: 'Error updating film',
				text: error.message,
				icon: 'error'
			});
		});
}


function getFilmByID(id) {
	return axios.get("http://localhost:8080/a-film-database/film-api", {
		params: {
			searchType: "search-by-id",
			searchText: id,
			format: "json"
		}
	}).catch(function(error) {
		console.log("Error getting film:", error);
	});
}





/*
* ADD
*/

function addForm() {
	var addFilm = document.getElementById("form");

	addFilm.innerHTML =
		'<form id="filmForm" class="grid justify-center">' +
		'<h2 class="underline px-12 py-5">ADD FILM</h2>' +
		'<label for="id">Film ID:</label>' +
		'<input id="film-id" type="text" name="id" class="border"><br>' +
		'<label for="title">Title:</label>' +
		'<input id="film-title" type="text"  name="title" class="border"><br>' +
		'<label for="year">Release Year:</label>' +
		'<input type="text" id="film-year" name="year" class="border"><br>' +
		'<label for="director">Director:</label>' +
		'<input type="text" id="film-director" name="director" class="border"><br>' +
		'<label for="stars">Stars:</label>' +
		'<input type="text" id="film-stars" name="stars" class="border"><br>' +
		'<label for="review">Review:</label>' +
		'<input type="text" id="film-review" name="review" class="border"><br>' +
		'<button type="button" onclick="addFilm()" class="inline-block px-6 py-2.5 mx-0 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out">Submit</button><br>' +
		'<button type="button" onclick="cancelForm()" class="inline-block px-6 py-2.5 bg-red-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-600 hover:shadow-lg focus:bg-red-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out">Cancel</button>' +
		'</form>';

	addFilm.style.display = "block";

}

function addFilm() {
	var id = document.getElementById("film-id").value;
	var title = document.getElementById("film-title").value;
	var year = document.getElementById("film-year").value;
	var director = document.getElementById("film-director").value;
	var stars = document.getElementById("film-stars").value;
	var review = document.getElementById("film-review").value;

	axios.post('http://localhost:8080/a-film-database/film-api?id=' + id + '&title=' + title + '&year=' + year + '&director=' + director + '&stars=' + stars + '&review=' + review)
		.then(function(response) {
			console.log(response);
		})
	Swal.fire({
		title: 'Film added successfully',
		icon: 'success'
	});
	form.style.display = "none";
	getFilms(currentPage);
}



function cancelForm() {
	form.innerHTML = "";
	form.style.display = "none";

}
