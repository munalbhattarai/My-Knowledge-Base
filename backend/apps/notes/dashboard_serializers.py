from rest_framework import serializers

class DashboardSerializer(serializers.Serializer):
    total_notes = serializers.IntegerField()
    learning = serializers.IntegerField()
    learned = serializers.IntegerField()
    review = serializers.IntegerField()
    favorites = serializers.IntegerField()
    archived = serializers.IntegerField()
    categories = serializers.IntegerField()