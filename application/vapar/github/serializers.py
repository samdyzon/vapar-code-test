from adrf.serializers import Serializer
from rest_framework import serializers


class RepoListSerializer(Serializer):
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
    full_name = serializers.CharField()
    description = serializers.CharField()
    stargazers_count = serializers.IntegerField()
    forks_count = serializers.IntegerField()
    open_issues_count = serializers.IntegerField()
    language = serializers.CharField()
