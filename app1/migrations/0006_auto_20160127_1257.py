# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-01-27 11:57
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0005_auto_20160127_1256'),
    ]

    operations = [
        migrations.RenameField(
            model_name='meteodata',
            old_name='station_id',
            new_name='station',
        ),
        migrations.RenameField(
            model_name='station',
            old_name='country_id',
            new_name='country',
        ),
    ]
