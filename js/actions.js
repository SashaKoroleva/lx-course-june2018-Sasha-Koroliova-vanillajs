var ordersNode = document.querySelector(".all-orders");
var sideBarInput = document.querySelector("#searchOrder");
var sideBarSearchButton = document.querySelector(".search-for-order");
var updateButton = document.querySelector(".refresh-orders");
var truckButton = document.querySelector(".address-info");
var humanButton = document.querySelector(".client-info");
var table = document.querySelector("table");
var tableInput = document.querySelector("#searchProduct");

ordersNode.addEventListener("click", showDetail);
sideBarInput.addEventListener("keyup", searchOrder );
sideBarSearchButton.addEventListener("click",searchOrder);
updateButton.addEventListener("click", updateSideBar);
truckButton.addEventListener("click", shipToState);
humanButton.addEventListener("click", clientInfoState);
table.addEventListener("click", identifyClick );
tableInput.addEventListener("keyup",searchProduct);

displaySideBar(Orders);
displayOrder(Orders[0]);
ordersNode.firstElementChild.classList.add("selected-order");