from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Network
from .serializers import NetworkSerializer
from rest_framework import status


class NetworkViewSet(viewsets.ModelViewSet):
    queryset = Network.objects.all()
    serializer_class = NetworkSerializer
    
    @action(methods=['post'], detail=False)
    def post(self, request):
        serializer = NetworkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
