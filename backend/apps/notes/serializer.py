from rest_framework import serializers

from .models import Note, Resource, CodeSnippet, Category, Tag


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


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
    """
    Full note serializer used for retrieve / create / update.

    Read  → category and tags are returned as nested {id, name} objects.
    Write → category accepts an integer PK (or null), tags accepts a list
            of integer PKs.  This matches exactly what the React editor sends.
    """

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

    # ------------------------------------------------------------------
    # Custom field declarations so DRF uses PK for writes and nested
    # objects for reads (to_representation handles the read side).
    # ------------------------------------------------------------------

    def to_internal_value(self, data):
        """Accept integer PK for category and list of integer PKs for tags."""
        # Make a mutable copy so we can manipulate it safely.
        data = data.copy() if hasattr(data, "copy") else dict(data)

        # Resolve category PK → Category instance
        category_val = data.get("category")
        if category_val not in (None, "", "null"):
            try:
                data["category"] = int(category_val)
            except (TypeError, ValueError):
                raise serializers.ValidationError({"category": "Must be an integer PK."})
        else:
            data["category"] = None

        # Resolve tags list of PKs → list of ints
        tags_val = data.get("tags")
        if tags_val is not None:
            if isinstance(tags_val, str):
                # Handle comma-separated or JSON-encoded string edge cases
                import json
                try:
                    tags_val = json.loads(tags_val)
                except (ValueError, json.JSONDecodeError):
                    tags_val = [t.strip() for t in tags_val.split(",") if t.strip()]
            try:
                data["tags"] = [int(t) for t in tags_val]
            except (TypeError, ValueError):
                raise serializers.ValidationError({"tags": "Must be a list of integer PKs."})
        else:
            data["tags"] = []

        return super().to_internal_value(data)

    def to_representation(self, instance):
        """Return nested {id, name} objects for category and tags."""
        ret = super().to_representation(instance)
        # Category — guard against RelatedObjectDoesNotExist if the FK target
        # was deleted without the SET_NULL trigger firing (e.g. raw SQL).
        if instance.category_id is not None:
            try:
                ret["category"] = CategorySerializer(instance.category).data
            except Exception:
                ret["category"] = None
        else:
            ret["category"] = None
        # Tags — prefetch_related must be done by the view for efficiency
        ret["tags"] = TagSerializer(instance.tags.all(), many=True).data
        return ret

    def validate_category(self, value):
        """value is a Category instance (resolved by PrimaryKeyRelatedField) or None."""
        if value is None:
            return None
        if isinstance(value, Category):
            return value
        try:
            return Category.objects.get(pk=value)
        except Category.DoesNotExist:
            raise serializers.ValidationError(f"Category with id {value} does not exist.")

    def validate_tags(self, value):
        """value is a list of Tag instances (resolved by PrimaryKeyRelatedField) or ints."""
        if not value:
            return []
        if value and isinstance(value[0], Tag):
            return value
        tags = list(Tag.objects.filter(pk__in=value))
        if len(tags) != len(value):
            raise serializers.ValidationError("One or more tag IDs are invalid.")
        return tags

    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        note = Note.objects.create(**validated_data)
        note.tags.set(tags)
        return note

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        if tags is not None:
            instance.tags.set(tags)
        return instance


class NoteListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for the notes list view.
    Returns nested category/tags objects (same shape as NoteSerializer)
    so the frontend doesn't need a separate registry lookup.
    """
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

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