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
        if (operationIndicator.value === "=") {
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
    operationIndicator.value = selectedOperationButton.innerText;
    firstNum = parseFloat(numScreen.value);
    currentOperator = selectedOperationButton.value;

    numScreen.value = firstNum && currentOperator ? "" : firstNum;
}

//calculation and  prints result
function calculation() {
    secondNum = parseFloat(numScreen.value);
    operationIndicator.value = null;
    try {
        const result = eval(`${firstNum} ${currentOperator} ${secondNum}`);
        if (result) {
            if (result == "Infinity") {
                throw new Error("infinity is not defined");
                return;
            }
            numScreen.value = result;
            operationIndicator.value = "=";
        }
    } catch (error) {
        operationIndicator.value = null;
        numScreen.value = "error     "; //error message is "error + 5 empty spaces"
        console.error(error);

        //just to delete the error message automatically
        autoClear();
    }
}

//just to delete the error message automatically
function autoClear(timeout = 5000) {
    setTimeout(() => {
        operationIndicator.value = null;
        const interval = setInterval(() => {
            if (numScreen.value.length > 0) {
                numScreen.value = numScreen.value.slice(0, -1);
            } else {
                clearInterval(interval);
            }
        }, 100);
    }, timeout);
}
