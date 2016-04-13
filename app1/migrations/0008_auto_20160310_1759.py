# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0007_datatypes_produits_resospatiale_resotemporelle_variable'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='produits',
            name='datatypes',
        ),
        migrations.RemoveField(
            model_name='resospatiale',
            name='datatypes',
        ),
        migrations.RemoveField(
            model_name='resotemporelle',
            name='datatypes',
        ),
        migrations.RemoveField(
            model_name='variable',
            name='datatypes',
        ),
        migrations.DeleteModel(
            name='DataTypes',
        ),
        migrations.DeleteModel(
            name='Produits',
        ),
        migrations.DeleteModel(
            name='ResoSpatiale',
        ),
        migrations.DeleteModel(
            name='ResoTemporelle',
        ),
        migrations.DeleteModel(
            name='Variable',
        ),
    ]
