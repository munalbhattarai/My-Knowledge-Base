from rest_framework.routers import DefaultRouter
from .views import (
    NoteViewSet,
    ResourceViewSet,
    DashboardView,
    CodeSnippetViewSet,
    CategoryViewSet,
    TagViewSet,
)
from django.urls import path

router = DefaultRouter()
router.register("notes", NoteViewSet, basename="note")
router.register("resources", ResourceViewSet, basename="resource")
router.register("code-snippets", CodeSnippetViewSet, basename="code-snippet")
router.register("categories", CategoryViewSet, basename="category")
router.register("tags", TagViewSet, basename="tag")

urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
]

urlpatterns += router.urls