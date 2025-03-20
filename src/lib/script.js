if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    const radios = document.querySelectorAll('input[name="registrationType"]');
    const priceElement = document.getElementById("price-full");

    let priceTiers = [
        { start: new Date("2025-01-01"), end: new Date("2025-05-31"), price: "€ 800.00" }, //Early Bird
        { start: new Date("2025-06-01"), end: new Date("2025-06-30"), price: "€ 900.00" },
        { start: new Date("2025-07-05"), end: new Date("2025-07-09"), price: "€ 1000.00" }  // On-site
    ];

    radios.forEach((radio) => {
        radio.addEventListener("change", updateCartAndPrice);
    });

    initializeCartEventListeners();
    updateCartAndPrice(); // Initial call to update the cart and price based on the default selection
}

function initializeCartEventListeners() {
    var removeCartItemButton = document.getElementsByClassName('btn-danger');
    for (var i = 0; i < removeCartItemButton.length; i++) {
        var button = removeCartItemButton[i];
        button.addEventListener('click', removeCartItem);
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button');
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked);
    }

    document.getElementById('purchaseTicket').addEventListener('click', purchaseTicket);
}

function updateCartAndPrice(event) {
    const selectedRadio = document.querySelector('input[name="registrationType"]:checked');

    if (!selectedRadio) {
        console.error("No registration type selected.");
        return;
    }

    const selectedValue = selectedRadio.value;

    let priceTiers = [
        { start: new Date("2025-01-01"), end: new Date("2025-06-03"), price: "€ 800.00" }, //Early Bird
        { start: new Date("2025-06-04"), end: new Date("2025-07-03"), price: "€ 900.00" },
        { start: new Date("2025-07-04"), end: new Date("2025-07-09"), price: "€ 1000.00" }  // On-site
    ];

    let priceWorkshopTiers = [
        { start: new Date("2025-01-01"), end: new Date("2025-06-03"), price: "€ 150.00" }, //Early Bird
        { start: new Date("2025-06-04"), end: new Date("2025-07-09"), price: "€ 180.00" }  // Late
    ];

    if (selectedValue === "student-non-member") {
        priceTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-03"), price: "€ 450.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-03"), price: "€ 550.00" },
            { start: new Date("2025-07-04"), end: new Date("2025-07-09"), price: "€ 1000.00" }  // On-site
        ];
        priceWorkshopTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-03"), price: "€ 100.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-09"), price: "€ 120.00" }  // Late

        ];
    } else if (selectedValue === "non-acm-member") {
        priceTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-03"), price: "€ 800.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-03"), price: "€ 900.00" },
            { start: new Date("2025-07-04"), end: new Date("2025-07-09"), price: "€ 1000.00" }  // On-site
        ];
        priceWorkshopTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-03"), price: "€ 150.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-09"), price: "€ 180.00" }  // Late
        ];
    } else if (selectedValue === "acm-member") {
        priceTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-03"), price: "€ 750.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-03"), price: "€ 800.00" },
            { start: new Date("2025-07-04"), end: new Date("2025-07-09"), price: "€ 1000.00" }  // On-site
        ];
        priceWorkshopTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-03"), price: "€ 120.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-09"), price: "€ 150.00" }  // Late

        ];
    } else if (selectedValue === "student-acm-member") {
        priceTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-03"), price: "€ 400.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-03"), price: "€ 450.00" },
            { start: new Date("2025-07-04"), end: new Date("2025-07-09"), price: "€ 1000.00" }  // On-site
        ];
        priceWorkshopTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-03"), price: "€ 80.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-09"), price: "€ 100.00" }  // Late

        ];
    }

    const today = new Date();

    // Find the matching price tier
    const currentTier = priceTiers.find(
        (tier) => today >= tier.start && today <= tier.end
    );

    const currentWorkshopTier = priceWorkshopTiers.find(
        (tier) => today >= tier.start && today <= tier.end
    );

    // Update the price element with the appropriate price
    const priceElement = document.getElementById("price-full");
    const priceWorkshop = document.getElementById("price-workshop");
    if (currentTier) {
        priceElement.textContent = currentTier.price;
        priceWorkshop.textContent = currentWorkshopTier.price;
    } else {
        priceElement.textContent = "Unavailable"; // Default if no tier matches          
    }

    
    // Update the price element with the appropriate price based on the date
    const priceGala = document.getElementById("price-dinner");

    // Set specific dates and prices
    const changeDate = new Date("2025-06-04");


    if (today < changeDate) {
        priceGala.textContent = "€ 100.00";
    } else {
        priceGala.textContent = "€ 120.00";
    }


    updateCartBasedOnRadio();
}

function updateCartBasedOnRadio() {
    const selectedRadio = document.querySelector('input[name="registrationType"]:checked').value;
    const cartItemContainer = document.getElementsByClassName('cart-items')[0];
    const cartItemNames = cartItemContainer.getElementsByClassName('cart-item-title');
    
    for (let i = 0; i < cartItemNames.length; i++) {
        const cartItemName = cartItemNames[i].innerText;
        if (cartItemName !== selectedRadio) {
            cartItemNames[i].parentElement.parentElement.remove();
        }
    }
    updateCartTotal();
}


function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement;
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    addItemToCart(title, price);
    updateCartTotal();
}

function addItemToCart(title, price) {
    var cartRow = document.createElement('tr');
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    var cartItemPrices = cartItems.getElementsByClassName('cart-price');

    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title && cartItemPrices[i].innerText === price) {
            alert('This item has already been added to the cart with the same price!');
            return;
        }
    }

    var cartRowContents = `
        <td class="cart-item cart-column">
            <span class="cart-item-title">${title}</span>                  
        </td>
        <td class="cart-item cart-column">
            <span class="cart-price cart-column">${price}</span>
        </td>
        <td class="cart-item cart-column">
            <button class="btn btn-danger" type="button">Remove</button>
        </td>        
    `;
     
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
}

async function purchaseTicket() {
    const acmNumberField = document.getElementById('acmNumber');
    let memberStatus = true;
    
    if (acmNumberField) {
        memberStatus = await isMember(acmNumberField.value);
    }
    
    if (!memberStatus) {
        alert("Check ACM Number or type of Registration selected");
        return;
    }

    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    let allChecked = true;

    allCheckboxes.forEach((checkbox) => {
        if (!checkbox.checked) {
            allChecked = false;
        }
    });

    if (!allChecked) {
        alert("Please check the required information before proceeding!");
        return;
    }

    const forms = document.querySelectorAll("form, .form");
    const data = {};
    let allFormsValid = true;

    forms.forEach((form) => {
        if (form.id === "contactForm") {
            return;
        }

        let formValid = true; 
        const formObject = {};

        Array.from(form.elements || []).forEach((element) => {
            if (element.hasAttribute('required') && !element.value) {
                element.style.border = "2px solid red";
                formValid = false;
            } else {
                element.style.border = "";
            }

            if (element.name && element.value) {
                formObject[element.name] = element.value;
            }
        });

        if (!formValid) {
            allFormsValid = false;
        }

        if (formValid) {
            const formId = form.id || `form_${Math.random().toString(36).substring(2)}`;
            data[formId] = formObject;
        }
    });

    if (!allFormsValid) {
        alert("Please fill in all required fields.");
        return; 
    }

    // Check if the selected registration type matches at least one cart item
    const selectedRadio = document.querySelector('input[name="registrationType"]:checked').value;
    
    // Add the selected registration type to the data object
    data.selectedRegistrationType = selectedRadio;

    const cartData = updateCartTotal();
    if (cartData) {
        data.cartItems = cartData.items;
        data.cartTotal = cartData.total;
    }

    // Store the data in localStorage for use in checkout-page
    localStorage.setItem('checkoutData', JSON.stringify(data));
    console.log(JSON.parse(localStorage.getItem('checkoutData')))
    
    // Redirect to the checkout page
    window.location.href = '/checkout-page';
}


function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;
    var cartItems = [];

    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var titleElement = cartRow.getElementsByClassName('cart-item-title')[0];

        var price = parseFloat(priceElement.innerText.replace('€ ', ''));
        var title = titleElement.innerText;

        total = total + price;

        cartItems.push({
            title: title,
            price: price
        });
    }

    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = '€ ' + total + '.00';

    return {
        total: total,
        items: cartItems
    };
}

async function isMember(acmNumber) {
    console.log("ACM Number:", acmNumber);

    if (!acmNumber) {
        console.error("ACM Number is missing.");
        return false;
    }

    try {
        const response = await fetch(`/api/checkout/confRegistration?clientNo=${acmNumber}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.THISSIGACTIVE !== "active") {
            alert("Not an active ACM member number.");
            return false;
        }

        const selectedRegistrationType = document.querySelector('input[name="registrationType"]:checked')?.value;
        if (!selectedRegistrationType) {
            console.warn("No registration type selected.");
            return false;
        }

        console.log("Selected Registration Type:", selectedRegistrationType);
        if (selectedRegistrationType === "acm-member") {
            return ["prof_mbr", "sig_mbr"].includes(data.CLASS);
        } else if (selectedRegistrationType === "student-acm-member"){
            return ["stu_mbr", "sig_stu_mbr"].includes(data.CLASS);
        }
        return false;

    } catch (error) {
        console.error("Error fetching conf registration:", error);
        return null;
    }
}
