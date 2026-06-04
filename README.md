# AI Software Architect Pipeline

A full-stack, AI-powered engineering tool that converts natural language prompts into strict, deployment-ready backend architecture schemas (Database & API).

## 🚀 Live Demo
**[Insert Your Vercel URL Here]**

## 🧠 The Multi-Stage AI Pipeline
Instead of relying on single-shot LLM generation (which is prone to hallucination), this system utilizes a strict multi-stage pipeline utilizing Groq and Llama 3.3:
1. **Intent Extraction:** Parses chaotic user input into structured feature requirements.
2. **System Design Layer:** Establishes core database entities and system access roles.
3. **Strict Schema Generation:** Outputs Pydantic-validated JSON guaranteeing type safety and cross-layer consistency.

## 🏗️ Architecture & Separation of Concerns
This project is built as a modern monorepo to ensure strict separation between the client and the logic engine:

* **Frontend (`/frontend`):** A Next.js (React) application styled with Tailwind CSS. Handles state management, API routing, and the interactive UI.
* **Backend (`/backend`):** A Python FastAPI server. Manages the LLM orchestration, strict Pydantic data modeling, and structured JSON output.

## ⚙️ Tech Stack
* **LLM Engine:** Groq API (Llama-3.3-70b-specdec)
* **Structured Outputs:** Python `instructor` & `pydantic`
* **Backend:** Python & FastAPI
* **Frontend:** Next.js, React, Tailwind CSS
* **Hosting:** Vercel (Serverless Functions)
