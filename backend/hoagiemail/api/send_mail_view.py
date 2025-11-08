from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class SendMailView(APIView):
    def post(self, request) -> Response:
        # Logic to send mail
        return Response({
            "status": "OK", 
            "message": "Mail sent successfully"
            }, status=status.HTTP_200_OK)