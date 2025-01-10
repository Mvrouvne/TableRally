# Generated by Django 5.1.2 on 2025-01-10 16:28

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='score',
            name='user1_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Score', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='score',
            name='user2_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Score2', to=settings.AUTH_USER_MODEL),
        ),
    ]
