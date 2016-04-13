# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0010_auto_20160314_1410'),
    ]

    operations = [
        migrations.DeleteModel(
            name='DataTypes',
        ),
    ]
