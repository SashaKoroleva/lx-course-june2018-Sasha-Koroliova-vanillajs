/**
 * Controller class. Orchestrates the model and view objects. A "glue" between them.
 *
 * @param {View} view view instance.
 * @param {Model} model model instance.
 *
 * @constructor
 */
function Controller(view, model) {

    /**
     * Initialize controller.
     *
     * @public
     */
    this.init = function () {

        this._onUpdateClick();

        var ordersNode = view.getOrdersNode();
        var orderSearchButton = view.getOrderSearchButton();
        var updateButton = view.getUpdateButton();
        var truckButton = view.getTruckButton();
        var clientButton = view.getClientButton();
        var productSearchButton = view.getProductSearchButton();
        var mapButton = view.getMapButton();
        var createProductButton = view.getCreateProductButton();
        var deleteOrderButton = view.getDeleteOrderButton();
        var createOrderButton = view.getCreateOrderButton();
        var editButton = view.getEditButton();
        var saveButton = view.getSaveButton();
        var productList = view.getProductList();
        var headOfProductList = view.getHeadOfProductList();
        var closeProductFormButton = view.getCloseProductFormButton();
        var closeOrderFormButton = view.getCloseOrderFormButton();

        orderSearchButton.addEventListener("click", this._onOrderSearchClick);
        updateButton.addEventListener("click", this._onUpdateClick);
        ordersNode.addEventListener("click", this._onOrdersNodeClick);
        truckButton.addEventListener("click", this._onTruckClick);
        clientButton.addEventListener("click", this._onClientClick);
        mapButton.addEventListener("click", this._onMapClick);
        createProductButton.addEventListener("click", this._onCreateProductClick);
        deleteOrderButton.addEventListener("click", this._onDeleteOrderClick);
        createOrderButton.addEventListener("click", this._onCreateOrderClick);
        productSearchButton.addEventListener("click", this._onProductSearchClick);
        editButton.addEventListener("click", this._onEditClick);
        saveButton.addEventListener("click", this._onSaveClick);
        productList.addEventListener("click", this._onDeleteProductClick);
        headOfProductList.addEventListener("click", this._onSortClick);
        closeOrderFormButton.addEventListener("click", this._onCloseOrderFormClick);
        closeProductFormButton.addEventListener("click", this._onCloseProductFormClick);

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
        model
            .fetchOrders()
            .then(function (orders) {
                if (orders.length) {
                    model
                        .fetchProducts(orders[0].id)
                        .then(function (products) {
                            view.displaySideBar(orders);
                            view.displayOrder(orders[0], products);
                            view.selectFirstOrder();
                            view.toggleClasses("truckButton");
                        });
                } else {
                    view.reportThereNoOrders();
                }
            });

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
        var selectedOrder = Array.from(event.path).filter(function (item, index) {
            if (index < 5) {
                return item.classList.contains("order-item");
            }
            return false;
        });
        if (selectedOrder) {
            view.removeClass("selected-order", ".order-item");
            view.addClass(selectedOrder[0], "selected-order");
            model
                .fetchOrder(selectedOrder[0].id)
                .then(function (order) {
                    model
                        .fetchProducts(selectedOrder[0].id)
                        .then(function (products) {
                            view.displayOrder(order, products);
                            view.toggleClasses("truckButton");
                        });
                });
        }
    };
    /**
     * Shows shipping address, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onTruckClick = function () {
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
    this._onClientClick = function () {
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
        var form = view.getProductCreationForm();
        var values = view.getValuesFromForm(form);

        if (model.checkFormValues(values)) {
            var flawNumbers = model.findFlaws(values);
            view.reportFlaws(flawNumbers, form);
        } else {
            var orderId = view.getIdOfSelectedOrder();
            var product = model.handleProductData(orderId, values);
            model
                .sendProduct(orderId, product)
                .then(function () {
                    model
                        .fetchProducts(orderId)
                        .then(function (products) {
                            view.displayProducts(products);
                            view.getCloseProductFormButton().click();
                            view.clearForm(view.getProductCreationForm());
                        });
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
        var form = view.getOrderCreationForm();
        var values = view.getValuesFromForm(form);

        if (model.checkFormValues(values)) {
            var flawNumbers = model.findFlaws(values);
            view.reportFlaws(flawNumbers, form);
        } else {
            var order = model.handleOrderData(values);
            model
                .sendOrder(order)
                .then(function () {
                    model
                        .fetchOrders()
                        .then(function (orders) {
                            if (orders.length === 1) {
                                model
                                    .fetchProducts(orders[0].id)
                                    .then(function (products) {
                                        view.displaySideBar(orders);
                                        view.displayOrder(orders[0], products);
                                        view.paintOrder();
                                    })
                            } else {
                                view.displaySideBar(orders);
                                view.paintOrder();
                            }
                            view.getCloseOrderFormButton().click();
                            view.clearForm(view.getOrderCreationForm());
                        });
                });
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
        model
            .deleteOrder(orderId)
            .then(function () {
                model
                    .fetchOrders()
                    .then(function (orders) {
                        if (orders.length) {
                            model
                                .fetchProducts(orders[0].id)
                                .then(function (products) {
                                    view.displaySideBar(orders);
                                    view.displayOrder(orders[0], products);
                                    view.selectFirstOrder();
                                });
                        } else {
                            view.displaySideBar(orders);
                            view.reportThereNoOrders();

                        }
                    });
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
            var productId = event.target.id;
            var orderId = view.getIdOfSelectedOrder();
            model.deleteProduct(productId, orderId);
            model
                .fetchOrder(orderId)
                .then(function (order) {
                    model
                        .fetchProducts(orderId)
                        .then(function (products) {
                            view.displayOrder(order, products);
                        });
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
        var newInfo;
        var form = view.getInfoForm();
        var idOfInfoOrder = view.getIdOfInfoAboutOrder();
        var values = view.getValuesFromForm(form);


        if (model.checkFormValues(values)) {
            var flawNumbers = model.findFlaws(values);
            view.reportFlaws(flawNumbers, form);
        } else {
            if (idOfInfoOrder === "address") {
                newInfo = model.handleAddressData(values);
            } else {
                newInfo = model.handleClientData(values);
            }

            model
                .putEditData(orderId, newInfo)
                .then(function () {
                    model
                        .fetchOrder(orderId)
                        .then(function (order) {
                            model.fetchProducts(orderId)
                                .then(function (products) {
                                    view.displayOrder(order, products);
                                    view.changeButtons(view.getEditButton(), view.getSaveButton());
                                    if (idOfInfoOrder === "client") {
                                        view.displayClientInfo(order);
                                    }
                                });
                        });
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
        view.clearForm(view.getProductCreationForm());
    };
    /**
     * Clears form fields when closing, button click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onCloseOrderFormClick = function () {
        view.clearForm(view.getOrderCreationForm());
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
                    view.displayProducts(model.sortProducts(view.getProductsFromTable(), options[0], options[1], options[2]));
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
                var sortItem = view.checkSortIsOn();

                if (sortItem != null) {
                    var options = view.defineSortingOptions(sortItem);
                    view.displayProducts(model.sortProducts(rightProducts, options[0], options[1], options[2]));
                } else {
                    view.displayProducts(model.searchProducts(products, productSearchInput.value));
                }
            });
    };


}

(new Controller(new View, new Model)).init();