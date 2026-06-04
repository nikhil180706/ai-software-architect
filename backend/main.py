from fastapi import FastAPI
from pydantic import BaseModel
import instructor
from openai import OpenAI

# This sets up our "Brain" server
app = FastAPI()

# Connects to OpenAI (You will need to get a free API key from platform.openai.com)
client = instructor.from_openai(OpenAI(api_key="PUT_YOUR_API_KEY_HERE"))

# This is our STRICT RULEBOOK. The AI must follow this format.
class SoftwareBlueprint(BaseModel):
    database_tables: list[str]
    api_endpoints: list[str]
    explanation: str

# This is the "Phone Line" the Face uses to talk to the Brain
@app.post("/generate")
def generate_software(user_prompt: str):
    # We ask the AI a question, and force it to use our Rulebook
    blueprint = client.chat.completions.create(
        model="gpt-4o",
        response_model=SoftwareBlueprint,
        messages=[
            {"role": "system", "content": "You are an expert software architect."},
            {"role": "user", "content": user_prompt}
        ]
    )
    return blueprint
