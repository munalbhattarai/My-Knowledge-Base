from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Note, Resource
from .serializer import NoteSerializer, ResourceSerializer
from rest_framework.exceptions import ValidationError

# Create your views here.

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Note.objects.filter(owner = self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner= self.request.user) 

class ResourceViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Resource.objects.filter(
            note__owner = self.request.user
        )
        
    def perform_create(self, serializer):
        note = serializer.validated_data["note"]
        
        if note.owner != self.request.user:
            raise ValidationError(
                "You cannot add the resources to another person notes"
            )
        serializer.save()
        