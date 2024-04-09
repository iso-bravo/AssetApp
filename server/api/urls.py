from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('asset_employee_count/', views.AssetAndEmployeesView.as_view(), name='asset_employee_count'),
    path('asset_all/', views.AssetInformationAllView.as_view(), name='asset_all'),
    path('asset_id/', views.AssetInformationByIDView.as_view(), name='asset_id'),
    path('create_asset/', views.CreateAssetView.as_view(), name='create_asset'),
    path('delete_asset/', views.DeleteAssetView.as_view(), name='delete_asset'),
    path('edit_asset/', views.EditAssetView.as_view(), name='edit_asset'),
    path('users/', views.GetUsersAllView.as_view(), name='users'),
    path('categories/', views.GetCategoriesAllView.as_view(), name='categories'),
    path('states/', views.GetStatesAllView.as_view(), name='states'),
    path('areas/', views.GetAreasAllView.as_view(), name='areas'),
    path('status_categories/', views.GetStatusCategoriesView.as_view(), name='status_categories'),
]
