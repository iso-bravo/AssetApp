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
    path('status_categories/', views.GetStatusCategoriesView.as_view(), name='status_categories'),
    
    path('users/', views.GetUsersAllView.as_view(), name='users'),
    path('create_user/', views.CreateUserView.as_view(), name='create_user'),
    path('edit_user/', views.EditUserByIDView.as_view(), name='edit_user'),
    path('delete_user/', views.DeleteUserByIDView.as_view(), name='delete_user'),
    
    path('departments/', views.GetDepartmentsAllView.as_view(), name='departments'),
    
    path('permissions/', views.GetPermissionsAllView.as_view(), name='permissions'),
    
    path('categories/', views.GetCategoriesAllView.as_view(), name='categories'),
    path('create_category/', views.CreateCategoryView.as_view(), name='create_category'),
    path('edit_category/', views.EditCategoryByIDView.as_view(), name='edit_category'),
    path('delete_category/', views.DeleteCategoryByIDView.as_view(), name='delete_category'),
    
    path('states/', views.GetStatesAllView.as_view(), name='states'),
    path('create_status/', views.CreateStatusView.as_view(), name='create_status'),
    path('edit_status/', views.EditStatusByIDView.as_view(), name='edit_status'),
    path('delete_status/', views.DeleteStatusByIDView.as_view(), name='delete_status'),
    
    path('areas/', views.GetAreasAllView.as_view(), name='areas'),
    path('create_area/', views.CreateAreaView.as_view(), name='create_area'),
    path('edit_area/', views.EditAreaByIDView.as_view(), name='edit_area'),
    path('delete_area/', views.DeleteAreaByIDView.as_view(), name='delete_area'),
    
    path('export_csv/', views.ExportAssetsCsvView.as_view(), name='export_csv'),
]
