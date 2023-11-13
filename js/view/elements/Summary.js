import { formatNumber, getNoun } from "../../services/services.js";

export default class Summary {
    #element;

    #totalPrice;
    #totalPriceElement;
    #itemsAmountElement;
    #oldPriceElement;
    #discountElement;

    #changePaymentButtonElement;
    #changeDeliveryButtonElement;

    #cardIconElement;
    #cardNumberElement;

    #deliveryTypeElement;
    #deliveryAddressElement;

    #immediatelyPaymentCheckBoxElement;
    #paymentHintElement;

    #submitButtonElement;

    constructor() {
        this.#element = document.getElementById("summary");

        this.#totalPriceElement = this.#element.querySelector("[data-totalPrice]");
        this.#itemsAmountElement = this.#element.querySelector("[data-itemsAmount]");
        this.#oldPriceElement = this.#element.querySelector("[data-oldPrice]");
        this.#discountElement = this.#element.querySelector("[data-discount]");

        this.#changePaymentButtonElement = this.#element.querySelector("[data-changePayment]");
        this.#changeDeliveryButtonElement = this.#element.querySelector("[data-changeDelivery]");

        this.#cardIconElement = this.#element.querySelector("[data-cardIcon]");
        this.#cardNumberElement = this.#element.querySelector("[data-cardNumber]");

        this.#deliveryTypeElement = this.#element.querySelector("[data-deliveryType]");
        this.#deliveryAddressElement = this.#element.querySelector("[data-deliveryAddress]");

        this.#immediatelyPaymentCheckBoxElement = this.#element.querySelector("[data-immediatelyPayment]");

        this.#paymentHintElement = this.#element.querySelector("[data-hint]");

        this.#submitButtonElement = this.#element.querySelector("[data-submitButton]");

        this.#initListeners();
    }

    setItemsData(value, itemsCount) {
        this.#totalPrice = value;

        const discountedValue = +(+this.#totalPrice * 1.2).toFixed(0);

        this.#totalPriceElement.textContent = formatNumber(+this.#totalPrice);
        this.#oldPriceElement.textContent = formatNumber(discountedValue);
        this.#discountElement.textContent = formatNumber(+this.#totalPrice - discountedValue);

        this.#itemsAmountElement.textContent = `${itemsCount} ${getNoun(itemsCount, "товар", "товара", "товаров")}`;
    }

    setTotalPrice(value) {
        this.#totalPrice = value;

        this.#totalPriceElement.textContent = formatNumber(+this.#totalPrice);

        const isChecked = this.#immediatelyPaymentCheckBoxElement.checked;

        this.#changeButtonText(isChecked);
    }

    setCard({ imageClass, number }) {
        this.#cardNumberElement.textContent = number;
        this.#cardIconElement.className = "";

        this.#cardIconElement.classList.add("card");
        this.#cardIconElement.classList.add(imageClass);
    }

    setDelivery({ deliveryType, address }) {
        this.#deliveryAddressElement.textContent = address.address;
        this.#deliveryTypeElement.textContent = this.#deliveryTypeText(deliveryType);
    }

    #deliveryTypeText(deliveryType) {
        return deliveryType === "courier" ? "Доставка курьером" : "Доставка в пункт выдачи";
    }

    #initListeners() {
        this.#changePaymentButtonElement.addEventListener(
            "click",
            this.#handleChangePaymentButtonElementClick.bind(this)
        );

        this.#changeDeliveryButtonElement.addEventListener(
            "click",
            this.#handleChangeDeliveryButtonElementClick.bind(this)
        );

        this.#immediatelyPaymentCheckBoxElement.addEventListener(
            "click",
            this.#handleImmediatelyPaymentChange.bind(this)
        );

        this.#submitButtonElement.addEventListener("click", this.#handleSumbitButtonClick.bind(this));
    }

    #handleChangePaymentButtonElementClick() {
        const ev = new CustomEvent("openPaymentModal", {
            bubbles: true,
        });

        this.#element.dispatchEvent(ev);
    }

    #handleChangeDeliveryButtonElementClick() {
        const ev = new CustomEvent("openDeliveryModal", {
            bubbles: true,
        });

        this.#element.dispatchEvent(ev);
    }

    #handleImmediatelyPaymentChange() {
        const isChecked = this.#immediatelyPaymentCheckBoxElement.checked;

        this.#changeButtonText(isChecked);
        this.#togglePaymentHint();

        const ev = new CustomEvent("immediatelyPaymentChange", {
            detail: {
                isChecked: isChecked,
            },
            bubbles: true,
        });

        this.#element.dispatchEvent(ev);
    }

    #handleSumbitButtonClick() {
        const ev = new CustomEvent("submitting", {
            bubbles: true,
        });

        this.#element.dispatchEvent(ev);
    }

    #changeButtonText(isImmediatelyPaymentCheckBox) {
        const defaultMessage = "Заказать";
        const payMessage = `Оплатить ${formatNumber(+this.#totalPrice)} сом`;

        this.#submitButtonElement.textContent = isImmediatelyPaymentCheckBox ? payMessage : defaultMessage;
    }

    #togglePaymentHint() {
        this.#paymentHintElement.classList.toggle("immediately-payment-wrapper__hint_hidden");
    }
}
