from django.urls import path
from . import admin_views

urlpatterns = [
    # Dashboard Statistics
    path('stats/', admin_views.dashboard_stats, name='admin-stats'),

    # Category Management
    path('categories/', admin_views.categories_admin, name='admin-categories'),
    path('categories/<int:cat_id>/', admin_views.category_detail_admin, name='admin-category-detail'),

    # User Management
    path('users/', admin_views.users_admin, name='admin-users'),
    path('users/<int:userid>/', admin_views.user_manage_admin, name='admin-user-manage'),

    # Listing Moderation
    path('listings/', admin_views.listings_admin, name='admin-listings'),
    path('listings/<int:listing_id>/', admin_views.listing_moderate_admin, name='admin-listing-moderate'),

    # Dealer Applications
    path('dealer-applications/', admin_views.dealer_applications_admin, name='admin-dealer-applications'),
    path('dealer-applications/<int:dealerapp_id>/', admin_views.dealer_application_review_admin, name='admin-dealer-application-review'),

    # Reports Management
    path('reports/', admin_views.reports_admin, name='admin-reports'),
    path('reports/<int:report_id>/', admin_views.report_resolve_admin, name='admin-report-resolve'),
]
