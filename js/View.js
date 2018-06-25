/**
 * View class. Knows everything about dom & manipulation and a little bit about data structure, which should be
 * filled into UI element.
 *
 * @constructor
 */
function View() {

    /**
     * Returns the update order list button.
     *
     * @returns {Element} the HTMLAnchorElement.
     *
     * @public
     */
    this.getUpdateButton = function () {
        return document.querySelector("#updateButton");
    };
    /**
     * Returns the delete order button.
     *
     * @returns {Element} the HTMLAnchorElement.
     *
     * @public
     */
    this.getDeleteOrderButton = function () {
        return document.querySelector("#deleteOrder");
    };
    /**
     * Returns the make info editable button.
     *
     * @returns {Element} the button element.
     *
     * @public
     */
    this.getEditButton = function () {
        return document.querySelector("#editButton");
    };
    /**
     * Returns the save changed info button.
     *
     * @returns {Element} the button element.
     *
     * @public
     */
    this.getSaveButton = function () {
        return document.querySelector("#saveButton");
    };
    /**
     * Returns the show shipping address button.
     *
     * @returns {Element} the HTMLAnchorElement.
     *
     * @public
     */
    this.getTruckButton = function () {
        return document.querySelector("#truckButton");
    };
    /**
     * Returns the show info about client button.
     *
     * @returns {Element} the HTMLAnchorElement.
     *
     * @public
     */
    this.getClientButton = function () {
        return document.querySelector("#clientButton");
    };
    /**
     * Returns the show address on map button.
     *
     * @returns {Element} the HTMLAnchorElement.
     *
     * @public
     */
    this.getMapButton = function () {
        return document.querySelector("#mapButton");
    };
    /**
     * Returns the search order button.
     *
     * @returns {Element} the HTMLAnchorElement.
     *
     * @public
     */
    this.getOrderSearchButton = function () {
        return document.querySelector("#orderSearchButton");
    };
    /**
     * Returns the search product button.
     *
     * @returns {Element} the button element.
     *
     * @public
     */
    this.getProductSearchButton = function () {
        return document.querySelector("#productSearchButton");
    };
    /**
     * Returns the order list.
     *
     * @returns {Element} the HTMLElement.
     *
     * @public
     */
    this.getOrdersNode = function () {
        return document.querySelector("#allOrders");
    };
    /**
     * Returns the product list.
     *
     * @returns {Element} the HTMLTableElement.
     *
     * @public
     */
    this.getProductList = function () {
        return document.querySelector("#productList");
    };
    /**
     * Returns the head of product list.
     *
     * @returns {Element} the HTMLTableSectionElement.
     *
     * @public
     */
    this.getHeadOfProductList = function () {
        return document.querySelector("#titleOfProductList");
    };
    /**
     * Returns the body of product list.
     *
     * @returns {Element} the HTMLTableSectionElement.
     *
     * @public
     */
    this.getBodyOfProductList = function () {
        return document.querySelector("#bodyOfProductList");
    };
    /**
     * Returns the search order input.
     *
     * @returns {Element} the HTMLInputElement.
     *
     * @public
     */
    this.getOrderSearchInput = function () {
        return document.querySelector("#searchOrder");
    };
    /**
     * Returns the search product input.
     *
     * @returns {Element} the HTMLInputElement.
     *
     * @public
     */
    this.getProductSearchInput = function () {
        return document.querySelector("#searchProduct");
    };
    /**
     * Returns the info form.
     *
     * @returns {Element} the HTMLFormElement.
     *
     * @public
     */
    this.getInfoForm = function () {
        return document.querySelector("#infoForm");
    };
    /**
     * Returns the array of values from form.
     *
     * @param {Element} form the HTMLFormElement.
     *
     * @returns {string[]} the array of values from form.
     *
     * @public
     */
    this.getFormValues = function (form) {
        var arrOfValues = [];
        for (var i = 0; i < form.length; i++) {
            arrOfValues.push(form[i].value);
        }
        return arrOfValues;
    };
    /**
     * Returns the id of selected order.
     *
     * @returns {string} the String.
     *
     * @public
     */
    this.getIdOfSelectedOrder = function () {
        return document.querySelector("#orderId").getAttribute("data-id");
    };
    /**
     * Returns the id of info about order.
     *
     * @returns {string} the String.
     *
     * @public
     */
    this.getIdOfInfoAboutOrder = function () {
        return this.getInfoAboutOrderNode().children[0].id;
    };
    /**
     * Returns the element where summary info of order is located.
     *
     * @returns {Element} the HTMLDivElement.
     *
     * @public
     */
    this.getOrderTitleNode = function () {
        return document.querySelector("#orderTitle");
    };
    /**
     * Returns the element where info about client or address of order is located.
     *
     * @returns {Element} the HTMLDivElement.
     *
     * @public
     */
    this.getInfoAboutOrderNode = function () {
        return document.querySelector("#infoAboutOrder");
    };
    /**
     * Returns element that contains the number of order products.
     *
     * @returns {Element} the HTMLSpanElement.
     *
     * @public
     */
    this.getNumOfProducts = function () {
        return document.querySelector("#numOfProducts");
    };
    /**
     * Returns element that contains contents of the order.
     *
     * @returns {Element} the HTMLElement.
     *
     * @public
     */
    this.getMainNode = function () {
        return document.querySelector("#main");
    };
    /**
     * Returns element in which the current order information is displayed.
     *
     * @returns {Element} the HTMLDivElement.
     *
     * @public
     */
    this.getOrderWrapper = function () {
        return document.querySelector("#orderWrapper");
    };
    /**
     * Returns the element containing the title.
     *
     * @returns {Element} the HTMLElement.
     *
     * @public
     */
    this.getOrderHeader = function () {
        return document.querySelector("#orderHeader");
    };
    /**
     * Returns tr from thead in product list.
     *
     * @returns {Element} the HTMLTableRowElement.
     *
     * @public
     */
    this.getHeadRow = function () {
        return document.querySelector("#headRow");
    };
    /**
     * Returns the open order creation window button.
     *
     * @returns {Element} the HTMLAnchorElement.
     *
     * @public
     */
    this.getOpenOrderFormButton = function () {
        return document.querySelector("#openOrderCreationWindow");
    };
    /**
     * Returns the open product creation window button.
     *
     * @returns {Element} the HTMLAnchorElement.
     *
     * @public
     */
    this.getOpenProductFormButton = function () {
        return document.querySelector("#openProductCreationWindow");
    };
    /**
     * Returns the body of page.
     *
     * @returns {Element} the HTMLAnchorElement.
     *
     * @public
     */
    this.getBody = function () {
        return document.querySelector("#body");
    };
    /**
     * Displays side bar with orders.
     *
     * @param {Object[]} orders the array of orders.
     *
     * @public
     */
    this.displaySideBar = function (orders) {
        var ordersNode = this.getOrdersNode();
        ordersNode.innerHTML = "";
        for (var i = 0; i < orders.length; i++) {
            ordersNode.appendChild(this.createOrderItem(orders[i]));
        }
    };
    /**
     * Displays summary info about order.
     *
     * @param {Object} order the order object.
     *
     * @public
     */
    this.displayOrderInfo = function (order) {
        var orderInfoNode = this.getOrderTitleNode();
        var link = document.querySelector("link[href*=orderInfo]");
        var template = link.import.querySelector("#orderInfo");
        var clone = document.importNode(template, true);

        clone.innerHTML = clone.innerHTML.replace("{orderId}", order.id);
        clone.innerHTML = clone.innerHTML.replace("{customer}", order.summary.customer);
        clone.innerHTML = clone.innerHTML.replace("{createdAt}", this.formatDate(order.summary.createdAt));
        clone.innerHTML = clone.innerHTML.replace("{shippedAt}", this.formatDate(order.summary.shippedAt));
        clone.innerHTML = clone.innerHTML.replace("{totalPrice}", order.summary.totalPrice);
        clone.innerHTML = clone.innerHTML.replace("{currency}", order.summary.currency);

        clone.children[0].children[0].children[0].setAttribute("data-id", order.id);

        if (orderInfoNode.children[0]) {
            orderInfoNode.replaceChild(clone, orderInfoNode.children[0]);
        } else {
            orderInfoNode.appendChild(clone);
        }
    };
    /**
     * Displays shipping address of order.
     *
     * @param {Object} order the order object.
     *
     * @public
     */
    this.displayShipTo = function (order) {
        var shipToNode = this.getInfoAboutOrderNode();
        var link = document.querySelector("link[href*=shipInfoForm]");
        var template = link.import.querySelector("#address");
        var clone = document.importNode(template, true);

        clone.innerHTML = clone.innerHTML.replace("{name}", order.shipTo.name);
        clone.innerHTML = clone.innerHTML.replace("{address}", order.shipTo.address);
        clone.innerHTML = clone.innerHTML.replace("{ZIP}", order.shipTo.ZIP);
        clone.innerHTML = clone.innerHTML.replace("{region}", order.shipTo.region);
        clone.innerHTML = clone.innerHTML.replace("{country}", order.shipTo.country);

        if (shipToNode.children.length === 1) {
            shipToNode.insertBefore(clone, shipToNode.children[0])
        } else {
            shipToNode.replaceChild(clone, shipToNode.children[0]);
        }
        this.toggleButtons("truckButton");

    };
    /**
     * Displays products of order.
     *
     * @param {Object[]} products the array of products.
     *
     * @public
     */
    this.displayProducts = function (products) {
        this.getOrderHeader().classList.remove("invisibility");
        this.getMainNode().classList.remove("invisibility");
        this.getOrderWrapper().classList.remove("no-orders");

        var numOfProductsNode = this.getNumOfProducts();
        numOfProductsNode.innerHTML = String(products.length);
        var productsNode = this.getBodyOfProductList();
        var codeHTML = "";
        for (var i = 0; i < products.length; i++) {
            codeHTML += '<tr>' +
                    '<td>' +
                        '<p>' + products[i].name + '</p>' +
                        '<span>' + products[i].id + '</span>' +
                    '</td>' +
                    '<td>' +
                        '<span class="price">' + products[i].price + '</span> ' +
                        '<span>' + products[i].currency + '</span>' +
                    '</td>' +
                    '<td>' +
                        '<span>' + products[i].quantity + '</span>' +
                    '</td>' +
                    '<td>' +
                        '<span class="price">' + products[i].totalPrice + '</span> ' +
                        '<span>' + products[i].currency + '</span>' +
                    '</td>' +
                    '<td>' +
                        '<i id="' + products[i].id + '" class="far fa-trash-alt deleteProduct"></i>' +
                    '</td>' +
                '</tr>';
        }
        productsNode.innerHTML = codeHTML;
    };
    /**
     * Displays all order info.
     *
     * @param {Object} order the order object.
     * @param {Object[]} products the array of products.
     *
     * @public
     */
    this.displayOrder = function (order, products) {
        this.displayOrderInfo(order);
        this.displayShipTo(order);
        this.displayProducts(products);
    };
    /**
     * Displays information about the customer.
     *
     * @param {Object} order the order object.
     *
     * @public
     */
    this.displayClientInfo = function (order) {
        var clientInfoNode = this.getInfoAboutOrderNode();
        var link = document.querySelector("link[href*=clientInfoForm]");
        var template = link.import.querySelector("#client");
        var clone = document.importNode(template, true);

        clone.innerHTML = clone.innerHTML.replace("{firstName}", order.customerInfo.firstName);
        clone.innerHTML = clone.innerHTML.replace("{lastName}", order.customerInfo.lastName);
        clone.innerHTML = clone.innerHTML.replace("{address}", order.customerInfo.address);
        clone.innerHTML = clone.innerHTML.replace("{phone}", order.customerInfo.phone);
        clone.innerHTML = clone.innerHTML.replace("{email}", order.customerInfo.email);

        clientInfoNode.replaceChild(clone, clientInfoNode.children[0]);

        this.toggleButtons("clientButton");
    };
    /**
     * Create order item.
     *
     * @param {Object} order the order object.
     *
     * @returns {Element} the HTMLDivElement.
     *
     * @public
     */
    this.createOrderItem = function (order) {
        var link = document.querySelector("link[href*=orderItem]");
        var template = link.import.querySelector(".order-item");
        var orderItem = document.importNode(template, true);
        orderItem.id = order.id;

        orderItem.innerHTML = orderItem.innerHTML.replace("{orderId}", order.id);
        orderItem.innerHTML = orderItem.innerHTML.replace("{customer}", order.summary.customer);
        orderItem.innerHTML = orderItem.innerHTML.replace("{shippedAt}", this.formatDate(order.summary.shippedAt));
        orderItem.innerHTML = orderItem.innerHTML.replace("{createdAt}", this.formatDate(order.summary.createdAt));
        orderItem.innerHTML = orderItem.innerHTML.replace("{status}", order.summary.status);

        orderItem.children[1].children[1].classList.add(this.highlightStatus(order.summary.status));

        return orderItem;
    };
    /**
     * Formats the date
     *
     * @param {string} date the date string.
     *
     * @returns {string} the date string.
     *
     * @public
     */
    this.formatDate = function (date) {
        var formattedDate = new Date(date);
        return formattedDate.getDate() + "." + (formattedDate.getMonth() + 1) + "." + formattedDate.getFullYear();
    };
    /**
     * Adds class, that highlights status depending on value of status.
     *
     * @param {string} status the status string.
     *
     * @returns {string} the css-class string.
     *
     * @public
     */
    this.highlightStatus = function (status) {
        var pendingStstus = "pending",
            acceptedStatus = "accepted";
        return (status === pendingStstus) ? pendingStstus : acceptedStatus;
    };
    /**
     * Removes a class.
     *
     * @param {string} nameOfClass the string of class name to be deleted.
     * @param {string} elements the string of class name by which can find the elements.
     *
     * @public
     */
    this.removeClass = function (nameOfClass, elements) {
        var arrOfElements = document.querySelectorAll(elements);
        arrOfElements.forEach(function (element) {
            element.classList.remove(nameOfClass);
        });
    };
    /**
     * Switches classes to display truck, client and map buttons correctly.
     *
     * @param {string} button the active button name string.
     *
     * @public
     */
    this.toggleClasses = function (button) {

        var clientButton = this.getClientButton();
        var truckButton = this.getTruckButton();
        var mapButton = this.getMapButton();

        switch (button) {
            case "truckButton":
                clientButton.classList.remove("selected-client-info");
                mapButton.classList.remove("selected-address-map");
                truckButton.classList.add("selected-address-info");
                break;
            case "mapButton":
                clientButton.classList.remove("selected-client-info");
                mapButton.classList.add("selected-address-map");
                truckButton.classList.remove("selected-address-info");
                break;
            case "clientButton":
                clientButton.classList.add("selected-client-info");
                mapButton.classList.remove("selected-address-map");
                truckButton.classList.remove("selected-address-info");
                break;
        }

    };
    /**
     * Adds class, that highlights the selected order.
     *
     * @public
     */
    this.highlightOrder = function () {
        var id = this.getIdOfSelectedOrder();
        var selectedOrder = Array.from(this.getOrdersNode().children).filter(function (order) {
            return order.id === id;
        });
        selectedOrder[0].classList.add("selected-order");
    };
    /**
     * Correctly displays buttons depending on conditions.
     *
     * @param {string} button the button name string.
     *
     * @public
     */
    this.toggleButtons = function (button) {
        var editButton = this.getEditButton();
        var saveButton = this.getSaveButton();

        switch (button) {
            case "truckButton":
                if (saveButton.classList.contains("invisibility")) {
                    editButton.classList.remove("invisibility");
                } else {
                    saveButton.classList.add("invisibility");
                    editButton.classList.remove("invisibility");
                }
                break;
            case "mapButton":
                editButton.classList.add("invisibility");
                saveButton.classList.add("invisibility");
                break;
            case "clientButton":
                if (saveButton.classList.contains("invisibility")) {
                    editButton.classList.remove("invisibility");
                } else {
                    saveButton.classList.add("invisibility");
                    editButton.classList.remove("invisibility");
                }
                break;
        }
    };
    /**
     * Replace buttons.
     *
     * @param {Element} appearButton the HTMLButtonElement which should appear.
     * @param {Element} disappearButton the HTMLButtonElement which should disappear.
     *
     * @public
     */
    this.changeButtons = function (appearButton, disappearButton) {
        appearButton.classList.remove("invisibility");
        disappearButton.classList.add("invisibility");
    };
    /**
     * Makes info about customer or shipping address available for edit.
     *
     * @public
     */
    this.makeDataEditable = function () {
        var form = document.querySelector(".edit-form").children;
        for (var i = 0; i < form.length; i++) {
            var input = document.createElement("input");
            input.setAttribute("required", "");
            input.value = form[i].children[1].innerText;
            form[i].replaceChild(input, form[i].children[1]);
        }
    };
    /**
     * Adds class for coloring first order in order list.
     *
     * @public
     */
    this.selectFirstOrder = function () {
        this.getOrdersNode().firstElementChild.classList.add("selected-order");
    };
    /**
     * Adds a class.
     *
     * @param {Element} element the HTMLDivElement.
     * @param {string} nameOfClass the class name string.
     *
     * @public
     */
    this.addClass = function (element, nameOfClass) {
        element.classList.add(nameOfClass);
    };
    /**
     * Creates an element to display map;
     *
     * @public
     */
    this.displayMap = function () {
        var clientInfoNode = this.getInfoAboutOrderNode();
        var div = document.createElement("div");
        div.innerHTML = '<h3>Map</h3><div id="YMapsID" class="map" >';
        clientInfoNode.replaceChild(div, clientInfoNode.children[0]);
        this.toggleButtons("mapButton");
    };
    /**
     * Shows what needs to be filled in the form.
     *
     * @param {number[]} flawNumbers array of flaw numbers.
     * @param {Element} formElement the HTMLFormElement.
     *
     * @public
     */
    this.reportFlaws = function (flawNumbers, formElement) {
        for (var i = 0; i < formElement.length; i++) {
            formElement[i].classList.remove("flaw");
        }
        for (var i = 0; i < flawNumbers.length; i++) {

            formElement[flawNumbers[i]].classList.add("flaw");
            if (formElement.classList.contains("edit-form")) {
                formElement[flawNumbers[i]].placeholder = "Fill me";
            }
        }
    };
    /**
     * Shows there are no orders.
     *
     * @public
     */
    this.reportThereNoOrders = function () {
        this.getOrderHeader().classList.add("invisibility");
        this.getMainNode().classList.add("invisibility");
        this.getOrderWrapper().classList.add("no-orders");
    };
    /**
     * Checks if the sorting in the product list is configured.
     *
     * @returns {Element} the HTMLElement by which the sort is set.
     *
     * @public
     */
    this.checkSortIsOn = function () {

        var sortedBy = null;
        var arrOfTh = this.getHeadRow().children;

        for (var i = 0; i < arrOfTh.length; i++) {
            for (var j = 0; j < arrOfTh[i].children.length; j++) {
                if (arrOfTh[i].children[j].classList.contains("sorted-by")) {
                    sortedBy = arrOfTh[i].children[j];
                    break;
                }

            }
        }

        return sortedBy;

    };
    /**
     * Creates an array of settings for sorting.
     *
     *@param {Element} element the HTMLElement from which the setting values ​​will be taken.
     *
     * @returns {string[]} returns array of sort settings.
     *
     * @public
     */
    this.defineSortingOptions = function (element) {
        var options = [];

        switch (element.parentElement.cellIndex) {
            case 0:
                options.push("name");
                break;
            case 1:
                options.push("price");
                break;
            case 2:
                options.push("quantity");
                break;
            case 3:
                options.push("totalPrice");
        }

        options.push(element.parentElement.getAttribute("data-type"));

        if (element.classList.contains("fa-caret-down")) {
            options.push("descending");
        } else {
            options.push("ascending");
        }

        return options;
    };

}