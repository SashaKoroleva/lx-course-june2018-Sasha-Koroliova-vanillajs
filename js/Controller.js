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

(new Controller(new View, new PopupView, new Model)).init();