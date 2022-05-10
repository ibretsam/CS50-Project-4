# Generated by Django 4.0.2 on 2022-05-09 15:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_remove_post_profile'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='profile',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='PostProfile', to='network.profile'),
            preserve_default=False,
        ),
    ]
