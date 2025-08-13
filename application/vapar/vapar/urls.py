"""URL Configuration for Project"""

from django.shortcuts import render
from django.urls import include, path


async def index(request: "HttpRequest") -> "HttpResponse":
    """Render the index page as static html.

    Args:
        request (HttpRequest): Django HTTP Request Object

    Returns:
        HttpResponse: Django HTTP Response Object
    """
    return render(request, "index.html")


urlpatterns = [path("", index, name="index"), path("api/", include("github.urls"))]
