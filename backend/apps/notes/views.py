from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Note, Resource
from .serializer import NoteSerializer, ResourceSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend,
                       SearchFilter]
    
    filterset_fields = ["category", "tags", "status"]
    search_fields = ["title", "content"]
    
    def get_queryset(self):
        queryset =  Note.objects.filter(owner = self.request.user)
        
        archived = self.request.query_params.get("archived")
        
        if archived == "true":
            queryset = queryset.filter(is_archived = True)
            
        else :
            queryset = queryset.filter(is_archived = False)
        
        return queryset
    
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
        