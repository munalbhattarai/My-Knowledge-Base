from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, ResourceViewSet

router = DefaultRouter()
router.register("notes", NoteViewSet, basename="note")
router.register("resources", ResourceViewSet, basename="resource")

urlpatterns = router.urls