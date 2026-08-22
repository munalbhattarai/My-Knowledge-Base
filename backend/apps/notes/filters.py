import django_filters
from .models import Note

class NoteFilter(django_filters.FilterSet):
    class Meta:
        model = Note
        fields = [
            "category",
            "tags",
            "status",
            "is_favorite",
            "is_archived",
        ]