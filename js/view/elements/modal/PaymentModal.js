export default class PaymentModal {
    #element;

    #closeButtonElement;

    #formElement;
    #cardListElement;

    #previousCard;

    constructor(element) {
        this.#element = element;

        this.#closeButtonElement = this.#element.querySelector("[data-modalCloseButton]");

        this.#formElement = this.#element.querySelector("#paymentCard");

        this.#cardListElement = this.#element.querySelector("[data-cardList]");

        this.#initListeners();
    }

    showModal() {
        this.#element.showModal();

        this.#previousCard = this.#formElement.querySelector(":checked").value;
    }

    close() {
        const ev = new CustomEvent("modalClose", { bubbles: true });
        this.#element.dispatchEvent(ev);
        this.#element.close();
    }

    fillCardsList(cards) {
        this.#cardListElement.innerHtml = "";

        let HTML = "";

        for (let card in cards) {
            HTML += this.#buildListItem(cards[card]);
        }

        this.#cardListElement.insertAdjacentHTML("afterbegin", HTML);
        this.#cardListElement.querySelector("input").checked = true;
    }

    #buildListItem({ label, number, imageClass }) {
        return `
            <li class="payment-method-list__item">
                <label class="radio">
                    <div class="card ${imageClass}"></div>
                    <input type="radio" class="radio__input" name="card" value="${label}" />${number}
                    <span class="radio__icon"></span>
                </label>
            </li>
        `;
    }

    #initListeners() {
        this.#closeButtonElement.addEventListener("click", this.#handleCloseButtonClick.bind(this));
        this.#formElement.addEventListener("submit", this.#handleSubmit.bind(this));
    }

    #handleCloseButtonClick() {
        this.#formElement.querySelector(`[value=${this.#previousCard}]`).checked = true;

        this.close();
    }

    #handleSubmit(event) {
        event.preventDefault();

        const ev = new CustomEvent("cardChange", {
            detail: {
                cardLabel: new FormData(this.#formElement).get("card"),
            },
            bubbles: true,
        });

        this.#element.dispatchEvent(ev);

        this.close();
    }
}
