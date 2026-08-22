from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name
    
class Tag(models.Model):
    name = models.CharField(max_length=50 , unique=True)
    
    def __str__(self):
        return self.name
    

class Note(models.Model):
    STATUS_CHOICES = [
        ("LEARNING", "Learning"),
        ("LEARNED", "Learned"),
        ("REVIEW", "Review"),
    ]
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    category = models.ForeignKey(Category , on_delete=models.SET_NULL, null=True ,blank=True,   related_name="notes")
    tags = models.ManyToManyField(Tag, blank=True, related_name="notes")
    
    title = models.CharField(max_length=225)
    content = models.TextField()
    
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default="LEARNING")
    
    is_archived = models.BooleanField(default= False)
    is_favorite = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at =models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title


class Resource(models.Model):
    RESOURCE_TYPES = [
        ("ARTICLE", "Article"),
        ("VIDEO", "Video"),
        ("DOCUMENTATION", "Documentation"),
        ("GITHUB", "Github"),
        ("COURSE", "Course"),
        ("OTHERS", "Others"),
    ]
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="resources")
    title = models.CharField(max_length=100)
    url = models.URLField()
    resource_type = models.CharField(
        max_length=100,
        choices=RESOURCE_TYPES,
        default="OTHERS"
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
        
class CodeSnippet(models.Model):
    LANGUAGE_CHOICES = [
        ("PYTHON", "Python"),
        ("JAVASCRIPT", "JavaScript"),
        ("TYPESCRIPT", "TypeScript"),
        ("HTML", "HTML"),
        ("CSS", "CSS"),
        ("SQL", "SQL"),
        ("BASH", "Bash"),
        ("JSON", "JSON"),
        ("OTHER", "Other"),
    ]

    note = models.ForeignKey(
        Note,
        on_delete=models.CASCADE,
        related_name="code_snippets"
    )

    title = models.CharField(max_length=255)

    code = models.TextField()

    language = models.CharField(
        max_length=20,
        choices=LANGUAGE_CHOICES,
        default="OTHER"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title