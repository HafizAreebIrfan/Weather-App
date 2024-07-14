const search = document.querySelector("#search");
const submitbtn = document.querySelector(".submit");
const header = document.querySelector(".header");

const nowdegree = document.querySelector(".nowdegree");
const nowweather = document.querySelector(".nowweather");
const city = document.querySelector(".city");
const georgdate = document.querySelector(".georgdate");
const hijridate = document.querySelector(".hijridate");
const maxmintemp = document.querySelector(".maxmintemp");
const uv = document.querySelector(".uv");
const winddirection = document.querySelector(".winddirection");

const feeltemp = document.querySelector(".feeltemp");
const humidpercent = document.querySelector(".humidpercent");
const windspeed = document.querySelector(".windspeed");
const sunrisehead = document.querySelector(".sunrisehead");
const sunsethead = document.querySelector(".sunsethead");
const airqualityhead = document.querySelector(".airqualityhead");
const forecast = document.querySelector(".forecast");

//icons
const nowicon = document.querySelector(".nowicon");
const feelicon = document.querySelector(".feelicon");
const humidicon = document.querySelector(".humidicon");
const windicon = document.querySelector(".windicon");
const dayicon = document.querySelectorAll(".dayicon");
const foreicon = document.querySelector(".foreicon");

//daytemp
const day1maxtemp = document.querySelector(".day1maxtemp");
const day2maxtemp = document.querySelector(".day2maxtemp");
const day3maxtemp = document.querySelector(".day3maxtemp");

const day1mintemp = document.querySelector(".day1mintemp");
const day2mintemp = document.querySelector(".day2mintemp");
const day3mintemp = document.querySelector(".day3mintemp");

const forecastday1 = document.querySelector(".forecastday1");
const forecastday2 = document.querySelector(".forecastday2");
const forecastday3 = document.querySelector(".forecastday3");

//dayweather
const day1weather = document.querySelector(".day1weather");
const day2weather = document.querySelector(".day2weather");
const day3weather = document.querySelector(".day3weather");
let intervalId;

foreicon.addEventListener("click", () => {
  if (forecast.classList.contains("show")) {
    forecast.classList.remove("show");
    foreicon.innerHTML = `<i class="fas fa-angle-up"></i>`;
  } else {
    forecast.classList.add("show");
    foreicon.innerHTML = `<i class="fas fa-angle-down"></i>`;
  }
});

submitbtn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  if (search.value === "") {
    alert("Please enter city name");
  }

  weatherapi();
  forecastapi();
});

window.addEventListener("load", async () => {
  //ipurl
  let ipurl = `https://api.ipgeolocation.io/ipgeo?apiKey=ab6af09c15b04f7483171cc2180e2d5c`;
  let ipresponse = await fetch(ipurl);
  let ipdata = await ipresponse.json();
  //weather api
  let weatherURLBase = `https://api.weatherapi.com/v1/forecast.json?key=39e38d5b03284e95a19102439241107&q=${ipdata.city}&days=5`;
  let weatherresponse = await fetch(weatherURLBase);
  let weatherdata = await weatherresponse.json();
  //airquality api
  let airqualityURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${ipdata.latitude}&lon=${ipdata.longitude}&appid=caaf27dbce8b55041d5283719e9a071c&units=metric`;
  let airqualityresponse = await fetch(airqualityURL);
  let airqualitydata = await airqualityresponse.json();
  
  weatherinfo(weatherresponse, weatherdata, airqualitydata);
  //forecast api
  let forecastURL = `https://api.weatherapi.com/v1/forecast.json?key=39e38d5b03284e95a19102439241107&q=${ipdata.city}&days=5`;
  let forecastresponse = await fetch(forecastURL);
  let forecastdata = await forecastresponse.json();
  forecastinfo(forecastdata);

  //update date time day
  const getDayDateTime = async () => {
    let sunsetTime = new Date(weatherdata.forecast.forecastday[0].astro.sunset);
    let timezone = new Date().toLocaleString("en-US", {
      timeZone: `${ipdata.time_zone.name}`,
    });
    let userday = new Date(timezone);
    let dayName = userday.toLocaleDateString("en-US", { weekday: "long" });
    georgdate.innerText = dayName;
    georgdate.innerText += ` ${timezone}`;

    let gethijridate;
    if (userday > sunsetTime) {
      let tomorrow = new Date(userday);
      tomorrow.setDate(tomorrow.getDate() + 1);
      gethijridate = `${tomorrow.getDate()}-${tomorrow.getMonth() + 1}-${tomorrow.getFullYear()}`;
    }
    else{
      gethijridate = `${userday.getDate()}-${userday.getMonth() + 1}-${userday.getFullYear()}`;
    }
    let hijriurl = `https://api.aladhan.com/v1/gToH/${gethijridate}`;
    let hijriresposne = await fetch(hijriurl);
    let hijridata = await hijriresposne.json();
    let hijridateineng = hijridata.data.hijri.date;

    //convert hijridate to arabic format
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const convertToArabicNumerals = (numberString) => {
      return numberString.split('').map(char => {
        if (char >= '0' && char <= '9') {
          return arabicNumerals[char];
        }
        return char;
      }).join('');
    };
    let hijriDateInArabic = convertToArabicNumerals(hijridateineng);
    hijridate.innerText = `${hijridata.data.hijri.weekday.ar} ${hijriDateInArabic} ${hijridata.data.hijri.month.ar}`;
  };
  clearInterval(intervalId);
  intervalId = setInterval(getDayDateTime, 1000);
});

const weatherapi = async () => {
  //weather api
  let weatherURLBase = `https://api.weatherapi.com/v1/forecast.json?key=39e38d5b03284e95a19102439241107&q=${search.value}&days=5`;
  let weatherresponse = await fetch(weatherURLBase);
  let weatherdata = await weatherresponse.json();
  //airquality api
  let latitude = weatherdata.location.lat;
  let longitude = weatherdata.location.lon;
  let airqualityURL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=caaf27dbce8b55041d5283719e9a071c&units=metric`;
  let airqualityresponse = await fetch(airqualityURL);
  let airqualitydata = await airqualityresponse.json();

  weatherinfo(weatherresponse, weatherdata, airqualitydata);
};

const weatherinfo = async (weatherresponse, weatherdata, airqualitydata) => {
  if (weatherresponse.ok) {
    //update date time day
    const getDayDateTime = () => {
      let timezone = new Date().toLocaleString("en-US", {
        timeZone: `${weatherdata.location.tz_id}`,
      });
      let userday = new Date(timezone);
      let dayName = userday.toLocaleDateString("en-US", { weekday: "long" });
      georgdate.innerText = dayName;
      georgdate.innerText += ` ${timezone}`;
    };
    clearInterval(intervalId);
    intervalId = setInterval(getDayDateTime, 1000);
    const weatherConditions = [
      "Sunny",
      "Clear",
      "Partly cloudy",
      "Cloudy",
      "Overcast",
      "Mist",
      "Patchy rain possible",
      "Patchy rain nearby",
      "Patchy snow possible",
      "Patchy sleet possible",
      "Patchy freezing drizzle possible",
      "Thundery outbreaks possible",
      "Blowing snow",
      "Blizzard",
      "Fog",
      "Freezing fog",
      "Patchy light drizzle",
      "Light drizzle",
      "Freezing drizzle",
      "Heavy freezing drizzle",
      "Patchy light rain",
      "Light rain",
      "Moderate rain at times",
      "Moderate rain",
      "Heavy rain at times",
      "Heavy rain",
      "Light freezing rain",
      "Moderate or heavy freezing rain",
      "Light sleet",
      "Moderate or heavy sleet",
      "Patchy light snow",
      "Light snow",
      "Patchy moderate snow",
      "Moderate snow",
      "Patchy heavy snow",
      "Heavy snow",
      "Ice pellets",
      "Light rain shower",
      "Moderate or heavy rain shower",
      "Torrential rain shower",
      "Light sleet showers",
      "Moderate or heavy sleet showers",
      "Light snow showers",
      "Moderate or heavy snow showers",
      "Light showers of ice pellets",
      "Moderate or heavy showers of ice pellets",
      "Patchy light rain with thunder",
      "Moderate or heavy rain with thunder",
      "Patchy light snow with thunder",
      "Moderate or heavy snow with thunder",
    ];

    const icons = {
      113: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/113.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/113.png",
      },
      116: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/116.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/116.png",
      },
      119: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/119.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/119.png",
      },
      122: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/122.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/122.png",
      },
      143: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/143.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/143.png",
      },
      176: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/176.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/176.png",
      },
      179: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/179.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/179.png",
      },
      182: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/182.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/182.png",
      },
      185: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/185.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/185.png",
      },
      200: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/200.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/200.png",
      },
      227: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/227.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/227.png",
      },
      230: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/230.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/230.png",
      },
      248: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/248.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/248.png",
      },
      260: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/260.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/260.png",
      },
      263: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/263.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/263.png",
      },
      266: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/266.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/266.png",
      },
      281: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/281.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/281.png",
      },
      284: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/284.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/284.png",
      },
      293: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/293.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/293.png",
      },
      296: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/296.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/296.png",
      },
      299: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/299.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/299.png",
      },
      302: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/302.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/302.png",
      },
      305: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/305.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/305.png",
      },
      308: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/308.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/308.png",
      },
      311: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/311.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/311.png",
      },
      314: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/314.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/314.png",
      },
      317: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/317.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/317.png",
      },
      320: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/320.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/320.png",
      },
      323: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/323.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/323.png",
      },
      326: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/326.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/326.png",
      },
      329: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/329.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/329.png",
      },
      332: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/332.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/332.png",
      },
      335: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/335.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/335.png",
      },
      338: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/338.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/338.png",
      },
      350: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/350.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/350.png",
      },
      353: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/353.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/353.png",
      },
      356: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/356.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/356.png",
      },
      359: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/359.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/359.png",
      },
      362: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/362.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/362.png",
      },
      365: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/365.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/365.png",
      },
      368: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/368.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/368.png",
      },
      371: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/371.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/371.png",
      },
      374: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/374.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/374.png",
      },
      377: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/377.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/377.png",
      },
      386: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/386.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/386.png",
      },
      389: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/389.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/389.png",
      },
      392: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/392.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/392.png",
      },
      395: {
        day: "https://cdn.weatherapi.com/weather/128x128/day/395.png",
        night: "https://cdn.weatherapi.com/weather/128x128/night/395.png",
      },
    };
    const images = {
      113: {
        day: "./assets/sunny.jpg",
        night: "./assets/clear.jpg",
      },
      116: {
        day: "./assets/partlycloudyday.jpg",
        night: "./assets/partlycloudynight.jpg",
      },
      119: {
        day: "./assets/cloudyday.jpg",
        night: "./assets/cloudynight.jpg",
      },
      122: {
        day: "./assets/overcastday.jpg",
        night: "./assets/overcastnight.jpg",
      },
      143: {
        day: "./assets/mistday.jpg",
        night: "./assets/mistnight.jpg",
      },
      176: {
        day: "./assets/patchyrainday.jpg",
        night: "./assets/patchyrainnight.jpg",
      },
      179: {
        day: "./assets/patchysnowday.jpg",
        night: "./assets/patchysnownight.jpg",
      },
      182: {
        day: "./assets/patchysleetday.jpg",
        night: "./assets/patchysleetnight.jpg",
      },
      185: {
        day: "./assets/freezingdrizzleday.jpg",
        night: "./assets/freezingdrizzlenight.jpg",
      },
      200: {
        day: "./assets/thunderybreaksday.jpg",
        night: "./assets/thunderybreaksnight.jpg",
      },
      227: {
        day: "./assets/blowingsnowday.jpg",
        night: "./assets/blowingsnownight.jpeg",
      },
      230: {
        day: "./assets/blizzardday.jpg",
        night: "./assets/blizzardnight.jpg",
      },
      248: {
        day: "./assets/fogday.jpg",
        night: "./assets/fognight.jpg",
      },
      260: {
        day: "./assets/freezingfogday.jpg",
        night: "./assets/freezingfognight.jpg",
      },
      263: {
        day: "./assets/lightdrizzleday.jpg",
        night: "./assets/lightdrizzlenight.jpeg",
      },
      266: {
        day: "./assets/lightdrizzleday.jpg",
        night: "./assets/lightdrizzlenight.jpeg",
      },
      281: {
        day: "./assets/freezingdrizzleday.jpeg",
        night: "./assets/freezingdrizzlenight.jpeg",
      },
      284: {
        day: "./assets/freezingdrizzleday.jpeg",
        night: "./assets/freezingdrizzlenight.jpeg",
      },
      293: {
        day: "./assets/patchylightrainday.jpg",
        night: "./assets/patchylightrainnight.jpeg",
      },
      296: {
        day: "./assets/patchylightrainday.jpg",
        night: "./assets/patchylightrainnight.jpeg",
      },
      299: {
        day: "./assets/partlycloudyday.jpg",
        night: "./assets/partlycloudyday.jpg",
      },
      302: {
        day: "./assets/moderaterainday.jpeg",
        night: "./assets/moderaterainnight.jpeg",
      },
      305: {
        day: "./assets/heavyrainday.jpeg",
        night: "./assets/heavyrainnight.jpg",
      },
      308: {
        day: "./assets/heavyrainday.jpeg",
        night: "./assets/heavyrainnight.jpg",
      },
      311: {
        day: "./assets/freezingrainday.jpg",
        night: "./assets/freezingrainnight.jpg",
      },
      314: {
        day: "./assets/freezingrainday.jpg",
        night: "./assets/freezingrainnight.jpg",
      },
      317: {
        day: "./assets/patchysleetday.jpg",
        night: "./assets/patchysleetnight.jpg",
      },
      320: {
        day: "./assets/patchysleetday.jpg",
        night: "./assets/patchysleetnight.jpg",
      },
      323: {
        day: "./assets/patchysnowday.jpg",
        night: "./assets/patchysnownight.jpg",
      },
      326: {
        day: "./assets/lightsnowday.jpeg",
        night: "./assets/lightsnownight.jpeg",
      },
      329: {
        day: "./assets/lightsnowday.jpeg",
        night: "./assets/lightsnownight.jpeg",
      },
      332: {
        day: "./assets/heavysnowday.jpeg",
        night: "./assets/heavysnownight.jpeg",
      },
      335: {
        day: "./assets/heavysnowday.jpeg",
        night: "./assets/heavysnownight.jpeg",
      },
      338: {
        day: "./assets/heavysnowday.jpeg",
        night: "./assets/heavysnownight.jpeg",
      },
      350: {
        day: "./assets/icepalletsday.jpeg",
        night: "./assets/icepalletsnight.jpg",
      },
      353: {
        day: "./assets/rainshowerday.jpeg",
        night: "./assets/rainshowernight.jpg",
      },
      356: {
        day: "./assets/rainshowerday.jpeg",
        night: "./assets/rainshowernight.jpg",
      },
      359: {
        day: "./assets/torrentialrainshowerday.jpg",
        night: "./assets/torrentialrainshowernight.jpg",
      },
      362: {
        day: "./assets/sleetshowerday.jpg",
        night: "./assets/patchysleetnight.jpg",
      },
      365: {
        day: "./assets/sleetshowerday.jpg",
        night: "./assets/patchysleetnight.jpg",
      },
      368: {
        day: "./assets/lightsnowday.jpeg",
        night: "./assets/lightsnownight.jpeg",
      },
      371: {
        day: "./assets/heavysnowday.jpeg",
        night: "./assets/haevysnownight.jpeg",
      },
      374: {
        day: "./assets/icepalletsday.jpeg",
        night: "./assets/icepalletsnight.jpeg",
      },
      377: {
        day: "./assets/icepalletsday.jpeg",
        night: "./assets/icepalletsnight.jpeg",
      },
      386: {
        day: "./assets/patchylightrainwiththunderday.jpg",
        night: "./assets/patchylightrainwiththundernight.jpeg",
      },
      389: {
        day: "./assets/patchylightrainwiththunderday.jpg",
        night: "./assets/patchylightrainwiththundernight.jpeg",
      },
      392: {
        day: "./assets/patchylightsnowwiththunderday.jpeg",
        night: "./assets/patchinglightsnowwiththundernight.jpeg",
      },
      395: {
        day: "./assets/patchylightsnowwiththunderday.jpeg",
        night: "./assets/patchinglightsnowwiththundernight.jpeg",
      },
    };

    let weatherCondition = weatherdata.current.condition.text.trim();
    let icon = weatherdata.current.condition.icon
      .split("/")
      .pop()
      .split(".")[0];
    let normalizedWeatherCondition = weatherCondition.toLowerCase();
    let found = weatherConditions.some(
      (condition) => condition.toLowerCase() === normalizedWeatherCondition
    );
    if (found) {
      if (weatherdata.current.is_day === 1) {
        let iconpath = icons[icon].day;
        let imagepath = images[icon].day;
        nowicon.src = iconpath;
        header.style.background = `url(${imagepath})`;
        header.style.backgroundPosition  = "center";
        header.style.backgroundRepeat = "no-repeat";
        header.style.backgroundSize = "cover";
      } else {
        let iconpath = icons[icon].night;
        let imagepath = images[icon].night;
        nowicon.src = iconpath;
        header.style.background = `url(${imagepath})`;
        header.style.backgroundPosition = "center";
        header.style.backgroundRepeat = "no-repeat";
        header.style.backgroundSize = "cover";
      }
    }

    nowdegree.innerText = `${weatherdata.current.temp_c}°C`;
    nowweather.innerText = weatherdata.current.condition.text;
    city.innerText = weatherdata.location.name;
    feeltemp.innerText = `${weatherdata.current.feelslike_c}°C`;
    humidpercent.innerText = `${weatherdata.current.humidity}%`;
    windspeed.innerText = `${weatherdata.current.wind_kph}Km/h`;
    sunrisehead.innerText = weatherdata.forecast.forecastday[0].astro.sunrise;
    sunsethead.innerText = weatherdata.forecast.forecastday[0].astro.sunset;
    maxmintemp.innerText = `${weatherdata.forecast.forecastday[0].day.maxtemp_c}° / ${weatherdata.forecast.forecastday[0].day.mintemp_c}°`;
    uv.innerText = `UV: ${weatherdata.current.uv}`;
    winddirection.innerText = `Wind Direction: ${weatherdata.current.wind_dir}`;

    //air quality data
    if (airqualitydata.list[0].main.aqi === 1) {
      airqualityhead.innerText = `Good`;
    } else if (airqualitydata.list[0].main.aqi === 2) {
      airqualityhead.innerText = `Fair`;
    } else if (airqualitydata.list[0].main.aqi === 3) {
      airqualityhead.innerText = `Moderate`;
    } else if (airqualitydata.list[0].main.aqi === 4) {
      airqualityhead.innerText = `Poor`;
    } else if (airqualitydata.list[0].main.aqi === 5) {
      airqualityhead.innerText = `Very Poor`;
    }
  } else {
    alert("No city found. Please enter valid city name!!", weatherresponse);
  }
};

const forecastapi = async () => {
  //forecast api
  let forecastURL = `https://api.weatherapi.com/v1/forecast.json?key=39e38d5b03284e95a19102439241107&q=${search.value}&days=5`;
  let forecastresponse = await fetch(forecastURL);
  let forecastdata = await forecastresponse.json();
  forecastinfo(forecastdata);
};

const forecastinfo = async (forecastdata) => {
  //fetching data
  day1maxtemp.innerText = `HI: ${forecastdata.forecast.forecastday[0].day.maxtemp_c}°C`;
  day2maxtemp.innerText = `HI: ${forecastdata.forecast.forecastday[1].day.maxtemp_c}°C`;
  day3maxtemp.innerText = `HI: ${forecastdata.forecast.forecastday[2].day.maxtemp_c}°C`;

  day1mintemp.innerText = `LO: ${forecastdata.forecast.forecastday[0].day.mintemp_c}°C`;
  day2mintemp.innerText = `LO: ${forecastdata.forecast.forecastday[1].day.mintemp_c}°C`;
  day3mintemp.innerText = `LO: ${forecastdata.forecast.forecastday[2].day.mintemp_c}°C`;

  let day = new Date();
  const dayNumber = day.getDay();
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  for (let i = 0; i < 3; i++) {
    const nextDayIndex = (dayNumber + i) % 7;
    const nextDayName = weekdays[nextDayIndex];
    if (i === 0) {
      forecastday1.innerText = nextDayName;
    } else if (i === 1) {
      forecastday2.innerText = nextDayName;
    } else if (i === 2) {
      forecastday3.innerText = nextDayName;
    }
  }

  const weatherConditions = [
    "Sunny",
    "Clear",
    "Partly cloudy",
    "Cloudy",
    "Overcast",
    "Mist",
    "Patchy rain possible",
    "Patchy rain nearby",
    "Patchy snow possible",
    "Patchy sleet possible",
    "Patchy freezing drizzle possible",
    "Thundery outbreaks possible",
    "Blowing snow",
    "Blizzard",
    "Fog",
    "Freezing fog",
    "Patchy light drizzle",
    "Light drizzle",
    "Freezing drizzle",
    "Heavy freezing drizzle",
    "Patchy light rain",
    "Light rain",
    "Moderate rain at times",
    "Moderate rain",
    "Heavy rain at times",
    "Heavy rain",
    "Light freezing rain",
    "Moderate or heavy freezing rain",
    "Light sleet",
    "Moderate or heavy sleet",
    "Patchy light snow",
    "Light snow",
    "Patchy moderate snow",
    "Moderate snow",
    "Patchy heavy snow",
    "Heavy snow",
    "Ice pellets",
    "Light rain shower",
    "Moderate or heavy rain shower",
    "Torrential rain shower",
    "Light sleet showers",
    "Moderate or heavy sleet showers",
    "Light snow showers",
    "Moderate or heavy snow showers",
    "Light showers of ice pellets",
    "Moderate or heavy showers of ice pellets",
    "Patchy light rain with thunder",
    "Moderate or heavy rain with thunder",
    "Patchy light snow with thunder",
    "Moderate or heavy snow with thunder",
  ];

  const icons = {
    113: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/113.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/113.png",
    },
    116: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/116.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/116.png",
    },
    119: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/119.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/119.png",
    },
    122: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/122.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/122.png",
    },
    143: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/143.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/143.png",
    },
    176: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/176.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/176.png",
    },
    179: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/179.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/179.png",
    },
    182: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/182.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/182.png",
    },
    185: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/185.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/185.png",
    },
    200: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/200.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/200.png",
    },
    227: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/227.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/227.png",
    },
    230: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/230.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/230.png",
    },
    248: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/248.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/248.png",
    },
    260: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/260.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/260.png",
    },
    263: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/263.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/263.png",
    },
    266: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/266.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/266.png",
    },
    281: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/281.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/281.png",
    },
    284: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/284.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/284.png",
    },
    293: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/293.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/293.png",
    },
    296: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/296.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/296.png",
    },
    299: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/299.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/299.png",
    },
    302: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/302.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/302.png",
    },
    305: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/305.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/305.png",
    },
    308: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/308.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/308.png",
    },
    311: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/311.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/311.png",
    },
    314: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/314.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/314.png",
    },
    317: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/317.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/317.png",
    },
    320: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/320.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/320.png",
    },
    323: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/323.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/323.png",
    },
    326: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/326.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/326.png",
    },
    329: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/329.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/329.png",
    },
    332: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/332.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/332.png",
    },
    335: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/335.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/335.png",
    },
    338: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/338.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/338.png",
    },
    350: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/350.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/350.png",
    },
    353: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/353.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/353.png",
    },
    356: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/356.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/356.png",
    },
    359: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/359.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/359.png",
    },
    362: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/362.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/362.png",
    },
    365: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/365.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/365.png",
    },
    368: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/368.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/368.png",
    },
    371: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/371.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/371.png",
    },
    374: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/374.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/374.png",
    },
    377: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/377.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/377.png",
    },
    386: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/386.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/386.png",
    },
    389: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/389.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/389.png",
    },
    392: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/392.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/392.png",
    },
    395: {
      day: "https://cdn.weatherapi.com/weather/128x128/day/395.png",
      night: "https://cdn.weatherapi.com/weather/128x128/night/395.png",
    },
  };

  const indices = [0, 1, 2];
  for (let i = 0; i < indices.length; i++) {
    let index = indices[i];
    if (forecastdata.forecast.forecastday[index]) {
      let weatherCondition =
        forecastdata.forecast.forecastday[index].day.condition.text.trim();
      let iconcondition = forecastdata.forecast.forecastday[
        index
      ].day.condition.icon
        .split("/")
        .pop()
        .split(".")[0]; //to split / from url and getting the last segment with pop(). Using split('.')[0] to remove the .png extension.
      let normalizedWeatherCondition = weatherCondition.toLowerCase();
      let found =
        weatherConditions.includes(weatherCondition) ===
        normalizedWeatherCondition;

      if (!found) {
        let iconday = icons[iconcondition]?.day;

        if (iconday) {
          dayicon[i].src = iconday;
        } else {
        }
      } else {
      }
    }
  }
  day1weather.innerText =
    forecastdata.forecast.forecastday[0].day.condition.text;
  day2weather.innerText =
    forecastdata.forecast.forecastday[1].day.condition.text;
  day3weather.innerText =
    forecastdata.forecast.forecastday[2].day.condition.text;
};
