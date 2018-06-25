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