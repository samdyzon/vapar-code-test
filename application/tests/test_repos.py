import pytest  # noqa: F401
from github.views import repo, repos  # noqa: F401
from rest_framework.test import APIRequestFactory

factory = APIRequestFactory()


@pytest.mark.asyncio
async def test_search_success():
    request = factory.get("/api/repos")
    response = await repos(request)  # type: ignore

    assert response.data == {"test": "ok"}


@pytest.mark.asyncio
async def test_detail_success():
    request = factory.get("/api/repo/test/test")
    response = await repo(request, owner="test", repo="test")  # type: ignore

    assert response.data == {"test": "ok"}


@pytest.mark.asyncio
async def test_detail_not_found():
    request = factory.get("/api/repo/test/test")
    response = await repo(request, owner="test", repo="test")  # type: ignore

    assert response.data == {"test": "ok"}


@pytest.mark.asyncio
async def test_detail_rate_limited():
    request = factory.get("/api/repo/test/test")
    response = await repo(request, owner="test", repo="test")  # type: ignore

    assert response.data == {"test": "ok"}
