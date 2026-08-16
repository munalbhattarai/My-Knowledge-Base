from rest_framework import serializers
from .models import Note, Resource

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