# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0012_datatypes'),
    ]

    operations = [
        migrations.RenameField(
            model_name='datatypes',
            old_name='datatypes',
            new_name='datatype',
        ),
    ]
