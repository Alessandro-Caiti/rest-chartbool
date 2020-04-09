$(document).ready(function() {

// http://157.230.17.132:4004/sales endpoint personale

    // var date = [];
    // var salesman = [];
    // var salesmanId = [];
    // var amount = [];


    // var ctx = $('#line-chart');
    // var chart = new Chart(ctx, {
    //
    //     type: 'line',
    //
    //     data: {
    //         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //         datasets: [{
    //             label: 'Fatturato',
    //             backgroundColor: 'rgb(255, 99, 132)',
    //             borderColor: 'rgb(255, 99, 132)',
    //             data: [0, 10, 5, 2, 20, 30, 45]
    //         }]
    //     }
    // });

    makeChart();

    $('#send-sales').click(function() {
        var newSalesman = $('#new-salesman').val();
        var newAmount = parseInt($('#new-amount').val());
        var newDate = moment($('#new-date').val()).format('L');
        var newObject = {
            salesman: newSalesman,
            amount: newAmount,
            date: newDate
        };
        $('input').val('');
        console.log(newSalesman);
        console.log(newAmount);
        console.log(newDate);
        console.log(newObject);
        $.ajax({
            url: "http://157.230.17.132:4004/sales",
            method: "POST",
            data: newObject,
            success: function (data) {
                makeChart();
            },
            error: function () {
                alert('BOOM');
            }
        })
    });

    function makeChart() {
        $.ajax({
            url: "http://157.230.17.132:4004/sales",
            method: "GET",
            success: function (data) {
                console.log(data);
            var dataToFormat = data;
            var salesData = formatData(dataToFormat);
            var salesPerMonth = getSalesPerMonth(getMonthAndSales(salesData));
            var salesPerSalesman = getSalesPerSalesman(salesData);
            // console.log(salesData);
            // getTotalAmounts(getAmounts(salesData));
            // getSalesmen(salesData);
            // getDate(salesData);
            // getId(salesData);
            var perc = getSalesPercentage(getSalesPerSalesman(salesData), getTotalAmounts(getAmounts(salesData)));
            makeLineChart(salesPerMonth.month, salesPerMonth.amount);
            makePieChart(salesPerSalesman.salesman, perc);
            console.log(salesPerMonth);
            console.log(salesPerSalesman);
            console.log(perc);
            console.log(salesData);

            },
            error: function () {
                alert('BOOM');
            }
        })
    }

    // $.ajax({
    //     url: "http://157.230.17.132:4004/sales",
    //     method: "GET",
    //     success: function (data) {
    //         // console.log(data);
    //     var salesData = data;
    //     var salesPerMonth = getSalesPerMonth(getMonthAndSales(salesData));
    //     var salesPerSalesman = getSalesPerSalesman(salesData);
    //     // console.log(salesData);
    //     // getTotalAmounts(getAmounts(salesData));
    //     // getSalesmen(salesData);
    //     // getDate(salesData);
    //     // getId(salesData);
    //     var perc = getSalesPercentage(getSalesPerSalesman(salesData), getTotalAmounts(getAmounts(salesData)));
    //     makeLineChart(salesPerMonth.month, salesPerMonth.amount);
    //     makePieChart(salesPerSalesman.salesman, perc);
    //
    //     },
    //     error: function () {
    //         alert('BOOM');
    //     }
    // })

    function formatData(data) {
        for (var i = 0; i < data.length; i++) {
            var objectToFormat = data[i];
            if (!isNaN(objectToFormat.amount)) {
                objectToFormat.amount = parseInt(objectToFormat.amount);
            }
        }
        console.log(objectToFormat);
        return data
    }

    function getMonthAndSales(data) {
        var monthSales = [];
        for (var i = 0; i < data.length; i++) {
            var singleData = data[i];
            var month = moment(singleData.date, 'L')
            var sales = {
                monthNuber: month.format('MM'),
                month: month.format('MMMM'),
                amount: singleData.amount
            }
            monthSales.push(sales);
        }
        monthSales.sort(function(a, b){
            return a.monthNuber - b.monthNuber
        });
        return monthSales;
    }

    function getSalesPerMonth(data) {
        var salesPerMonth = {};
        for (var i = 0; i < data.length; i++) {
            var singleData = data[i];

            var mymonth = singleData.month;

            if (salesPerMonth[mymonth] === undefined) {
                salesPerMonth[mymonth] = 0;
            }

            salesPerMonth[mymonth] += singleData.amount;
        }
        var month = [];
        var amount = [];

        for (var key in salesPerMonth) {
            month.push(key);
            amount.push(salesPerMonth[key]);
        }
        return {
            month: month,
            amount: amount
        }
    }

    function getSalesPerSalesman(data) {
        var salesPerSalesman = {};
        for (var i = 0; i < data.length; i++) {
            var singleData = data[i];

            var mySalesman = singleData.salesman;

            if (salesPerSalesman[mySalesman] === undefined) {
                salesPerSalesman[mySalesman] = 0;
            }

            salesPerSalesman[mySalesman] += singleData.amount;
        }
        var salesman = [];
        var amount = [];

        for (var key in salesPerSalesman) {
            salesman.push(key);
            amount.push(salesPerSalesman[key]);
        }
        // console.log(salesman);
        // console.log(amount);
        return {
            salesman: salesman,
            amount: amount
        }
    }

    function getSalesPercentage(data, total) {
        var salesPercentage = data.amount;
        var arrayPerc =[];
        for (var i = 0; i < salesPercentage.length; i++) {
            salesPercentage[i] = ((salesPercentage[i]/total)*100).toFixed(2);
            arrayPerc.push(salesPercentage[i]);
        }
        // console.log(arrayPerc);
        return arrayPerc
    }

    function makeLineChart(data1, data2) {
        var ctx = $('#line-chart');
        var chart = new Chart(ctx, {

            type: 'line',

            data: {
                labels: data1,
                datasets: [{
                    label: 'Fatturato 2017',
                    backgroundColor: 'rgba(176,224,230,0.5)',
                    borderColor: 'rgba(176,224,230,1)',
                    lineTension: 0,
                    data: data2
                }]
            }
        });
    }

    function makePieChart(data1, data2) {
        var ctx = $('#pie-chart');
        var chart = new Chart(ctx, {

            type: 'pie',

            data : {
                datasets: [{
                    data: data2,
                    backgroundColor: [
                        'powderblue',
                        'lightcoral',
                        'limegreen',
                        'darkviolet'
                    ]
                }],
                labels: data1
            },
            options: { //chiamata options default per avere l'aggiunta di "%" alla fine del numero
                responsive: true,
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
                    }
                  }
                }
            }
        });
    }

//  ---------------------------- da qui è il delirio ---------------------------------------------

    function getTotalAmounts(data) {
        var total = 0;
        for (var i = 0; i < data.length; i++) {
            total += data[i]
        }
        // console.log(total);
        return total;
    }

    function getAmounts(data) {
        var amounts = [];
        for (var i = 0; i < data.length; i++) {
            var singleData = data[i];
            var amount = singleData.amount;
            amounts.push(amount);
        }
        return amounts;
    }

    function getSalesmen(data) {
        var salesmen = [];
        for (var i = 0; i < data.length; i++) {
            var singleData = data[i];
            var salesman = singleData.salesman;
            salesmen.push(salesman);
            // console.log(salesmen);
        }
        return salesmen;
    }

    function getDate(data) {
        var dates = [];
        for (var i = 0; i < data.length; i++) {
            var singleData = data[i];
            var date = singleData.date;
            dates.push(date);
            // console.log(dates);
        }
    }

    function getId(data) {
        var ids = [];
        for (var i = 0; i < data.length; i++) {
            var singleData = data[i];
            var id = singleData.id;
            ids.push(id);
            // console.log(ids);
        }
    }

});
