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

    $.ajax({
        url: "http://157.230.17.132:4004/sales",
        method: "GET",
        success: function (data) {
            // console.log(data);
        var salesData = data;
        // console.log(salesData);
        // getTotalAmounts(getAmounts(salesData));
        // getSalesmen(salesData);
        // getDate(salesData);
        // getId(salesData);
        getSalesPerMonth(getMonthAndSales(salesData));
        getSalesPerSalesman(salesData);

        },
        error: function () {
            alert('BOOM');
        }
    })

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
        makeLineChart(month, amount)
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
        makePieChart(salesman, amount)
    }

    function makeLineChart(data1, data2) {
        var ctx = $('#line-chart');
        var chart = new Chart(ctx, {

            type: 'line',

            data: {
                labels: data1,
                datasets: [{
                    label: 'Fatturato',
                    backgroundColor: 'powderblue',
                    borderColor: 'powderblue',
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
        console.log(amounts);
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
