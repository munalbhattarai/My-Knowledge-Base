from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name
    
class Tag(models.Model):
    name = models.CharField(max_length=100 , unique=True)
    
    def __str__(self):
        return self.name
        

class Note(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    category = models.ForeignKey(Category , on_delete=models.SET_NULL, null=True ,blank=True,   related_name="notes")
    tags = models.ManyToManyField(Tag, blank=True, related_name="notes")
    
    title = models.CharField(max_length=225)
    content = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at =models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
        