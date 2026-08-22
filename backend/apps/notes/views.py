from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
from rest_framework.views import APIView
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from .models import Note, Resource, CodeSnippet, Category, Tag
from .serializer import (
    NoteSerializer,
    ResourceSerializer,
    NoteListSerializer,
    CodeSnippetSerializer,
    CategorySerializer,
    TagSerializer,
)
from .filters import NoteFilter
from .dashboard_serializers import DashboardSerializer


class NoteViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, SearchFilter]

    filterset_class = NoteFilter
    search_fields = ["title", "content"]

    def get_queryset(self):
        queryset = Note.objects.filter(owner=self.request.user).select_related("category")

        if self.action in ("list",):
            queryset = queryset.prefetch_related("tags")
        elif self.action == "retrieve":
            queryset = queryset.prefetch_related(
                "tags",
                "resources",
                "code_snippets",
            )
        return queryset.order_by("-updated_at")

    def get_serializer_class(self):
        if self.action == "list":
            return NoteListSerializer
        return NoteSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ResourceViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resource.objects.filter(note__owner=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        note = serializer.validated_data["note"]

        if note.owner != self.request.user:
            raise ValidationError("You cannot add the resources to another person notes")
        serializer.save()


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ["name"]
    # The registry must be complete (it resolves note category names), so never
    # paginate it — return every category.
    pagination_class = None

    def get_queryset(self):
        # Categories are a shared registry: notes only store a raw category id
        # and the frontend resolves names from this list, so every category must
        # be returned — including ones no note references yet.
        return Category.objects.order_by("name")

    def create(self, request, *args, **kwargs):
        # Names are globally unique; treat a duplicate as an idempotent "return
        # the existing category" instead of a 400 so the editor can select it.
        name = request.data.get("name", "").strip()
        if name:
            existing = Category.objects.filter(name__iexact=name).first()
            if existing:
                return Response(self.get_serializer(existing).data, status=status.HTTP_200_OK)
        return super().create(request, *args, **kwargs)


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ["name"]
    # See CategoryViewSet — return every tag, never paginate.
    pagination_class = None

    def get_queryset(self):
        # See CategoryViewSet.get_queryset — same shared-registry reasoning.
        return Tag.objects.order_by("name")

    def create(self, request, *args, **kwargs):
        name = request.data.get("name", "").strip()
        if name:
            existing = Tag.objects.filter(name__iexact=name).first()
            if existing:
                return Response(self.get_serializer(existing).data, status=status.HTTP_200_OK)
        return super().create(request, *args, **kwargs)


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notes = Note.objects.filter(owner=request.user)

        data = {
            "total_notes": notes.count(),
            "learning": notes.filter(status="LEARNING", is_archived=False).count(),
            "learned": notes.filter(status="LEARNED", is_archived=False).count(),
            "review": notes.filter(status="REVIEW", is_archived=False).count(),
            "favorites": notes.filter(is_favorite=True, is_archived=False).count(),
            "archived": notes.filter(is_archived=True).count(),
            "categories": notes.values("category").distinct().count(),
        }

        serializer = DashboardSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.validated_data)


class CodeSnippetViewSet(viewsets.ModelViewSet):
    serializer_class = CodeSnippetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CodeSnippet.objects.filter(note__owner=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        note = serializer.validated_data["note"]

        if note.owner != self.request.user:
            raise ValidationError("You cannot add the code snippet to other user's Note")

        serializer.save()
