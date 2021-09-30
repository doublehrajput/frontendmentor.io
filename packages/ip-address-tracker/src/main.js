const App = (function () {
  const IPIFY_API_KEY = "at_XMyLKmYFvr9xz8blHnE3bLuaY81IM";

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoibGVvbm1pY2hhbGFrIiwiYSI6ImNrdTQ1MThkdTJ4dWUyb3A4MHR6eXlwcGoifQ.1TgXN8HncHOfoUGc_XCdKA";

  let map = false;

  const request = (options) =>
    fetch(options).then((res) => {
      const response = res.json();

      if (res.status >= 200 && res.status < 300) return response;
      throw new Error("Input correct IPv4 or IPv6 address.");
    });

  const _init = () => {
    updateLocation();

    document.querySelector("#submit-button").addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        let ip = document.querySelector("#ipaddress-input").value;
        updateLocation({ ipAddress: ip, domain: ip });
      },
      false
    );
  };

  const encodeQueryString = (params) => {
    let query = [];

    for (const [k, v] of Object.entries(params)) {
      query.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }

    return "?" + query.join("&");
  };

  const drawMap = (latlng) => {
    if (map) {
      map.remove();
    }

    map = L.map("mapid").setView(latlng, 13);

    L.tileLayer(
      `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`,
      {
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
      }
    ).addTo(map);

    let icon = L.icon({
      iconUrl: "images/icon-location.svg",
      iconSize: [26, 36], // size of the icon
    });

    L.marker(latlng, { icon }).addTo(map);
  };

  const updateLocation = async (options = {}) => {
    const ipaddressDiv = document.querySelector("#ip-address");
    const locationDiv = document.querySelector("#location");
    const timezoneDiv = document.querySelector("#timezone");
    const ispDiv = document.querySelector("#isp");

    ipaddressDiv.classList.add("loading");
    locationDiv.classList.add("loading");
    timezoneDiv.classList.add("loading");
    ispDiv.classList.add("loading");

    let params = Object.assign({}, options, { apiKey: IPIFY_API_KEY });
    let url = `https://geo.ipify.org/api/v1` + encodeQueryString(params);

    request(url)
      .then((res) => {
        let {
          ip,
          location: { timezone, city, country, lat, lng },
          isp,
        } = res;

        ipaddressDiv.innerHTML = ip;
        locationDiv.innerHTML = `${city}, ${country}`;
        timezoneDiv.innerHTML = timezone;
        ispDiv.innerHTML = isp;

        drawMap([lat, lng]);
      })
      .catch((e) => {
        alert(e.message);
      })
      .finally(() => {
        ipaddressDiv.classList.remove("loading");
        locationDiv.classList.remove("loading");
        timezoneDiv.classList.remove("loading");
        ispDiv.classList.remove("loading");
      });
  };

  return {
    init: () => {
      _init();
    },
  };
})();

App.init();
