let titleForm = document.getElementById('t');
titleForm.value = '';
let yearForm = document.getElementById('y');
yearForm.value = '';

let data = {};

// Displays data in the HTML file
function displayData() {
  // Error if the input did not return any results
  if (Object.keys(data).includes("Error")) {
    document.getElementById("search-by-title-error").style.display = "block"
    document.getElementById("search-by-title-error").innerText = "Search did not yield results. Please make sure the title is correct."
    return console.error("Search did not yield results");
  }

  function getResponseElement(propertyStr) {
    return document.getElementById('response-' + propertyStr);
  }
  getResponseElement('title').textContent = data.Title;
  getResponseElement('year').textContent = data.Year;
  getResponseElement('rated').textContent = data.Rated;
  getResponseElement('runtime').textContent = data.Runtime;
  getResponseElement('genre').textContent = data.Genre;
  getResponseElement('director').textContent = data.Director;
  getResponseElement('writer').textContent = data.Writer;
  getResponseElement('actors').textContent = data.Actors;
  getResponseElement('plot').textContent = data.Plot;
  getResponseElement('language').textContent = data.Language;
  getResponseElement('country').textContent = data.Country;
  getResponseElement('poster').src = data.Poster;
  getResponseElement('type').textContent = data.Type;
  
  addToListCollapse();
  document.getElementById("search-by-title-response").style.display = "flex";
}


// Submit form button event. Fetches the data from the API.
const searchForm = document.getElementById('search-by-title-form');
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  document.getElementById("search-by-title-error").style.display = "none";

  let titleFormPathSegment = '&t=' + titleForm.value.trim().split(' ').map(element => encodeURIComponent(element)).join('+');
  let yearFormPathSegment = '&y=' + yearForm.value.trim().split(' ').map(element => encodeURIComponent(element)).join('+');

  // Error if user did not input a title
  if (titleForm.value.trim() == '') {
    document.getElementById("search-by-title-error").style.display = "block";
    document.getElementById("search-by-title-error").innerText = "Title parameter must be filled!"
    return console.error("Search did not yield results")
  }
  if (yearForm.value.trim() == '') {
    yearFormPathSegment = '';
  }
  
  async function fetchData() {
    try {
      const response = await fetch('http://www.omdbapi.com/?apikey=3ae78589' + titleFormPathSegment + yearFormPathSegment)
  
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      data = await response.json();
      displayData();
      return data;
  
    } catch(error) {
      alert("Failed to fetch data. Please try again later.");
      console.error('Error:', error);
    }
  }

  fetchData();
})

// Function to clear all fields and collapse search form elements
function resetForm() {
  searchForm.reset();
  document.getElementById('search-by-title-response').style.display = "none";
}

// Functions to expand and collapse the add-to-list-details
const addToListCollapsible = document.getElementById("add-to-list-details");
function addToListExpand() {
  if (addToListCollapsible.style.display == "flex") {
    return addToListCollapsible.style.display = "none";
  } else {
  return addToListCollapsible.style.display = "flex";
  }
}
function addToListCollapse() {
  document.getElementById("add-to-list-error").style.display = "none";
  addToListCollapsible.style.display = "none";
}

// Function to add title to list
let savedList = [];
function addToList() {
  // Error if title is already included in the list
  if (savedList.includes(data)) {
    document.getElementById("add-to-list-error").style.display = "inline"
    return console.error("Failed to add to list");
  }

  savedList.unshift(data);

  // Creates new row in the list
  let tableRef = document.getElementById('movie-list');
  let newRow = tableRef.insertRow(1);
  function createNewCell(i, content) {
    let newCell = newRow.insertCell(i);
    return newCell.appendChild(content);
  }
  const entryStatusOption = document.getElementById("entry-status");
  const yourScoreOption = document.getElementById("your-score");
  let newCell0 = createNewCell(0, document.createTextNode(savedList[0].Title));
  let newCell1 = createNewCell(1, document.createTextNode(savedList[0].Year));
  let newCell2 = createNewCell(2, document.createTextNode(savedList[0].Type));
  let newCell3 = createNewCell(3, document.createTextNode(entryStatusOption.options[entryStatusOption.selectedIndex].text));
  let newCell4 = createNewCell(4, document.createTextNode(document.getElementById("date-completed").value));
  let newCell5 = createNewCell(5, document.createTextNode(yourScoreOption.options[yourScoreOption.selectedIndex].text));
  let newCell6 = createNewCell(6, document.createElement("button"));
  newCell6.appendChild(document.createTextNode("Delete"));
  newCell6.setAttribute("onclick", "deleteRow()");

  addToListCollapse();
  
  document.getElementById("add-to-list-confirm").style.display = "inline";
  setTimeout(() => {
    document.getElementById("add-to-list-confirm").style.display = "none";
  }, 5000)
}

// Function to delete row in list.
function deleteRow() {
  let td = event.target.parentNode;
  var tr = td.parentNode;
  tr.parentNode.removeChild(tr);
}