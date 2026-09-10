import math
import re
from typing import List, Dict, Any
from backend.db.database import get_all_standards

class BM25Engine:
    """Fast Rank-BM25 Implementation for exact term and IS Standard matching."""
    def __init__(self, corpus: List[Dict[str, Any]]):
        self.corpus = corpus
        self.documents = [
            f"{doc['is_number']} {doc['title']} {doc['scope']} {doc['technical_specifications']} {doc['department']}".lower()
            for doc in corpus
        ]
        self.tokenized_docs = [self._tokenize(doc) for doc in self.documents]
        self.doc_len = [len(doc) for doc in self.tokenized_docs]
        self.avg_doc_len = sum(self.doc_len) / len(self.doc_len) if self.doc_len else 1.0
        self.N = len(self.corpus)
        self.k1 = 1.5
        self.b = 0.75
        self.idf = self._calculate_idf()

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r'\b\w+\b', text.lower())

    def _calculate_idf(self) -> Dict[str, float]:
        df = {}
        for doc in self.tokenized_docs:
            for token in set(doc):
                df[token] = df.get(token, 0) + 1
        idf = {}
        for token, freq in df.items():
            idf[token] = math.log((self.N - freq + 0.5) / (freq + 0.5) + 1.0)
        return idf

    def score(self, query: str) -> List[float]:
        query_tokens = self._tokenize(query)
        scores = [0.0] * self.N
        for token in query_tokens:
            if token not in self.idf:
                continue
            idf_val = self.idf[token]
            for idx, doc in enumerate(self.tokenized_docs):
                tf = doc.count(token)
                if tf > 0:
                    denom = tf + self.k1 * (1 - self.b + self.b * (self.doc_len[idx] / self.avg_doc_len))
                    scores[idx] += idf_val * (tf * (self.k1 + 1)) / denom
        return scores


class VectorEmbeddingEngine:
    """Semantic Vector Similarity Engine supporting SentenceTransformers or pure-Python TF-IDF."""
    def __init__(self, corpus: List[Dict[str, Any]]):
        self.corpus = corpus
        self.mode = "pure_python"
        
        corpus_texts = [
            f"{doc['title']}. {doc['scope']}. Tech Specs: {doc['technical_specifications']}"
            for doc in corpus
        ]
        
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            self.corpus_embeddings = self.model.encode(corpus_texts, convert_to_numpy=True)
            self.mode = "sentence_transformers"
        except Exception:
            try:
                from sklearn.feature_extraction.text import TfidfVectorizer
                self.vectorizer = TfidfVectorizer(stop_words='english')
                self.corpus_embeddings = self.vectorizer.fit_transform(corpus_texts)
                self.mode = "sklearn"
            except Exception:
                # Pure-Python TF-IDF vectorizer fallback
                self.mode = "pure_python"
                self.vocabulary = set()
                self.doc_vectors = []
                for text in corpus_texts:
                    words = re.findall(r'\b\w+\b', text.lower())
                    self.vocabulary.update(words)
                    
                self.vocab_list = list(self.vocabulary)
                for text in corpus_texts:
                    words = re.findall(r'\b\w+\b', text.lower())
                    tf = {w: words.count(w) for w in set(words)}
                    self.doc_vectors.append(tf)

    def search(self, query: str) -> List[float]:
        if self.mode == "sentence_transformers":
            import numpy as np
            query_emb = self.model.encode([query], convert_to_numpy=True)[0]
            scores = []
            for emb in self.corpus_embeddings:
                norm_a = np.linalg.norm(query_emb)
                norm_b = np.linalg.norm(emb)
                sim = np.dot(query_emb, emb) / (norm_a * norm_b) if norm_a and norm_b else 0.0
                scores.append(float(sim))
            return scores
        elif self.mode == "sklearn":
            from sklearn.metrics.pairwise import cosine_similarity
            query_vec = self.vectorizer.transform([query])
            sims = cosine_similarity(query_vec, self.corpus_embeddings)[0]
            return [float(s) for s in sims]
        else:
            # Pure Python Cosine Similarity
            q_words = re.findall(r'\b\w+\b', query.lower())
            q_tf = {w: q_words.count(w) for w in set(q_words)}
            q_norm = math.sqrt(sum(v*v for v in q_tf.values()))
            
            scores = []
            for doc_tf in self.doc_vectors:
                dot = sum(q_tf[w] * doc_tf[w] for w in q_tf if w in doc_tf)
                d_norm = math.sqrt(sum(v*v for v in doc_tf.values()))
                sim = dot / (q_norm * d_norm) if (q_norm * d_norm) > 0 else 0.0
                scores.append(float(sim))
            return scores


class HybridSearchService:
    """Combines BM25 Exact Matching + Vector Semantic Embeddings as shown in Architecture Flow."""
    def __init__(self):
        self.reload()

    def reload(self):
        self.corpus = get_all_standards()
        self.bm25 = BM25Engine(self.corpus)
        self.vector_engine = VectorEmbeddingEngine(self.corpus)

    def hybrid_search(self, query: str, top_k: int = 5, bm25_weight: float = 0.4, vector_weight: float = 0.6) -> List[Dict[str, Any]]:
        bm25_scores = self.bm25.score(query)
        vector_scores = self.vector_engine.search(query)
        
        # Normalize BM25 scores
        max_bm25 = max(bm25_scores) if max(bm25_scores) > 0 else 1.0
        norm_bm25 = [s / max_bm25 for s in bm25_scores]
        
        # Normalize Vector scores
        max_vec = max(vector_scores) if max(vector_scores) > 0 else 1.0
        norm_vec = [s / max_vec for s in vector_scores]
        
        combined_results = []
        for idx, doc in enumerate(self.corpus):
            hybrid_score = (bm25_weight * norm_bm25[idx]) + (vector_weight * norm_vec[idx])
            
            # Boost score if explicit IS number match in query (e.g., query contains '1786' or 'IS 456')
            is_num_clean = re.sub(r'[^\w]', '', doc['is_number'].lower())
            query_clean = re.sub(r'[^\w]', '', query.lower())
            if is_num_clean in query_clean or doc['is_number'].lower() in query.lower():
                hybrid_score += 0.5
                
            doc_copy = dict(doc)
            doc_copy["scores"] = {
                "bm25_raw": round(bm25_scores[idx], 3),
                "bm25_norm": round(norm_bm25[idx], 3),
                "vector_semantic": round(norm_vec[idx], 3),
                "hybrid_score": round(hybrid_score, 3)
            }
            combined_results.append(doc_copy)
            
        # Sort by hybrid score descending
        combined_results.sort(key=lambda x: x["scores"]["hybrid_score"], reverse=True)
        return combined_results[:top_k]

# Global instance
search_service = HybridSearchService()
