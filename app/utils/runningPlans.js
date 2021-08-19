const { Packages } = require("../utils/packages");
const _MS_PER_DAY = 1000 * 60 * 60 * 24;

exports.packagesPlans = (result) => {
  let pending = [];
  let running = [];
  let runningCounter ,completedCounter, runningTotalAmt= 0;

  for (var obj of result) {
    obj.status == "pending" ? pending.push(obj) : running.push(obj);
  }
  if (running.length) {
    runningCounter = running.length;
    for (var i = 0; i < running.length; i++) {
      let { Price, Duration, Returns } =
        Packages[running[i].package.split("$")[0]][
          running[i].package.split("$")[1]
        ];
      running[i].Price = Price;
      running[i].Duration = Duration;
      running[i].Returns = Returns;
      running[i].package = running[i].package
        .split("$")[0]
        .toUpperCase()
        .concat(`$${running[i].package.split("$")[1]}`);

      var today = new Date();
      var now =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();

      var due_date = new Date(running[i].duedate);
      runningTotalAmt += runningTotalAmt += returnOfInvestment(
        running[i].Duration,
        running[i].Returns,
        running[i].Price,
        now,
        due_date
      );
      ExpireddDate =
        due_date.getFullYear() +
        "-" +
        (due_date.getMonth() + 1) +
        "-" +
        due_date.getDate();

      if (ExpireddDate < now) {
        completedCounter++;
        runningTotalAmt = 0;
        running[i].status = "Completed";
        runningCounter = 0;
        runningTotalAmt += returnOfInvestment(
          running[i].Duration,
          running[i].Returns,
          running[i].Price,
          now,
          due_date
        );
      }
    }
  }

  return {
    pending,
    running,
    runningCounter,
    pendingCounter: pending.length,
    runningTotalAmt,
    completedCounter,
  };
};




const returnOfInvestment = (
  duration,
  returnStr,
  price,
  todaysDate,
  dueDate
) => {
  let perdayInterest = dateDiffInDays(new Date(todaysDate), new Date(dueDate));

  let due = parseInt(duration.split(" ")[0]) - perdayInterest;
  let returnDays = ["daily", "weekly"];
  let totalDue = parseInt(duration.split(" ")[0]);
  let result = 0;

  returnStr.split("%")[1] == "weekly" ?  totalDue = parseInt(duration.split(" ")[0])/7 : totalDue;

  if(perdayInterest <= 0){
    return result = ((parseFloat(returnStr.split("%")[0]) / 100)  * price *  totalDue) + price;
  }

  else if (returnStr.split("%")[1].trim() == returnDays[0]) {
    return (result =
      (parseFloat(returnStr.split("%")[0]) / 100) * price * due + price);
  } else {
    return (result =
      (parseFloat(returnStr.split("%")[0]) / 100) * price * parseInt(due / 7) + price);
  }
};

function dateDiffInDays(a, b) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

exports.validateWithdrawalRequest=(result)=>{
  let outPut = {};
  for(var i=0; i< result.length; i++){
    if(result[i].status == "Completed"){
      outPut = result
    }
  }

  return  {outPut}
  
}
