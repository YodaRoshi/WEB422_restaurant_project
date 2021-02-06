/*********************************************************************************
 * WEB422 – Assignment 2
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: _Yasuaki Toyoda_ Student ID: _148584170_ Date: _Feb 5th,2021_
 *
 *
 ********************************************************************************/

// An empty array that will hold restaurant data
let restaurantData = [];

// Holds a restaurant data
let currentRestaurant = {};

// Current page number
let page = 1;

// The number of items shown per page
const perPage = 10;

// Leaflet "map" object)
let map = null;
// Calicurates average grade
let avg = (grades) => {
    let newArray = grades.map((grade) => {
        return grade.score;
    });
    return newArray.reduce((a, b) => a + b) / newArray.length;
};

// Table row template
const tableRows = _.template(
    `<% _.forEach(restaurantData, function(restaurants) { %>
        <tr data-id=<%- restaurants._id %>>
            <td><%- restaurants.name %></td> .
            <td><%- restaurants.cuisine %></td>
            <td><%- restaurants.address.building %> <%- restaurants.address.street %></td>
            <td><%- avg(restaurants.grades).toFixed(2) %></td>
            
        </tr>
    <% }); %>`
);

// Populates the table
function loadRestaurantData() {
    fetch(
        //GET
        `https://calm-coast-35236.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`
    )
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            restaurantData = json;
            let rows = tableRows(restaurantData);
            $("tbody").html(rows);
            $("#current-page").html(page);
        });
}
// Executed when the document is ready
$(function () {
    loadRestaurantData();
});
// Executed when a particular restaurant is clicked, pulling more details out of restaurantData
$("#restaurant-table").on("click", "tr", function (e) {
    let thisId = $(this).attr("data-id"); // obtain the "data-id" value
    currentRestaurant = new Object(
        restaurantData.find(({ _id }) => _id == thisId)
    );
    $("h4.modal-title").html(`${currentRestaurant.name}`);
    $("#restaurant-address").html(
        ` ${currentRestaurant.address.building} ${currentRestaurant.address.street} `
    );

    $("#restaurant-modal").modal({
        backdrop: "static", // 	Includes a modal-backdrop element. Alternatively, specify static for a backdrop which doesn't close the modal on click.
        keyboard: false, //Closes the modal when escape key is pressed
    });
});
// go to the previus page
$("#previous-page").on("click", function (e) {
    if (page > 1) page--;

    loadRestaurantData();
});

// go to the next page
$("#next-page").on("click", function (e) {
    page++;
    loadRestaurantData();
});
// Excuted when modal is ready displaying the selected restaurantlocation on Map
$("#restaurant-modal").on("shown.bs.modal", function () {
    map = new L.Map("leaflet", {
        center: [
            currentRestaurant.address.coord[1],
            currentRestaurant.address.coord[0],
        ],
        zoom: 18,
        layers: [
            new L.TileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ),
        ],
    });
    L.marker([
        currentRestaurant.address.coord[1],
        currentRestaurant.address.coord[0],
    ]).addTo(map);
});
// Excuted when the modal is closed reseting the map object for the next cycle
$("#restaurant-modal").on("hidden.bs.modal", function () {
    map = map.remove();
});
