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