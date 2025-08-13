from adrf.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
async def repos(request):
    return Response({})


@api_view(["GET"])
async def repo(request, owner, repo):
    return Response({"owner": owner, "repo": repo})
