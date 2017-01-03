# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('teledm', '0015_villes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='meteodata',
            name='station',
        ),
        migrations.RemoveField(
            model_name='station',
            name='country',
        ),
        migrations.RemoveField(
            model_name='villes',
            name='country',
        ),
        migrations.DeleteModel(
            name='Country',
        ),
        migrations.DeleteModel(
            name='MeteoData',
        ),
        migrations.DeleteModel(
            name='Station',
        ),
        migrations.DeleteModel(
            name='Villes',
        ),
    ]
