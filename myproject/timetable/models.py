from django.db import models

class TimeTable(models.Model):
    id = models.AutoField(primary_key=True)
    AYear = models.IntegerField(null=True, db_column='a_year')
    Semestr = models.IntegerField(null=True, db_column='semestr')
    DateBeg = models.DateField(null=True, db_column='date_beg')
    DateEnd = models.DateField(null=True, db_column='date_end')
    WeekPeriod = models.TextField(max_length=25, db_column='week_period')
    TimeBeg = models.TimeField(null=True, db_column='time_beg')
    TimeEnd = models.TimeField(null=True, db_column='time_end')
    Teacher = models.TextField(max_length=50, db_column='teacher')
    ClassRoom = models.TextField(max_length=50, db_column='class_room')
    SGroup = models.TextField(max_length=50, db_column='s_group')
    SubGroup = models.TextField(max_length=50, null=True, db_column='sub_group')
    Discipline = models.TextField(max_length=150, db_column='discipline')
    TypeJob = models.TextField(max_length=50, db_column='type_job')
    SubSpecial = models.TextField(max_length=150, null=True, db_column='sub_special')
    Kurs = models.IntegerField(null=True, db_column='kurs')
    DayOfWeek = models.IntegerField(null=True, db_column='day_of_week')
    Department = models.TextField(max_length=150, db_column='department')
    DisciplineShort = models.TextField(max_length=30, null=True, db_column='discipline_short')
    TeacherShort = models.CharField(max_length=50, null=True, db_column='teacher_short')
    OverUnderLine = models.CharField(max_length=10, null=True, db_column='over_under_line')
    Faculty = models.TextField(max_length=150, db_column='faculty')

    class Meta:
        db_table = 'TimeTable'



