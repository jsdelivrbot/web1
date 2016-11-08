# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('teledm', '0014_delete_datatypes'),
    ]

    operations = [
        migrations.CreateModel(
            name='Villes',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('villes', models.CharField(max_length=50)),
                ('country', models.ForeignKey(to='teledm.Country')),
            ],
        ),
    ]
