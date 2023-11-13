export default class RecipientForm {
    #element;

    #inputs;

    constructor(element) {
        this.#element = element;

        this.#inputs = Array.from(this.#element.querySelectorAll("input"));

        this.#initListeners();
    }

    validate() {
        this.#setAllRequired();

        const failedElem = this.#checkValidity();

        if (failedElem) {
            const ev = new CustomEvent("validateFail", {
                detail: {
                    element: failedElem,
                },

                bubbles: true,
            });
            this.#element.dispatchEvent(ev);
        } else {
            const ev = new CustomEvent("validatePass", {
                bubbles: true,
            });
            this.#element.dispatchEvent(ev);
        }
    }

    #checkValidity() {
        return this.#inputs.find((e) => !e.checkValidity());
    }

    #initListeners() {
        this.#element.addEventListener("change", this.#handleInput.bind(this));

        this.#inputs.forEach((e) => {
            e.addEventListener("focus", this.#handleFocus.bind(this));
            e.addEventListener("blur", this.#handleBlur.bind(this));
        });
    }

    #handleInput(event) {
        this.#setIsEmpty(event.target);
    }

    #handleFocus(event) {
        const target = event.target;
        event.target.dataset.isempty = "false";

        if (target.value.length === 0) {
            target.required = false;
        }
    }

    #handleBlur(event) {
        const target = event.target;

        // RegExp explain: Allows to enter only Cyrillic and Latin Letters.
        const regExpForTextFiled = "^[A-Za-zА-Яа-яЁё]+$";

        // RegExp explain: Allows to enter exaclty 11 numbers.
        const regExpForTelephoneFiled = "[0-9]{11,11}";

        // RegExp explain: Allows to enter exaclty 10 numbers.
        const regExpForINNField = "[0-9]{10,10}";

        this.#setIsEmpty(event.target);

        if (event.target.type === "text") {
            event.target.setAttribute("pattern", regExpForTextFiled);

            return;
        }

        if (event.target.type === "tel") {
            if (target.hasAttribute("data-tel")) {
                target.setAttribute("pattern", regExpForTelephoneFiled);
            } else if (target.hasAttribute("data-inn")) {
                target.setAttribute("pattern", regExpForINNField);
            }
        }
    }

    #setIsEmpty(target) {
        if (target.value.length === 0) {
            target.dataset.isempty = "true";
            return;
        }

        target.dataset.isempty = "false";
    }

    #setAllRequired() {
        this.#inputs.forEach((e) => e.setAttribute("required", ""));
    }
}
