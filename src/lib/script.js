import { CATEGORY_H, CATEGORY_I, DISCOUNT_MAIL, SV_MAIL, TEAM_MAIL, VALID_CODES, WORKSHOP_MAIL } from "./constants";

const CATEGORY_H_DISCOUNT_PERCENT = 50;
const CATEGORY_I_DISCOUNT_PERCENT = 75;

const CATEGORY_SV = 100;

const CATEGORY_TEAM = 100;

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
        radio.addEventListener("change", ()=> {
            resetCart();
            updateCartAndPrice();
        });
    });



    initializeCartEventListeners();
    updateCartAndPrice();
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

    const countryInput = document.querySelector('[name="country"]');
    if (countryInput) {
        countryInput.addEventListener('input', updateDiscount);
    }

    const emailInput = document.querySelector('[name="email"]');
    emailInput.addEventListener('input', () => {
        resetCart();
    });

    const wsInput = document.querySelector('[name="workshopName"]');
    if (wsInput) {
        wsInput.addEventListener('input', updateDiscount);
    }

    document.getElementById('purchaseTicket').addEventListener('click', purchaseTicket);
}

function resetCart() {
    const cartItems = document.getElementsByClassName('cart-items')[0];
    cartItems.innerHTML = '';
    updateCartTotal();
}

function updateCartAndPrice(event) {
    const selectedRadio = document.querySelector('input[name="registrationType"]:checked');

    if (!selectedRadio) {
        console.error("No registration type selected.");
        return;
    }

    const selectedValue = selectedRadio.value;

    let priceTiers = [
        { start: new Date("2025-01-01"), end: new Date("2025-06-04"), price: "€ 800.00" }, //Early Bird
        { start: new Date("2025-06-04"), end: new Date("2025-07-04"), price: "€ 900.00" },
        { start: new Date("2025-07-04"), end: new Date("2025-07-09"), price: "€ 1000.00" }  // On-site
    ];

    let priceWorkshopTiers = [
        { start: new Date("2025-01-01"), end: new Date("2025-06-04"), price: "€ 150.00" }, //Early Bird
        { start: new Date("2025-06-04"), end: new Date("2025-07-09"), price: "€ 180.00" }  // Late
    ];

    if (selectedValue === "student-non-member") {
        priceTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-04"), price: "€ 450.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-04"), price: "€ 550.00" },
            { start: new Date("2025-07-04"), end: new Date("2025-07-09"), price: "€ 1000.00" }  // On-site
        ];
        priceWorkshopTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-04"), price: "€ 100.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-09"), price: "€ 120.00" }  // Late

        ];
    } else if (selectedValue === "non-acm-member") {
        priceTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-04"), price: "€ 800.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-04"), price: "€ 900.00" },
            { start: new Date("2025-07-04"), end: new Date("2025-07-09"), price: "€ 1000.00" }  // On-site
        ];
        priceWorkshopTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-04"), price: "€ 150.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-09"), price: "€ 180.00" }  // Late
        ];
    } else if (selectedValue === "acm-member") {
        priceTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-04"), price: "€ 750.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-04"), price: "€ 800.00" },
            { start: new Date("2025-07-04"), end: new Date("2025-07-09"), price: "€ 1000.00" }  // On-site
        ];
        priceWorkshopTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-04"), price: "€ 120.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-09"), price: "€ 150.00" }  // Late

        ];
    } else if (selectedValue === "student-acm-member") {
        priceTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-04"), price: "€ 400.00" }, //Early Bird
            { start: new Date("2025-06-04"), end: new Date("2025-07-04"), price: "€ 450.00" },
            { start: new Date("2025-07-04"), end: new Date("2025-07-09"), price: "€ 1000.00" }  // On-site
        ];
        priceWorkshopTiers = [
            { start: new Date("2025-01-01"), end: new Date("2025-06-04"), price: "€ 80.00" }, //Early Bird
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
    const priceCompanion = document.getElementById("price-companion");

    // Set specific dates and prices
    const changeDate = new Date("2025-06-04");


    if (today < changeDate) {
        priceGala.textContent = "€ 100.00";
        priceCompanion.textContent = "€ 320.00";
    } else {
        priceGala.textContent = "€ 120.00";
        priceCompanion.textContent = "€ 350.00"
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

    if (title.includes('Workshop')){
        const codeInput = document.getElementById('workshopName');
        const code = codeInput?.value.trim();

        const isWorkshop = VALID_CODES.includes(code);
        //console.log("name " + code +" is " + isWorkshop + " VD " + VALID_CODES);

        if (!isWorkshop){
            alert("Invalid workshop code");
            return;
        }
    }


    addItemToCart(title, price);
    updateDiscount();
    
}

function addItemToCart(title, price) {
    var cartRow = document.createElement('tr');
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    var cartItemPrices = cartItems.getElementsByClassName('cart-price');

    

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
    console.log(cartData);
    if (cartData) {
        data.cartItems = cartData.items;
        data.cartTotal = cartData.total;
    }

    // Store the data in localStorage for use in checkout-page
    localStorage.setItem('checkoutData', JSON.stringify(data));
    //console.log(JSON.parse(localStorage.getItem('checkoutData')))
    
    // Redirect to the checkout page
    if (!cartData || cartData.items.length === 0) {
        alert("Your cart is empty. Please add a registration or workshop.");
        return;
    } else if (data.cartTotal == 0 && cartData.items.length != 0) {
        window.location.href = '/complementary-checkout'
    } else {
        window.location.href = '/checkout-page';
    }
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

        total += price;

        cartItems.push({
            title: title,
            price: price
        });
    }

    //total = Math.round(total * 100) / 100;
    total = Math.max(0, Math.round(total * 100) / 100);
    
    document.getElementsByClassName('cart-total-price')[0].innerText = '€ ' + total.toFixed(2);


    return {
        total: total,
        items: cartItems
    };
}

async function isMember(acmNumber) {
    //console.log("ACM Number:", acmNumber);

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
        //console.log("API Response:", data);

        if (data.CLASS == "non_mbr") {
            alert("Not an active ACM member.");
            return false;
        }

        const selectedRegistrationType = document.querySelector('input[name="registrationType"]:checked')?.value;
        if (!selectedRegistrationType) {
            console.warn("No registration type selected.");
            return false;
        }

        //console.log("Selected Registration Type:", selectedRegistrationType);
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

function updateDiscount() {
    const billingCountry = document.querySelector('[name="country"]')?.value?.trim();
    const reg_mail = document.querySelector('[name="email"]')?.value?.trim().toLowerCase();

    const isDiscountedSV = SV_MAIL.includes(reg_mail);
    const isDiscountedTeam = TEAM_MAIL.includes(reg_mail);
    const isDiscountArt = DISCOUNT_MAIL.includes(reg_mail);
    const isDiscountWS = WORKSHOP_MAIL.includes(reg_mail);

    const isDiscountedH = (!isDiscountedSV && !isDiscountedTeam && !isDiscountArt) && CATEGORY_H.includes(billingCountry);
    const isDiscountedI = (!isDiscountedSV && !isDiscountedTeam && !isDiscountArt) && CATEGORY_I.includes(billingCountry);

    const cartItems = document.getElementsByClassName('cart-items')[0];

    // Remove orphaned discount rows
    document.querySelectorAll('.cart-row[data-type="discount"]').forEach(discountRow => {
        const relatedItem = discountRow.dataset.relatedItem;
        const hasItem = [...cartItems.getElementsByClassName('cart-item-title')].some(el =>
            el.innerText.toLowerCase().includes(relatedItem)
        );
        if (!hasItem) discountRow.remove();
    });

    // Apply workshop discount if valid and workshop exists
    const hasWorkshop = [...cartItems.getElementsByClassName('cart-item-title')]
        .some(el => el.innerText.toLowerCase().includes('workshop'));

    if (isDiscountWS && hasWorkshop && !document.querySelector('[data-related-item="workshop"]')) {
        const priceWorkshop = document.getElementById("price-workshop");
        const discountAmount = parseFloat(priceWorkshop.textContent.replace('€ ', '')) || 0;

        const discountRow = document.createElement('tr');
        discountRow.classList.add('cart-row');
        discountRow.dataset.type = 'discount';
        discountRow.dataset.relatedItem = 'workshop';
        discountRow.innerHTML = `
            <td class="cart-item cart-column">
                <span class="cart-item-title">Complementary Workshop</span>                                    
            </td>
            <td class="cart-item cart-column">
                <span class="cart-price cart-column">€ -${discountAmount.toFixed(2)}</span>
            </td>
            <td class="cart-item cart-column"></td>
        `;
        cartItems.append(discountRow);
    }

    // Apply registration discount (mutually exclusive)
    const regRow = [...cartItems.getElementsByClassName('cart-row')].find(row =>
        row.querySelector('.cart-item-title')?.innerText.toLowerCase().includes('conference')
    );

    if (!regRow) {
        updateCartTotal();
        return;
    }

    const alreadyHasConfDiscount = !!document.querySelector('[data-related-item="conference"]');
    if (alreadyHasConfDiscount) {
        updateCartTotal();
        return;
    }

    const priceElement = regRow.querySelector('.cart-price');
    const originalPrice = parseFloat(priceElement.innerText.replace('€ ', ''));

    let discountAmount = 0;
    let label = '';

    if (isDiscountedH) {
        discountAmount = originalPrice * CATEGORY_H_DISCOUNT_PERCENT / 100;
        label = "Category H Discount";
    } else if (isDiscountedI) {
        discountAmount = originalPrice * CATEGORY_I_DISCOUNT_PERCENT / 100;
        label = "Category I Discount";
    } else if (isDiscountedSV) {
        discountAmount = originalPrice * CATEGORY_SV / 100;
        label = "SV Student Discount";
    } else if (isDiscountedTeam) {
        discountAmount = originalPrice * CATEGORY_TEAM / 100;
        label = "Complementary Registration";
    } else if (isDiscountArt) {
        const selectedRadio = document.querySelector('input[name="registrationType"]:checked');

        if (!selectedRadio) {
            console.error("No registration type selected.");
            return;
        }

        const selectedValue = selectedRadio.value;

        if (selectedValue != "non-acm-member" && selectedValue != "acm-member") {
            discountAmount = originalPrice * CATEGORY_TEAM / 100;
            label = "Artist Discount Registration 400€";
        } else {
            alert("Check selected registration type");
            return;
        } 
    }

    if (discountAmount > 0) {
        const discountRow = document.createElement('tr');
        discountRow.classList.add('cart-row');
        discountRow.dataset.type = 'discount';
        discountRow.dataset.relatedItem = 'conference';
        discountRow.innerHTML = `
            <td class="cart-item cart-column">
                <span class="cart-item-title">${label}</span>                                    
            </td>
            <td class="cart-item cart-column">
                <span class="cart-price cart-column">€ -${discountAmount.toFixed(2)}</span>
            </td>
            <td class="cart-item cart-column"></td>
        `;
        cartItems.append(discountRow);
    }

    updateCartTotal();
}
