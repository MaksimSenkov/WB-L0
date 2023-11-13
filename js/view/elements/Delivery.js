import { convertStringToLocaleDayWithMonth } from "../../services/services.js";

export default class Delivery {
    #element;

    #addressElement;
    #deliveryTypeElement;

    #deliveryPointIfnoElement;

    #changeDelivryTypeButtonElement;

    #deliveryCargoElement;

    constructor(element) {
        this.#element = element;

        this.#addressElement = this.#element.querySelector("[data-deliveryAddress]");
        this.#deliveryTypeElement = this.#element.querySelector("[data-deliveryType]");
        this.#changeDelivryTypeButtonElement = this.#element.querySelector("[data-changeDelivery]");

        this.#deliveryPointIfnoElement = this.#element.querySelector("[data-deliveryPointInfo]");

        this.#deliveryCargoElement = this.#element.querySelector("[data-deliveryCargo]");

        this.#initListeners();
    }

    setDelivery({ deliveryType, address }) {
        this.#addressElement.textContent = address.address;

        if (deliveryType === "courier") {
            this.#deliveryTypeElement.textContent = "Курьером";
            this.#deliveryPointIfnoElement.innerHTML = "";
        } else {
            this.#deliveryTypeElement.textContent = "Пункт выдачи";
            this.#fillDeliveryPointInfo(address);
        }
    }

    fillCargo(items) {
        this.#deliveryCargoElement.innerHTML = "";
        const itemsByDates = this.#spreadDeliveryByDay(items);

        let HTML = "";

        for (let deliveryDate of itemsByDates) {
            const selectedItems = this.#selectItemsForDate(items, deliveryDate.items);
            HTML += this.#buildCargo(deliveryDate, selectedItems);
        }

        this.#deliveryCargoElement.insertAdjacentHTML("afterbegin", HTML);
    }

    #spreadDeliveryByDay(items) {
        const result = [];

        for (let key in items) {
            const item = items[key];

            const dates = item.deliveryDates;

            let itemsLeft = item.amount;

            for (let date of dates) {
                if (itemsLeft === 0) {
                    break;
                }

                let amount = 0;
                const diff = itemsLeft - date.amount;

                if (diff >= 0) {
                    amount = date.amount;
                    itemsLeft = diff;
                } else {
                    amount = itemsLeft;
                    itemsLeft = 0;
                }

                const index = result.findIndex((elem) => {
                    return elem.start === date.date.start && elem.end === date.date.end;
                });

                if (index === -1) {
                    result.push({
                        start: date.date.start,
                        end: date.date.end,

                        items: [
                            {
                                id: item.id,
                                amount: amount,
                            },
                        ],
                    });
                } else {
                    result[index].items.push({
                        id: item.id,
                        amount: amount,
                    });
                }
            }
        }

        return result;
    }

    #selectItemsForDate(items, deliveryDateItems) {
        const result = [];

        for (let item of deliveryDateItems) {
            result.push({ ...items[item.id], amountForDay: item.amount });
        }

        return result;
    }

    #buildCargo(deliveryDate, selectedItems) {
        const HTML = `
            <div class="delivery-description-list__item">
                <dt class="delivery-description-list__term text_fw600">${this.#buildDeliveryDate(deliveryDate)}</dt>
                <dd class="delivery-description-list__images-list images-list">
                    <ul class="image-list__list">
                        ${selectedItems.map((e) => this.#buildListElement(e)).join("")}
  
                    </ul>
                </dd>
            </div>
        `;

        return HTML;
    }

    #buildDeliveryDate(deliveryDate) {
        const dateStart = new Date(deliveryDate.start);
        const dateEnd = new Date(deliveryDate.end);

        if (dateStart.getMonth() === dateEnd.getMonth()) {
            return `${dateStart.getDate()}—<wbr />${convertStringToLocaleDayWithMonth(dateEnd)}`;
        }

        return `${convertStringToLocaleDayWithMonth(dateStart)}—<wbr />${convertStringToLocaleDayWithMonth(dateEnd)}`;
    }

    #buildListElement({ amountForDay, image, label }) {
        const HTML = `
            <li class="image-list__item" ${amountForDay > 1 ? `data-amount="${amountForDay}"` : ""}>
                
                <picture>
                    <source
                        srcset="
                            /project/assets/images/${image}/${image}@1x.avif 1x,
                            /project/assets/images/${image}/${image}@2x.avif 2x
                        "
                        type="image/avif"
                    />
                    <source
                        srcset="
                            /project/assets/images/${image}/${image}@1x.webp 1x,
                            /project/assets/images/${image}/${image}@2x.webp 2x
                        "
                        type="image/webp"
                    />
                    <img
                        height="56px"
                        width="40px"
                        loading="lazy"
                        src="/project/assets/images/${image}/${image}@1x.jpg"
                        srcset="/project/assets/images/${image}/${image}@2x.jpg 2x"
                        alt="${label}"
                    />
                </picture>
            </li>
        `;

        return HTML;
    }

    #fillDeliveryPointInfo(address) {
        this.#deliveryPointIfnoElement.innerHTML = "";

        const rating = address.rating ?? "";

        const HTML = `
            <span class="star"></span>
            <span class="address-wrapper__rating">${rating}</span>
            <span class="address-wrapper__working-hours">Ежедневно с 10 до 21</span>
        `;
        this.#deliveryPointIfnoElement.insertAdjacentHTML("afterbegin", HTML);
    }

    #initListeners() {
        this.#changeDelivryTypeButtonElement.addEventListener(
            "click",
            this.#handleChangeDeliveryButtonElementClick.bind(this)
        );
    }

    #handleChangeDeliveryButtonElementClick() {
        const ev = new CustomEvent("openDeliveryModal", {
            bubbles: true,
        });

        this.#element.dispatchEvent(ev);
    }
}
