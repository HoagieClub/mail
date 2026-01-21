from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class MailView(APIView):
	def post(self, request) -> Response:
		# Logic to send mail
		return Response({"status": "OK", "message": "Mail sent successfully"}, status=status.HTTP_200_OK)

	def get(self, request) -> Response:
		# Logic to get scheduled mails
		return Response(
			{"status": "unused", "message": "Scheduled mails retrieved successfully"}, status=status.HTTP_200_OK
		)

	def put(self, request) -> Response:
		# Logic to update a scheduled mail
		return Response({"status": "OK", "message": "Scheduled mail updated successfully"}, status=status.HTTP_200_OK)

	def delete(self, request) -> Response:
		# Logic to delete a scheduled mail
		return Response({"status": "OK", "message": "Scheduled mail deleted successfully"}, status=status.HTTP_200_OK)
