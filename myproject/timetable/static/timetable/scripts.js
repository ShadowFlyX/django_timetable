document.addEventListener("DOMContentLoaded", function () {
    const langButton = document.getElementById("langButton");
    const currentLanguage = document.documentElement.dataset.lang;

    langButton.addEventListener("click", function () {
        let newLanguage = (currentLanguage === 'en') ? 'ru' : 'en';
        document.cookie = `django_language=${newLanguage};path=/`;
        window.location.href = window.location.href;
    });

    const datetimeElement = document.getElementById("datetime");
    setInterval(function () {
        const now = new Date();
        const formattedDatetime = `${formatTime(now)} ${formatDate(now)}`;
        datetimeElement.textContent = formattedDatetime;
    }, 1000);

    fetchFaculties();
});

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

async function updateSelect(elementId, data) {
    const selectElement = document.getElementById(elementId);
    selectElement.innerHTML = '';

    for (const option of data) {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.text = option;
        selectElement.add(optionElement);
    }
}

async function fetchFaculties() {
    const response = await fetch('/get_faculties/');
    const data = await response.json();

    updateSelect('facultySelect', data.faculties);

    // Сброс выбора факультета
    const facultySelect = document.getElementById("facultySelect");
    facultySelect.value = '';  // или facultySelect.selectedIndex = -1;
}

async function fetchSelectData() {
    const facultySelect = document.getElementById("facultySelect");
    const selectedFaculty = facultySelect.value;

    if (selectedFaculty) {
        const response = await fetch(`/get_select_data/?faculty=${selectedFaculty}`);
        const data = await response.json();

        updateSelect('groupSelect', data.groups);
    }
}

const facultySelect = document.getElementById("facultySelect");
facultySelect.addEventListener("change", fetchSelectData);

function getSelectedGroup() {
    const groupSelect = document.getElementById('groupSelect');
    return groupSelect.value;
}


function createClassTable(classData) {
    const table = document.createElement('table');
    table.className = 'class-table';

    // Создаем заголовок таблицы
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Дисциплина', 'Кабинет', 'Преподаватель', 'Время начала'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Добавляем информацию о текущем занятии в таблицу
    const tbody = document.createElement('tbody');
    const row = document.createElement('tr');
    const columns = [
        classData.discipline,
        classData.class_room,
        classData.teacher,
        classData.time_beg
    ];
    columns.forEach(columnText => {
        const td = document.createElement('td');
        td.textContent = columnText;
        row.appendChild(td);
    });
    tbody.appendChild(row);
    table.appendChild(tbody);

    return table;
}


async function showCurrentClassTable() {
    const classData = await showCurrentClass();

    const tableContainer = document.getElementById('classTable');
    tableContainer.innerHTML = '';

    
    if (classData.class) {
        const table = createClassTable(classData.class);
        tableContainer.appendChild(table);
    } else {
        tableContainer.textContent = `Нет текущих пар для выбранной группы`;
    }
}


async function showWeeklySchedule() {
    const selectedGroup = getSelectedGroup();
    const scheduleContainer = document.getElementById('classTable');
    scheduleContainer.innerHTML = '';

    if(!selectedGroup){
        scheduleContainer.textContent = 'Сначала выберите группу';
        return;
    }    

    const response = await fetch(`/get_schedule_for_current_week/${selectedGroup}/`);
    const data = await response.json();
    
    if(data.schedule.length == 0){
        scheduleContainer.textContent = 'Нет пар по расписанию';
        return;
    }    

    // Группируем занятия по дням
    const groupedClasses = groupClassesByDay(data.schedule);

    // Создаем таблицу для каждого дня
    for (const [day, classesData] of Object.entries(groupedClasses)) {
        const dayTable = createDayTable(day, classesData);
        scheduleContainer.appendChild(dayTable);
    }
}

function groupClassesByDay(classes) {
    const groupedClasses = {};
    classes.forEach(classData => {
        const day = getDayLabel(classData.DayOfWeek);
        if (!groupedClasses[day]) {
            groupedClasses[day] = [];
        }
        groupedClasses[day].push(classData);
    });
    return groupedClasses;
}

function createDayTable(day, classesData) {
    const container = document.createElement('div');

    // Добавляем название дня перед таблицей
    const dayLabel = document.createElement('h3');
    dayLabel.textContent = day;
    container.appendChild(dayLabel);

    const dayTable = document.createElement('table');
    dayTable.className = 'class-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Дисциплина', 'Кабинет', 'Преподаватель', 'Время начала'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    dayTable.appendChild(thead);

    const tbody = document.createElement('tbody');
    classesData.forEach(classData => {
        const row = document.createElement('tr');
        const columns = [
            classData.Discipline,
            classData.ClassRoom,
            classData.TeacherShort,
            formatClassTime(classData.TimeBeg),
        ];
        columns.forEach(columnText => {
            const td = document.createElement('td');
            td.textContent = columnText;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    dayTable.appendChild(tbody);

    container.appendChild(dayTable);
    return container;
}
function getDayLabel(dayNumber) {
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return daysOfWeek[dayNumber - 1];
}

async function showClassesToday() {
    await showClassesForDay('today');
}

async function showClassesTomorrow() {
    await showClassesForDay('tomorrow');
}

async function showClassesForDay(day) {
    const selectedGroup = getSelectedGroup();
    const scheduleContainer = document.getElementById('classTable');
    scheduleContainer.innerHTML = '';
    
    if(!selectedGroup){
        scheduleContainer.textContent = 'Сначала выберите группу';
        return;
    }

    const response = await fetch(`/get_schedule_for_day/${selectedGroup}/${day}/`);
    const data = await response.json();

    if (data.schedule && data.schedule.length > 0) {
        // Группируем занятия по дням
        const groupedClasses = groupClassesByDay(data.schedule);

        // Создаем таблицу для каждого дня
        for (const [day, classesData] of Object.entries(groupedClasses)) {
            const dayTable = createDayTable(day, classesData);
            scheduleContainer.appendChild(dayTable);
        }
    } else {
        scheduleContainer.textContent = 'Нет пар по расписанию';
    }
}

async function showCurrentClass() {
    await fetchAndDisplayClass('current');
}

async function showNextClass() {
    await fetchAndDisplayClass('next');
}

function createTableRow(classData) {
    const row = document.createElement('tr');
    const columns = [
        classData.Discipline,
        classData.ClassRoom,
        classData.TeacherShort,
        classData.TimeBeg,
    ];
    columns.forEach(columnText => {
        const td = document.createElement('td');
        td.textContent = columnText;
        row.appendChild(td);
    });
    return row;
}

async function fetchAndDisplayClass(type) {
    const selectedGroup = getSelectedGroup();
    const tableContainer = document.getElementById('classTable');
    tableContainer.innerHTML = '';

    if(!selectedGroup){
        tableContainer.textContent = 'Сначала выберите группу';
        return;
    }
    
    const response = await fetch(`/get_schedule_for_class/${selectedGroup}/${type}/`);
    const data = await response.json();

    if (data.schedule) {
        // Если schedule не null или undefined
        const dayTable = createDayTable(getDayLabel(data.schedule.DayOfWeek), [data.schedule]);
        tableContainer.appendChild(dayTable);
    } else {
        if (type == 'next') {
            tableContainer.textContent = `Нет следующих пар для выбранной группы`;
        }
        else if (type == 'current') {
            tableContainer.textContent = `Нет текущих пар для выбранной группы`;
        }
        else {
            tableContainer.textContent = `Нет пар для выбранной группы`;
        }
    }
}

function formatClassTime(rawTime) {
    const timeParts = rawTime.split(':');
    const hours = timeParts[0].padStart(2, '0');
    const minutes = timeParts[1].padStart(2, '0');
    return `${hours}:${minutes}`;
}