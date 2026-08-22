from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0007_note_is_favourite'),
    ]

    operations = [
        migrations.RenameField(
            model_name='note',
            old_name='is_favourite',
            new_name='is_favorite',
        ),
    ]
