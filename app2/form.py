from django import forms
from .models import Variables

class Variablesform(forms.Form):
    class Meta:
        model = Variables
        fields = ['variable']
        widgets = forms.ChoiceField(fields)
        