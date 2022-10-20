const { Packages } = require("../utils/packages");
const _MS_PER_DAY = 1000 * 60 * 60 * 24;

exports.packagesPlans = async (result) => {
    let pending = [];
    let running = [];
    var runningCounter = 0, completedCounter = 0;
    let runningTotalAmt = 0;
    if (result && Object.entries(result).length !== 0) {
        for (var obj of result) { obj.status == "pending" ? pending.push(obj) : running.push(obj) }
    }

    if (running.length) {

        runningCounter = running.length;

        for (var i = 0; i < running.length; i++) {
            let { Price, Duration, Returns } =
                Packages[running[i].package.split("$")[0]][
                running[i].package.split("$")[1]
                ];
            running[i].Price = running[i].accumulatedBalance ? running[i].accumulatedBalance : Price;
            running[i].Duration = Duration;
            running[i].Returns = Returns;
            running[i].package = running[i].package
                .split("$")[0]
                .toUpperCase()
                .concat(`$${running[i].package.split("$")[1]}`);

            var today = new Date();
            var now = today.getFullYear() +
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate();

            // var due_date = new Date(running[i].duedate);
            var due_date = new Date(parseFloat(running[i].countDownDate))
            runningTotalAmt += returnOfInvestment(
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

            // if (ExpireddDate < now) {
            if (due_date < today) {
                completedCounter++;
                runningTotalAmt = 0;
                running[i].status = "Completed";
                runningCounter -= 1;
                runningTotalAmt += returnOfInvestment(
                    running[i].Duration,
                    running[i].Returns,
                    running[i].Price,
                    now,
                    due_date
                );
                // runningTotalAmt += returnRunningTime(runningTotalAmt, amountDeducted)
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

// function returnRunningTime(runningTotalAmt, amountDeducted){
//  const value = runningTotalAmt - amountDeducted;
//  return value;
// }


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


    if (returnStr.split("%")[1] == "weekly") {
        totalDue = parseInt(duration.split(" ")[0]) / 7
    }
    if (perdayInterest <= 0) {
        return result = ((parseFloat(returnStr.split("%")[0]) / 100) * price * totalDue) + price;
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

exports.validateWithdrawalRequest = async (result) => {
    let outPut = [];
    if (result) {
        result.forEach(element => {
            if (element.status == "Completed") {
                outPut.push(element)
            }
        });
    }
    return { outPut }
}
