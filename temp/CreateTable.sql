DROP TABLE IF EXISTS TimeTable;

CREATE TABLE IF NOT EXISTS TimeTable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    a_year INTEGER NULL,
    semestr INTEGER NULL,
    date_beg DATE NULL,
    date_end DATE NULL,
    week_period TEXT NOT NULL,
    time_beg TIME NULL,
    time_end TIME NULL,
    teacher TEXT NOT NULL,
    class_room TEXT NOT NULL,
    s_group TEXT NOT NULL,
    sub_group TEXT NULL,
    discipline TEXT NOT NULL,
    type_job TEXT NOT NULL,
    sub_special TEXT NULL,
    kurs INTEGER NULL,
    day_of_week INTEGER NULL,
    department TEXT NOT NULL,
    discipline_short TEXT NULL,
    teacher_short VARCHAR(50) NULL,
    over_under_line VARCHAR(10) NULL,
    faculty TEXT NOT NULL
);
