from rest_framework import serializers
from .models import Note, Resource, CodeSnippet

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = [
            "id",
            "category",
            "title",
            "content",
            "owner",
            "tags",
            "status",
            "is_archived",
            "is_favourite",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "owner",
            "created_at",
            "updated_at"
        ]
        
class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = [
            "id",
            "note",
            "title",
            "url",
            "resource_type",
            "description",
            "created_at"
        ]
        read_only_fields  = [
            "id",
            "created_at",
        ]
        
class CodeSnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSnippet
        fields = [
            "id",
            "note",
            "title",
            "code",
            "language",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]