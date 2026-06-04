from fastapi import FastAPI
from pydantic import BaseModel
import os
import instructor
from groq import Groq

# THIS VARIABLE MUST BE FLUSH AGAINST THE LEFT WALL (NO SPACES)
app = FastAPI()

class UserRequest(BaseModel):
    prompt: str

class CompleteApplicationSchema(BaseModel):
    database_tables: list[dict]
    api_endpoints: list[str]
    access_roles: list[str]

@app.post("/api/generate")
def generate_architecture(req: UserRequest):
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    ai_client = instructor.from_groq(client)
    
    response = ai_client.chat.completions.create(
        model="llama-3.3-70b-specdec",
        response_model=CompleteApplicationSchema,
        messages=[
            {"role": "system", "content": "You are an elite Software Architect. Generate strict technical JSON."},
            {"role": "user", "content": req.prompt}
        ]
    )
    return response.model_dump()