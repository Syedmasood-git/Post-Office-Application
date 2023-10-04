const btn = document.getElementById("btn");
const homeContainer = document.querySelector(".home-container");
const ipAdd = document.getElementById("ipAddress");
const ipDetails = document.getElementById("ip-details");
const mapContainer = document.querySelector(".map-container");
const topD = document.querySelector(".top");
const moreInfoDetails = document.querySelector(".more-info-details");
const cards = document.querySelector(".cards");
const searchInput = document.getElementById("search");
let ipAddress;
let pincodeData; // Declare a variable for pincodeData

getIP();

async function getIP() {
  const endPoint = `https://api.ipify.org?format=json`;
  try {
    const response = await fetch(endPoint);
    const data = await response.json();
    console.log(data);
    ipAdd.innerText = data.ip;
  } catch (error) {
    console.log(error);
  }
}

btn.addEventListener("click", () => {
  homeContainer.style.display = "none";

  getIPAdd();
  async function getIPAdd() {
    const endPoint = `https://api.ipify.org?format=json`;
    try {
      const response = await fetch(endPoint);
      const data = await response.json();
      // console.log(data);
      getDetails(data.ip);
    } catch (error) {
      console.log(error);
    }
  }

  async function getDetails(IP) {
    const endPoint = `https://ipapi.co/${IP}/json/`;
    try {
      const response = await fetch(endPoint);
      const userData = await response.json();
      console.log(userData);
      topD.innerHTML = `
        <div class="ip-address">
          <h2>IP Address : <span id="ip-details">${userData.ip}</span></h2>
        </div>
        <div class="top-details">
        <div class="lat-long">
            <h2 id="lat">Lat: ${userData.latitude}</h2>
            <h2 id="long">Long: ${userData.longitude}</h2>
          </div>
          <div class="city-region">
            <h2 id="city">City: ${userData.city}</h2>
            <h2 id="region">Region: ${userData.region}</h2>
          </div>
          <div class="org-host">
            <h2 id="org">Organisation: ${userData.org}</h2>
            <h2 id="host">Hostname: ${userData.network}</h2>
          </div>
          </div>
        `;
      mapContainer.innerHTML = `<iframe
        src="https://maps.google.com/maps?q=${userData.latitude},${userData.longitude}&output=embed"
        frameborder="0"
        style="border: 0"
      ></iframe>`;

      getPincodeDetails(userData.postal);
    } catch (error) {
      console.log(error);
    }
  }

  async function getPincodeDetails(pincode) {
    console.log(pincode);
    const endPoint = `https://api.postalpincode.in/pincode/${pincode}`;
    try {
      const response = await fetch(endPoint);
      pincodeData = await response.json(); // Store pincodeData in the outer scope
      console.log(pincodeData);
      let datetime_str = new Date().toLocaleString("en-US", {
        timeZone: `Asia/Kolkata`,
      });
      moreInfoDetails.innerHTML = `
        <h3>Time Zone: Asia/Kolkata</h3>
        <h3>Date And Time: ${datetime_str}</h3>
        <h3>Pincode: ${pincode}</h3>
        <h3>Message: ${pincodeData[0].Message}</h3>`;
      renderCards(""); // Pass an empty searchTerm
    } catch (error) {
      console.log(error);
    }
  }

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    renderCards(searchTerm);
  });

  function renderCards(searchTerm) {
    console.log(pincodeData); // Access pincodeData from the outer scope
    cards.innerHTML = "";

    if (pincodeData) {
      pincodeData[0].PostOffice.forEach((pin) => {
        const name = pin.Name.toLowerCase();
        const branchType = pin.BranchType.toLowerCase();
        const district = pin.District.toLowerCase();

        if (
          name.includes(searchTerm) ||
          branchType.includes(searchTerm) ||
          district.includes(searchTerm)
        ) {
          cards.innerHTML += `
            <div class="card">
              <h2>Name: ${pin.Name}</h2>
              <h2>Branch Type: ${pin.BranchType}</h2>
              <h2>Delivery Status: ${pin.DeliveryStatus}</h2>
              <h2>District: ${pin.District}</h2>
              <h2>Division: ${pin.Division}</h2>
            </div>`;
        }
      });
    }
  }
});
