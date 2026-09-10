import uvicorn
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from backend.db.database import init_db, get_all_standards
from backend.services.ingestion import DocumentProcessor
from backend.services.hybrid_search import search_service
from backend.services.knowledge_graph import knowledge_graph_service
from backend.services.rag_engine import rag_engine

app = FastAPI(
    title="BIS AI Standard Recommendation API - SIH 2026",
    description="Official REST API for SIH 2026 Problem Statement 108 - Indian Standards Recommendation System",
    version="1.0.0"
)

# CORS middleware for React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

class QueryRequest(BaseModel):
    query: str
    department_filter: Optional[str] = None
    extracted_entities: Optional[List[str]] = []

@app.get("/")
def root():
    return {
        "status": "Online",
        "system": "BIS AI Standard Recommendation System",
        "hackathon": "Smart India Hackathon 2026",
        "problem_statement": "108"
    }

@app.get("/api/health")
def health():
    standards = get_all_standards()
    return {
        "status": "Healthy",
        "standards_indexed": len(standards),
        "vector_engine": "SentenceTransformers / TF-IDF Active",
        "bm25_engine": "Active",
        "knowledge_graph": "NetworkX / Neo4j Active"
    }

@app.get("/api/standards")
def list_standards(search: Optional[str] = None, dept: Optional[str] = None):
    standards = get_all_standards()
    if dept:
        standards = [s for s in standards if dept.lower() in s["department"].lower()]
    if search:
        standards = search_service.hybrid_search(search, top_k=20)
    return {"count": len(standards), "standards": standards}

@app.post("/api/recommend")
def recommend_standards(req: QueryRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query string cannot be empty.")
    result = rag_engine.generate_recommendation(req.query, req.extracted_entities)
    return result

@app.post("/api/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    contents = await file.read()
    try:
        extracted_data = DocumentProcessor.extract_from_bytes(contents)
        # Automatically generate recommendation for extracted text
        query_text = extracted_data["extracted_text"][:500] if extracted_data["extracted_text"] else file.filename
        rec = rag_engine.generate_recommendation(query_text, extracted_data["extracted_entities"])
        return {
            "file_name": file.filename,
            "extraction_details": extracted_data,
            "recommendation": rec
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF extraction error: {str(e)}")

@app.get("/api/graph/{is_number}")
def get_graph(is_number: str):
    graph_data = knowledge_graph_service.get_standard_subgraph(is_number)
    return graph_data

@app.get("/api/why-not")
def get_why_not_matrix(query: str):
    rec = rag_engine.generate_recommendation(query)
    return {
        "query": query,
        "primary": rec.get("primary_recommendation"),
        "why_not_list": rec.get("why_not_intelligence", [])
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
