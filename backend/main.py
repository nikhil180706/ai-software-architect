import os
import json
from dotenv import load_dotenv
from groq import Groq
import instructor
from pydantic import BaseModel, Field, field_validator

# Load environment variables from the .env file
load_dotenv()

# Check if the API key is set
if not os.environ.get("GROQ_API_KEY"):
    raise ValueError("CRITICAL ERROR: GROQ_API_KEY is missing from your environment or .env file.")

# Initialize the Groq client wrapped with 'instructor' for strict JSON delivery
groq_base_client = Groq()
ai_client = instructor.from_groq(groq_base_client)

# We use Llama 3.3 70B as it is highly intelligent and great at logic
MODEL_NAME = "llama-3.3-70b-specdec"

# =====================================================================
# STAGE 1: INTENT EXTRACTION LAYER (The Data Contracts)
# =====================================================================

class ExtractedIntent(BaseModel):
    """Parses chaotic user inputs into a highly organized list of requirements."""
    core_purpose: str = Field(description="The primary objective of the application (e.g., E-commerce, CRM, Task Manager).")
    features: list[str] = Field(description="Clean bulleted list of separate structural features explicitly requested.")
    user_roles: list[str] = Field(description="All target user classes or roles mentioned or heavily implied (e.g., Admin, Customer).")

def stage_1_extract_intent(user_prompt: str) -> ExtractedIntent:
    print("\n[Stage 1] Extracting user intent from raw text...")
    return ai_client.chat.completions.create(
        model=MODEL_NAME,
        response_model=ExtractedIntent,
        messages=[
            {"role": "system", "content": "You are a professional requirements engineer. Strip away emotional filler and extract explicit, structured requirements."},
            {"role": "user", "content": user_prompt}
        ]
    )

# =====================================================================
# STAGE 2: SYSTEM DESIGN LAYER (The Blueprint Entities)
# =====================================================================

class BusinessRule(BaseModel):
    rule_name: str = Field(description="Short unique slug for the rule, e.g., 'premium_gating'.")
    description: str = Field(description="The condition logic, e.g., 'Only users with a premium subscription can access contacts'.")

class SystemDesign(BaseModel):
    """Establishes high-level data models and behavioral access rules before writing schema."""
    target_entities: list[str] = Field(description="Core database nouns needed based on requirements, e.g., ['User', 'Contact', 'Invoice'].")
    valid_roles: list[str] = Field(description="Strict list of approved app roles.")
    access_rules: list[BusinessRule] = Field(description="Security, gating, and premium access logic rules.")

def stage_2_design_system(intent: ExtractedIntent) -> SystemDesign:
    print("[Stage 2] Transforming structural intent into system engineering components...")
    return ai_client.chat.completions.create(
        model=MODEL_NAME,
        response_model=SystemDesign,
        messages=[
            {"role": "system", "content": "You are a Chief Software Architect. Map high-level intent objects cleanly into required database entities, system access roles, and strict core logic constraints."},
            {"role": "user", "content": intent.model_dump_json()}
        ]
    )

# =====================================================================
# STAGE 3: DETAILED SCHEMA GENERATION LAYER (The Core Code Maps)
# =====================================================================

class DbColumn(BaseModel):
    name: str = Field(description="Field name, lowercase snake_case, e.g., 'created_at'.")
    data_type: str = Field(description="Data type matching PostgreSQL rules, e.g., 'VARCHAR', 'INTEGER', 'BOOLEAN', 'TIMESTAMP'.")
    is_primary_key: bool = False
    references_table: str | None = Field(None, description="If this is a foreign key, name the target table exactly, else null.")

class DbTable(BaseModel):
    table_name: str = Field(description="Table name, plural, lowercase snake_case, e.g., 'contacts'.")
    columns: list[DbColumn]

class ApiEndpoint(BaseModel):
    path: str = Field(description="Clean RESTful URL path, e.g., '/api/v1/analytics'.")
    method: str = Field(description="HTTP Verb: GET, POST, PUT, or DELETE.")
    allowed_roles: list[str] = Field(description="Roles allowed to call this endpoint.")
    mutates_table: str = Field(description="The exact database table name this specific endpoint reads from or writes to.")

class CompleteApplicationSchema(BaseModel):
    """The absolute technical roadmap for code builders."""
    database_tables: list[DbTable]
    api_endpoints: list[ApiEndpoint]

def stage_3_generate_schemas(design: SystemDesign) -> CompleteApplicationSchema:
    print("[Stage 3] Generating exact database definitions and API definitions...")
    return ai_client.chat.completions.create(
        model=MODEL_NAME,
        response_model=CompleteApplicationSchema,
        messages=[
            {"role": "system", "content": "You are a Principal Database Administrator and API designer. Generate strict, production-ready schemas matching provided rules."},
            {"role": "user", "content": design.model_dump_json()}
        ]
    )

# =====================================================================
# STAGE 4: VALIDATION, REFINEMENT & REPAIR ENGINE (The Core Logic)
# =====================================================================

def execute_deterministic_audit(schema: CompleteApplicationSchema, design: SystemDesign) -> list[str]:
    """
    Pure Python cross-layer audit. 
    Catches logical errors, schema mismatches, and hallucinations.
    """
    errors = []
    generated_tables = {t.table_name for t in schema.database_tables}
    system_roles = set(design.valid_roles)
    
    # 1. Audit API Layer against Database Layer (Cross-layer Consistency)
    for endpoint in schema.api_endpoints:
        if endpoint.mutates_table not in generated_tables:
            errors.append(
                f"API Endpoint '{endpoint.path}' references a hallucinated database table: '{endpoint.mutates_table}'."
            )
            
        # 2. Audit API Security Rules against System Design Layer (Role Consistency)
        for role in endpoint.allowed_roles:
            if role not in system_roles:
                errors.append(
                    f"API Endpoint '{endpoint.path}' allows access to undefined role: '{role}'."
                )
                
    return errors

def run_self_healing_pipeline(user_prompt: str) -> CompleteApplicationSchema:
    """Coordinates execution across all layers and boots the repair engine if needed."""
    
    # Run the initial multi-stage chain
    intent = stage_1_extract_intent(user_prompt)
    design = stage_2_design_system(intent)
    schema = stage_3_generate_schemas(design)
    
    print("\n[Stage 4] Running Programmatic Refinement & Validation Check...")
    
    # Run audit checks
    validation_flaws = execute_deterministic_audit(schema, design)
    
    # The Repair Engine Loop
    max_repair_attempts = 3
    attempt = 0
    
    while validation_flaws and attempt < max_repair_attempts:
        attempt += 1
        print(f" -> [ALERT] Validation failed with {len(validation_flaws)} logical flaws. Launching Self-Healing Loop (Attempt {attempt}/{max_repair_attempts})...")
        
        error_log_for_ai = "\n".join([f"- {err}" for err in validation_flaws])
        
        # We re-feed everything back into the model along with the exact errors python found
        schema = ai_client.chat.completions.create(
            model=MODEL_NAME,
            response_model=CompleteApplicationSchema,
            messages=[
                {"role": "system", "content": "You are a code refactoring agent. Your previous schema output failed logical cross-layer consistency validation. Review the errors and correct the fields precisely."},
                {"role": "user", "content": f"System Blueprint Design Context:\n{design.model_dump_json()}\n\nBroken Schema Provided:\n{schema.model_dump_json()}\n\nValidation Failures Found:\n{error_log_for_ai}\n\nTask: Output a completely revised, error-free schema object."},
            ]
        )
        
        # Re-audit the newly fixed output to verify correctness
        validation_flaws = execute_deterministic_audit(schema, design)

    if validation_flaws:
        print(" -> [CRITICAL] System could not heal itself automatically after maximum attempts. Manual override needed.")
    else:
        print(" -> [SUCCESS] Application architecture schema passed all logical cross-layer consistency verification steps!")
        
    return schema

# =====================================================================
# THE APPLICATION RUNNER
# =====================================================================
if __name__ == "__main__":
    prompt_input = (
        "Build a CRM with login, contacts, dashboard, role-based access, "
        "and premium plan with payments. Admins can see analytics."
    )
    
    # Run entire pipeline
    final_architecture = run_self_healing_pipeline(prompt_input)
    
    # Print the beautiful, ultra-premium architecture blueprint data
    print("\n================== VERIFIED EXPORT METADATA ==================")
    print(json.dumps(final_architecture.model_dump(), indent=2))
