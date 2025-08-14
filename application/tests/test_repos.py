import pytest  # noqa: F401
import pytest_asyncio
from github.views import repo, repos  # noqa: F401
from rest_framework.test import APIRequestFactory

factory = APIRequestFactory()


@pytest_asyncio.fixture
async def demo_repo():
    """Simple fixture for a search repos response"""
    return {
        "name": "test-repo",
        "full_name": "This is a test repo",
        "html_url": "https://github.com/owner/test-repo",
        "description": "",
        "stargazers_count": 1,
        "forks_count": 1,
        "owner": {"login": "owner"},
    }


@pytest_asyncio.fixture
async def demo_repo_detail():
    """Simple fixture for a detail response - does not need 'owner'"""
    return {
        "name": "test-repo",
        "full_name": "This is a test repo",
        "html_url": "https://github.com/owner/test-repo",
        "description": "",
        "stargazers_count": 1,
        "forks_count": 1,
        "open_issues_count": 1,
        "language": "python",
    }


@pytest.mark.asyncio
async def test_search_success(httpx_mock, demo_repo):
    """Test search success and results serialization.

    The result from the API should only show the "owner.login" for owner.
    """

    httpx_mock.add_response(json={"items": [demo_repo]})

    request = factory.get("/api/repos?query=python+in:topics")
    response = await repos(request)  # type: ignore

    assert response.data["results"] == [
        {
            "name": "test-repo",
            "full_name": "This is a test repo",
            "html_url": "https://github.com/owner/test-repo",
            "description": "",
            "stargazers_count": 1,
            "forks_count": 1,
            "owner": "owner",
        }
    ]


@pytest.mark.asyncio
async def test_search_failed_404(httpx_mock):
    """Test that we pass back a 404 when items is empty."""
    expected_response = {"total_count": 10, "incomplete_results": False, "items": []}
    httpx_mock.add_response(json=expected_response)

    request = factory.get("/api/repos?query=python+in:topics")
    response = await repos(request)  # type: ignore

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_search_failed_rate_limit(httpx_mock):
    """Test that we return a 429 when rate limited (GitHub sends 422)"""
    expected_response = {}
    httpx_mock.add_response(json=expected_response, status_code=422)

    request = factory.get("/api/repos?query=python+in:topics")
    response = await repos(request)  # type: ignore

    assert response.status_code == 429


@pytest.mark.asyncio
async def test_search_failed_503(httpx_mock):
    """Test that we return a 503 if GitHub throws a 503"""
    expected_response = {}
    httpx_mock.add_response(json=expected_response, status_code=503)

    request = factory.get("/api/repos?query=python+in:topics")
    response = await repos(request)  # type: ignore

    assert response.status_code == 503


@pytest.mark.asyncio
async def test_detail_success(httpx_mock, demo_repo_detail):
    """Test that we get a successful response and return the right status codes"""
    httpx_mock.add_response(json=demo_repo_detail)

    request = factory.get("/api/repo/test/test")
    response = await repo(request, owner="test", repo="test")  # type: ignore

    assert response.data.get("repo", {}) == {
        "full_name": "This is a test repo",
        "description": "",
        "stargazers_count": 1,
        "forks_count": 1,
        "open_issues_count": 1,
        "html_url": "https://github.com/owner/test-repo",
        "language": "python",
    }


@pytest.mark.asyncio
async def test_detail_404(httpx_mock):
    """Test that we return a 404 if github cannot find a repo"""
    httpx_mock.add_response(json={}, status_code=404)

    request = factory.get("/api/repo/test/test")
    response = await repo(request, owner="test", repo="test")  # type: ignore

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_detail_403(httpx_mock):
    """Test that we return a 403 if we don't have permission to a repo"""

    httpx_mock.add_response(json={}, status_code=403)

    request = factory.get("/api/repo/test/test")
    response = await repo(request, owner="test", repo="test")  # type: ignore

    assert response.status_code == 403


@pytest.mark.asyncio
async def test_detail_503(httpx_mock):
    """Test that we return a 503 if github is down"""
    httpx_mock.add_response(json={}, status_code=503)

    request = factory.get("/api/repo/test/test")
    response = await repo(request, owner="test", repo="test")  # type: ignore

    assert response.status_code == 503
