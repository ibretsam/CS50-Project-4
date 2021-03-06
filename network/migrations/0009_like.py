# Generated by Django 4.0.2 on 2022-05-27 11:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0008_alter_post_postcontent_alter_profile_follower_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('liked', models.BooleanField(default=False)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='postLiked', to='network.post')),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likedProfile', to='network.profile')),
            ],
        ),
    ]
