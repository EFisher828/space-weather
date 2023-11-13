// Function to create a timeseries chart
/*function createTimeseriesChart(labels, bz, bt) {
  const ctx = document.getElementById('myChart').getContext('2d');

  // Create the chart
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Bz',
          data: bz,
          borderColor: 'blue',
          fill: false,
        },
        {
          label: 'Bt',
          data: bt,
          borderColor: 'red',
          fill: false,
        }
      ],
    },
    options: {
      elements: {
        point:{
          radius: 0
        }
      }
    }
  });
}*/

// Function to calculate trends in data
function calcTrends(values) {
  // Calculate the difference between the first and last values
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const trend = lastValue - firstValue;

  // Alternatively, calculate the average rate of change
  const sumOfChanges = values.reduce((sum, value, index, array) => {
    if (index > 0) {
      // Calculate the change between the current and previous value
      const change = value - array[index - 1];
      return sum + change;
    }
    return sum;
  }, 0);

  // Calculate the average rate of change per minute
  const averageRateOfChange = sumOfChanges / (values.length - 1);

  return (averageRateOfChange*values.length).toFixed(2);
}

// Function to format and adjust the timezone of timestamps
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  // Subtract 5 hours
  date.setHours(date.getHours() - 5);

  const options = {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    //timeZone: 'America/New_York', // Convert to Eastern Time
  };
  //return new Intl.DateTimeFormat('en-US', options).format(date);
  return date.toLocaleString('en-US', { timeZone: 'America/New_York', ...options });
}

//const bz_zones = [{value: -30,color: '#910AC5'},{value: -25,color: '#6512B9'},{value: -20,color: '#391AAD'},{value: -15,color: '#0D23A1'},{value: -10,color: '#3D55B8'},{value: -5,color: '#6E87D0'},{value: 0,color: '#9EB9E7'},{color: '#CFEBFF'}]
const bz_zones = [{value: -30,color: '#910AC5'},{value: -25,color: '#6512B9'},{value: -20,color: '#391AAD'},{value: -15,color: '#0D23A1'},{value: -10,color: '#3D55B8'},{value: -5,color: '#6E87D0'},{value: 0,color: '#9EB9E7'},{value: 5,color: '#FFCEBA'},{value: 10,color: '#FDAB9B'},{value: 15,color: '#FC897C'},{value: 20,color: '#FB675D'},{value: 25,color: '#F9443E'},{value: 30,color: '#F8221F'},{color: '#F70000'}]

const bt_zones = [{value: 5,color: '#FFCEBA'},{value: 10,color: '#FDAB9B'},{value: 15,color: '#FC897C'},{value: 20,color: '#FB675D'},{value: 25,color: '#F9443E'},{value: 30,color: '#F8221F'},{color: '#F70000'}]

const speed_zones = [{value: 50,color: '#FFF0D7'},{value: 100,color: '#FFE6BF'},{value: 150,color: '#FFDDA7'},{value: 200,color: '#FFD48F'},{value: 250,color: '#FFCB77'},{value: 300,color: '#FFC15F'},{value: 350,color: '#FFB847'},{value: 400,color: '#FFAF2F'},{value: 450,color: '#FFA617'},{color: '#FF9D00'}]

function createIMFChart(labels, bz, bt) {
  const arearangeData = labels.map((label, index) => {
    // Convert the timestamp to a JavaScript Date object
    const timestamp = new Date(label).getTime();

    // The 'bz' value becomes the 'low' and 'high' values in the arearange series
    const value1 = bz[index];
    const value2 = bt[index]

    // Create an array where the first element is the timestamp and the second element is the 'low' and 'high' values
    return [timestamp, value1, value2];
  });

  Highcharts.chart('IMFchart', {
    title: {
      text: 'Interplanetary Magnetic Field (nT)',
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function () {
          return formatTimestamp(this.value);
        },
        rotation: 330,
      },
    },
    yAxis: {
      title: {
        text: ' ',
      },
      min: -40,
      max: 40,
      plotLines: [
        {
          color: 'gray',      // Line color
          width: 2,           // Line width
          value: 0,           // Value where the line will be placed
          zIndex: 0,          // Make the line appear above the grid lines
          dashStyle: 'Solid', // Make the line solid
        },
      ],
    },
    tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: 'nT',
        formatter: function () {
            return formatTimestamp(this.x);
        }
    },
    series: [
      {
        name: 'Arearange Series',
        type: 'arearange', // Define the series type (arearange)
        data: arearangeData,
        color: {
            linearGradient: {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1
            },
            stops: [
                [0, '#ff0000'],
                [1, '#391AAD']
            ]
        },
        label: false,
      },
      {
        name: 'Bz',
        type: 'spline',
        data: labels.map((label, index) => [new Date(label).getTime(), bz[index]]),
        //zoneAxis: 'y',
        //zones: bz_zones,
        color: '#3D55B8',
        lineWidth: 3,
        label: false,
      },
      {
        name: 'Bt',
        type: 'spline',
        data: labels.map((label, index) => [new Date(label).getTime(), bt[index]]),
        color: '#c70d00',
        lineWidth: 3,
        label: false,
      },
    ],
    legend: false,
  });
}

function createSpeedChart(labels, speed) {
  const arearangeData = labels.map((label, index) => {
    // Convert the timestamp to a JavaScript Date object
    const timestamp = new Date(label).getTime();

    // The 'bz' value becomes the 'low' and 'high' values in the arearange series
    const value1 = 0;
    const value2 = speed[index]

    // Create an array where the first element is the timestamp and the second element is the 'low' and 'high' values
    return [timestamp, value1, value2];
  });

  Highcharts.chart('speedchart', {
    title: {
      text: 'Speed (km/s)',
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function () {
          return formatTimestamp(this.value);
        },
        rotation: 330,
      },
    },
    yAxis: {
      title: {
        text: ' ',
      }
    },
    series: [
      {
        name: 'Arearange Series',
        type: 'arearange', // Define the series type (arearange)
        data: arearangeData,
        color: {
            linearGradient: {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1
            },
            stops: [
                [0, '#FF9D00'],
                [1, '#FFF0D7']
            ]
        },
        label: false,
      },
      /*{
        name: 'Speed-sub',
        type: 'spline',
        data: labels.map((label, index) => [new Date(label).getTime(), speed[index]]),
        color: '#383838',
        lineWidth: 6,
        label: false,
      },*/
      {
        name: 'Speed',
        type: 'spline',
        data: labels.map((label, index) => [new Date(label).getTime(), speed[index]]),
        zoneAxis: 'y',
        zones: speed_zones,
        lineWidth: 3,
        label: false,
      },
    ],
    legend: false,

  });
}

function createDensityChart(labels, density) {
  const arearangeData = labels.map((label, index) => {
    // Convert the timestamp to a JavaScript Date object
    const timestamp = new Date(label).getTime();

    // The 'bz' value becomes the 'low' and 'high' values in the arearange series
    const value1 = 0;
    const value2 = density[index]

    // Create an array where the first element is the timestamp and the second element is the 'low' and 'high' values
    return [timestamp, value1, value2];
  });

  Highcharts.chart('densitychart', {
    title: {
      text: 'Density (p/cm3)',
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function () {
          return formatTimestamp(this.value);
        },
        rotation: 330,
      },
    },
    yAxis: {
      title: {
        text: ' ',
      }
    },
    series: [
      {
        name: 'Arearange Series',
        type: 'arearange', // Define the series type (arearange)
        data: arearangeData,
        color: {
            linearGradient: {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1
            },
            stops: [
                [0, '#05b31c'],
                [1, '#c9f5ce']
            ]
        },
        label: false,
      },
      {
        name: 'Density',
        type: 'spline',
        data: labels.map((label, index) => [new Date(label).getTime(), density[index]]),
        lineWidth: 3,
        color: '#05b31c',
        label: false,
      },
    ],
    legend: false,

  });
}

function createHPChart(labels, hp) {
  const arearangeData = labels.map((label, index) => {
    // Convert the timestamp to a JavaScript Date object
    const timestamp = new Date(label).getTime();

    // The 'bz' value becomes the 'low' and 'high' values in the arearange series
    const value1 = 0;
    const value2 = hp[index]

    // Create an array where the first element is the timestamp and the second element is the 'low' and 'high' values
    return [timestamp, value1, value2];
  });

  Highcharts.chart('hpchart', {
    title: {
      text: 'Northern Hemispheric Power (GW)',
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function () {
          return formatTimestamp(this.value);
        },
        rotation: 330,
      },
    },
    yAxis: {
      title: {
        text: ' ',
      }
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            }
        }
    },
    series: [
      {
        name: 'Arearange Series',
        type: 'arearange', // Define the series type (arearange)
        data: arearangeData,
        color: {
            linearGradient: {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1
            },
            stops: [
                [0, '#f0ec0e'],
                [1, '#fffecc']
            ]
        },
        label: false,
      },
      {
        name: 'hp',
        type: 'spline',
        data: labels.map((label, index) => [new Date(label).getTime(), hp[index]]),
        lineWidth: 3,
        color: '#f0ec0e',
        label: false,
      },
    ],
    legend: false,

  });
}


fetch('https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json')
  .then(response => response.json())
  .then(data => {
    // 'data' now contains the parsed JSON from the file

    let timestamps = []
    let bz = []
    let bt = []
    let count = 0
    data.forEach(item => {
      bz.push(Number(item[3]))
      bt.push(Number(item[6]))
      timestamps.push(item[0])
      /*if (count==data.length-1) {
        document.getElementById('bz-current').innerHTML = item[3]
      }*/
      count ++
    })

    document.getElementById('bz-current').innerHTML = bz.slice(-1)
    document.getElementById('bz-30m').innerHTML = calcTrends(bz.slice(-30))
    document.getElementById('bz-60m').innerHTML = calcTrends(bz.slice(-60))
    document.getElementById('bz-180m').innerHTML = calcTrends(bz.slice(-180))

    document.getElementById('bt-current').innerHTML = bt.slice(-1)
    document.getElementById('bt-30m').innerHTML = calcTrends(bt.slice(-30))
    document.getElementById('bt-60m').innerHTML = calcTrends(bt.slice(-60))
    document.getElementById('bt-180m').innerHTML = calcTrends(bt.slice(-180))

    createIMFChart(timestamps.slice(-360), bz.slice(-360), bt.slice(-360))
    //createIMFChart(timestamps, bz, bt, bz_bt_range)
  })
  .catch(error => {
    console.error('Error:', error);
  });

fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json')
  .then(response => response.json())
  .then(data => {
    // 'data' now contains the parsed JSON from the file

    let timestamps = []
    let density = []
    let speed = []
    let count = 0
    data.forEach(item => {
      density.push(Number(item[1]))
      speed.push(Number(item[2]))
      timestamps.push(item[0])
      count ++
    })

    document.getElementById('dty-current').innerHTML = density.slice(-1)
    document.getElementById('dty-30m').innerHTML = calcTrends(density.slice(-30))
    document.getElementById('dty-60m').innerHTML = calcTrends(density.slice(-60))
    document.getElementById('dty-180m').innerHTML = calcTrends(density.slice(-180))

    document.getElementById('spd-current').innerHTML = speed.slice(-1)
    document.getElementById('spd-30m').innerHTML = calcTrends(speed.slice(-30))
    document.getElementById('spd-60m').innerHTML = calcTrends(speed.slice(-60))
    document.getElementById('spd-180m').innerHTML = calcTrends(speed.slice(-180))

    createSpeedChart(timestamps.slice(-360), speed.slice(-360))
    createDensityChart(timestamps.slice(-360), density.slice(-360))
  })
  .catch(error => {
    console.error('Error:', error);
  });

fetch('https://services.swpc.noaa.gov/text/aurora-nowcast-hemi-power.txt')
  .then(response => response.text())
  .then(data => {
    // 'data' now contains the parsed JSON from the file
    let hp_nh = []
    let hp_sh = []
    let timestamps = []
    // Split the content into lines
    const lines = data.split('\n');
    let count = 0
    lines.forEach(line => {
      if (count > 15 && count < lines.length - 1) {
        let datetime = line.toString().substr(0,10) + ' ' + line.toString().substr(11,5)
        let nh = Number(line.toString().substr(41,3))
        let sh = Number(line.toString().substr(49,3))
        hp_nh.push(nh)
        hp_sh.push(sh)
        timestamps.push(datetime)
      }
      count ++
    })

    document.getElementById('hp-current').innerHTML = hp_nh.slice(-1)
    document.getElementById('hp-30m').innerHTML = calcTrends(hp_nh.slice(-6))
    document.getElementById('hp-60m').innerHTML = calcTrends(hp_nh.slice(-12))
    document.getElementById('hp-180m').innerHTML = calcTrends(hp_nh.slice(-36))

    createHPChart(timestamps.slice(-62), hp_nh.slice(-62))
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Function to lazy load images
/*function lazyLoadImages(imageUrls) {
    const imageContainer = document.getElementById('imageContainer');

    imageUrls.forEach((imageUrl) => {
      console.log(imageUrl)
        const img = new Image();
        img.src = imageUrl;

        // Once the image is loaded, append it to the container
        img.onload = () => {
            imageContainer.appendChild(img);
        };
    });
}

const maine_photos = []

for (let i = 1; i<=278; i++){
  photo_frame = i.toString()
  if (photo_frame.length == 1) {
    photo_frame = '000' + photo_frame
  } else if (photo_frame.length == 2) {
    photo_frame = '00' + photo_frame
  } else if (photo_frame.length == 3) {
    photo_frame = '0' + photo_frame
  }

  maine_photos.push(`https://www.neoc.com/webcam3/2023_11_05/m${photo_frame}.jpg`)
}

lazyLoadImages(maine_photos)*/


/*const map = new maplibregl.Map({
    container: 'map',
    style: './maplibre-style.json',
    zoom: 8,
    center: [-74.5447, 40.6892]
});*/


/*map.on('load', () => {
  map.addSource('aurora-data', {
    type: 'geojson',
    data: 'https://services.swpc.noaa.gov/json/ovation_aurora_latest.json'
  });

  map.addLayer({
      id: 'aurora-visibility',
      type: 'circle',
      source: 'aurora-data',
      paint: {
          'circle-color': [
              'match',
              ['get', 'Aurora'],
              0, 'red', // Style the point with aurora visibility 0 as red
              1, 'green', // Style the point with aurora visibility 1 as green
              'blue', // Default color for other values
          ],
          'circle-radius': 6,
          'circle-opacity': 0.7,
      },
  });
});*/
