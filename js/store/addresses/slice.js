import Slice from "../slice.js";

const initialState = {
    currentAddress: 1,
    currentDeliveryType: "deliveryPoints",

    courier: [
        {
            id: 1,
            address: "Бишкек, улица Табышалиева, 57",
        },
        {
            id: 2,
            address: "Бишкек, улица Жукеева-Пудовкина, 77/1",
        },
        {
            id: 3,
            address: "Бишкек, микрорайон Джал, улица Ахунбаева Исы, 67/1",
        },
    ],
    deliveryPoints: [
        {
            id: 1,
            address: "г. Бишкек, микрорайон Джал, улица Ахунбаева Исы, д. 67/1",
            rating: null,
        },
        {
            id: 2,
            address: "г. Бишкек, микрорайон Джал, улица Ахунбаева Исы, д. 67/1",
            rating: 4.99,
        },
        {
            id: 3,
            address: "г. Бишкек, улица Табышалиева, д. 57",
            rating: 4.99,
        },
    ],
};

export default class AddressesSlice extends Slice {
    constructor() {
        super("delivery", initialState);
    }

    getAddresses() {
        const state = super.getState();
        return {
            courier: state.courier,
            deliveryPoints: state.deliveryPoints,
        };
    }

    setCurrentDeliveryData(deliveryType, address) {
        const state = super.getState();

        state.currentDeliveryType = deliveryType;
        state.currentAddress = address;
    }

    getCurrentDelivery() {
        const state = super.getState();

        const address = state[state.currentDeliveryType].find((element) => element.id === +state.currentAddress);

        return {
            deliveryType: state.currentDeliveryType,
            address: address,
        };
    }
}
