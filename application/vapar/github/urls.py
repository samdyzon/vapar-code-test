from django.urls import path

from github.views import repo, repos

urlpatterns = [
    path("repos", repos, name="repos-list"),
    path("repo/<slug:owner>/<slug:repo>", repo, name="repos-detail"),
]
