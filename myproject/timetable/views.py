from django.shortcuts import render
from .models import TimeTable
from django.http import JsonResponse
from datetime import datetime, timedelta
from django.views.decorators.http import require_GET
from django.db.models import Q

def index(request):

    return render(request, 'index.html')


def get_select_data(request):
    selected_faculty = request.GET.get('faculty', None)

    if selected_faculty:
        groups = TimeTable.objects.filter(Faculty=selected_faculty).values_list('SGroup', flat=True).distinct().order_by('SGroup')
    else:
        groups = TimeTable.objects.values_list('SGroup', flat=True).distinct().order_by('SGroup')

    data = {
        'groups': list(groups),
    }

    return JsonResponse(data, safe=False)


def get_faculties(request):
    faculties = TimeTable.objects.values_list('Faculty', flat=True).distinct()
    data = {'faculties': list(faculties)}
    return JsonResponse(data, safe=False)




@require_GET
def get_schedule_for_current_week(request, group):
    current_date = get_current_date()
    current_week = get_week_number(current_date)


    current_over_under_line = get_over_under_line(current_date)
    schedule = TimeTable.objects.filter(
            Q(SGroup=group),
            Q(DateBeg__lte=current_date + timedelta(days=7), DateEnd__gte=current_date),
            Q(OverUnderLine=current_over_under_line + ' чертой') | Q(OverUnderLine=''),
        ).values('DayOfWeek', 'Discipline', 'ClassRoom', 'TeacherShort', 'TimeBeg', 'OverUnderLine').order_by('DayOfWeek', 'TimeBeg')
    result = {
        'current_week': current_week,
        'schedule': list(schedule),
    }
    return JsonResponse(result)

def get_week_number(date):
    # Определение номера недели на основе даты
    return date.isocalendar()[1]

def get_over_under_line(date):
    # Определение, находится ли текущая неделя "Над" или "Под" чертой
    return 'Над' if date.isocalendar()[1] % 2 == 1 else 'Под'


@require_GET
def get_schedule_for_day(request, group, day):
    current_date = get_current_date()
    if day == 'today':
        day_offset = 0
    elif day == 'tomorrow':
        day_offset = 1
    else:
        # Обработка других вариантов (например, 'yesterday', 'in_two_days', и т.д.)
        # Если нужно будет реализовать
        day_offset = 0

    target_date = current_date + timedelta(days=day_offset)
    current_week = get_week_number(target_date)

    # Получаем текущую неделю для определения "Над" или "Под" чертой
    current_over_under_line = get_over_under_line(target_date)

    # Фильтруем занятия по дню недели
    schedule = TimeTable.objects.filter(
        Q(SGroup=group),
        Q(DateBeg__lte=target_date + timedelta(days=6), DateEnd__gte=target_date),
        Q(DayOfWeek=target_date.isoweekday()),
        Q(OverUnderLine=current_over_under_line + ' чертой') | Q(OverUnderLine=''),
    ).values('DayOfWeek', 'Discipline', 'ClassRoom', 'TeacherShort', 'TimeBeg', 'OverUnderLine').order_by('TimeBeg')

    result = {
        'current_week': current_week,
        'schedule': list(schedule),
    }

    return JsonResponse(result)


@require_GET
def get_schedule_for_class(request, group, class_type):
    current_date = get_current_date() # текущая дата и время
    current_week = get_week_number(current_date)
    current_over_under_line = get_over_under_line(current_date)

    # Определение текущего дня и времени
    current_day = current_date.isoweekday()
    current_time = get_current_time()


    # Выбор соответствующего дня и времени в зависимости от типа занятий
    if class_type == 'current':
        schedule = TimeTable.objects.filter(
            Q(SGroup=group),
            Q(DateBeg__lte=current_date + timedelta(days=7), DateEnd__gte=current_date),
            Q(DayOfWeek=current_day),
            Q(OverUnderLine=current_over_under_line + ' чертой') | Q(OverUnderLine=''),
            Q(TimeBeg__lte=current_time) & Q(TimeEnd__gte=current_time),
        ).values('DayOfWeek', 'Discipline', 'ClassRoom', 'TeacherShort', 'TimeBeg', 'OverUnderLine').order_by('TimeBeg').first()

    elif class_type == 'next':
        schedule = TimeTable.objects.filter(
            Q(SGroup=group),
            Q(DateBeg__lte=current_date + timedelta(days=7), DateEnd__gte=current_date),
            Q(DayOfWeek=current_day),
            Q(OverUnderLine=current_over_under_line + ' чертой') | Q(OverUnderLine=''),
            Q(TimeBeg__gte=current_time)
        ).values('DayOfWeek', 'Discipline', 'ClassRoom', 'TeacherShort', 'TimeBeg', 'OverUnderLine').order_by('TimeBeg').first()

    else:
        # Добавить обработку для других типов занятий, если необходимо
        ...


    result = {
        'current_week': current_week,
        'schedule': schedule,
    }

    return JsonResponse(result)

def get_current_date():
    return datetime.now().date()


def get_current_time():
    return datetime.now().time()