from rest_framework import serializers

from .models import Note, Resource, CodeSnippet


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
            "created_at",
        ]
        read_only_fields = [
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


class NoteSerializer(serializers.ModelSerializer):
    resources = ResourceSerializer(many=True, read_only=True)
    code_snippets = CodeSnippetSerializer(many=True, read_only=True)

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "content",
            "owner",
            "category",
            "tags",
            "status",
            "is_archived",
            "is_favorite",
            "resources",
            "code_snippets",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "owner",
            "resources",
            "code_snippets",
            "created_at",
            "updated_at",
        ]


class NoteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = [
            "id",
            "category",
            "title",
            "owner",
            "tags",
            "status",
            "is_archived",
            "is_favorite",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "owner",
            "created_at",
            "updated_at",
        ]