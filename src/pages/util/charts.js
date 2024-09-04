//Colours for chart
//Sage green, dark green, dark purple, bright light green (according to colour scheme)
const colors = ['#87b37a', '#4c6663', '#2a1e5c', '#9ce37d'];


export const getChartOptions = (data) => {
    return {
      series: data.map(item => item.value),
      colors: colors,
      chart: {
        height: 320,
        width: "100%",
        type: "donut",
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 20,
              },
              total: {
                showAlways: true,
                show: true,
                label: "Total",
                fontFamily: "Inter, sans-serif",
                formatter: function (w) {
                  const sum = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                  return sum;
                },
              },
              value: {
                show: true,
                fontFamily: "Lato",
                fontSize: '24px',
                offsetY: -20,
              
                formatter: function (value) {
                  return value;
                },
                className: 'custom-value-label' // Add a custom class

              },
            },
            size: "70%",
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: data.map(item => item.name),
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
        show: false,
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value;
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value;
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    };
  };

 export const getPieChartOptions = (internStats) => {
    return {
      series: [internStats.nustian, internStats.nonNustian],
      colors: ["#2a1e5c", "#87b37a"],
      chart: {
        height: 420,
        width: "100%",
        type: "pie",
      },
      stroke: {
        colors: ["white"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          labels: {
            show: true,
          },
          size: "100%",
          dataLabels: {
            offset: -25
          }
        },
      },
      labels: ["Nustian", "Non-Nustian"],
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: "Inter, sans-serif",
        },
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
        show: false,
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value + "%";
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value + "%";
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    };
  };