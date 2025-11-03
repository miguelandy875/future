"""
Admin Dashboard API Views
Comprehensive admin panel endpoints for platform management
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Avg, Q, Sum
from django.utils import timezone
from datetime import timedelta

from users.models import User, VerificationCode
from listings.models import Listing, Category, RatingReview, Favorite, ReportMisconduct, UserSubscription
from payments.models import Payment, DealerApplication, DealerDocument
from messaging.models import Chat, Message
from notifications.models import Notification


def is_admin(user):
    """Check if user is admin (staff or superuser)"""
    return user.is_staff or user.is_superuser


# ============================================================================
# DASHBOARD STATISTICS
# ============================================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    Get dashboard statistics
    GET /api/admin/stats/
    """
    if not is_admin(request.user):
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)

    # Calculate date ranges
    now = timezone.now()
    last_30_days = now - timedelta(days=30)
    last_7_days = now - timedelta(days=7)
    today = now.date()

    # User statistics
    total_users = User.objects.count()
    new_users_30d = User.objects.filter(date_joined__gte=last_30_days).count()
    verified_users = User.objects.filter(is_verified=True).count()
    sellers = User.objects.filter(is_seller=True).count()
    dealers = User.objects.filter(is_dealer=True).count()

    # Listing statistics
    total_listings = Listing.objects.count()
    active_listings = Listing.objects.filter(listing_status='active').count()
    pending_listings = Listing.objects.filter(listing_status='pending').count()
    new_listings_30d = Listing.objects.filter(createdat__gte=last_30_days).count()
    featured_listings = Listing.objects.filter(is_featured=True).count()

    # Payment statistics
    total_payments = Payment.objects.count()
    successful_payments = Payment.objects.filter(payment_status='successful').count()
    total_revenue = Payment.objects.filter(
        payment_status='successful'
    ).aggregate(total=Sum('payment_amount'))['total'] or 0
    revenue_30d = Payment.objects.filter(
        payment_status='successful',
        createdat__gte=last_30_days
    ).aggregate(total=Sum('payment_amount'))['total'] or 0

    # Dealer applications
    pending_dealer_apps = DealerApplication.objects.filter(appli_status='pending').count()
    approved_dealers = DealerApplication.objects.filter(appli_status='approved').count()

    # Reports
    pending_reports = ReportMisconduct.objects.filter(report_status='pending').count()
    total_reports = ReportMisconduct.objects.count()

    # Engagement metrics
    total_messages = Message.objects.count()
    total_favorites = Favorite.objects.count()
    total_reviews = RatingReview.objects.count()
    avg_rating = RatingReview.objects.aggregate(avg=Avg('rating'))['avg'] or 0

    # Recent activity (last 7 days)
    recent_users = User.objects.filter(date_joined__gte=last_7_days).count()
    recent_listings = Listing.objects.filter(createdat__gte=last_7_days).count()
    recent_messages = Message.objects.filter(sent_at__gte=last_7_days).count()

    return Response({
        'users': {
            'total': total_users,
            'new_30d': new_users_30d,
            'verified': verified_users,
            'sellers': sellers,
            'dealers': dealers,
            'recent_7d': recent_users,
        },
        'listings': {
            'total': total_listings,
            'active': active_listings,
            'pending': pending_listings,
            'featured': featured_listings,
            'new_30d': new_listings_30d,
            'recent_7d': recent_listings,
        },
        'payments': {
            'total': total_payments,
            'successful': successful_payments,
            'total_revenue': float(total_revenue),
            'revenue_30d': float(revenue_30d),
        },
        'dealers': {
            'pending_applications': pending_dealer_apps,
            'approved': approved_dealers,
        },
        'reports': {
            'pending': pending_reports,
            'total': total_reports,
        },
        'engagement': {
            'messages': total_messages,
            'favorites': total_favorites,
            'reviews': total_reviews,
            'avg_rating': round(float(avg_rating), 2),
            'recent_messages_7d': recent_messages,
        },
    })


# ============================================================================
# CATEGORY MANAGEMENT
# ============================================================================

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def categories_admin(request):
    """
    Get all categories or create new category
    GET/POST /api/admin/categories/
    """
    if not is_admin(request.user):
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        categories = Category.objects.all().annotate(
            listings_count=Count('listing')
        ).order_by('-createdat')

        data = [{
            'cat_id': cat.cat_id,
            'cat_name': cat.cat_name,
            'slug': cat.slug,
            'cat_description': cat.cat_description,
            'is_active': cat.is_active,
            'listings_count': cat.listings_count,
            'createdat': cat.createdat,
        } for cat in categories]

        return Response(data)

    elif request.method == 'POST':
        from django.utils.text import slugify

        cat_name = request.data.get('cat_name')
        cat_description = request.data.get('cat_description', '')
        is_active = request.data.get('is_active', True)

        if not cat_name:
            return Response({
                'error': 'Category name is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Generate slug
        slug = slugify(cat_name)

        # Check if slug exists
        if Category.objects.filter(slug=slug).exists():
            return Response({
                'error': 'Category with this name already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        category = Category.objects.create(
            cat_name=cat_name,
            slug=slug,
            cat_description=cat_description,
            is_active=is_active
        )

        return Response({
            'message': 'Category created successfully',
            'category': {
                'cat_id': category.cat_id,
                'cat_name': category.cat_name,
                'slug': category.slug,
                'cat_description': category.cat_description,
                'is_active': category.is_active,
            }
        }, status=status.HTTP_201_CREATED)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def category_detail_admin(request, cat_id):
    """
    Update or delete category
    PUT/DELETE /api/admin/categories/{cat_id}/
    """
    if not is_admin(request.user):
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)

    try:
        category = Category.objects.get(cat_id=cat_id)
    except Category.DoesNotExist:
        return Response({
            'error': 'Category not found'
        }, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        from django.utils.text import slugify

        cat_name = request.data.get('cat_name', category.cat_name)
        cat_description = request.data.get('cat_description', category.cat_description)
        is_active = request.data.get('is_active', category.is_active)

        # Update slug if name changed
        if cat_name != category.cat_name:
            slug = slugify(cat_name)
            if Category.objects.filter(slug=slug).exclude(cat_id=cat_id).exists():
                return Response({
                    'error': 'Category with this name already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            category.slug = slug

        category.cat_name = cat_name
        category.cat_description = cat_description
        category.is_active = is_active
        category.save()

        return Response({
            'message': 'Category updated successfully',
            'category': {
                'cat_id': category.cat_id,
                'cat_name': category.cat_name,
                'slug': category.slug,
                'cat_description': category.cat_description,
                'is_active': category.is_active,
            }
        })

    elif request.method == 'DELETE':
        # Check if category has listings
        listings_count = Listing.objects.filter(cat_id=category).count()
        if listings_count > 0:
            return Response({
                'error': f'Cannot delete category with {listings_count} listings'
            }, status=status.HTTP_400_BAD_REQUEST)

        category.delete()
        return Response({
            'message': 'Category deleted successfully'
        }, status=status.HTTP_200_OK)


# ============================================================================
# USER MANAGEMENT
# ============================================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_admin(request):
    """
    Get all users with filtering
    GET /api/admin/users/
    Query params: role, verified, search, page
    """
    if not is_admin(request.user):
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)

    users = User.objects.all()

    # Filters
    role = request.GET.get('role')
    if role == 'seller':
        users = users.filter(is_seller=True)
    elif role == 'dealer':
        users = users.filter(is_dealer=True)

    verified = request.GET.get('verified')
    if verified == 'true':
        users = users.filter(is_verified=True)
    elif verified == 'false':
        users = users.filter(is_verified=False)

    search = request.GET.get('search')
    if search:
        users = users.filter(
            Q(email__icontains=search) |
            Q(user_firstname__icontains=search) |
            Q(user_lastname__icontains=search) |
            Q(phone_number__icontains=search)
        )

    # Annotate with counts
    users = users.annotate(
        listings_count=Count('listings'),
        reviews_count=Count('reviews_given')
    ).order_by('-date_joined')

    # Pagination
    page = int(request.GET.get('page', 1))
    page_size = 20
    start = (page - 1) * page_size
    end = start + page_size

    total = users.count()
    users_page = users[start:end]

    data = [{
        'userid': user.userid,
        'full_name': user.full_name,
        'email': user.email,
        'phone_number': user.phone_number,
        'user_role': user.user_role,
        'is_seller': user.is_seller,
        'is_dealer': user.is_dealer,
        'is_verified': user.is_verified,
        'email_verified': user.email_verified,
        'phone_verified': user.phone_verified,
        'is_active': user.is_active,
        'date_joined': user.date_joined,
        'listings_count': user.listings_count,
        'reviews_count': user.reviews_count,
    } for user in users_page]

    return Response({
        'users': data,
        'total': total,
        'page': page,
        'page_size': page_size,
        'total_pages': (total + page_size - 1) // page_size
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def user_manage_admin(request, userid):
    """
    Manage user (activate/deactivate, verify, etc.)
    PUT /api/admin/users/{userid}/
    """
    if not is_admin(request.user):
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(userid=userid)
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)

    # Update fields
    if 'is_active' in request.data:
        user.is_active = request.data['is_active']

    if 'is_verified' in request.data:
        user.is_verified = request.data['is_verified']
        if user.is_verified:
            user.email_verified = True
            user.phone_verified = True

    if 'is_dealer' in request.data:
        user.is_dealer = request.data['is_dealer']
        if user.is_dealer:
            user.user_role = 'dealer'

    user.save()

    return Response({
        'message': 'User updated successfully',
        'user': {
            'userid': user.userid,
            'full_name': user.full_name,
            'is_active': user.is_active,
            'is_verified': user.is_verified,
            'is_dealer': user.is_dealer,
        }
    })


# ============================================================================
# LISTING MODERATION
# ============================================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listings_admin(request):
    """
    Get all listings for moderation
    GET /api/admin/listings/
    Query params: status, search, page
    """
    if not is_admin(request.user):
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)

    listings = Listing.objects.all().select_related('userid', 'cat_id')

    # Filters
    listing_status = request.GET.get('status')
    if listing_status:
        listings = listings.filter(listing_status=listing_status)

    search = request.GET.get('search')
    if search:
        listings = listings.filter(
            Q(listing_title__icontains=search) |
            Q(list_description__icontains=search) |
            Q(userid__email__icontains=search)
        )

    listings = listings.order_by('-createdat')

    # Pagination
    page = int(request.GET.get('page', 1))
    page_size = 20
    start = (page - 1) * page_size
    end = start + page_size

    total = listings.count()
    listings_page = listings[start:end]

    data = [{
        'listing_id': listing.listing_id,
        'listing_title': listing.listing_title,
        'listing_price': str(listing.listing_price),
        'list_location': listing.list_location,
        'listing_status': listing.listing_status,
        'is_featured': listing.is_featured,
        'views': listing.views,
        'createdat': listing.createdat,
        'seller': {
            'userid': listing.userid.userid,
            'full_name': listing.userid.full_name,
            'email': listing.userid.email,
        },
        'category': {
            'cat_id': listing.cat_id.cat_id,
            'cat_name': listing.cat_id.cat_name,
        },
    } for listing in listings_page]

    return Response({
        'listings': data,
        'total': total,
        'page': page,
        'page_size': page_size,
        'total_pages': (total + page_size - 1) // page_size
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def listing_moderate_admin(request, listing_id):
    """
    Moderate listing (approve/reject/feature)
    PUT /api/admin/listings/{listing_id}/
    """
    if not is_admin(request.user):
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)

    try:
        listing = Listing.objects.get(listing_id=listing_id)
    except Listing.DoesNotExist:
        return Response({
            'error': 'Listing not found'
        }, status=status.HTTP_404_NOT_FOUND)

    # Update fields
    if 'listing_status' in request.data:
        listing.listing_status = request.data['listing_status']

        # Notify seller
        from notifications.utils import create_notification
        if listing.listing_status == 'active':
            create_notification(
                user=listing.userid,
                title='Listing Approved',
                message=f'Your listing "{listing.listing_title}" has been approved and is now live!',
                notif_type='listing',
                link_url=f'/listings/{listing.listing_id}'
            )
        elif listing.listing_status == 'hidden':
            create_notification(
                user=listing.userid,
                title='Listing Rejected',
                message=f'Your listing "{listing.listing_title}" has been rejected.',
                notif_type='listing'
            )

    if 'is_featured' in request.data:
        listing.is_featured = request.data['is_featured']

    listing.save()

    return Response({
        'message': 'Listing updated successfully',
        'listing': {
            'listing_id': listing.listing_id,
            'listing_status': listing.listing_status,
            'is_featured': listing.is_featured,
        }
    })


# ============================================================================
# DEALER APPLICATIONS
# ============================================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dealer_applications_admin(request):
    """
    Get all dealer applications
    GET /api/admin/dealer-applications/
    Query params: status, page
    """
    if not is_admin(request.user):
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)

    applications = DealerApplication.objects.all().select_related('userid')

    # Filters
    appli_status = request.GET.get('status')
    if appli_status:
        applications = applications.filter(appli_status=appli_status)

    applications = applications.order_by('-createdat')

    # Pagination
    page = int(request.GET.get('page', 1))
    page_size = 20
    start = (page - 1) * page_size
    end = start + page_size

    total = applications.count()
    apps_page = applications[start:end]

    data = [{
        'dealerapp_id': app.dealerapp_id,
        'business_name': app.business_name,
        'business_type': app.business_type,
        'business_address': app.business_address,
        'business_phone': app.business_phone,
        'business_email': app.business_email,
        'tax_id': app.tax_id,
        'appli_status': app.appli_status,
        'rejection_reason': app.rejection_reason,
        'createdat': app.createdat,
        'approvedat': app.approvedat,
        'applicant': {
            'userid': app.userid.userid,
            'full_name': app.userid.full_name,
            'email': app.userid.email,
            'phone_number': app.userid.phone_number,
        },
    } for app in apps_page]

    return Response({
        'applications': data,
        'total': total,
        'page': page,
        'page_size': page_size,
        'total_pages': (total + page_size - 1) // page_size
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def dealer_application_review_admin(request, dealerapp_id):
    """
    Approve or reject dealer application
    PUT /api/admin/dealer-applications/{dealerapp_id}/
    {
        "appli_status": "approved" or "rejected",
        "rejection_reason": "..." (if rejected)
    }
    """
    if not is_admin(request.user):
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)

    try:
        application = DealerApplication.objects.get(dealerapp_id=dealerapp_id)
    except DealerApplication.DoesNotExist:
        return Response({
            'error': 'Application not found'
        }, status=status.HTTP_404_NOT_FOUND)

    appli_status = request.data.get('appli_status')
    if appli_status not in ['approved', 'rejected']:
        return Response({
            'error': 'Invalid status. Use "approved" or "rejected"'
        }, status=status.HTTP_400_BAD_REQUEST)

    application.appli_status = appli_status

    if appli_status == 'approved':
        application.approvedat = timezone.now()
        # Signal will handle setting user.is_dealer = True

        # Notify user
        from notifications.utils import create_notification
        create_notification(
            user=application.userid,
            title='Dealer Application Approved!',
            message=f'Congratulations! Your dealer application for "{application.business_name}" has been approved.',
            notif_type='system'
        )

    elif appli_status == 'rejected':
        rejection_reason = request.data.get('rejection_reason', 'Application did not meet requirements')
        application.rejection_reason = rejection_reason

        # Notify user
        from notifications.utils import create_notification
        create_notification(
            user=application.userid,
            title='Dealer Application Rejected',
            message=f'Your dealer application has been rejected. Reason: {rejection_reason}',
            notif_type='system'
        )

    application.save()

    return Response({
        'message': f'Application {appli_status} successfully',
        'application': {
            'dealerapp_id': application.dealerapp_id,
            'appli_status': application.appli_status,
            'approvedat': application.approvedat,
        }
    })


# ============================================================================
# REPORTS MANAGEMENT
# ============================================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reports_admin(request):
    """
    Get all reports
    GET /api/admin/reports/
    Query params: status, type, page
    """
    if not is_admin(request.user):
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)

    reports = ReportMisconduct.objects.all().select_related(
        'userid', 'reported_userid', 'listing_id'
    )

    # Filters
    report_status = request.GET.get('status')
    if report_status:
        reports = reports.filter(report_status=report_status)

    report_type = request.GET.get('type')
    if report_type:
        reports = reports.filter(report_type=report_type)

    reports = reports.order_by('-createdat')

    # Pagination
    page = int(request.GET.get('page', 1))
    page_size = 20
    start = (page - 1) * page_size
    end = start + page_size

    total = reports.count()
    reports_page = reports[start:end]

    data = [{
        'reportmiscond_id': report.reportmiscond_id,
        'report_type': report.report_type,
        'report_reason': report.report_reason,
        'report_status': report.report_status,
        'admin_notes': report.admin_notes,
        'createdat': report.createdat,
        'resolved_at': report.resolved_at,
        'reporter': {
            'userid': report.userid.userid,
            'full_name': report.userid.full_name,
            'email': report.userid.email,
        },
        'reported_user': {
            'userid': report.reported_userid.userid,
            'full_name': report.reported_userid.full_name,
            'email': report.reported_userid.email,
        } if report.reported_userid else None,
        'listing': {
            'listing_id': report.listing_id.listing_id,
            'listing_title': report.listing_id.listing_title,
        } if report.listing_id else None,
    } for report in reports_page]

    return Response({
        'reports': data,
        'total': total,
        'page': page,
        'page_size': page_size,
        'total_pages': (total + page_size - 1) // page_size
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def report_resolve_admin(request, report_id):
    """
    Resolve or reject a report
    PUT /api/admin/reports/{report_id}/
    {
        "report_status": "resolved" or "rejected",
        "admin_notes": "..."
    }
    """
    if not is_admin(request.user):
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)

    try:
        report = ReportMisconduct.objects.get(reportmiscond_id=report_id)
    except ReportMisconduct.DoesNotExist:
        return Response({
            'error': 'Report not found'
        }, status=status.HTTP_404_NOT_FOUND)

    report_status = request.data.get('report_status')
    if report_status not in ['resolved', 'rejected']:
        return Response({
            'error': 'Invalid status. Use "resolved" or "rejected"'
        }, status=status.HTTP_400_BAD_REQUEST)

    report.report_status = report_status
    report.admin_notes = request.data.get('admin_notes', '')
    report.resolved_at = timezone.now()
    report.save()

    # If resolved, take action on the reported content/user
    if report_status == 'resolved':
        if report.listing_id:
            # Hide the reported listing
            report.listing_id.listing_status = 'hidden'
            report.listing_id.save()

    return Response({
        'message': f'Report {report_status} successfully',
        'report': {
            'reportmiscond_id': report.reportmiscond_id,
            'report_status': report.report_status,
            'resolved_at': report.resolved_at,
        }
    })

