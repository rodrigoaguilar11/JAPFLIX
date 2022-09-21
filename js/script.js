const catalog = "https://japceibal.github.io/japflix_api/movies-data.json";
let catalogLoaded;
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(catalog).then(function (resultObj) {
        if (resultObj.status === "ok") {
            catalogLoaded = (resultObj.data);
        }
    });

    document.getElementById("btnBuscar").addEventListener("click", () => {
        showResults();
    })

    inputBuscar.addEventListener("keydown", enterDetect);

    function enterDetect(e) {
        switch (e.key) {
            case "Enter":
                showResults();
        }
    }
    //End of DOMContentLoaded
})
let getJSONData = function (url) {
    let result = {};
    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(function (response) {
            result.status = 'ok';
            result.data = response;
            return result;
        })
        .catch(function (error) {
            result.status = 'error';
            result.data = error;
            return result;
        });
}

function showResults() {
    document.getElementById("lista").innerHTML = "";
    let input = document.getElementById("inputBuscar").value;
    let filteredList = catalogLoaded.filter(p => p.title.includes(input) || p.tagline.includes(input) || p.genres.includes(input) || p.overview.includes(input));
    filteredList.sort((a, b) => a.search - b.search);

    //show the list in the screen
    if (filteredList.length > 0) {

        for (let i = 0; i < filteredList.length; i++) {
            let average = filteredList[i].vote_average / 2;
            average = Math.round(average);

            let stars = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= average) {
                    stars += '<span class="fa fa-star checked"></span>';
                } else {
                    stars += '<span class="fa fa-star white"></span>';
                }
            }

            document.getElementById("lista").innerHTML += `
<div class="row list-group-item transparent" onclick="showDetails(${filteredList[i].id})">
<div class="d-flex w-100 justify-content-between">
    <h4 class="white">` + filteredList[i].title + `</h4>
    <h4>${stars}</h4>
</div>   
 <p class="grey">` + filteredList[i].tagline + `</p> 
</div>
    `;
        }
    } else {
        document.getElementById("lista").innerHTML += `
        <div class="row list-group-item transparent">
        <div class="d-flex w-100 justify-content-between">
            <h4 class="white">No se encontraron coincidencias con: ${input}</h4>
        </div>   
        </div>
            `;


    }
}

function showDetails(movieId) {
    document.getElementById("details").innerHTML = ``;
    //console.log(movieId);
    let movie;
    catalogLoaded.forEach(object => {
        if (object.id === movieId) {
            //console.log(object);
            movie = object;
        }
    });
    //Obtain categories
    let genres = "";
    for (let i = 0; i < movie.genres.length; i++) {
        //console.log(movie.genres[i]);
        genres += (movie.genres[i].name);
        if (!(movie.genres.length - 1 == i)) {
            genres += " - ";
        }
        //console.warn(genres);
    }
    movie.genres

    //Obtain year of date
    let year = movie.release_date.substring(0, 4);
    document.getElementById("details").innerHTML += `
<div class="row list-group-item backgroudBlack">
  <div class="d-flex w-100 justify-content-between">
    <h4> ${movie.title} </h4>
    <button type="button" class="btn-close" aria-label="Close" onclick="closeMoreInfo()"></button>
    
  </div>   
  <p> ${movie.overview} </p> 
  <hr>
  <div class="d-flex w-100 justify-content-between">
    <p>${genres}</p>
    <button type="button" class="btn btn-secondary" onclick="showMoreInfo()">More ▼</button>

  </div>
</div>
<div id="moreInfo" class=" row moreInfo list-group-item">
<div class="d-flex w-100 justify-content-between">
  <p>Year:</p>
  <p>${year}</p>
</div>
<div class="d-flex w-100 justify-content-between">
  <p>Runtime:</p>
  <p>${movie.runtime} mins </p>
</div>
<div class="d-flex w-100 justify-content-between">
  <p>Budget:</p>
  <p>$${movie.budget} </p>

</div>
<div class="d-flex w-100 justify-content-between">
  <p>Revenue:</p>
  <p>$${movie.revenue} </p>

</div>
</div>
`;
    document.getElementById("details").classList.add("visible");

}

function showMoreInfo() {
    if (document.getElementById("moreInfo").classList.contains("showMoreInfo")) {
        document.getElementById("moreInfo").classList.remove("showMoreInfo");
        document.getElementById("moreInfo").classList.add("moreInfo");
    } else {
        document.getElementById("moreInfo").classList.remove("moreInfo");
        document.getElementById("moreInfo").classList.add("showMoreInfo");
    }
}

function closeMoreInfo() {
    document.getElementById("details").innerHTML = ``;
    document.getElementById("details").classList.remove("visible");
    showMoreInfo()
}
//            The Lord of the Rings: The Return of the King
//[`+ filteredList[i].title +`,`+ filteredList[i].overview +`,`+ filteredList[i].genres +`,`+ filteredList[i].release_date +`,`+ filteredList[i].budget +`,`+ filteredList[i].runtime +`]