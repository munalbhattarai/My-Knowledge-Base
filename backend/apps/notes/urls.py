from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, ResourceViewSet, DashboardView
from django.urls import path

router = DefaultRouter()
router.register("notes", NoteViewSet, basename="note")
router.register("resources", ResourceViewSet, basename="resource")

urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
]

urlpatterns += router.urls