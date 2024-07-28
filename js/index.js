function querySelectorAndSetInnerHTML(selector, html) {
  document.querySelector(selector).innerHTML = html;
}

function createWeatherHTML(data) {
  return `
      <div class="tem-box">
          <span class="temp">
              <span class="temperature">${data.temperature}</span>
              <span>°</span>
          </span>
      </div>
      <div class="climate-box">
          <div class="air">
              <span class="psPm25">${data.psPm25}</span>
              <span class="psPm25Level">${data.psPm25Level}</span>
          </div>
          <ul class="weather-list">
              <li>
                  <img src="${data.weatherImg}" class="weatherImg" alt="">
                  <span class="weather">${data.weather}</span>
              </li>
              <li class="windDirection">${data.windDirection}</li>
              <li class="windPower">${data.windPower}</li>
          </ul>
      </div>`;
}

function createTodayWeatherHTML(todayWeather) {
  return `
      <div class="range-box">
          <span>今天：</span>
          <span class="range">
              <span class="weather">${todayWeather.weather}</span>
              <span class="temNight">${todayWeather.temNight}</span>
              <span>-</span>
              <span class="temDay">${todayWeather.temDay}</span>
              <span>℃</span>
          </span>
      </div>
      <ul class="sun-list">
          <li>
              <span>紫外线</span>
              <span class="ultraviolet">${todayWeather.ultraviolet}</span>
          </li>
          <li>
              <span>湿度</span>
              <span class="humidity">${todayWeather.humidity}</span>%
          </li>
          <li>
              <span>日出</span>
              <span class="sunriseTime">${todayWeather.sunriseTime}</span>
          </li>
          <li>
              <span>日落</span>
              <span class="sunsetTime">${todayWeather.sunsetTime}</span>
          </li>
      </ul>`;
}

const render = (cityCode) => {
  myAxios({
      url: 'http://hmajax.itheima.net/api/weather',
      method: 'GET',
      params: {
          city: cityCode
      }
  }).then(res => {
      const { data } = res;
      const timeOne = `
          <span class='dataShot'>${data.dateShort}</span>
          <span class='calendar'>农历&nbsp;
          <span class='dataLunar'>${data.dateLunar}</span>
          </span>`;
      querySelectorAndSetInnerHTML('.top-box .title', timeOne);
      querySelectorAndSetInnerHTML('.area', data.area);
      querySelectorAndSetInnerHTML('.weather-box', createWeatherHTML(data));
      querySelectorAndSetInnerHTML('.today-weather', createTodayWeatherHTML(data.todayWeather));
      const htmlStr = data.dayForecast.map(item => {
          return `
              <li class="item">
                  <div class="date-box">
                      <span class="dateFormat">${item.dateFormat}</span>
                      <span class="date">${item.date}</span>
                  </div>
                  <img src="${item.weatherImg}" alt="" class="weatherImg">
                  <span class="weather">${item.weather}</span>
                  <div class="temp">
                      <span class="temNight">${item.temNight}</span>-
                      <span class="temDay">${item.temDay}</span>
                      <span>℃</span>
                  </div>
                  <div class="wind">
                      <span class="windDirection">${item.windDirection}</span>
                      <span class="windPower">&lt;${item.windPower}</span>
                  </div>
              </li>`;
      }).join('');
      querySelectorAndSetInnerHTML('.week-wrap', htmlStr);
  }).catch(error => {
      console.error('Failed to fetch weather data:', error);
  });
};

render('110100');

document.querySelector('.search-city').addEventListener('input', e => {
  const city = e.target.value;
  myAxios({
      url: "https://hmajax.itheima.net/api/weather/city",
      method: 'GET',
      params: {
          city
      }
  }).then(res => {
      document.querySelector('.search-list').innerHTML = res.data.map(item => {
          return `<li class="city-item" data-code="${item.code}">${item.name}</li>`;
      }).join('');
  }).catch(error => {
      console.error('Failed to fetch city data:', error);
  });
});

document.querySelector('.search-list').addEventListener('click', ({ target }) => {
  if (target.tagName === 'LI') {
      render(target.dataset.code);
      document.querySelector('.search-city').value = '';
      document.querySelector('.search-list').innerHTML = '';
  }
});