from pydantic import BaseModel


class AccessTokenGet(BaseModel):
    access_token: str
    token_type: str = "Bearer"
