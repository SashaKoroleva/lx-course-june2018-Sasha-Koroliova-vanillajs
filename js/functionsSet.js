function displaySideBar(Orders) {
    var ordersNode = document.querySelector(".all-orders");

    for (var i = 0; i < Orders.length; i++) {
        ordersNode.appendChild(createOrderItem(Orders[i]));
    }

}

function createOrderItem(order) {
    var orderItem = document.createElement("div");
    orderItem.className = "order-item";
    orderItem.id = order.id;
    orderItem.innerHTML = '<div><h3>Order <span class="order-number">' + order.id +
        '</span></h3><span class="customer">' + order.OrderInfo.customer +
        '</span><span>Shipped:<span>' + order.OrderInfo.shippedAt +
        '</span></span></div><div><time>' + order.OrderInfo.createdAt +
        '</time><span class="status in-time">' + order.OrderInfo.status +
        '</span></div></div>';

    return orderItem;
}

function displayOrderInfo(order) {

    var orderInfoNode = document.querySelector(".order-title");
    orderInfoNode.innerHTML = '<div><h3>Order ' + order.id +
        '</h3><span class="customer">Customer: ' + order.OrderInfo.customer +
        '</span><span>Ordered: <span>' + order.OrderInfo.createdAt +
        '</span></span><span>Shipped: <span>' + order.OrderInfo.shippedAt +
        '</span></span></div><div><span class="total-price">' + '150,000' + '</span><span>EUR</span></div></div>';
}

function displayShipTo(order) {
    var shipToNode = document.querySelector(".shipping-address");
    shipToNode.innerHTML = '<h3>Shipping address</h3><div><p><span>Name:</span> <span>' + order.ShipTo.name +
        '</span></p><p><span>Street:</span> <span>' + order.ShipTo.Address +
        '</span></p><p><span>ZIP Code/City:</span> <span>' + order.ShipTo.ZIP +
        '</span></p><p><span>Region:</span> <span>' + order.ShipTo.Region +
        '</span></p><p><span>Country:</span> <span>' + order.ShipTo.Country +
        '</span></p></div>';
}

function displayClientInfo(order) {
    var clientInfoNode = document.querySelector(".shipping-address");
    clientInfoNode.innerHTML = '<h3>Client info</h3><div><p><span>Name:</span> <span>' + order.CustomerInfo.firstName +
        '</span></p><p><span>Surname:</span> <span>' + order.CustomerInfo.lastName +
        '</span></p><p><span>Street:</span> <span>' + order.CustomerInfo.address +
        '</span></p><p><span>number:</span> <span>' + order.CustomerInfo.phone +
        '</span></p><p><span>email:</span> <span>' + order.CustomerInfo.email +
        '</span></p></div>';

}

function displayProducts(order) {

    var numOfProductsNode = document.querySelector("#numOfProducts");
    numOfProductsNode.innerHTML = String(order.products.length);

    var productsNode = document.querySelector("tbody");

    var codeHTML = "";

    for (var i = 0; i < order.products.length; i++) {
        codeHTML += '<tr><td><p>' + order.products[i].name + '</p><span>' + order.products[i].id +
            '</span></td><td><span class="price">' + order.products[i].price + '</span> <span>' +
            order.products[i].currency + '</span></td><td><span>' + order.products[i].quantity +
            '</span></td><td><span class="price">' + order.products[i].totalPrice +
            '</span> <span>' + order.products[i].currency + '</span></td></tr>';
    }

    productsNode.innerHTML = codeHTML;

}

function displaySuitableProducts(products) {
    var tbody = document.querySelector("tbody");
    var codeHTML = "";
    for (var i = 0; i < products.length; i++) {
        codeHTML += '<tr><td><p>' + products[i].name + '</p><span>' + products[i].id +
            '</span></td><td><span class="price">' + products[i].price + '</span> <span>' +
            products[i].currency + '</span></td><td><span>' + products[i].quantity +
            '</span></td><td><span class="price">' + products[i].totalPrice +
            '</span> <span>' + products[i].currency + '</span></td></tr>';
    }
    tbody.innerHTML = codeHTML;
}

function displayOrder(order) {
    displayOrderInfo(order);
    displayShipTo(order);
    displayProducts(order);
}

function selectOrderById(id) {
    var order = Orders.filter(function (order) {
        if (order.id === id) {
            return true;
        }
        return false;

    });

    return order[0];
}

function removeClass(nameOfClass, elements) {
    var arrOfElements = document.querySelectorAll(elements);
    arrOfElements.forEach(function (element) {
        element.classList.remove(nameOfClass);
    });
}

function showDetail(event) {

    var target = event.target;

    removeClass("selected-order", ".order-item");

    while (target != ordersNode) {
        if (target.className == "order-item") {

            target.classList.add("selected-order");
            displayOrder(selectOrderById(target.id));
            truckButton.classList.add("selected-first-button");
            humanButton.classList.remove("selected-second-button");

            return;
        }
        target = target.parentNode;
    }

}

function searchOrder() {

    var value = sideBarInput.value;
    ordersNode.innerHTML = "";

    var filteredOrders = Orders.filter(function (order) {
        for (var key in order.OrderInfo) {
            if (order.OrderInfo[key].toUpperCase().indexOf(value.toUpperCase()) !== -1) {
                return true;
            }
        }

        return false;
    });
    displaySideBar(filteredOrders);

    if (value == "") {
        updateSideBar();
    }

}

function updateSideBar() {
    sideBarInput.value = "";
    ordersNode.innerHTML = "";
    displaySideBar(Orders);
    displayOrder(Orders[0]);
    ordersNode.firstElementChild.classList.add("selected-order");
}

function shipToState() {
    var selectOrder = document.querySelector(".selected-order");
    truckButton.classList.add("selected-first-button");
    humanButton.classList.remove("selected-second-button")
    displayShipTo(selectOrderById(selectOrder.id));
}

function clientInfoState() {
    var selectOrder = document.querySelector(".selected-order");
    truckButton.classList.remove("selected-first-button");
    humanButton.classList.add("selected-second-button")
    displayClientInfo(selectOrderById(selectOrder.id));
}

function identifyClick(event) {
    if (event.target.classList.contains("fa-caret-up")) {
        removeClass("sorted-by", ".fas");
        sortTable(event.path[1].cellIndex, event.path[1].getAttribute("data-type"), "1");
        event.target.classList.add("sorted-by");
    }
    else if (event.target.classList.contains("fa-caret-down")) {
        removeClass("sorted-by", ".fas");
        sortTable(event.path[1].cellIndex, event.path[1].getAttribute("data-type"), "-1");
        event.target.classList.add("sorted-by");
    }
}

function sortTable(colNum, type, orderOf) {
    var tbody = document.querySelector("tbody");
    var arrOfRows = [].slice.call(tbody.rows);
    var compare;

    if (type == "number") {
        compare = function (rowA, rowB) {
            return parseInt(rowA.cells[colNum].innerText) - (orderOf) * parseInt(rowB.cells[colNum].innerText);
        };
    } else {
        switch (orderOf) {
            case "-1":
                compare = function (rowA, rowB) {
                    return rowA.cells[colNum].innerHTML < rowB.cells[colNum].innerHTML;
                };
                break;
            case "1":
                compare = function (rowA, rowB) {
                    return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML;
                };
                break;
        }
    }

    arrOfRows.sort(compare);
    table.removeChild(tbody);

    for (var i = 0; i < arrOfRows.length; i++) {
        tbody.appendChild(arrOfRows[i]);
    }
    table.appendChild(tbody);

}

function searchProduct() {
    removeClass("sorted-by", ".fas");
    var value = tableInput.value;
    var selectOrder = document.querySelector(".selected-order");

    var tbody = document.querySelector("tbody");

    tbody.innerHTML = "";

    var select = selectOrderById(selectOrder.id)


    var filteredProducts = select.products.filter(function (product) {

        for (var key in product) {
            if (product[key].toUpperCase().indexOf(value.toUpperCase()) != -1) {
                return true;
            }
        }
        return false;

    });

    displaySuitableProducts(filteredProducts);

}




