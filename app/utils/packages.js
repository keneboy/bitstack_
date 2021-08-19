exports.routeParams = ["/", "/features", "/faq", "/login", "/register"];

exports.imageParams = ["image/jpeg", "image/png", "image/jpg", "image/JPG", "image/gif"];

exports.Packages={
    btc:{
        Starter:{
            Price: 2500,
            Duration: "3 days",
            Returns: "1.42% daily",
            Speed: "20 TH/s",
            MEF: "7.1%"
        },
        Basic:{
            Price: 10000,
            Duration: "7 days",
            Returns: "1.86% daily" ,
            Speed: "36 TH/s",
            MEF: "5.2%",
        },
        Standard:{
            Price: 22000,
            Duration: "14 days",
            Returns: "2.02% daily",
            Speed: "41 TH/s",
            MEF: "4.9%",
        },
        
        Premium:{
            Price: 50000,
            Duration: "30 days",
            Returns: "2.16% daily",
            Speed: "55 TH/s",
            MEF: "3.9%",
        },

        Gold:{
            Price: 100000,
            Duration: "60 days",
            Returns: "8.16% weekly",
            Speed: "51 TH/s",
            MEF: "3.3%",
        },
        Platinum:{
            Price: 200000,
            Duration: "90 days",
            Returns: "5.12% weekly",
            Speed: "57 TH/s",
            MEF: "3.1%",
        }
    },

    eth:{
        Silver:{
            Price: 5000,
            Duration: "14 days",
            Returns: "2.88% daily",
        },
        Classic:{
            Price: 15000,
            Duration: "30 days",
            Returns: "12.6% weekly",
        },
        Gold:{
            Price: 40000,
            Duration: "30 days",
            Returns: "13.31% weekly",
        }

    }
}