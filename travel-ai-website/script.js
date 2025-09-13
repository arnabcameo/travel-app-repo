// Navbar login check
window.onload = function() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    document.getElementById("loginOption").style.display = "none";
    document.getElementById("tripsOption").style.display = "block";
    document.getElementById("logoutOption").style.display = "block";
    if (document.getElementById("welcomeMsg")) {
      document.getElementById("loginContainer").style.display = "none";
      document.getElementById("profileContainer").style.display = "block";
      document.getElementById("welcomeMsg").innerText = `Hi ${user.name}, you are logged in with ${user.email}`;
    }
  }
};

function logout() {
  localStorage.removeItem("user");
  alert("You have been logged out.");
  window.location.href = "landing.html";
}

function submitForm() {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!name || !phone || !email || !password) {
    alert("Please fill all fields!");
    return;
  }
  localStorage.setItem("user", JSON.stringify({ name, phone, email }));
  alert(`Welcome, ${name}!`);
  window.location.href = "index.html";
}

function forgotPassword() {
  const email = prompt("Enter your registered email:");
  if (email) {
    alert(`Password reset link sent to ${email} (simulation).`);
  }
}

// Trip Search
function searchTrips() {
  const destination = document.getElementById('destination').value;
  const checkin = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  const guests = document.getElementById('guests').value;
  const budget = document.getElementById('budget').value;
  if (!destination || !checkin || !checkout || !guests || !budget) {
    alert("Please fill all fields!");
    return;
  }
  localStorage.setItem("tripData", JSON.stringify({ destination, checkin, checkout, guests, budget }));
  window.location.href = "itinerary.html";
}

// Select Trip Card
function selectTrip(destination, days, budget) {
  const today = new Date();
  const checkin = today.toISOString().split("T")[0];
  const checkout = new Date(today.setDate(today.getDate() + days)).toISOString().split("T")[0];
  localStorage.setItem("tripData", JSON.stringify({ destination, checkin, checkout, guests: 2, budget }));
  window.location.href = "itinerary.html";
}

// --- NEW: API Integrations ---
const GOOGLE_API_KEY = "AIzaSyBQpmOeeAdVWTHzll4mwUtkI79ZmAqw44Y";   // replace with your key
const WEATHER_API_KEY = "5507c6fcb3ff1b67835044dbcfd581af"; // replace with your key

async function fetchPlaces(city, type = "tourist attractions") {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${type}+in+${city}&key=${GOOGLE_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results.slice(0, 5); // return top 5
}

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
  const res = await fetch(url);
  return await res.json();
}

// Load Itinerary
if (window.location.pathname.includes("itinerary.html")) {
  const tripData = JSON.parse(localStorage.getItem("tripData"));
  if (tripData) {
    document.getElementById("itinerary").innerHTML = `
      <div class="container fade-in">
        <h2>Your ${tripData.destination} Trip</h2>
        <p>🗓 Dates: ${tripData.checkin} to ${tripData.checkout}</p>
        <p>👥 Guests: ${tripData.guests}</p>
        <p>💰 Budget: ₹${tripData.budget}</p>
        <h3>🌦 Weather</h3>
        <p id="weather-info">Loading weather...</p>
        <h3>📍 Top Places to Visit</h3>
        <ul id="places-list"></ul>
      </div>
    `;
    // Fetch and show weather
    fetchWeather(tripData.destination).then(data => {
      if (data.main) {
        document.getElementById("weather-info").innerText =
          `Weather in ${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;
      } else {
        document.getElementById("weather-info").innerText = "Weather data not available.";
      }
    });

    // Fetch and show places
    fetchPlaces(tripData.destination).then(places => {
      const list = document.getElementById("places-list");
      if (places.length === 0) {
        list.innerHTML = "<li>No places found.</li>";
      } else {
        list.innerHTML = "";
        places.forEach(p => {
          const li = document.createElement("li");
          li.textContent = p.name + " - " + (p.formatted_address || "");
          list.appendChild(li);
        });
      }
    }); 
  }
}


