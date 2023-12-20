# timetable/urls.py
from django.urls import path
from .views import get_faculties, get_schedule_for_current_week, get_schedule_for_day, get_schedule_for_class, index, get_select_data

app_name = 'timetable'

urlpatterns = [
    path('', index, name='index'),
    path('get_select_data/', get_select_data, name='get_select_data'),
    path('get_faculties/', get_faculties, name='get_faculties'),
    path('get_schedule_for_current_week/<str:group>/', get_schedule_for_current_week, name='get_schedule_for_current_week'),
    path('get_schedule_for_day/<str:group>/<str:day>/', get_schedule_for_day, name='get_schedule_for_day'),
    path('get_schedule_for_class/<str:group>/<str:class_type>/', get_schedule_for_class, name='get_schedule_for_class')
]
