import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import instructor
from openai import OpenAI

app = FastAPI()

# By leaving the parenthesis empty, it automatically finds the OPENAI_API_KEY you saved in Vercel!
client = instructor.from_openai(OpenAI())

class SoftwareBlueprint(BaseModel):
    database_tables: list[str]
    api_endpoints: list[str]
    explanation: str

@app.post("/generate")
def generate_software(user_prompt: str):
    try:
        blueprint = client.chat.completions.create(
            # We will use gpt-4o-mini because it is much faster and cheaper for testing
            model="gpt-4o-mini", 
            response_model=SoftwareBlueprint,
            messages=[
                {"role": "system", "content": "You are an expert software architect."},
                {"role": "user", "content": user_prompt}
            ]
        )
        return blueprint
    except Exception as e:
        # If OpenAI crashes, this sends the EXACT error to your screen instead of a generic "500"
        raise HTTPException(status_code=500, detail=str(e))
