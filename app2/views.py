from __future__ import unicode_literals
from django.shortcuts import render_to_response, RequestContext
from django.http import HttpResponse
from .models import *
from .form import Variablesform

def accueil(request):
    form = Variablesform()
    return render_to_response("app2/accueil.html", locals(), context_instance=RequestContext(request))

def test(request, res_sp):
    r = ResolutionsSpatiales.objects.get(resolutionspatiale__exact=res_sp)
    prod = r.produits.all().values_list('produit', flat=True)
    return HttpResponse(prod)