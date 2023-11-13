const BD = {
    1: {
        id: 1,
        label: "Футболка UZcotton мужская",
        parameters: [
            ["Цвет", "белый"],
            ["Размер", "56"],
        ],
        store: "Коледино WB",
        manufacturer: {
            label: "OOO Вайлдберриз",
            OGRN: "5167746237148",
            address: "129337, Москва, улица Красная Сосна, 2, корпус 1, стр. 1, помещение 2, офис 34",
        },
        price: "522",
        deliveryDates: [
            {
                date: {
                    start: "2020-02-02",
                    end: "2020-02-04",
                },
                amount: 2,
            },
            {
                date: {
                    start: "2020-02-06",
                    end: "2020-02-08",
                },
                amount: 30,
            },
        ],

        image: "img_1",
    },
    2: {
        id: 2,
        label: "Силиконовый чехол картхолдер (отверстия) для карт, прозрачный кейс бампер на Apple iPhone XR, MobiSafe",
        parameters: [["Цвет", "прозрачный"]],
        store: "Коледино WB",
        manufacturer: {
            label: "OOO Мегапрофстиль",
            OGRN: "5167746237148",
            address: "129337, Москва, улица Красная Сосна, 2, корпус 1, стр. 1, помещение 2, офис 34",
        },
        price: "10500",

        deliveryDates: [
            {
                date: {
                    start: "2020-02-03",
                    end: "2020-02-05",
                },
                amount: 130,
            },
            {
                date: {
                    start: "2020-02-06",
                    end: "2020-02-07",
                },
                amount: 30,
            },
        ],
        image: "img_2",
    },
    3: {
        id: 3,
        label: 'Карандаши цветные Faber-Castell "Замок", набор 24 цвета, заточенные, шестигранные, Faber-Castell',
        parameters: [],
        store: "Коледино WB",
        manufacturer: {
            label: "OOO Вайлдберриз",
            OGRN: "5167746237148",
            address: "129337, Москва, улица Красная Сосна, 2, корпус 1, стр. 1, помещение 2, офис 34",
        },
        price: "522",

        deliveryDates: [
            {
                date: {
                    start: "2020-02-02",
                    end: "2020-02-04",
                },
                amount: 1,
            },
            {
                date: {
                    start: "2020-02-28",
                    end: "2020-03-08",
                },
                amount: 2,
            },
        ],
        image: "img_3",
    },
};

export default BD;
