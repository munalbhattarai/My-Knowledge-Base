from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Note
from .serializer import NoteSerializer

# Create your views here.

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Note.objects.filter(owner = self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner= self.request.user) 
        