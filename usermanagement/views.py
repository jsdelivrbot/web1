from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render
from django.http import  HttpResponseRedirect


def create_account(request):
    form = UserCreationForm()
    return render(request, "user/create.html", {'form':form})