const calendarContainer = document.querySelector(".calendar"),
    calendarDays = calendarContainer.querySelector(".day"),
    calendarMonthYear = calendarContainer.querySelector(".month_yr"),
    calendarTable = calendarContainer.querySelector(".calendarTable"),
    calendarLast = calendarContainer.querySelector(".last"),
    calendarNext = calendarContainer.querySelector(".next"),
    calendarNum = calendarTable.querySelector(".dayNum"),
    calendarBody = calendarTable.querySelector("tbody");

const dayList = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const monthList = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const daysOfMonth=[31,28,31,30,31,30,31,31,30,31,30,31];

//to save chosen cell
let chosen;

function leapyear(year) {
    return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
}

function printDate(date = new Date()) {
    //const yr = date.getFullYear();
    //const mon = date.getMonth();
    //const monName = monthList[mon];
    //const dayName = dayList[date.getDay()];
    //const day = date.getDate();
    calendarDays.innerText = `${dayList[date.getDay()]}
    ${date.getDate()}`;
    calendarMonthYear.innerText = `${monthList[date.getMonth()]} ${date.getFullYear()}`;
}

//check today
function checkToday(date, cell) {
    const today = new Date();

    if (date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate()) {
       cell.classList.add('today');
       //chooseDate(cell);
       return true;
   }
   return false;
}

function getTable(dt = new Date()) {
    const yr = dt.getFullYear();
    const mon = dt.getMonth();

    calendarBody.id = `${yr}/${mon+1}`;

    //현재 달 첫번째 요일 시작 기준
    const firstDayNum = new Date(yr, mon, 1).getDay();
    const lastDayNum = new Date(yr, mon, daysOfMonth[mon]).getDay();
    let row;

    //determine calendar row number (5 or 6)
    //FDN + LDN + daysOfMonth
    let rowNums = firstDayNum + (6 - lastDayNum) + daysOfMonth[mon];

    //check leap year
    if (leapyear(yr)) {
        daysOfMonth[1] = 29;
    }

    for (let i = 0; i < rowNums; i++) {
        if (i%7 === 0) {
            row = calendarBody.insertRow(calendarBody.length);
            row.className = `week ${(i/7) + 1}`;
        }

        //create table td
        const cell = row.insertCell(i%7);
        cell.className = 'dayNum';

        //날짜
        const date = new Date(yr, mon, i - firstDayNum+1);
        cell.classList.add(dayList[date.getDay()].toLowerCase());

        //set class name for days of last,next month
        if (i < firstDayNum) {
            cell.classList.add('lastMonth');
        } else if (i >= daysOfMonth[mon] + firstDayNum) {
            cell.classList.add('nextMonth');
        } else {
            cell.classList.add('thisMonth');
        }

        cell.id = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
        cell.innerHTML = `${date.getDate()}`;

        if (checkToday(date, cell)) {
            chooseDate(cell);
        }
    }
    //console.log(calendarTable);
}

//id 받아와서 연/월 계산
function calcDate(id, func) {
    const arr = id.split('/');
    let year = parseInt(arr[0]);
    let month = parseInt(arr[1]);
    if (func === 'last') {
        month--;
        if (month === 0) {
            month = 12;
            year--;
        }
    } else {
        month++;
        if (month === 13) {
            month = 1;
            year++;
        }
    }
    return new Date(`${year}/${month}/1`);
}

function handleLast(event) {
    const dt = calcDate(calendarBody.id, 'last');
    refreshTable(dt);
    chooseDate(document.getElementById(`${dt.getFullYear()}/${dt.getMonth()+1}/${dt.getDate()}`));
}

function handleNext(event) {
    const dt = calcDate(calendarBody.id, 'next');
    refreshTable(dt);
    chooseDate(document.getElementById(`${dt.getFullYear()}/${dt.getMonth()+1}/${dt.getDate()}`));
}

function refreshTable(dt) {
    while (calendarBody.hasChildNodes()) {
        calendarBody.removeChild(calendarBody.firstChild);
    }
    getTable(dt);
}

function chooseDate(cell) {
    if (cell.classList.contains('dayNum')){

        //getTable불러올 때 error방지 if문
        if (chosen !== undefined) {
            chosen.classList.toggle('chosen');
        }

        //저번달 or 다음달로 넘어가기
        if (!cell.classList.contains('thisMonth')) {
            const dt = new Date(cell.id);
            refreshTable(dt);

            //다시 불러오는 이유 = 현재 달로 넘어갈때 today chosen된거 덮어씌우려고
            chooseDate(document.getElementById(`${dt.getFullYear()}/${dt.getMonth()+1}/${dt.getDate()}`));
        }

        //id로 지정하는 이유가 다른 달로 넘어가도 지정할수 있게하려고
        chosen = document.getElementById(`${cell.id}`);
        chosen.classList.add('chosen');
        printDate(new Date(`${cell.id}`));
    }
}

function handleCalendar(event) {
    chooseDate(event.target);
}

function init() {
    getTable();
    calendarLast.addEventListener("click", handleLast);
    calendarNext.addEventListener("click", handleNext);
    calendarBody.addEventListener("click", handleCalendar);
}

init();
