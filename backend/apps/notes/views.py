from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Note, Resource, CodeSnippet
from .serializer import NoteSerializer, ResourceSerializer, NoteListSerializer, CodeSnippetSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from .filters import NoteFilter

from rest_framework.views import APIView
from rest_framework.response import Response
from .dashboard_serializers import DashboardSerializer




# Create your views here.

class NoteViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend,
                       SearchFilter]
    
    filterset_class = NoteFilter
    search_fields = ["title", "content"]
    
    def get_queryset(self):
        queryset = Note.objects.filter(
        owner=self.request.user
    ).select_related("category")

        if self.action == "retrieve":
            queryset = queryset.prefetch_related(
            "tags",
            "resources",
            "code_snippets",
        )

        return queryset
                    
        
                    
        
    def get_serializer_class(self):
        if self.action == "list":
            return NoteListSerializer
        return NoteSerializer
        
    
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
        
        
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        notes = Note.objects.filter(owner= request.user)
        
        data = {
            "totl_count" : notes.coutn(),
            "learning" : notes.filter(status = "LEARNING").count(),
            "learned " : notes.filter(status = "LEARNED").count(),
            "review" : notes.filter(status = "REVIEW").count(),
            "is_favourite" : notes.filter(is_favourite = True).count(),
            "is_archived" : notes.filter(is_archived= True),
            "categories" :notes.values("category").distinct().count(),
            
        }
        
        serializer = DashboardSerializer(data = data)
        serializer.is_valid(raise_exception=True)
    
        return Response(serializer.validated_data)
    
class CodeSnippetViewSet(viewsets.ModelViewSet):
    serializer_class = CodeSnippetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CodeSnippet.objects.filter(
            note__owner = self.request.user
        )
    def perform_create(self, serializer):
        note = serializer.validated_data["note"]
        
        if note.owner != self.request.user:
            raise ValidationError("You cannot add the code snippet to other user's Note")
        
        serializer.save()