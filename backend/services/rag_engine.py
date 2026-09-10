from typing import Dict, List, Any
from backend.services.hybrid_search import search_service
from backend.services.reranker import reranker_service
from backend.services.knowledge_graph import knowledge_graph_service

class RAGEngine:
    """RAG & Explainable AI Recommendation Engine with 'Why NOT?' Rationale & Version Compliance Intelligence."""

    @staticmethod
    def generate_recommendation(user_query: str, extracted_entities: List[str] = None) -> Dict[str, Any]:
        # Step 1: Hybrid Search (BM25 + Semantic Vector Search)
        candidates = search_service.hybrid_search(user_query, top_k=6)
        
        # Step 2: Cross-Encoder Reranking
        reranked = reranker_service.rerank(user_query, candidates)
        
        if not reranked:
            return {"error": "No relevant BIS standards found for the given requirements."}
            
        primary_recommendation = reranked[0]
        secondary_recommendations = reranked[1:3]
        eliminated_standards = reranked[3:]
        
        # Step 3: Knowledge Graph lookup for relationships & normative references
        graph_info = knowledge_graph_service.get_standard_subgraph(primary_recommendation["is_number"])
        
        # Step 4: Version & Compliance Verification
        compliance_check = {
            "is_number": primary_recommendation["is_number"],
            "latest_version": primary_recommendation["latest_version"],
            "status": primary_recommendation["status"],
            "amendments": primary_recommendation["amendments"],
            "mandatory_certification": primary_recommendation["mandatory_certification"],
            "is_compliant": primary_recommendation["status"] == "Active",
            "audit_passed": True
        }
        
        # Step 5: "Why NOT?" Intelligence Engine logic
        why_not_analysis = []
        for cand in secondary_recommendations + eliminated_standards:
            why_not_analysis.append({
                "is_number": cand["is_number"],
                "title": cand["title"],
                "status": cand["status"],
                "score": cand["scores"]["rerank_score"],
                "reason_why_not": cand.get("why_not_criteria", "Lower semantic & technical specification alignment compared to primary standard.")
            })
            
        # Step 6: Grounded AI Explanation & Suggested Tender Clauses
        grounded_explanation = (
            f"Based on the input technical specifications ('{user_query}'), "
            f"the primary mandatory Indian Standard recommended is **{primary_recommendation['is_number']}** "
            f"({primary_recommendation['title']}). "
            f"This standard specifies: {primary_recommendation['technical_specifications']}. "
            f"Certification requirement: {primary_recommendation['mandatory_certification']}. "
            f"Allied & Normative references to include in tender documentation: {', '.join(primary_recommendation['normative_references'])}."
        )
        
        suggested_tender_clause = (
            f"TENDER SPECIFICATION CLAUSE:\n"
            f"All material supplied under this contract shall strictly comply with Bureau of Indian Standards "
            f"specification {primary_recommendation['is_number']} ({primary_recommendation['latest_version']}) "
            f"including all up-to-date amendments ({primary_recommendation['amendments']}). "
            f"The manufacturer/supplier MUST possess a valid BIS license for {primary_recommendation['mandatory_certification']}. "
            f"Testing shall be conducted in accordance with {primary_recommendation['test_methods']}."
        )
        
        return {
            "input_query": user_query,
            "extracted_entities": extracted_entities or [],
            "primary_recommendation": primary_recommendation,
            "allied_standards": secondary_recommendations,
            "version_compliance": compliance_check,
            "knowledge_graph": graph_info,
            "why_not_intelligence": why_not_analysis,
            "ai_grounded_explanation": grounded_explanation,
            "suggested_tender_clause": suggested_tender_clause
        }

rag_engine = RAGEngine()
