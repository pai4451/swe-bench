from dataclasses import dataclass
from typing import Optional
from datetime import datetime

@dataclass
class EditRequest:
    prompt: str
    timestamp: datetime

@dataclass
class EditResponse:
    completion: str
    latency_ms: int

@dataclass
class EditResolution:
    success: bool
    message: Optional[str] = None

@dataclass
class EditDatum:
    """Represents a full edit event with its request, response."""
    
    request_id: str
    """The request ID of the completion event."""

    user_id: str
    """The user ID of the user who made the edit."""

    user_agent: str
    """The user agent of the user who made the edit."""

    request: EditRequest
    """The edit request."""

    response: EditResponse
    """The edit response."""

    resolution: Optional[EditResolution]
    """The edit resolution."""
