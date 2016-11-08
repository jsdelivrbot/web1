# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('teledm', '0011_delete_datatypes'),
    ]

    operations = [
        migrations.CreateModel(
            name='DataTypes',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('datatypes', models.CharField(max_length=50)),
            ],
        ),
    ]
