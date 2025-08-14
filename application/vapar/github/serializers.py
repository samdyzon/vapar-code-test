from adrf.serializers import Serializer
from rest_framework import serializers


class RepoListSerializer(Serializer):
    """Serialize a single search result from GitHub"""

    name = serializers.CharField()
    full_name = serializers.CharField()
    html_url = serializers.CharField()
    description = serializers.CharField()
    stargazers_count = serializers.IntegerField()
    forks_count = serializers.IntegerField()
    owner = serializers.SerializerMethodField()

    def get_owner(self, obj):
        return obj.get("owner", {}).get("login")


class RepoDetailSerializer(Serializer):
    """Serialize a single repository from the detail API in GitHub"""

    full_name = serializers.CharField()
    description = serializers.CharField()
    stargazers_count = serializers.IntegerField()
    forks_count = serializers.IntegerField()
    open_issues_count = serializers.IntegerField()
    language = serializers.CharField()
    html_url = serializers.CharField()
