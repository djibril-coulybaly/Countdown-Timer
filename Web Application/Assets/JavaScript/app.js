var CountdownButton = document.getElementById("CountdownButton");
var TimerDiv = document.getElementById("DisplayCountdownTimer");
var DisplayCountdownTimer = Rx.Observable.interval(1000);
var CountDownTimer = new Date();
var TempDate = null;

var StartTimerClicked = Rx.Observable.fromEvent(CountdownButton,"click");
StartTimerClicked.subscribe(() => GetValues());

// Function to see if the value entered by the user is empty
function IfValueIsEmptyString(InputNumber){ 
    return InputNumber == "";
}

// Function to see if the value entered by the user is is a valid number
function ValidateNumber(InputNumber){
    let NumberTest = /^[0-9]+$/
    return NumberTest.test(InputNumber);
}

// Function to see if the digits displayed to the user in the hour, minute or second column is in a single digit form e.g. 9 minutes will now be displayed as 09 minutes
function IfValueIsSingleDigitFormat(Input){
    return (Number(Input) > 9 ? Input : "0" + Input);
}

// Function to see if the value entered by the user is less than 60 - max value for minutes and seconds
function IfValueIsMinutesAndOrSecond(InputNumber){
    return InputNumber < 60;
}

// Function to see if the value entered by the user is less than 24 - max value for hour
function IfValueIsHour(InputNumber){
    return InputNumber < 24;
}

// Function to get the values entered by the user
function GetValues() {
    TimerDiv.innerHTML = "";
    CountdownButton.disabled = true;

    let HourInput = document.getElementById("hourInput").value;
    let MinuteInput = document.getElementById("minuteInput").value;
    let SecondInput = document.getElementById("secondInput").value;

    let checkHourInput = ValidateNumber(HourInput) && !(IfValueIsEmptyString(HourInput)) && IfValueIsHour(HourInput);
    let Hour = (checkHourInput ? HourInput : false);

    let checkMinuteInput = ValidateNumber(MinuteInput) && !(IfValueIsEmptyString(MinuteInput)) &&  IfValueIsMinutesAndOrSecond(MinuteInput);
    let Minute = (checkMinuteInput ? MinuteInput : false);
    
    let checkSecondInput = ValidateNumber(SecondInput) && !(IfValueIsEmptyString(SecondInput)) &&  IfValueIsMinutesAndOrSecond(SecondInput);
    let Second = (checkSecondInput ? SecondInput : false);

    if(Hour == false && Minute == false && Second == false) {
        alert("An error has occured. Please enter a numerical value for the follwing columns\n\nHour: Less than 24\nMinute: Less than 60\nSecond: Less than 60");
        CountdownButton.disabled = false;
        return;
    }
    else {
        SetupCountdown(Hour, Minute, Second);
    }
}

// Function to setup the countdown and create a subcription
function SetupCountdown(Hour, Minute, Second)
{
    let TempDate = new Date();
    let HourSet = Number(TempDate.getHours()) + Number(Hour);
    let MinuteSet = Number(TempDate.getMinutes()) + Number(Minute);
    let SecondSet = Number(TempDate.getSeconds()) + Number(Second) + 2;

    CountDownTimer = new Date(
        TempDate.getFullYear(), 
        TempDate.getMonth(), 
        TempDate.getDate(),
        HourSet,
        MinuteSet,
        SecondSet
    );

    DisplayCountdownTimer.subscribe(() => DisplayCountdown());
}

// Function to display the countdown timer to the user 
function DisplayCountdown() {
    let TimerToGetTo = CountDownTimer.getTime();
    let currentTime = (new Date()).getTime();

    let timerLeft = TimerToGetTo - currentTime;

    var hours = Math.floor((timerLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timerLeft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timerLeft % (1000 * 60)) / 1000);

    let TimeDisplayString = "";

    if (hours > 0) {
        TimeDisplayString = TimeDisplayString + IfValueIsSingleDigitFormat(hours) + ":";
    }

    if(minutes > 0) {
        TimeDisplayString = TimeDisplayString + IfValueIsSingleDigitFormat(minutes) + ":";
    }

    if(seconds > -1) {
        TimeDisplayString = TimeDisplayString + IfValueIsSingleDigitFormat(seconds);
    }

    TimerDiv.innerHTML = TimeDisplayString;

    if(timerLeft < 0) {
        TimerDiv.innerHTML = "Countdown Finished";
        CountdownButton.disabled = false;
        DisplayCountdownTimer.unsubscribe();
    }
}