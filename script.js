/* =========================================
   FASTAPI CONFIGURATION
========================================= */

const API_URL = "http://127.0.0.1:8000/predict";


/* =========================================
   GET HTML ELEMENTS
========================================= */

const form = document.getElementById("predictionForm");

const loading = document.getElementById("loading");
const result = document.getElementById("result");

const roomType = document.getElementById("roomType");

const entireBar = document.getElementById("entire");
const privateBar = document.getElementById("private");
const sharedBar = document.getElementById("shared");

const entireText = document.getElementById("entireText");
const privateText = document.getElementById("privateText");
const sharedText = document.getElementById("sharedText");


/* =========================================
   INITIAL STATE
========================================= */

result.style.display = "none";


/* =========================================
   FORM SUBMIT
========================================= */

form.addEventListener("submit", async function (event) {

    // Prevent page refresh
    event.preventDefault();


    /* -----------------------------------------
       GET USER INPUT
    ----------------------------------------- */

    const data = {

        latitude: parseFloat(
            document.getElementById("latitude").value
        ),

        longitude: parseFloat(
            document.getElementById("longitude").value
        ),

        price: parseFloat(
            document.getElementById("price").value
        ),

        minimum_nights: parseInt(
            document.getElementById("minimum_nights").value
        ),

        number_of_reviews: parseInt(
            document.getElementById("number_of_reviews").value
        ),

        reviews_per_month: parseFloat(
            document.getElementById("reviews_per_month").value
        ),

        calculated_host_listings_count: parseInt(
            document.getElementById(
                "calculated_host_listings_count"
            ).value
        ),

        availability_365: parseInt(
            document.getElementById("availability_365").value
        ),

        neighbourhood_group:
            document.getElementById(
                "neighbourhood_group"
            ).value,

        neighbourhood:
            document.getElementById(
                "neighbourhood"
            ).value.trim()
    };


    /* -----------------------------------------
       SHOW LOADING
    ----------------------------------------- */

    loading.style.display = "flex";

    result.style.display = "none";


    /* -----------------------------------------
       RESET PROGRESS BARS
    ----------------------------------------- */

    resetProgressBars();


    try {

        /* -----------------------------------------
           API REQUEST
        ----------------------------------------- */

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });


        /* -----------------------------------------
           CHECK API RESPONSE
        ----------------------------------------- */

        if (!response.ok) {

            const errorData = await response.json()
                .catch(() => null);

            throw new Error(
                errorData?.detail ||
                `Server Error: ${response.status}`
            );
        }


        /* -----------------------------------------
           GET PREDICTION
        ----------------------------------------- */

        const prediction = await response.json();


        console.log(
            "Prediction Response:",
            prediction
        );


        /* -----------------------------------------
           HIDE LOADING
        ----------------------------------------- */

        loading.style.display = "none";

        result.style.display = "block";


        /* -----------------------------------------
           SHOW ROOM TYPE
        ----------------------------------------- */

        const predictedRoom =
            prediction.Predicted_room_type;

        roomType.textContent =
            formatRoomType(predictedRoom);


        /* -----------------------------------------
           GET PROBABILITIES
        ----------------------------------------- */

        const probabilities =
            prediction.Probability[0] ||
            prediction.Probability;


        /*
            Model probability order depends
            on model.classes_.

            Default mapping used here:

            0 -> Entire Home/Apartment
            1 -> Private Room
            2 -> Shared Room
        */

        const entireProbability =
            Number(probabilities[0] || 0) * 100;

        const privateProbability =
            Number(probabilities[1] || 0) * 100;

        const sharedProbability =
            Number(probabilities[2] || 0) * 100;


        /* -----------------------------------------
           UPDATE PROGRESS BARS
        ----------------------------------------- */

        setTimeout(() => {

            entireBar.style.width =
                `${entireProbability}%`;

            privateBar.style.width =
                `${privateProbability}%`;

            sharedBar.style.width =
                `${sharedProbability}%`;

        }, 100);


        /* -----------------------------------------
           UPDATE PERCENTAGE TEXT
        ----------------------------------------- */

        entireText.textContent =
            `${entireProbability.toFixed(2)}%`;

        privateText.textContent =
            `${privateProbability.toFixed(2)}%`;

        sharedText.textContent =
            `${sharedProbability.toFixed(2)}%`;


        /* -----------------------------------------
           SCROLL TO RESULT
        ----------------------------------------- */

        setTimeout(() => {

            document
                .querySelector(".result-section")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

        }, 300);


    } catch (error) {

        /* -----------------------------------------
           HIDE LOADING
        ----------------------------------------- */

        loading.style.display = "none";


        /* -----------------------------------------
           SHOW ERROR
        ----------------------------------------- */

        result.style.display = "block";

        roomType.textContent =
            "Prediction Failed";

        roomType.style.color =
            "#fca5a5";

        roomType.style.borderColor =
            "rgba(239, 68, 68, 0.4)";


        console.error(
            "Prediction Error:",
            error
        );


        alert(
            "Unable to connect with the prediction server.\n\n" +
            error.message
        );

    }

});


/* =========================================
   RESET PROGRESS BARS
========================================= */

function resetProgressBars() {

    entireBar.style.width = "0%";

    privateBar.style.width = "0%";

    sharedBar.style.width = "0%";


    entireText.textContent = "0%";

    privateText.textContent = "0%";

    sharedText.textContent = "0%";

}


/* =========================================
   FORMAT ROOM TYPE
========================================= */

function formatRoomType(roomTypeValue) {

    if (!roomTypeValue) {

        return "Unknown Room Type";

    }


    const value =
        String(roomTypeValue)
        .toLowerCase()
        .trim();


    if (
        value.includes("entire")
    ) {

        return "🏠 Entire Home / Apartment";

    }


    if (
        value.includes("private")
    ) {

        return "🛏️ Private Room";

    }


    if (
        value.includes("shared")
    ) {

        return "👥 Shared Room";

    }


    return roomTypeValue;

}


/* =========================================
   INPUT NUMBER VALIDATION
========================================= */

const numberInputs =
    document.querySelectorAll(
        'input[type="number"]'
    );


numberInputs.forEach(input => {

    input.addEventListener(
        "input",
        function () {

            if (this.value < 0) {

                this.value = 0;

            }

        }
    );

});


/* =========================================
   RIPPLE EFFECT ON BUTTON
========================================= */

const button =
    document.querySelector(".btn");


button.addEventListener(
    "click",
    function (event) {

        const ripple =
            document.createElement("span");


        const rect =
            button.getBoundingClientRect();


        const size =
            Math.max(
                rect.width,
                rect.height
            );


        ripple.style.width =
            `${size}px`;

        ripple.style.height =
            `${size}px`;


        ripple.style.left =
            `${event.clientX - rect.left - size / 2}px`;

        ripple.style.top =
            `${event.clientY - rect.top - size / 2}px`;


        ripple.style.position =
            "absolute";


        ripple.style.borderRadius =
            "50%";


        ripple.style.background =
            "rgba(255, 255, 255, 0.25)";


        ripple.style.transform =
            "scale(0)";


        ripple.style.pointerEvents =
            "none";


        ripple.style.animation =
            "rippleEffect 0.6s linear";


        button.appendChild(ripple);


        setTimeout(() => {

            ripple.remove();

        }, 600);

    }
);


/* =========================================
   ADD RIPPLE ANIMATION
========================================= */

const rippleStyle =
    document.createElement("style");


rippleStyle.textContent = `

    @keyframes rippleEffect {

        to {

            transform: scale(4);

            opacity: 0;

        }

    }

`;


document.head.appendChild(
    rippleStyle
);


/* =========================================
   MOUSE PARALLAX EFFECT
========================================= */

const glassCard =
    document.querySelector(".glass-card");


if (window.innerWidth > 900) {

    glassCard.addEventListener(
        "mousemove",
        function (event) {

            const rect =
                glassCard.getBoundingClientRect();


            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;


            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;


            const rotateX =
                (y - centerY) / 35;

            const rotateY =
                (centerX - x) / 35;


            glassCard.style.transform =
                `perspective(1000px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-5px)`;

        }
    );


    glassCard.addEventListener(
        "mouseleave",
        function () {

            glassCard.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0)";

        }
    );

}


/* =========================================
   AUTO FOCUS FIRST INPUT
========================================= */

window.addEventListener(
    "load",
    function () {

        const firstInput =
            document.getElementById(
                "latitude"
            );

        if (firstInput) {

            firstInput.focus();

        }

    }
);