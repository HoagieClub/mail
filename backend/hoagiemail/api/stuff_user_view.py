from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class StuffUserView(APIView):
    def get(self, request) -> Response:
        # Logic to get user posts
        return Response({
            "status": "OK", 
            "message": "User posts retrieved successfully"
            }, status=status.HTTP_200_OK)
    
    def post(self, request) -> Response:
        # Logic to make a post
        return Response({
            "status": "OK", 
            "message": "Post made successfully"
            }, status=status.HTTP_200_OK)
    
    def delete(self, request) -> Response:
        # Logic to delete a post
        return Response({
            "status": "OK", 
            "message": "Post deleted successfully"
            }, status=status.HTTP_200_OK)