import Slice from "../slice.js";

const initialState = {
    cards: {
        mir: {
            label: "mir",
            number: "1234 56•• •••• 1234",
            imageClass: "card__mir",
        },
        visa: {
            label: "visa",
            number: "7777 56•• •••• 1234",
            imageClass: "card__visa",
        },
        mastercard: {
            label: "mastercard",
            number: "6666 56•• •••• 1234",
            imageClass: "card__mastercard",
        },
        maestro: {
            label: "maestro",
            number: "5555 56•• •••• 1234",
            imageClass: "card__maestro",
        },
    },

    currentCard: null,
};

initialState.currentCard = initialState.cards.mir;

export default class CardSlice extends Slice {
    constructor() {
        super("card", initialState);
    }

    getName() {
        return super.getName();
    }

    getState() {
        return super.getState();
    }

    getCards() {
        return super.getState().cards;
    }

    getCurrentCard() {
        return super.getState().currentCard;
    }

    setCurrentCard(cardLabel = "mir") {
        let state = super.getState();

        state.currentCard = state.cards[cardLabel];
    }
}
