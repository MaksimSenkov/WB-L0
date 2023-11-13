export default class Payment {
    #element;

    #changePaymentButton;

    #cardIconElement;
    #cardNumberElement;

    #paymentHintElement;

    constructor(element) {
        this.#element = element;

        this.#changePaymentButton = this.#element.querySelector("[data-changePayment]");

        this.#cardIconElement = this.#element.querySelector("[data-cardIcon]");
        this.#cardNumberElement = this.#element.querySelector("[data-cardNumber]");

        this.#paymentHintElement = this.#element.querySelector("[data-hint]");

        this.#initListeners();
    }

    setCard({ imageClass, number }) {
        this.#cardNumberElement.textContent = number;
        this.#cardIconElement.className = "";

        this.#cardIconElement.classList.add("card");
        this.#cardIconElement.classList.add(imageClass);
    }

    togglePaymentHint() {
        this.#paymentHintElement.classList.toggle("payment__payment-hint_hidden");
    }

    #initListeners() {
        this.#changePaymentButton.addEventListener("click", this.#handleChangePaymentButtonClick.bind(this));
    }

    #handleChangePaymentButtonClick() {
        const ev = new CustomEvent("openPaymentModal", {
            bubbles: true,
        });

        this.#element.dispatchEvent(ev);
    }
}
