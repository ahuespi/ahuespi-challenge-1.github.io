let coins = [];

let createCriptoSelect = () => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
        .then(response => response.json())
        .then(data => {

            var str = '';
            coins = data

            for (var i = 0; i < coins.length; ++i) {
                str += '<option value="' + coins[i].symbol + '" />';
            }

            var my_list = document.getElementById("browsers");
            my_list.innerHTML = str;
        });
}

let getInfoBuy = () => {
    let inputSelected = document.getElementById('cointEntered').value
    let currentPriceSelected = document.getElementById('currentPrice');
    let quantitySelected = document.getElementById('quantityCoin').value;
    let totalBuyed = document.getElementById('totalSimbol');

    coins.filter(row => {
        if (row.symbol == inputSelected) {
            currentPriceSelected.innerText = row.current_price
            let calculateBuy = quantitySelected / currentPriceSelected.innerText
            totalBuyed.innerText = `${calculateBuy}`
        }
    })
}

// Función que obtiene los datos para pasarselo al setItemLocalStorage 
let handleSubmit = () => {
    let coin = document.getElementById('cointEntered').value;
    let quantity = document.getElementById('quantityCoin').value;
    let currentPrice = document.getElementById('currentPrice').innerText;
    let totalBuyed = document.getElementById('totalSimbol').innerText;
    let date = createDate()
    let name;
    coins.filter(row => {
        if (row.symbol == coin) {
            name = row.name
        }
    })
    let buyInfo = {
        coin: coin,
        quantity: parseInt(quantity),
        currentPrice: parseFloat(currentPrice),
        totalBuyed: parseFloat(totalBuyed),
        date: date,
        name: name
    }

    setItemLocalStorage(buyInfo)
}
// Función para crear y formatear la Fecha
let createDate = () => {
    let date = new Date();

    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    date = dd + '/' + mm + '/' + yyyy;

    return date
}


let setItemLocalStorage = (item) => {
    let allItems = allStorage()
    let newItem = item

    let index = allItems.length

    if (index == 0) {
        localStorage.setItem(1, JSON.stringify(newItem))
    } else {
        index += 1
        localStorage.setItem(index, JSON.stringify(newItem))
    }

    let successAlert = document.getElementById('successAlert')
    successAlert.style.opacity = '1'
    successAlert.style.visibility = 'visible'
    successAlert.innerHTML = `<strong>Compra realizada.</strong> <br>Compraste U$D ${newItem.quantity} de ${newItem.coin} que equivalen a ${newItem.totalBuyed} ${newItem.name}`
    setTimeout(() => {
        successAlert.style.opacity = '0'
        successAlert.style.transition = 'visibility 0s, opacity 0.5s linear'
        successAlert.style.visibility = 'hidden'
        allStorage()
    }, 11000);

    allStorage()
}

let allStorage = () => {

    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while (i--) {
        values.push(localStorage.getItem(keys[i]));
    }
    createRowInfo(values)
    return values;
}

let createRowInfo = (values) => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
        .then(response => response.json())
        .then(data => {

            let history = document.getElementById('history')

            history.innerHTML = values.map(i => {
                let itemParsed = JSON.parse(i)
                let avg;
                let currentPrice;
                let avgFixed;
                let avgClass;

                data.filter(row => {
                    if (row.symbol == itemParsed.coin) {
                        currentPrice = row.current_price
                        avg = (row.current_price / itemParsed.currentPrice) * 100
                        avgFixed = avg.toFixed(2) - 100
                        avgClass = avgFixed.toFixed(2).includes('-') ? `<span class="avg-price negative">(${avgFixed.toFixed(2)}%)<span>` : `<span class="avg-price">(${avgFixed.toFixed(2)}%)<span>`
                    }
                })

                return `
                    <tr>
                        <th>${itemParsed.date}</th>
                        <td>${itemParsed.coin}</td>
                        <td>$ ${itemParsed.quantity}</td>
                        <td>$ ${itemParsed.currentPrice} ${avgClass}</td>
                        <td>$ ${currentPrice}</td>
                        <td>${itemParsed.totalBuyed}<td>
                    </tr>`
            }).join('')
        });
}

/* let getMyCriptos = () => {
    let allCriptos = allStorage()
    let criptos = {}
    let myCriptos = document.getElementById('myCriptos')

    allCriptos.map(i => {
        let c = JSON.parse(i)

        if (!criptos.hasOwnProperty(c.coin)) {
            criptos[c.coin] = c
        } else {
            let objQuantity = parseInt(criptos[c.coin].quantity)
            let newObjQuantity = parseInt(c.quantity)
            let sum = objQuantity + newObjQuantity
            criptos[c.coin].quantity = sum

            let objTotalBuyed = criptos[c.coin].totalBuyed
            let newObjTotalBuyed = c.totalBuyed
            let sumTotal = objTotalBuyed + newObjTotalBuyed
            criptos[c.coin].totalBuyed = sumTotal
        }

    })

    for (const key in criptos) {
        if (Object.hasOwnProperty.call(criptos, key)) {
            const element = criptos[key];
            myCriptos.innerHTML +=
                `<tr>
                    <td>${element.coin}</td>
                    <td>$ ${element.quantity}</td>
                    <td>$ ${element.currentPrice}</td>
                    <td>${element.totalBuyed} ${element.coin}<td>
                </tr>`
        }
    }
} */

setInterval(() => {
    allStorage()
}, 60000);

createCriptoSelect()
allStorage()
// getMyCriptos()