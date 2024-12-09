// In this implementation, this JS file acts as the server and does data manipulation & processesing
document.addEventListener('DOMContentLoaded', () => {
// Fetch the bankTransactions.json file
fetch('bankTransactions.json')
  .then(response => response.json()) // Parse the JSON data
  .then(data => {
    const balance = data.bankAccount.balance;
    const name = data.bankAccount.accountHolder;
    const transactions = data.bankAccount.transactions;

    // Update the user info in the UI
    document.getElementById('userName').textContent = name;
    document.getElementById('balance').textContent = `Account Balance: $${balance.toFixed(2)}`;

    // Process transactions
    if (Array.isArray(transactions)) {
      displayTransactions(transactions);
      displayExpensesPieChart(transactions);
    }
  
    console.log(transactions);

  })
  .catch(error => console.error('Error loading the JSON file:', error));
});


// Function to list all transactions in the left column of the UI
function displayTransactions(transactions) {
  const listContainer = document.getElementById('transactions-list');
  if (listContainer) {

    listContainer.innerHTML = '';

    // Reverse so that newest transaction is at top
    const reversedTransactions = transactions.slice().reverse();

    reversedTransactions.forEach(transaction => {
      const li = document.createElement('li');
      let category = transaction.category || categorizeTransaction(transaction.description);
      transaction.category = category;

      // Determine the color based on negative or positive
      let color = 'red;'
      if(transaction.amount > 0){
        color = 'green'
      }

      // Create data to be passed back to UI
      li.innerHTML = `
      <b>Date</b>: ${transaction.date} <br>
      <b>Amount:</b> <span style="color: ${color};">$${transaction.amount}</span> <br>
      <b>Description:</b> ${transaction.description} <br>
      <b>Category:</b> ${category}<br><br>
      `;

      listContainer.appendChild(li);
    });
  }
}

// Function to give each transaction a category
function categorizeTransaction(description) {
  // In the real implementation this would have a full list of options for each category

  let category = "";

  if (description == "Apartment Services") {
    category = "Rent";
  }
  else if (description == "Direct Deposit") {
    category = "Paycheck";
  }
  else if (description == "Giant Eagle") {
    category = "Groceries";
  }
  else if (description == "McDonald's" || description == "Dunkin' Donuts" || description == "Pizza Restaurant") {
    category = "Takeout";
  }
  else if (description == "Sheetz" || description == "Sunoco") {
    category = "Gas";
  }
  else if (description == "Venmo") {
    category = "Other Income";
  }


  return category;
}

function displayExpensesPieChart(transactions) {
  const rightArea = document.getElementById('expense_graph');
  let rentNum = 0, payNum = 0, groceriesNum = 0, takeoutNum = 0, gasNum = 0, otherNum = 0;
  var chartTitles = [];
  var uniqueTitle = [];
  var categoryAmounts = [];
  transactions.forEach(transaction => {
    let category = categorizeTransaction(transaction.description);
    if (category == "Rent") {
      rentNum += Math.abs(transaction.amount);
    } else if (category == "Paycheck") {
      payNum += Math.abs(transaction.amount);
    } else if (category == "Groceries") {
      groceriesNum += Math.abs(transaction.amount);
    } else if (category == "Takeout") {
      takeoutNum += Math.abs(transaction.amount);
    } else if (category == "Gas") {
      gasNum += Math.abs(transaction.amount);
    } else if (category == "Other Income") {
      otherNum += Math.abs(transaction.amount);
    }
    if (category !== "Paycheck" && category !== "Other Income"){
      chartTitles.push(category);
    }

  });

  uniqueTitle = [...new Set(chartTitles)];
  categoryAmounts = [rentNum, groceriesNum, takeoutNum, gasNum];
  // console.log(uniqueTitle);
  // console.log(categoryAmounts);

  rightArea.innerHTML = '';

  var data = [{
    values: categoryAmounts,
    labels: uniqueTitle,
    type: 'pie',
    hole: .4,
    textinfo: "label+percent",
    insidetextorientation: "radial"
  }];

  var layout = {
    // title: {
    // text: 'Expense Info'
    // },
    annotations: [
    {
      font: {
        size: 20
      },
      showarrow: false,
      text: 'Current Expenses'
    }],
    height: 750,
    width: 750
  };

  Plotly.newPlot('expense_graph', data, layout);

}

