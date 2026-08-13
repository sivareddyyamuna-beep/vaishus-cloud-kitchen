document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SETTINGS
    ===================================================== */

    const WHATSAPP_NUMBER = "916305253275";
    const DELIVERY_CHARGE = 50;


    /* =====================================================
       CART
    ===================================================== */

    let cart = JSON.parse(
        localStorage.getItem("vaishuCart")
    ) || [];


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const cartButton =
        document.getElementById("cartButton");

    const cartCount =
        document.getElementById("cartCount");

    const cartPanel =
        document.getElementById("cartPanel");

    const cartOverlay =
        document.getElementById("cartOverlay");

    const closeCart =
        document.getElementById("closeCart");

    const cartItems =
        document.getElementById("cartItems");

    const cartSubtotal =
        document.getElementById("cartSubtotal");

    const cartDelivery =
        document.getElementById("cartDelivery");

    const cartTotal =
        document.getElementById("cartTotal");

    const whatsappOrder =
        document.getElementById("whatsappOrder");

    const clearCart =
        document.getElementById("clearCart");


    /* =====================================================
       SAVE CART
    ===================================================== */

    function saveCart() {

        localStorage.setItem(
            "vaishuCart",
            JSON.stringify(cart)
        );

    }


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    function money(amount) {

        return "₹" +
            Number(amount).toLocaleString("en-IN");

    }


    /* =====================================================
       OPEN CART
    ===================================================== */

    function openCart() {

        if (cartPanel) {
            cartPanel.classList.add("active");
        }

        if (cartOverlay) {
            cartOverlay.classList.add("active");
        }

    }


    /* =====================================================
       CLOSE CART
    ===================================================== */

    function closeCartPanel() {

        if (cartPanel) {
            cartPanel.classList.remove("active");
        }

        if (cartOverlay) {
            cartOverlay.classList.remove("active");
        }

    }


    if (cartButton) {

        cartButton.addEventListener(
            "click",
            openCart
        );

    }


    if (closeCart) {

        closeCart.addEventListener(
            "click",
            closeCartPanel
        );

    }


    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            closeCartPanel
        );

    }


    /* =====================================================
       ADD TO CART
    ===================================================== */

    function addToCart(name, price) {

        price = Number(price);


        const existing =
            cart.find(function (item) {

                return (
                    item.name === name &&
                    item.price === price
                );

            });


        if (existing) {

            existing.quantity++;

        } else {

            cart.push({

                name: name,

                price: price,

                quantity: 1

            });

        }


        saveCart();

        updateCart();

        openCart();

    }


    /* =====================================================
       REMOVE
    ===================================================== */

    function removeItem(index) {

        cart.splice(index, 1);

        saveCart();

        updateCart();

    }


    /* =====================================================
       CHANGE QUANTITY
    ===================================================== */

    function changeQuantity(index, amount) {

        if (!cart[index]) {
            return;
        }


        cart[index].quantity += amount;


        if (cart[index].quantity <= 0) {

            cart.splice(index, 1);

        }


        saveCart();

        updateCart();

    }


    /* =====================================================
       TOTALS
    ===================================================== */

    function getSubtotal() {

        return cart.reduce(
            function (total, item) {

                return total +
                    item.price * item.quantity;

            },
            0
        );

    }


    function getDelivery() {

        return cart.length > 0
            ? DELIVERY_CHARGE
            : 0;

    }


    function getTotal() {

        return getSubtotal() +
            getDelivery();

    }


    /* =====================================================
       UPDATE CART COUNT
    ===================================================== */

    function updateCartCount() {

    const count =
        cart.reduce(
            function (total, item) {
                return total +
                    item.quantity;
            },
            0
        );

    if (cartCount) {
        cartCount.textContent = count;

        cartCount.classList.remove("cart-pop");

        void cartCount.offsetWidth;

        cartCount.classList.add("cart-pop");
    }
}


    /* =====================================================
       DISPLAY CART
    ===================================================== */

    function updateCart() {

        updateCartCount();


        if (!cartItems) {
            return;
        }


        if (cart.length === 0) {

            cartItems.innerHTML = `

                <div class="empty-cart">

                    <div class="empty-cart-icon">
                        🛒
                    </div>

                    <h3>
                        Your cart is empty
                    </h3>

                    <p>
                        Add your favourite dishes
                        to get started.
                    </p>

                </div>

            `;

        } else {

            cartItems.innerHTML = "";


            cart.forEach(
                function (item, index) {

                    const itemTotal =
                        item.price *
                        item.quantity;


                    const div =
                        document.createElement("div");


                    div.className =
                        "cart-item";


                    div.innerHTML = `

                        <div class="cart-item-info">

                            <h4>
                                ${item.name}
                            </h4>

                            <p>
                                ${money(item.price)}
                                each
                            </p>

                        </div>


                        <div class="cart-item-actions">

                            <button
                                class="quantity-button"
                                data-action="minus"
                                data-index="${index}">

                                −

                            </button>


                            <span class="quantity">

                                ${item.quantity}

                            </span>


                            <button
                                class="quantity-button"
                                data-action="plus"
                                data-index="${index}">

                                +

                            </button>

                        </div>


                        <div class="cart-item-price">

                            ${money(itemTotal)}

                        </div>


                        <button
                            class="remove-item"
                            data-action="remove"
                            data-index="${index}">

                            ×

                        </button>

                    `;


                    cartItems.appendChild(div);

                }
            );

        }


        const subtotal =
            getSubtotal();

        const delivery =
            getDelivery();

        const total =
            getTotal();


        if (cartSubtotal) {

            cartSubtotal.textContent =
                money(subtotal);

        }


        if (cartDelivery) {

            cartDelivery.textContent =
                money(delivery);

        }


        if (cartTotal) {

            cartTotal.textContent =
                money(total);

        }

    }


    /* =====================================================
       CART CONTROLS
    ===================================================== */

    if (cartItems) {

        cartItems.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest("button");


                if (!button) {
                    return;
                }


                const index =
                    Number(button.dataset.index);


                const action =
                    button.dataset.action;


                if (action === "plus") {

                    changeQuantity(index, 1);

                }


                if (action === "minus") {

                    changeQuantity(index, -1);

                }


                if (action === "remove") {

                    removeItem(index);

                }

            }
        );

    }


    /* =====================================================
       CLEAR CART
    ===================================================== */

    if (clearCart) {

        clearCart.addEventListener(
            "click",
            function () {

                cart = [];

                saveCart();

                updateCart();

            }
        );

    }


    /* =====================================================
       CREATE BUTTON
    ===================================================== */

    function createButton(
        container,
        name,
        price,
        label
    ) {

        const button =
            document.createElement("button");


        button.type = "button";

        button.className =
            "add-menu-cart";


        button.textContent =
            "🛒 " + label;


        button.addEventListener(
            "click",
            function () {

                addToCart(
                    name,
                    price
                );

            }
        );


        container.appendChild(button);

    }


    /* =====================================================
       FAVOURITE DISHES
    ===================================================== */

    document.querySelectorAll(
        ".food-card"
    ).forEach(
        function (card) {

            const title =
                card.querySelector("h3");


            if (!title) {
                return;
            }


            const name =
                title.textContent.trim();


            const container =
                document.createElement("div");


            container.className =
                "add-to-cart-container";


            /*
             * HALF / FULL
             */

            const options =
                card.querySelectorAll(
                    ".price-options span"
                );


            if (options.length > 0) {

                options.forEach(
                    function (option) {

                        const text =
                            option.textContent.trim();


                        const match =
                            text.match(
                                /(Half|Full)\s*₹\s*([\d,]+)/
                            );


                        if (!match) {
                            return;
                        }


                        const size =
                            match[1];


                        const price =
                            Number(
                                match[2]
                                    .replace(
                                        /,/g,
                                        ""
                                    )
                            );


                        createButton(
                            container,
                            name +
                            " (" +
                            size +
                            ")",
                            price,
                            size +
                            " ₹" +
                            price
                        );

                    }
                );

            }


            /*
             * SINGLE PRICE
             */

            const priceElement =
                card.querySelector(".price");


            if (
                options.length === 0 &&
                priceElement
            ) {

                const match =
                    priceElement.textContent.match(
                        /₹\s*([\d,]+)/
                    );


                if (match) {

                    const price =
                        Number(
                            match[1]
                                .replace(
                                    /,/g,
                                    ""
                                )
                        );


                    createButton(
                        container,
                        name,
                        price,
                        "Add to Cart"
                    );

                }

            }


            card.appendChild(
                container
            );

        }
    );


    /* =====================================================
       NORMAL MENU
    ===================================================== */

    document.querySelectorAll(
        ".menu-item"
    ).forEach(
        function (item) {

            const title =
                item.querySelector("h4");


            const price =
                item.querySelector("strong");


            if (!title || !price) {
                return;
            }


            const name =
                title.textContent.trim();


            const priceText =
                price.textContent.trim();


            const container =
                document.createElement("div");


            container.className =
                "add-to-cart-container";


            /*
             * HALF / FULL MENU ITEM
             *
             * Example:
             * ₹250 / ₹400
             */

            const slashPrices =
                priceText.match(
                    /₹\s*([\d,]+)\s*\/\s*₹?\s*([\d,]+)/
                );


            if (slashPrices) {

                const half =
                    Number(
                        slashPrices[1]
                            .replace(
                                /,/g,
                                ""
                            )
                    );


                const full =
                    Number(
                        slashPrices[2]
                            .replace(
                                /,/g,
                                ""
                            )
                    );


                createButton(
                    container,
                    name + " (Half)",
                    half,
                    "Half ₹" + half
                );


                createButton(
                    container,
                    name + " (Full)",
                    full,
                    "Full ₹" + full
                );

            }


            /*
             * SINGLE PRICE
             */

            else {

                const singlePrice =
                    priceText.match(
                        /₹\s*([\d,]+)/
                    );


                if (singlePrice) {

                    const amount =
                        Number(
                            singlePrice[1]
                                .replace(
                                    /,/g,
                                    ""
                                )
                        );


                    createButton(
                        container,
                        name,
                        amount,
                        "Add to Cart"
                    );

                }

            }


            item.appendChild(
                container
            );

        }
    );


    /* =====================================================
       WHATSAPP
    ===================================================== */

    /* =====================================================
   WHATSAPP ORDER
===================================================== */

if (whatsappOrder) {

    whatsappOrder.addEventListener(
        "click",
        function () {

            /* -----------------------------------------
               CHECK CART
            ----------------------------------------- */

            if (cart.length === 0) {

                alert(
                    "Please add at least one item to your cart."
                );

                return;
            }


            /* -----------------------------------------
               GET CUSTOMER DETAILS
            ----------------------------------------- */

            const customerName =
                document.getElementById("customerName");

            const customerPhone =
                document.getElementById("customerPhone");

            const customerEmail =
                document.getElementById("customerEmail");

            const customerLocation =
                document.getElementById("customerLocation");


            /* -----------------------------------------
               CHECK CUSTOMER DETAILS
            ----------------------------------------- */

            if (!customerName || !customerPhone ||
                !customerEmail || !customerLocation) {

                alert(
                    "Customer details fields are missing. Please check the HTML."
                );

                return;
            }


            const name =
                customerName.value.trim();

            const phone =
                customerPhone.value.trim();

            const email =
                customerEmail.value.trim();

            const location =
                customerLocation.value.trim();


            /* -----------------------------------------
               REQUIRED FIELD VALIDATION
            ----------------------------------------- */

            if (!name) {

                alert("Please enter your full name.");

                customerName.focus();

                return;
            }


            if (!phone) {

                alert("Please enter your phone number.");

                customerPhone.focus();

                return;
            }


            if (!email) {

                alert("Please enter your email address.");

                customerEmail.focus();

                return;
            }


            if (!location) {

                alert("Please enter your delivery location.");

                customerLocation.focus();

                return;
            }


            /* -----------------------------------------
               CREATE WHATSAPP MESSAGE
            ----------------------------------------- */

            let message =
                "Hello Vaishu's Cloud Kitchen! 👋\n\n";


            message +=
                "🍽️ *NEW ORDER*\n\n";


            /* -----------------------------------------
               CUSTOMER DETAILS
            ----------------------------------------- */

            message +=
                "👤 *Customer Details*\n";

            message +=
                "Name: " +
                name +
                "\n";

            message +=
                "Phone: " +
                phone +
                "\n";

            message +=
                "Email: " +
                email +
                "\n";

            message +=
                "Delivery Location: " +
                location +
                "\n\n";


            /* -----------------------------------------
               ORDER DETAILS
            ----------------------------------------- */

            message +=
                "🛒 *Order Details*\n\n";


            cart.forEach(
                function (item) {

                    const itemTotal =
                        item.price *
                        item.quantity;


                    message +=
                        "🍽️ " +
                        item.name +
                        " × " +
                        item.quantity +
                        " — " +
                        money(itemTotal) +
                        "\n";

                }
            );


            /* -----------------------------------------
               TOTALS
            ----------------------------------------- */

            message +=
                "\n--------------------\n";


            message +=
                "Subtotal: " +
                money(getSubtotal()) +
                "\n";


            message +=
                "Delivery: " +
                money(getDelivery()) +
                "\n";


            message +=
                "TOTAL: " +
                money(getTotal()) +
                "\n";


            message +=
                "--------------------\n\n";


            message +=
                "Please confirm my order. Thank you! ❤️";


            /* -----------------------------------------
               OPEN WHATSAPP
            ----------------------------------------- */

            const url =
                "https://wa.me/" +
                WHATSAPP_NUMBER +
                "?text=" +
                encodeURIComponent(message);


            window.open(
                url,
                "_blank"
            );

        }
    );

}

    /* =====================================================
       START
    ===================================================== */

    updateCart();

});
