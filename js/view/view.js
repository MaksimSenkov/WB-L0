import Controller from "../controller/controller.js";

import Accordion from "./elements/Accordion.js";
import Payment from "./elements/Payment.js";

import Summary from "./elements/Summary.js";
import PaymentModal from "./elements/modal/PaymentModal.js";
import DeliveryModal from "./elements/modal/DeliveryModal.js";
import Delivery from "./elements/Delivery.js";
import RecipientForm from "./elements/RecipientForm.js";

export default class View {
    #root;

    #controller;

    #accordionElement;
    #paymentElement;
    #deliveryElement;
    #recipientFormElement;

    #summaryElement;

    #paymentModalElement;
    #deliveryModalElement;

    constructor() {
        this.#root = document.getElementById("root");

        this.#controller = new Controller();

        this.#accordionElement = new Accordion(document.getElementById("accordion"));
        this.#paymentElement = new Payment(document.getElementById("payment"));
        this.#deliveryElement = new Delivery(document.getElementById("delivery"));
        this.#recipientFormElement = new RecipientForm(document.getElementById("recipientForm"));

        this.#summaryElement = new Summary();

        this.#paymentModalElement = new PaymentModal(document.getElementById("paymentModal"));
        this.#deliveryModalElement = new DeliveryModal(document.getElementById("deliveryModal"));

        this.#fillElements();
        this.#initListeners();
    }

    #fillElements() {
        const items = this.#controller.getBasketItems();
        const selectedItemsTotalPrice = this.#controller.getSelectedItemsPrice();

        const cards = this.#controller.getCards();
        const currentCard = this.#controller.getCurrentCard();

        const addresses = this.#controller.getAddresses();
        const deliveryTypes = Object.keys(addresses);

        const currentDelivery = this.#controller.getCurrentDelivery();

        this.#accordionElement.fillItemsList(items);

        this.#deliveryElement.fillCargo(this.#controller.getSelectedItems());
        this.#summaryElement.setItemsData(selectedItemsTotalPrice, this.#controller.getSelectedItemsAmount());

        this.#accordionElement.setSummary(selectedItemsTotalPrice, this.#controller.getSelectedItemsAmount());

        this.#summaryElement.setCard(currentCard);
        this.#paymentElement.setCard(currentCard);

        this.#deliveryElement.setDelivery(currentDelivery);
        this.#summaryElement.setDelivery(currentDelivery);

        this.#paymentModalElement.fillCardsList(cards);

        this.#deliveryModalElement.fillDeliveryPointAddressForm(addresses[deliveryTypes[1]], deliveryTypes[1]);
        this.#deliveryModalElement.fillCourierAddressForm(addresses[deliveryTypes[0]], deliveryTypes[0]);
    }

    #initListeners() {
        this.#root.addEventListener("itemAmountChange", this.#handleItemAmountChange.bind(this));
        this.#root.addEventListener("itemToggleSelection", this.#handleItemSelection.bind(this));
        this.#root.addEventListener("selectAll", this.#handleSelectAll.bind(this));

        this.#root.addEventListener("openPaymentModal", this.#handleOpenPaymentModal.bind(this));
        this.#root.addEventListener("openDeliveryModal", this.#handleOpenDeliveryModal.bind(this));
        this.#root.addEventListener("modalClose", this.#handleModalClose.bind(this));

        this.#root.addEventListener("cardChange", this.#handleCardChange.bind(this));
        this.#root.addEventListener("deliveryChange", this.#handleDeliveryChange.bind(this));

        this.#root.addEventListener("immediatelyPaymentChange", this.#handleImmediatelyPaymentChange.bind(this));

        this.#root.addEventListener("submitting", this.#handleSubmitting.bind(this));

        this.#root.addEventListener("validatePass", this.#handleValidatePassed.bind(this));
        this.#root.addEventListener("validateFail", this.#handleValidateFailed.bind(this));
    }

    #handleItemAmountChange(event) {
        const id = event.detail.id;

        this.#controller.changeBasketItemAmount(id, event.detail.amount);

        const item = this.#controller.getItemById(id);
        this.#accordionElement.setItemPrice(id, item.amount * item.price);

        this.#render();
    }

    #handleItemSelection(event) {
        this.#controller.changeBasketItemtoggleIsSelected(event.detail.id);

        this.#render();
    }

    #handleSelectAll(event) {
        const isSelected = event.detail.isSelected;

        this.#controller.setAllIsSelectedTo(isSelected);

        this.#render();
    }

    #handleOpenPaymentModal() {
        this.#root.classList.add("body__overflow_hidden");
        this.#paymentModalElement.showModal();
    }

    #handleOpenDeliveryModal() {
        this.#root.classList.add("body__overflow_hidden");
        this.#deliveryModalElement.showModal();
    }

    #handleModalClose() {
        this.#root.classList.remove("body__overflow_hidden");
    }

    #handleCardChange(event) {
        this.#controller.setCurrentCard(event.detail.cardLabel);

        const currentCard = this.#controller.getCurrentCard();

        this.#summaryElement.setCard(currentCard);
        this.#paymentElement.setCard(currentCard);
    }

    #handleDeliveryChange(event) {
        this.#controller.setCurrentDelivery(event.detail.deliveryType, event.detail.address);

        const currentDelivery = this.#controller.getCurrentDelivery();

        this.#summaryElement.setDelivery(currentDelivery);
        this.#deliveryElement.setDelivery(currentDelivery);
    }

    #handleImmediatelyPaymentChange() {
        this.#paymentElement.togglePaymentHint();
    }

    #handleSubmitting() {
        this.#recipientFormElement.validate();
    }

    #handleValidatePassed() {
        alert("Passed");
    }

    #handleValidateFailed(event) {
        event.detail.element.scrollIntoView({ behavior: "smooth" });
    }

    #render() {
        const selectedItemsTotalPrice = this.#controller.getSelectedItemsPrice();
        const selectedItemsAmount = this.#controller.getSelectedItemsAmount();

        this.#summaryElement.setItemsData(selectedItemsTotalPrice, selectedItemsAmount);
        this.#deliveryElement.fillCargo(this.#controller.getSelectedItems());
        this.#accordionElement.setSummary(selectedItemsTotalPrice, selectedItemsAmount);
    }
}
