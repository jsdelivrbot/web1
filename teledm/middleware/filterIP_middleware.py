from django.core.exceptions import PermissionDenied


class FilterIPMiddleware(object):
    # Check if client IP is allowed
    def process_request(self, request):
        allowed_ips = ['192.168.1.1', '123.123.123.123', '127.0.0.1', ] # Authorized ip's
        ip = request.META.get('REMOTE_ADDR') # Get client IP
        if ip not in allowed_ips:
            raise PermissionDenied # If user is not allowed raise Error

        # If IP is allowed we don't do anything
        return None



#def get_client_ip(request):
#    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
#    if x_forwarded_for:
#        print "returning FORWARDED_FOR"
#        ip = x_forwarded_for.split(',')[-1].strip()
#    elif request.META.get('HTTP_X_REAL_IP'):
#        print "returning REAL_IP"
#        ip = request.META.get('HTTP_X_REAL_IP')
#    else:
#        print "returning REMOTE_ADDR"
#        ip = request.META.get('REMOTE_ADDR')
#    return ip