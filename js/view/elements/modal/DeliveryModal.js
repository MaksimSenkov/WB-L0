export default class DeliveryModal {
    #element;

    #closeButtonElement;

    #typeButtonWrapperElement;

    #couriersAddressesFormElement;
    #deliveriesPointsAddressesFormElement;

    #currentFormElement;

    #previousCourierDelivery;
    #previousDeliveryPointDelivery;

    constructor(element) {
        this.#element = element;

        this.#closeButtonElement = this.#element.querySelector("[data-modalCloseButton]");

        this.#typeButtonWrapperElement = this.#element.querySelector("[data-typeList]");

        this.#deliveriesPointsAddressesFormElement = this.#element.querySelector("[data-deliveryPointForm]");
        this.#couriersAddressesFormElement = this.#element.querySelector("[data-courierForm]");

        this.#currentFormElement = this.#deliveriesPointsAddressesFormElement;

        this.#initListeners();
    }

    showModal() {
        this.#previousDeliveryPointDelivery =
            this.#deliveriesPointsAddressesFormElement.querySelector(":checked").value;
        this.#previousCourierDelivery = this.#couriersAddressesFormElement.querySelector(":checked").value;

        this.#element.showModal();
    }

    close() {
        const ev = new CustomEvent("modalClose", { bubbles: true });
        this.#element.dispatchEvent(ev);
        this.#element.close();
    }

    fillCourierAddressForm(addresses, type) {
        this.#fillForm(this.#couriersAddressesFormElement, addresses, type);
    }

    fillDeliveryPointAddressForm(addresses, type) {
        this.#fillForm(this.#deliveriesPointsAddressesFormElement, addresses, type);
    }

    #initListeners() {
        this.#closeButtonElement.addEventListener("click", this.#handleCloseButtonClick.bind(this));
        this.#typeButtonWrapperElement.addEventListener("click", this.#handleTypeChange.bind(this));

        this.#couriersAddressesFormElement.addEventListener("submit", this.#handleSubmit.bind(this));
        this.#deliveriesPointsAddressesFormElement.addEventListener("submit", this.#handleSubmit.bind(this));
    }

    #handleCloseButtonClick() {
        this.#deliveriesPointsAddressesFormElement.querySelector(
            `[value=${this.#previousDeliveryPointDelivery}]`
        ).checked = true;
        this.#couriersAddressesFormElement.querySelector(`[value=${this.#previousCourierDelivery}]`).checked = true;

        this.close();
    }

    #handleTypeChange(event) {
        const target = event.target;
        if (target.tagName !== "BUTTON") {
            return;
        }

        Array.from(this.#typeButtonWrapperElement.querySelectorAll("button")).forEach((elem) =>
            elem.classList.remove("tabs-list__button_active")
        );

        target.classList.add("tabs-list__button_active");

        if (target.dataset.type === "deliveryPoint") {
            this.#currentFormElement = this.#deliveriesPointsAddressesFormElement;
            this.#deliveriesPointsAddressesFormElement.classList.remove("delivery-method__form_hidden");
            this.#couriersAddressesFormElement.classList.add("delivery-method__form_hidden");
        } else if (target.dataset.type === "courier") {
            this.#currentFormElement = this.#couriersAddressesFormElement;
            this.#deliveriesPointsAddressesFormElement.classList.add("delivery-method__form_hidden");
            this.#couriersAddressesFormElement.classList.remove("delivery-method__form_hidden");
        }
    }

    #handleSubmit(event) {
        event.preventDefault();

        const [type, address] = new FormData(this.#currentFormElement).get("address").split("-");

        const ev = new CustomEvent("deliveryChange", {
            detail: {
                deliveryType: type,
                address: address,
            },
            bubbles: true,
        });

        this.#element.dispatchEvent(ev);

        this.close();
    }

    #fillForm(formElement, addresses, type) {
        const list = formElement.querySelector("[data-addressList]");

        list.innerHTML = "";

        let HTML = "";

        for (let address of addresses) {
            HTML += this.#buildListItem(address, type);
        }

        list.insertAdjacentHTML("afterbegin", HTML);
        list.querySelector("input").checked = true;
    }

    #buildListItem({ id, address, rating }, type) {
        return `
            <li class="delivery-method-list__item method-list-item">
                <label class="radio">
                    <input type="radio" class="radio__input" name="address" value="${type}-${id}" /> ${address}
                    <span class="radio__icon"></span>
                    ${
                        rating || rating === null
                            ? `<div class="caption method-list-item__rating-wrapper">
                                <span class="star method-list-item__icon"></span>
                                <span class="method-list-item__rating">${rating ?? ""}</span>
                                <span class="font-color_light-gray method-list-item__delivery-point">Пункт выдачи</span>
                            </div>`
                            : ""
                    }
                </label>
                <button>
                    <svg>
                        <use href="/assets/icons.svg#removeItemGray"></use>
                    </svg>
                </button>
            </li>
        `;
    }
}
