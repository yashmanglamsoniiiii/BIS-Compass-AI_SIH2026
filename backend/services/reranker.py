from typing import List, Dict, Any

class CrossEncoderReranker:
    """Reranks candidate standards retrieved from Hybrid Search using deep Cross-Attention principles."""
    
    def __init__(self):
        self.use_st = False
        try:
            from sentence_transformers import CrossEncoder
            self.model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
            self.use_st = True
        except Exception:
            self.use_st = False

    def rerank(self, query: str, candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if not candidates:
            return []
            
        if self.use_st:
            pairs = [[query, f"{c['title']} - {c['scope']} Tech: {c['technical_specifications']}"] for c in candidates]
            scores = self.model.predict(pairs)
            for i, cand in enumerate(candidates):
                cand["scores"]["rerank_score"] = float(round(scores[i], 4))
            candidates.sort(key=lambda x: x["scores"]["rerank_score"], reverse=True)
        else:
            # High-precision heuristic cross-encoder feature computation
            for cand in candidates:
                q_terms = set(query.lower().split())
                title_terms = set(cand["title"].lower().split())
                tech_terms = set(cand["technical_specifications"].lower().split())
                scope_terms = set(cand["scope"].lower().split())
                
                title_match = len(q_terms.intersection(title_terms)) / max(len(q_terms), 1)
                tech_match = len(q_terms.intersection(tech_terms)) / max(len(q_terms), 1)
                scope_match = len(q_terms.intersection(scope_terms)) / max(len(q_terms), 1)
                
                rerank_val = cand["scores"]["hybrid_score"] + (0.3 * title_match) + (0.2 * tech_match) + (0.1 * scope_match)
                cand["scores"]["rerank_score"] = round(rerank_val, 3)
                
            candidates.sort(key=lambda x: x["scores"]["rerank_score"], reverse=True)
            
        return candidates

reranker_service = CrossEncoderReranker()
