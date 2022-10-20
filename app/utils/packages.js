exports.routeParams = ["/", "/features", "/faq", "/login", "/register", "/forget_password"];

exports.imageParams = ["image/jpeg", "image/png", "image/jpg", "image/JPG", "image/gif"];

exports.Packages = {
    btc: {
        Starter: {
            Price: 2500,
            Duration: "30 days",
            Returns: "1.42% daily",
            Speed: "20 TH/s",
            MEF: "7.1%"
        },
        Basic: {
            Price: 10000,
            Duration: "30 days",
            Returns: "1.86% daily",
            Speed: "36 TH/s",
            MEF: "5.2%",
        },

        Standard: {
            Price: 22000,
            Duration: "30 days",
            Returns: "2.02% daily",
            Speed: "41 TH/s",
            MEF: "4.9%",
        },
        Premium: {
            Price: 50000,
            Duration: "30 days",
            Returns: "2.16% daily",
            Speed: "55 TH/s",
            MEF: "3.9%",
        },

        Gold: {
            Price: 100000,
            Duration: "30 days",
            Returns: "8.16% weekly",
            Speed: "51 TH/s",
            MEF: "3.3%",
        },
        Platinum: {
            Price: 200000,
            Duration: "30 days",
            Returns: "5.12% weekly",
            Speed: "57 TH/s",
            MEF: "3.1%",
        }
    },

    eth: {
        Silver: {
            Price: 5000,
            Duration: "30 days",
            Returns: "1.66% daily",
        },

        Classic: {
            Price: 15000,
            Duration: "30 days",
            Returns: "12.6% weekly",
        },

        Gold: {
            Price: 40000,
            Duration: "30 days",
            Returns: "13.31% weekly",
        }

    },
    trx: {
        Silver: {
            Price: 5000,
            Duration: "30 days",
            Returns: "1.66% daily",
        },

        Classic: {
            Price: 15000,
            Duration: "30 days",
            Returns: "12.6% weekly",
        },

        Gold: {
            Price: 40000,
            Duration: "30 days",
            Returns: "13.31% weekly",
        }

    },
    usdt: {
        Silver: {
            Price: 5000,
            Duration: "30 days",
            Returns: "1.66% daily",
        },

        Classic: {
            Price: 15000,
            Duration: "30 days",
            Returns: "12.6% weekly",
        },

        Gold: {
            Price: 40000,
            Duration: "30 days",
            Returns: "13.31% weekly",
        }

    },

    doge: {
        Silver: {
            Price: 3000,
            Duration: "30 days",
            Returns: "1.25% daily",

        },
        Classic: {
            Price: 12000,
            Duration: "30 days",
            Returns: "2.1% daily",
        },
        Gold: {
            Price: 30000,
            Duration: "30 days",
            Returns: "2.21% daily",
        }
    },
    cad: {
        Silver: {
            Price: 2000,
            Duration: "30 days",
            Returns: "1.38% daily",
        },
        Classic: {
            Price: 5000,
            Duration: "30 days",
            Returns: "1.96% daily",
        },
        Standard: {
            Price: 14000,
            Duration: "30 days",
            Returns: "2.12% daily",
        },
        Gold: {
            Price: 25000,
            Duration: "30 days",
            Returns: "2.28% daily",
        }
    }
}