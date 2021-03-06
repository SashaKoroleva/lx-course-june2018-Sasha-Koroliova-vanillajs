/**
 * Controller class. Orchestrates the model and view objects. A "glue" between them.
 *
 * @param {View} view view instance.
 * @param {PopupView} popupView popupView instance.
 * @param {Model} model model instance.
 *
 * @constructor
 */
function Controller(view, popupView, model) {

    /**
     * Working array-copy of products.
     * @type {Object[]}
     *
     * @private
     */
    var _currentProducts;

    /**
     * Initialize controller.
     *
     * @public
     */
    this.init = function () {
        this._onUpdateClick();
        this._declareEventHandlers();
    };

    /**
     * Searches for an order, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onOrderSearchClick = function () {
        model
            .fetchOrders()
            .then(function (orders) {
                var orderSearchInput = view.getOrderSearchInput();
                view.displaySideBar(model.searchOrder(orders, orderSearchInput.value));
            });
    };
    /**
     * Updates order list, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onUpdateClick = function () {

        var receivedOrders;
        model
            .fetchOrders()
            .then(function (orders) {
                if (orders.length) {
                    receivedOrders = orders;
                    return model.fetchProducts(orders[0].id);
                } else {
                    view.reportThereNoOrders();
                }
            })
            .then(function (products) {
                _currentProducts = products;
                view.displaySideBar(receivedOrders);
                view.displayOrder(receivedOrders[0], products);
                view.selectFirstOrder();
                view.toggleClasses("truckButton");
            })
    };
    /**
     * Shows details of selected order, button click event handler.
     *
     * @listens click
     *
     * @param {Event} event the DOM event object.
     *
     * @private
     */
    this._onOrdersNodeClick = function (event) {
        var receivedOrder;
        var selectedOrder = Array.from(event.path).find(function (item) {
            return item.classList.contains("order-item")
        });

        if (selectedOrder) {
            view.removeClass("selected-order", ".order-item");
            view.addClass(selectedOrder, "selected-order");
            model
                .fetchOrder(selectedOrder.id)
                .then(function (order) {
                    receivedOrder = order;
                    return model.fetchProducts(selectedOrder.id)
                })
                .then(function (products) {
                    _currentProducts = products;
                    view.displayOrder(receivedOrder, products);
                    view.toggleClasses("truckButton");
                    view.removeClass("sorted-by", ".fas");
                })

        }
    };
    /**
     * Shows shipping address, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onAddressInfoClick = function () {
        var orderId = view.getIdOfSelectedOrder();
        model
            .fetchOrder(orderId)
            .then(function (order) {
                view.displayShipTo(order);
                view.toggleClasses("truckButton");
            });
    };
    /**
     * Shows info about client, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onClientInfoClick = function () {
        var orderId = view.getIdOfSelectedOrder();
        model
            .fetchOrder(orderId)
            .then(function (order) {
                view.displayClientInfo(order);
                view.toggleClasses("clientButton")
            });
    };
    /**
     * Shows address on map, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onMapClick = function () {
        model
            .fetchOrder(view.getIdOfSelectedOrder())
            .then(function (order) {
                view.displayMap();
                model.getMapWithCoordinates(order.shipTo.address, order.shipTo.region, order.shipTo.country);
                view.toggleClasses("mapButton");
            });
    };
    /**
     * Creates a product, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onCreateProductClick = function () {
        var form = popupView.getProductCreationForm();
        var values = popupView.getFormValues(form);

        if (model.checkFormValues(values)) {
            var flawNumbers = model.findFlaws(values);
            popupView.reportFlaws(flawNumbers, form);
        } else {
            var orderId = view.getIdOfSelectedOrder();
            var product = model.serializeProductData(orderId, values);
            model
                .createProduct(orderId, product)
                .then(function () {
                    return model.fetchProducts(orderId)
                })
                .then(function (products) {
                    _currentProducts = products;
                    view.displayProducts(products);
                    popupView.deleteProductWindow(view.getBody());
                });
        }
    };
    /**
     * Creates an order, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onCreateOrderClick = function () {
        var form = popupView.getOrderCreationForm();
        var values = popupView.getFormValues(form);

        if (model.checkFormValues(values)) {
            var flawNumbers = model.findFlaws(values);
            popupView.reportFlaws(flawNumbers, form);
        } else {
            var order = model.serializeOrderData(values);
            model
                .createOrder(order)
                .then(function () {
                    return model.fetchOrders();
                })
                .then(function (orders) {
                    view.displaySideBar(orders);
                    popupView.deleteOrderWindow(view.getBody());
                    if (orders.length === 1) {
                        view.displayOrder(orders[0], []);
                        _currentProducts = [];
                    }
                    view.highlightOrder();
                })
        }
    };
    /**
     * Deletes an order, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onDeleteOrderClick = function () {
        var orderId = view.getIdOfSelectedOrder();
        var receivedOrders;
        model
            .deleteOrder(orderId)
            .then(function () {
                return model.fetchOrders();
            })
            .then(function (orders) {
                if (orders.length) {
                    receivedOrders = orders;
                    return model.fetchProducts(orders[0].id);
                } else {
                    view.displaySideBar(orders);
                    view.reportThereNoOrders();
                }
            })
            .then(function (products) {
                _currentProducts = products;
                view.displaySideBar(receivedOrders);
                view.displayOrder(receivedOrders[0], products);
                view.selectFirstOrder();
            });
    };
    /**
     * Deletes a product, button click event handler.
     *
     * @listens click
     *
     * @param {Event} event the DOM event object.
     *
     * @private
     */
    this._onDeleteProductClick = function (event) {
        if (event.target.classList.contains("deleteProduct")) {
            var receivedOrder;
            var productId = event.target.id;
            var orderId = view.getIdOfSelectedOrder();
            model.deleteProduct(productId, orderId);
            model
                .fetchOrder(orderId)
                .then(function (order) {
                    receivedOrder = order;
                    return model.fetchProducts(orderId)
                })
                .then(function (products) {
                    _currentProducts = products;
                    view.displayOrder(receivedOrder, products);
                });
        }
    };
    /**
     * Makes info editable, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onEditClick = function () {
        view.changeButtons(view.getSaveButton(), view.getEditButton());
        view.makeDataEditable();
    };
    /**
     * Saves changed info, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onSaveClick = function () {
        var orderId = view.getIdOfSelectedOrder();
        var newInfo, receivedOrder;
        var form = view.getInfoForm();
        var idOfInfoOrder = view.getIdOfInfoAboutOrder();
        var values = view.getFormValues(form);
        var client = "client";
        var address = "address";

        if (model.checkFormValues(values)) {
            var flawNumbers = model.findFlaws(values);
            view.reportFlaws(flawNumbers, form);
        } else {
            if (idOfInfoOrder === address) {
                newInfo = model.serializeAddressData(values);
            } else {
                newInfo = model.serializeClientData(values);
            }

            model
                .changeOrderInfo(orderId, newInfo)
                .then(function () {
                    return model.fetchOrder(orderId)
                })
                .then(function (order) {
                    receivedOrder = order;
                    return model.fetchProducts(orderId)
                })
                .then(function (products) {
                    view.displayOrder(receivedOrder, products);
                    view.changeButtons(view.getEditButton(), view.getSaveButton());
                    if (idOfInfoOrder === client) {
                        view.displayClientInfo(receivedOrder);
                    }
                });
        }
    };
    /**
     * Clears form fields when closing, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onCloseProductFormClick = function () {
        popupView.deleteProductWindow(view.getBody());
    };
    /**
     * Clears form fields when closing, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onCloseOrderFormClick = function () {
        popupView.deleteOrderWindow(view.getBody());
    };
    /**
     * Sorts products, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onSortClick = function (event) {
        if (event.target.classList.contains("fa-caret-up") || event.target.classList.contains("fa-caret-down")) {
            view.removeClass("sorted-by", ".fas");
            var options = view.defineSortingOptions(event.target);
            view.displayProducts(model.sortProducts(_currentProducts, options[0], options[1], options[2]));
            event.target.classList.add("sorted-by");
        }
    };
    /**
     * Searches for a product, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onProductSearchClick = function () {
        model
            .fetchProducts(view.getIdOfSelectedOrder())
            .then(function (products) {
                var productSearchInput = view.getProductSearchInput();
                var rightProducts = model.searchProducts(products, productSearchInput.value);
                _currentProducts = rightProducts;
                var sortItem = view.checkSortIsOn();

                if (sortItem != null) {
                    var options = view.defineSortingOptions(sortItem);
                    view.displayProducts(model.sortProducts(rightProducts, options[0], options[1], options[2]));
                } else {
                    view.displayProducts(model.searchProducts(products, productSearchInput.value));
                }
            });
    };
    /**
     * Creates a window for creating an order.
     *
     * @private
     */
    this._onOpenOrderFormClick = function () {
        popupView.displayOrderWindow(view.getBody());
        var createOrderButton = popupView.getCreateOrderButton();
        createOrderButton.addEventListener("click", this._onCreateOrderClick);
        var closeOrderFormButton = popupView.getCloseOrderFormButton();
        closeOrderFormButton.addEventListener("click", this._onCloseOrderFormClick);
    };
    /**
     * Creates a window for creating a product.
     *
     * @private
     */
    this._onOpenProductFormClick = function () {
        popupView.displayProductWindow(view.getBody());
        var createProductButton = popupView.getCreateProductButton();
        createProductButton.addEventListener("click", this._onCreateProductClick);
        var closeProductFormButton = popupView.getCloseProductFormButton();
        closeProductFormButton.addEventListener("click", this._onCloseProductFormClick);
    };
    /**
     * Declares event handlers.
     *
     * @private
     */
    this._declareEventHandlers = function () {
        var ordersNode = view.getOrdersNode();
        var orderSearchButton = view.getOrderSearchButton();
        var updateButton = view.getUpdateButton();
        var truckButton = view.getTruckButton();
        var clientButton = view.getClientButton();
        var productSearchButton = view.getProductSearchButton();
        var mapButton = view.getMapButton();
        var deleteOrderButton = view.getDeleteOrderButton();
        var editButton = view.getEditButton();
        var saveButton = view.getSaveButton();
        var productList = view.getProductList();
        var headOfProductList = view.getHeadOfProductList();
        var openOrderFormButton = view.getOpenOrderFormButton();
        var openProductFormButton = view.getOpenProductFormButton();

        orderSearchButton.addEventListener("click", this._onOrderSearchClick);
        updateButton.addEventListener("click", this._onUpdateClick);
        ordersNode.addEventListener("click", this._onOrdersNodeClick);
        truckButton.addEventListener("click", this._onAddressInfoClick);
        clientButton.addEventListener("click", this._onClientInfoClick);
        mapButton.addEventListener("click", this._onMapClick);
        deleteOrderButton.addEventListener("click", this._onDeleteOrderClick);
        productSearchButton.addEventListener("click", this._onProductSearchClick);
        editButton.addEventListener("click", this._onEditClick);
        saveButton.addEventListener("click", this._onSaveClick);
        productList.addEventListener("click", this._onDeleteProductClick);
        headOfProductList.addEventListener("click", this._onSortClick);
        openOrderFormButton.addEventListener("click", this._onOpenOrderFormClick.bind(this));
        openProductFormButton.addEventListener("click", this._onOpenProductFormClick.bind(this));

    };

}

/**
 * Model class. Knows everything about API endpoint and data structure. Can format/map data to any structure.
 *
 * @constructor
 */
function Model() {

    var _apiPrefix = "http://localhost:3000/api/Orders/";
    /**
     * URL template for getting products from service.
     * @type {string}
     *
     * @example _productsURLTemplate.replace("{ORDER}", orderId);
     *
     * @private
     */
    var _productsURLTemplate = _apiPrefix + "{ORDER}/products";
    /**
     * URL template for getting an order from service.
     * @type {string}
     *
     * @example _orderURLTemplate.replace("{ORDER}", orderId);
     *
     * @private
     */
    var _orderURLTemplate = _apiPrefix + "{ORDER}";

    /**
     * Common method which "promisifies" the XHR calls.
     *
     * @param {string} method the HTTP method name string.
     * @param {string} url the URL address to request.
     * @param {string} data a JSON string.
     *
     * @return {Promise} the promise object will be resolved once XHR gets loaded/failed.
     *
     * @public
     */
    this.request = function (method, url, data) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();

            req.open(method, url, true);

            req.addEventListener("load", function () {
                if (req.status < 400) {
                    resolve(JSON.parse(req.responseText));
                } else {
                    reject(new Error("Request failed: " + req.statusText));
                }
            });

            req.addEventListener("error", function () {
                reject(new Error("Network error"));
            });

            req.setRequestHeader('Content-Type', 'application/json');

            if (data === null) {
                req.send();
            } else {
                req.send(data);
            }

        });
    };
    /**
     * Fetches all of orders.
     *
     * @returns {Promise} the promise object will be resolved once orders array gets loaded.
     *
     * @public
     */
    this.fetchOrders = function () {
        return this.request("GET", _apiPrefix, null)
    };
    /**
     * Fetches an order.
     *
     * @returns {Promise} the promise object will be resolved once order object gets loaded.
     *
     * @public
     */
    this.fetchOrder = function (orderId) {
        return this.request("GET", _orderURLTemplate.replace("{ORDER}", orderId), null);
    };
    /**
     * Fetches products of one order.
     *
     * @returns {Promise} the promise object will be resolved once products array gets loaded.
     *
     * @public
     */
    this.fetchProducts = function (orderId) {
        return this.request("GET", _productsURLTemplate.replace("{ORDER}", orderId), null)
    };
    /**
     * Makes a request for the addition of an order.
     *
     * @param {string} order a JSON string to be sent.
     *
     * @returns {Promise} the promise object will be resolved once sending the JSON string.
     *
     * @public
     */
    this.createOrder = function (order) {
        return this.request("POST", _apiPrefix, order);
    };
    /**
     * Makes a request for the addition of an product.
     *
     * @param {string} orderId id of order string.
     * @param {string} product a JSON string to be sent.
     *
     * @returns {Promise} the promise object will be resolved once sending the JSON string.
     *
     * @public
     */
    this.createProduct = function (orderId, product) {
        return this.request("POST", _productsURLTemplate.replace("{ORDER}", orderId), product);
    };
    /**
     * Make a request to change order info.
     *
     * @param {string} orderId id of order string.
     * @param {string} newInfo a JSON string to be sent.
     *
     * @returns {Promise} the promise object will be resolved once sending the JSON string.
     *
     * @public
     */
    this.changeOrderInfo = function (orderId, newInfo) {
        return this.request("PUT", _orderURLTemplate.replace("{ORDER}", orderId), newInfo);
    };
    /**
     * Makes a request to delete an order.
     *
     * @param {string} orderId id of order string.
     *
     * @returns {Promise} the promise object will be resolved once deletion of order.
     *
     * @public
     */
    this.deleteOrder = function (orderId) {
        return this.request("DELETE", _orderURLTemplate.replace("{ORDER}", orderId), null);
    };
    /**
     * Makes a request to delete a product.
     *
     * @param {string} productId id of product string.
     * @param {string} orderId id of order string.
     *
     * @returns {Promise} the promise object will be resolved once deletion of product.
     *
     * @public
     */
    this.deleteProduct = function (productId, orderId) {
        return this.request("DELETE", _productsURLTemplate.replace("{ORDER}", orderId) + "/" + productId, null);
    };
    /**
     * Processes and converts product data to JSON string .
     *
     * @param {string} orderId the order id string.
     * @param {string[]} productData array of product data.
     *
     * @returns {string} a JSON string representing the given value.
     *
     * @public
     */
    this.serializeProductData = function (orderId, productData) {
        var product = {
            "name": productData[0],
            "price": Number(productData[1]),
            "currency": productData[3],
            "quantity": Number(productData[2]),
            "totalPrice": Number(productData[1]) * Number(productData[2]),
            "orderId": Number(orderId)
        };
        return JSON.stringify(product);
    };
    /**
     * Processes and converts order data to JSON string .
     *
     * @param {string[]} orderData array of order data.
     *
     * @returns {string} a JSON string representing the given value.
     *
     * @public
     */
    this.serializeOrderData = function (orderData) {
        var order = {
            "summary": {
                "createdAt": new Date(),
                "customer": orderData[0],
                "status": "pending",
                "shippedAt": new Date(),
                "totalPrice": 0,
                "currency": orderData[8]
            },
            "shipTo": {
                "name": orderData[1],
                "address": orderData[4],
                "ZIP": orderData[5],
                "region": orderData[6],
                "country": orderData[7]
            },
            "customerInfo": {
                "firstName": orderData[1].split(" ")[0],
                "lastName": orderData[1].split(" ")[1],
                "address": orderData[4],
                "phone": orderData[2],
                "email": orderData[3]
            }
        };
        return JSON.stringify(order);

    };
    /**
     * Processes and converts client data to JSON string .
     *
     * @param {string[]} clientData array of client data.
     *
     * @returns {string} a JSON string representing the given value.
     *
     * @public
     */
    this.serializeClientData = function (clientData) {
        var client = {
            "customerInfo": {
                "firstName": clientData[0],
                "lastName": clientData[1],
                "address": clientData[2],
                "phone": clientData[3],
                "email": clientData[4]
            }
        };
        return JSON.stringify(client);

    };
    /**
     * Processes and converts address data to JSON string .
     *
     * @param {string[]} addressData array of address data.
     *
     * @returns {string} a JSON string representing the given value.
     *
     * @public
     */
    this.serializeAddressData = function (addressData) {
        var address = {
            "shipTo": {
                "name": addressData[0],
                "address": addressData[1],
                "ZIP": addressData[2],
                "region": addressData[3],
                "country": addressData[4]
            }
        };
        return JSON.stringify(address);
    };
    /**
     * Receives a map with required coordinates.
     *
     * @param {string} street street name string.
     * @param {string} region region name string.
     * @param {string} country country name string.
     *
     * @public
     */
    this.getMapWithCoordinates = function (street, region, country) {

        ymaps.ready(function () {
            var map;
            var geocoder = ymaps.geocode(street + " " + region + " " + country);

            geocoder
                .then(function (result) {
                    var coordinates = result.geoObjects.get(0).geometry.getCoordinates();
                    map = new ymaps.Map("YMapsID", {
                        center: coordinates,
                        zoom: 13
                    });
                    map.controls.add('zoomControl');
                    map.geoObjects.add(new ymaps.Placemark(coordinates));
                });
        });
    };
    /**
     * Checks for empty strings presence in form values.
     *
     * @param {string[]} values array of values from form.
     *
     * @returns {boolean} returns boolean.
     *
     * @public
     */
    this.checkFormValues = function (values) {

        for (var i = 0; i < values.length; i++) {
            if (values[i].trim().length === 0) {
                return true;
            }
        }
        return false;
    };
    /**
     * Finds input numbers with flaws.
     *
     * @param {string[]} values array of values from form.
     *
     * @returns {number[]} returns array of flaw number.
     *
     * @public
     */
    this.findFlaws = function (values) {
        var flawNumbers = [];
        values.filter(function (value, number) {
            if (value === "" || value === " ") {
                flawNumbers.push(number);
                return true;
            }
            return false;
        });
        return flawNumbers;
    };
    /**
     * Selects appropriate orders.
     *
     * @param {Object[]} orders array of orders.
     * @param {string} value the value of string in input.
     *
     * @returns {Object[]} returns the array of appropriate orders.
     *
     * @public
     */
    this.searchOrder = function (orders, value) {
        return orders.filter(function (order) {
            for (var key in order.summary) {
                if (key !== "totalPrice" && key !== "currency") {
                    if (key === "shippedAt" || key === "createdAt") {
                        if (order.summary[key].substr(0, 10).toUpperCase().indexOf(value.toUpperCase()) !== -1) {
                            return true;
                        }
                    }
                    else if (order.summary[key].toUpperCase().indexOf(value.toUpperCase()) !== -1) {
                        return true;
                    }
                }
            }
            return false;
        });
    };
    /**
     * Selects appropriate products.
     *
     * @param {Object[]} products array of products.
     * @param {string} value the value of string in input.
     *
     * @returns {Object[]} returns the array of appropriate products.
     *
     * @public
     */
    this.searchProducts = function (products, value) {

        return products.filter(function (product) {

            for (var key in product) {
                if (String(product[key]).toUpperCase().indexOf(value.toUpperCase()) !== -1) {
                    return true;
                }
            }
            return false;

        });
    };
    /**
     * Sorts products.
     *
     * @param {Object[]} products array of products.
     * @param {string} property product property string by which the products will be sorted.
     * @param {string} type string of the type of the value to be sorted.
     * @param {string} orderOf sort order name string.
     *
     * @returns {Object[]} returns sorted array of products.
     *
     * @public
     */
    this.sortProducts = function (products, property, type, orderOf) {
        var comparator;
        var ascending = "ascending";
        var descending = "descending";

        if (type === "number") {
            switch (orderOf) {
                case descending :
                    comparator = function (a, b) {
                        return parseInt(b[property], 10) - parseInt(a[property], 10);
                    };
                    break;
                case ascending:
                    comparator = function (a, b) {
                        return parseInt(a[property], 10) - parseInt(b[property], 10);
                    };
                    break;

            }
        }
        else {
            switch (orderOf) {
                case descending :
                    comparator = function (a, b) {
                        return a[property] < b[property];
                    };
                    break;
                case ascending:
                    comparator = function (a, b) {
                        return a[property] > b[property];
                    };
                    break;
            }
        }

        return products.sort(comparator);

    };

}

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

/**
 * PopupView class. Knows everything about dom & manipulation connected with popups and a little bit about data structure, which should be
 * filled into UI element.
 *
 * @constructor
 */
function PopupView() {

    /**
     * Displays a window for creating an order.
     *
     * @param {Element} body thw HTMLElement in which the window will be inserted.
     *
     * @public
     */
    this.displayOrderWindow = function (body) {
        var link = document.querySelector("link[href*=orderCreationWindow]");
        var template = link.import.querySelector("#orderWindow");
        var clone = document.importNode(template, true);

        body.insertBefore(clone, body.children[0])
    };
    /**
     * Displays a window for creating a product.
     *
     * @param {Element} body thw HTMLElement in which the window will be inserted.
     *
     * @public
     */
    this.displayProductWindow = function (body) {
        var link = document.querySelector("link[href*=productCreationWindow]");
        var template = link.import.querySelector("#productWindow");
        var clone = document.importNode(template, true);

        body.insertBefore(clone, body.children[0])
    };
    /**
     * Deletes a window for creating an order.
     *
     * @public
     */
    this.deleteOrderWindow = function (body) {
        body.removeChild(document.querySelector("#orderWindow"));
    };
    /**
     * Deletes a window for creating a product.
     *
     * @public
     */
    this.deleteProductWindow = function (body) {
        body.removeChild(document.querySelector("#productWindow"));
    };
    /**
     * Returns the close order form button.
     *
     * @returns {Element} the HTMLAnchorElement.
     *
     * @public
     */
    this.getCloseOrderFormButton = function () {
        return document.querySelector("#closeOrderCreationWindow");
    };
    /**
     * Returns the close product form button.
     *
     * @returns {Element} the HTMLAnchorElement.
     *
     * @public
     */
    this.getCloseProductFormButton = function () {
        return document.querySelector("#closeProductCreationWindow");
    };
    /**
     * Returns the product creation form.
     *
     * @returns {Element} the HTMLFormElement.
     *
     * @public
     */
    this.getProductCreationForm = function () {
        return document.querySelector("#productForm");
    };
    /**
     * Returns the order creation form.
     *
     * @returns {Element} the HTMLFormElement.
     *
     * @public
     */
    this.getOrderCreationForm = function () {
        return document.querySelector("#orderForm");
    };
    /**
     * Returns the create order button.
     *
     * @returns {Element} the HTMLAnchorElement.
     *
     * @public
     */
    this.getCreateOrderButton = function () {
        return document.querySelector("#createOrderButton");
    };
    /**
     * Returns the create product button.
     *
     * @returns {Element} the HTMLAnchorElement.
     *
     * @public
     */
    this.getCreateProductButton = function () {
        return document.querySelector("#createProductButton");
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

}
