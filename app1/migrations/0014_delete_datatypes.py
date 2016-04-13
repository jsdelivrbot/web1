# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0013_auto_20160314_1418'),
    ]

    operations = [
        migrations.DeleteModel(
            name='DataTypes',
        ),
    ]
