# Generated by Django 4.2 on 2024-11-30 00:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='image',
            field=models.ImageField(blank=True, default='Default-welcomer.png', null=True, upload_to='profile_images/'),
        ),
    ]
