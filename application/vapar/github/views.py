import httpx
from adrf.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

from github.serializers import RepoDetailSerializer, RepoListSerializer


@api_view(["GET"])
async def repos(request):
    query = request.query_params.get("query", "")

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.github.com/search/repositories?q={query}",
            headers={"accept": "application/vnd.github+json"},
        )

        if response.status_code == 422:
            return Response(
                {"error": "You have been rate limited by GitHub, try again later."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )
        elif response.status_code == 503:
            return Response(
                {"error": "GitHub seems to be down, try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        data = response.json()

        if not data.get("items", []):
            return Response(
                {"error": "No repositories found with this query."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = RepoListSerializer(data.get("items", []), many=True)
        return Response({"results": serializer.data})


@api_view(["GET"])
async def repo(request, owner, repo):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}",
            headers={"accept": "application/vnd.github+json"},
        )

        if response.status_code == 404:
            return Response(
                {"error": "Repository Not Found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        elif response.status_code == 403:
            return Response(
                {"error": "You do not have permission to view this repo."},
                status=status.HTTP_403_FORBIDDEN,
            )
        elif response.status_code == 503:
            return Response(
                {"error": "GitHub seems to be down, try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        data = response.json()
        serializer = RepoDetailSerializer(data)

        return Response({"repo": serializer.data})
