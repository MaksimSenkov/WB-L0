import { formatNumber, getNoun } from "../../services/services.js";

export default class Accordion {
    #element;

    #summaryElement;

    #inBasketItemsButton;
    #missingItemsButton;

    #selectAllElement;

    #itemList;

    constructor(element) {
        this.#element = element;

        this.#summaryElement = this.#element.querySelector("[data-summary]");

        this.#inBasketItemsButton = this.#element.querySelector('[data-button="inBasketItems"]');
        this.#missingItemsButton = this.#element.querySelector('[data-button="missingItems"]');

        this.#selectAllElement = this.#element.querySelector("[data-selectAll]");

        this.#itemList = this.#element.querySelector("#accordionItemList");

        this.#initListeners();
    }

    fillItemsList(items) {
        this.#itemList.innerHTML = "";

        let result = "";

        for (let item in items) {
            result += this.#buildListItem(items[item]);
        }

        this.#itemList.insertAdjacentHTML("afterbegin", result);
    }

    setItemPrice(id, price) {
        const priceElement = this.#element.querySelector(`[data-priceId="${id}"]`);

        const oldPriceElement = priceElement.closest(".item__price-wrapper").querySelector(".item__old-price");

        if (10e5 <= price) {
            priceElement.classList.remove("h3");
            priceElement.classList.add("h4");
        } else {
            priceElement.classList.add("h3");
            priceElement.classList.remove("h4");
        }

        priceElement.textContent = formatNumber(+price);
        oldPriceElement.textContent = `${formatNumber(+(price * 1.2).toFixed(0))} сом`;
    }

    setSummary(selectedItemsTotalPrice, itemAmount) {
        const formattedNumber = formatNumber(selectedItemsTotalPrice);
        const formattedAmount = `${itemAmount} ${getNoun(itemAmount, "товар", "товара", "товаров")}`;

        this.#summaryElement.textContent = `${formattedAmount} · ${formattedNumber} сом`;
    }

    #initListeners() {
        this.#inBasketItemsButton.addEventListener("click", this.#inBasketItemsToggleOpen.bind(this));
        this.#missingItemsButton.addEventListener("click", this.#toggleOpen);

        this.#selectAllElement.addEventListener("click", this.#handleSelectAll.bind(this));

        this.#element.addEventListener("click", this.#handleAmountItemChange.bind(this));
        this.#element.addEventListener("keydown", this.#prevenNonNumericCharacters.bind(this));
        this.#element.addEventListener("change", this.#handleChange.bind(this));
    }

    #toggleOpen(event) {
        event.target.closest(".accordion-item").classList.toggle("accordion-item_hidden");
    }

    #inBasketItemsToggleOpen(event) {
        this.#toggleOpen(event);

        const parentElement = event.target.parentElement;

        parentElement.querySelector(".accordion-item__select-all").classList.toggle("accordion-item__select-all_shown");
        parentElement.querySelector(".accordion-item__summary").classList.toggle("accordion-item__summary_shown");
    }

    #handleAmountItemChange(event) {
        if (!event.target.hasAttribute("data-type")) {
            return;
        }

        const button = event.target;

        const [decButton, incButton] = button.parentElement.querySelectorAll("button");

        const input = button.parentElement.querySelector("input");

        const inputMin = input.getAttribute("min");
        const inputMax = input.getAttribute("max");

        if (button.dataset.type === "inc") {
            if (inputMax <= +input.value) {
                button.disabled = true;
                return;
            }

            input.value = +input.value + 1;
            decButton.disabled = false;

            const ev = new CustomEvent("itemAmountChange", {
                detail: {
                    id: this.#getId(event),
                    amount: +input.value,
                },
                bubbles: true,
            });

            this.#element.dispatchEvent(ev);
        } else {
            if (+input.value <= inputMin) {
                button.disabled = true;
                return;
            }
            input.value -= 1;
            incButton.disabled = false;

            const ev = new CustomEvent("itemAmountChange", {
                detail: {
                    id: this.#getId(event),
                    amount: +input.value,
                },
                bubbles: true,
            });

            this.#element.dispatchEvent(ev);
        }
    }

    #prevenNonNumericCharacters(event) {
        if (isNaN(event.key)) {
            if (event.code !== "Backspace") {
                event.preventDefault();
            }
            return;
        }
    }

    #handleChange(event) {
        const target = event.target;

        if (target.getAttribute("type") === "checkbox") {
            if (target.dataset.checkboxtype === "selectAll") {
                this.#handleSelectAll();
                return;
            }

            if (target.dataset.checkboxtype === "item") {
                this.#handleItemSelection(event);
                return;
            }

            return;
        }

        this.#handleAmountItemChangeByTyping(event);
    }

    #handleItemSelection(event) {
        const ev = new CustomEvent("itemToggleSelection", {
            detail: {
                id: this.#getId(event),
            },
            bubbles: true,
        });

        this.#element.dispatchEvent(ev);
    }

    #handleAmountItemChangeByTyping(event) {
        const amount = 0 === +event.target.value ? 1 : +event.target.value;
        const ev = new CustomEvent("itemAmountChange", {
            detail: {
                id: this.#getId(event),
                amount: amount,
            },
            bubbles: true,
        });

        this.#element.dispatchEvent(ev);
    }

    #handleSelectAll() {
        const checked = this.#selectAllElement.querySelector('input[type="checkbox"]').checked;

        const ev = new CustomEvent("selectAll", {
            detail: {
                isSelected: checked,
            },
            bubbles: true,
        });

        this.#element.dispatchEvent(ev);

        Array.from(this.#itemList.querySelectorAll('input[type="checkbox"]')).forEach(
            (elem) => (elem.checked = checked)
        );
    }

    #buildListItem({ id, image, label, parameters = [], store, manufacturer, amount, availableAmount, price }) {
        const amountForWarning = 3;

        const totalPrice = amount * price;

        return `
        <li class="item-list__item item" data-id=${id}>
            <div class="item__checkwrapper">
                <label class="checkbox">
                    <input type="checkbox" class="checkbox__input" data-checkBoxType="item"/>
                    <span class="checkbox__icon"></span>
                </label>

                <picture>
                    <source
                        srcset="
                            ./assets/images/${image}/${image}@1x.avif 1x,
                            ./assets/images/${image}/${image}1@2x.avif 2x
                        "
                        type="image/avif"
                    />
                    <source
                        srcset="
                            ./assets/images/${image}/${image}@1x.webp 1x,
                            ./assets/images/${image}/${image}@2x.webp 2x
                        "
                        type="image/webp"
                    />
                    <img
                        height="96px"
                        width="72px"
                        loading="lazy"
                        class="item__img"
                        src="./assets/images/${image}/${image}@1x.jpg"
                        srcset="./assets/images/${image}/${image}@2x.jpg 2x"
                        alt="${label}"
                    />
                </picture>
            </div>

            <div class="item__description">
                <span class="item__label">${label}</span>

                ${
                    parameters.length > 0
                        ? `<dl class="item__parameters-list parameters-list">
                             ${parameters.reduce((acc, curr) => {
                                 return (acc += `
                                             <div class="parameters-list__item">
                                                 <dt class="parameters-list__term">${curr[0]}</dt>
                                                 <dd>${curr[1]}</dd>
                                             </div>
                                         `);
                             }, "")}
                         </dl>`
                        : ""
                }
            

                <span class="item__location">${store}</span>
                <div class="item__organization-wrapper organization">
                    <span class="organization__label caption font-color_gray">${manufacturer.label}</span>
                 
                    <div class="organization__info-tooltip info"></div>
                    <div class="item__organiztion-info caption">
                        <span class="h5">${manufacturer.label}</span>
                        <span>ОРГН: ${manufacturer.OGRN}</span>
                        <span>${manufacturer.address}</span>
                    </div>
                </div>
            </div>

            <div class="item__wrapper">
                <div class="item__counter counter">
                    <button class="counter__control" data-type="dec"><span>&minus;</span></button>

                    <input
                        class="counter__value"
                        type="number"
                        min="1"
                        max="${availableAmount}"
                        maxlength="3"
                        value="${amount}"
                    />
                    <button class="counter__control" data-type="inc"><span>&plus;</span></button>
                </div>

                ${
                    availableAmount <= amountForWarning
                        ? `<span class="item__left">Осталось ${availableAmount} шт.</span>`
                        : ""
                }
          
                <div class="item__item-controls item-controls">
                    <button class="item-controls__favorite">
                        <svg>
                            <use href="./assets/icons.svg#favoriteItem"></use>
                        </svg>
                    </button>
                    <button class="item-controls__remove">
                        <svg>
                            <use href="./assets/icons.svg#removeItem"></use>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="item__price-wrapper">
                <div class="item__current-price-container price-container">
                    <div class="price-container__price">
                    <span data-priceId=${id} class="price-container__priceWrapper ${10e5 <= totalPrice ? "h4" : "h3"}">
                    ${formatNumber(+totalPrice)}</span>&nbsp;сом</div>
                </div>
                <del class="item__old-price">${formatNumber(+(totalPrice * 1.2).toFixed(0))} сом</del>
                <div class="item_price-discounts discounts">
                    <table class="discounts-list">
                        <tbody>
                            <tr>
                                <td class="font-color_light-gray">Скидка 55%</td>
                                <td>−300 сом</td>
                            </tr>
                            <tr>
                                <td class="font-color_light-gray">Скидка покупателя 10%</td>
                                <td>−30 сом</td>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>
            </div>

            
            <div class="item__item-controls_mobile item-controls">
                <button class="item-controls__favorite">
                    <svg>
                        <use href="./assets/icons.svg#favoriteItem"></use>
                    </svg>
                </button>
                <button class="item-controls__remove">
                    <svg>
                        <use href="./assets/icons.svg#removeItem"></use>
                    </svg>
                </button>
            </div>
        </li>`;
    }

    #getId(event) {
        return +event.target.closest(".item").dataset.id;
    }
}
