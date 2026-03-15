from django.contrib.auth.models import User


def get_user_from_request(request) -> User:
    """
    Helper to get the authenticated user from a DRF request.
    """
    return request.user

