const numScreen = document.getElementById("num-screen");
const operationIndicator = document.getElementById("operator-screen");
const numButtons = document.querySelectorAll(".num-button");
const operatorButtons = document.querySelectorAll(".operation");
const clearButton = document.getElementById("clear");
const equalsButton = document.getElementById("equals");
let firstNum;
let currentOperator;
let secondNum;
10;

//focus on input all the time
numScreen.addEventListener("blur", () => {
    setTimeout(() => {
        numScreen.focus(); // allows entering input without manually selecting input
    }, 0);
});

//manages input from keyboard
numScreen.addEventListener("input", (event) => {
    //clears the previous result on new click
    if (operationIndicator.value === "=") {
        numScreen.value = null;
        operationIndicator.value = null;
    }
    event.target.value = event.target.value
        .replace(/[^0-9.]/g, "") //prevents keyboard characters from entering input (except numbers & dot)
        .slice(0, 11);
});

//click event for number buttons
numButtons.forEach((button) => {
    button.addEventListener("click", function () {
        //clears the previous result on new click
        if (
            operationIndicator.value === "=" ||
            operationIndicator.value === "\u2BBF"
        ) {
            numScreen.value = null;
            operationIndicator.value = null;
        }
        //calling function
        numOnDisplay(this);
    });
});

//click event for operator buttons
operatorButtons.forEach((operator) => {
    operator.addEventListener("click", function () {
        //calling function
        operation(this);
    });
});

//work for clearButton = backspacing the screen
clearButton.addEventListener("click", () => {
    autoClear(0);
});

//onclick of equals button
equalsButton.addEventListener("click", function () {
    if (firstNum)
        calculation();
});

//
//functions
//

//controlling input from calculator buttons
function numOnDisplay(button) {
    const newDigit = button.value;
    //limits to 11 digit
    if (numScreen.value.length < 11) {
        numScreen.value += newDigit;
    }
}

//on selecting an operation
function operation(selectedOperationButton) {
    if (firstNum && numScreen.value) {
        secondNum = numScreen.value == "" ? null : parseFloat(numScreen.value);
        calculation()
    }
    if (!currentOperator) {
        firstNum = numScreen.value == "" ? null : parseFloat(numScreen.value);
    }
    if (
        !firstNum &&
        (selectedOperationButton.value === "-" ||
            selectedOperationButton.value == "+")
    ) {
        numScreen.value = selectedOperationButton.value;
        return;
    }
    if (
        firstNum &&
        currentOperator &&
        (selectedOperationButton.value === "-" ||
            selectedOperationButton.value == "+")
    ) {
        numScreen.value = selectedOperationButton.value;
        return;
    }
    //these lines sets the operator
    operationIndicator.value = selectedOperationButton.innerText;
    currentOperator = selectedOperationButton.value;
    //clears screen for second num
    numScreen.value = firstNum != "NaN" && currentOperator ? null : firstNum;
}

//calculation and  prints result
function calculation() {

    secondNum = (numScreen.value === "" || numScreen.value == null) ? false : parseFloat(numScreen.value);
    console.log(`${firstNum} ${currentOperator} ${secondNum}`);
    try {
        if (isNaN(secondNum)) {
            console.log("no secondNum");
            return
        }
        if (currentOperator && (firstNum || secondNum)) {
            let result = eval(`${firstNum} ${currentOperator} ${secondNum}`); //on floating-number or big-Number calculatins errors will occurr, to fix use libraries
            secondNum = "";
            if (result !== null && result !== undefined) {
                console.log("result", result);

                numScreen.value = result;
                operationIndicator.value = "=";
                if (isNaN(result) || !isFinite(result)) {
                    autoClear();
                }
            }
        } else {
            throw new Error("Invalid calculation");
        }
    } catch (error) {
        operationIndicator.value = "\u2BBF";
        numScreen.value = "error      "; //error message is "error + 6 empty spaces"
        console.error(error);

        //just to delete the error message automatically
        autoClear();
    }
    currentOperator = null;
    firstNum = null;
    secondNum = null;
}

//just to delete the error message automatically
function autoClear(timeout = 5000) {
    setTimeout(() => {
        //removing all values
        firstNum = null;
        secondNum = null;
        operationIndicator.value = "";
        currentOperator = null;
        const interval = setInterval(() => {
            if (numScreen.value.length > 0) {
                numScreen.value = numScreen.value.slice(0, -1);
            } else {
                clearInterval(interval);
            }
        }, 100);
    }, timeout);
}
