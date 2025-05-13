<!-- Fetch Data -->
<script>
  import { onMount } from "svelte";

  onMount(async () => {
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));
    if (!checkoutData) {
      alert("No checkout data found. Redirecting back to registration page.");
      window.location.href = "/acm-member";
      return;
    }

    document.getElementById("main-checkout").innerHTML = `
      <h1>User Details</h1>
      <p><strong>Name:</strong> ${checkoutData.personalInfo.name}</p>
      <p><strong>Email:</strong> ${checkoutData.personalInfo.email}</p>
      <p><strong>Registration Type:</strong> ${checkoutData.selectedRegistrationType}</p>
      <p><strong>Total Amount:</strong> €${checkoutData.cartTotal.toFixed(2)}</p>
      </br>
      <h3>Thank you for registering for DIS 2025!</h3>
      <p> We've received your registration details. You'll receive an email with the confirmation and details for the conference.</p>
    `;

    const paymentType = "No Payment";

    const bodyData = JSON.stringify({
      name: checkoutData.personalInfo.name,
      email: checkoutData.personalInfo.email,
      acmnumber: checkoutData.personalInfo.acmnumber || "Non Member",
      registrationType: checkoutData.selectedRegistrationType,
      company: checkoutData.badgeInfo.company,
      jobtitle: checkoutData.badgeInfo.jobtitle,
      "fname-badge": checkoutData.badgeInfo["fname-badge"],
      "lname-badge": checkoutData.badgeInfo["lname-badge"],
      pronouns: checkoutData.badgeInfo.pronouns,
      sneedsacm: checkoutData.badgeInfo["sneeds-acm"],
      sneedsconference: checkoutData.badgeInfo["sneeds-conference"],
      billingaddress: checkoutData.billingInfo.address,
      billingname: checkoutData.billingInfo["name-billing"],
      billingcity: checkoutData.billingInfo.city,
      billingcountry: checkoutData.billingInfo.country,
      phone: checkoutData.billingInfo.phone,
      postalcode: checkoutData.billingInfo["postal-code"],
      state: checkoutData.billingInfo.state,
      vat: checkoutData.billingInfo.vat,
      cartItems: checkoutData.cartItems[0]?.title,
      cartprice: checkoutData.cartItems[0]?.price,
      ...(checkoutData.cartItems[1] && {
        secondCartItem: checkoutData.cartItems[1].title,
        secondCartPrice: checkoutData.cartItems[1].price,
      }),
      amount: checkoutData.cartTotal,
      "email-consent": checkoutData.preferencesInfo["email-consent"],
      "email-opt-in": checkoutData.preferencesInfo["email-opt-in"],
      "postal-mail-consent": checkoutData.preferencesInfo["postal-mail-consent"],
      speaker: checkoutData.preferencesInfo.speaker,
      type: paymentType,
    });

    try {
      const response = await fetch("/api/createRegistrant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      console.log("Registration successful:", result);
    } catch (error) {
      console.error("Error submitting registration:", error);
      alert("Something went wrong submitting your registration.");
    }
  });
</script>



<!--Heading-->
<nav
  class="navbar sticky-top navbar-expand-m justify-content-between flex-column flex-md-row navbar-light"
  style="background-color: #F9F9F9;"
>
  <a class="navbar-brand" href="https://dis.acm.org/2025/">
    <img src="images/DIS_branding-08.png" width="60" alt="" /> DIS 2025
  </a>
  <a href="/" class="btn btn-link"> Main Registration Page</a>
  <a href="https://dis.acm.org/2025/attending" class="btn btn-link">
    Registration Rates and Information
  </a>
</nav>

<div class="float-sm-left" style="padding-bottom: 5vh;">
  <img
    src="images/header_homepage.jpg"
    class="img-fluid"
    alt="DIS 2025 in Madeira"
  />
</div>

<!-- Checkout Container -->
<div class="container align-items-center" style="padding-bottom: 5vh;">
  <div class="col" id="main-checkout"></div>
</div>

<div class="container justify-content-center align-items-center">
  <h1>Staying in Madeira</h1>

  <h2>Conference Venue – Pestana Casino Park</h2>

  <p>
    The Pestana Casino Park is a 5-star hotel in Funchal, Madeira, surrounded by
    15,000 m² of private gardens. The hotel was designed by world-renowned Óscar
    Niemeyer, a Brazilian architect and key figure in the development of Modern
    Architecture. The hotel is adjacent to Funchal’s bay cruise port. Plus, it
    is only 5 minutes on foot from the city center and the epicenter of the
    city’s social and cultural life. Its privileged location on the shores of
    the Atlantic Ocean makes it one of the most famous hotels on the island of
    Madeira.
  </p>

  <p>
    There are other hotel options you can book near the DIS conference venue.<br
    />
    You have the option to book airport transfers with your hotel package.
    <br />
    You can find all information and conference rates in the Booking website below
  </p>
  <a href="https://travel-to-madeira.com/dis-2025/" class="btn btn-link btn-lg">
    Booking
  </a>
</div>

<!--Footer-->
<div class="container" style="padding:2vh;">
  <div class="row justify-content-center" style="padding:2vh;">
    <div class="col">
      <img
        alt="ACM logo"
        src="https://images.cvent.com/805440b54d1d4794ad337ef0b9cb88e5/pix/9d1b62fd7a7140d08267ebaf7ff88043!_!dffc38a4627d06d5d8305029c800b30a.jpg?f=webp"
        style="max-width: 20vh;"
      />
    </div>
    <div class="col">
      <img
        alt="SIGCHI logo"
        src="https://images.cvent.com/805440b54d1d4794ad337ef0b9cb88e5/pix/0a24906b749441e9b5bd370e489d4f5a!_!c3da50606b948eb8450cb110f8df6b9c.jpeg?f=webp"
        style="max-width: 20vh;"
      />
    </div>
    <div class="col">
      <img
        alt="Adobe logo"
        src="https://dis.acm.org/2025/wp-content/uploads/2024/07/logo_Adobe-crop.png"
        style="max-width: 20vh;"
      />
    </div>
    <div class="col">
      <img
        alt=""
        src="https://dis.acm.org/2025/wp-content/uploads/2025/01/logo_ITI-crop-300x144.png"
        style="max-width: 20vh;"
      />
    </div>
    <div class="col">
      <img
        alt=""
        src="https://dis.acm.org/2025/wp-content/uploads/2025/01/logo_Madeira-crop-300x109.png"
        style="max-width: 20vh;"
      />
    </div>
  </div>

  <div class="row align-items-center justify-content-center">
    <a
      class="btn btn-floating"
      href="https://hci.social/@dis"
      aria-label="mastodon"
      role="button"><i class="bi bi-mastodon"></i></a
    >
    <!-- <a class="btn btn-floating" href="https://x.com/acm_dis" aria-label="x" role="button"><i class="bi bi-x" ></i></a> -->
    <a
      class="btn btn-floating"
      href="https://www.instagram.com/acm_dis/"
      aria-label="instagram"
      role="button"><i class="bi bi-instagram"></i></a
    >
    <a
      class="btn btn-floating"
      href="https://www.linkedin.com/company/acm-dis"
      aria-label="linkedin"
      role="button"><i class="bi bi-linkedin"></i></a
    >
    <!-- <a class="btn btn-floating" href="https://acm-dis.bsky.social/" aria-label="bluesky" role="button"><i class="fa-brands fa-bluesky"></i></a>
          <a class="btn btn-floating" href="https://www.threads.net/@acm_dis" aria-label="threads" role="button"><i class="bi bi-threads"></i></a> -->
  </div>
  <p class=" text-center fs-6">
    ACM Designing Interactive Systems Conference 2025
  </p>
</div>
