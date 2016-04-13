# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0006_auto_20160127_1257'),
    ]

    operations = [
        migrations.CreateModel(
            name='DataTypes',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('datatypes', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Produits',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('produits', models.CharField(max_length=50)),
                ('datatypes', models.ForeignKey(to='app1.DataTypes')),
            ],
        ),
        migrations.CreateModel(
            name='ResoSpatiale',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('resospatiale', models.CharField(max_length=50)),
                ('datatypes', models.ForeignKey(to='app1.DataTypes')),
            ],
        ),
        migrations.CreateModel(
            name='ResoTemporelle',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('resotemporelle', models.CharField(max_length=50)),
                ('datatypes', models.ForeignKey(to='app1.DataTypes')),
            ],
        ),
        migrations.CreateModel(
            name='Variable',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('variable', models.CharField(max_length=50)),
                ('long_name', models.CharField(max_length=50)),
                ('datatypes', models.ForeignKey(to='app1.DataTypes')),
            ],
        ),
    ]
