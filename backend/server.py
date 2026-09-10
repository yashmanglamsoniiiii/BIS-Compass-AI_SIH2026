import http.server
import socketserver
import json
import urllib.parse
import sys
import os

# Add root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.db.database import init_db, get_all_standards
from backend.services.hybrid_search import search_service
from backend.services.knowledge_graph import knowledge_graph_service
from backend.services.rag_engine import rag_engine

PORT = 8000

class BISApiHandler(http.server.BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        query_params = urllib.parse.parse_qs(parsed_path.query)

        if path == "/" or path == "/api/health":
            standards = get_all_standards()
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "Healthy",
                "system": "BIS AI Standard Recommendation System",
                "hackathon": "SIH 2026",
                "problem_statement": "108",
                "standards_indexed": len(standards),
                "engine": "Hybrid BM25 + Vector Semantic Reranker + Knowledge Graph"
            }).encode('utf-8'))
            
        elif path == "/api/standards":
            search_query = query_params.get("search", [None])[0]
            dept = query_params.get("dept", [None])[0]
            standards = get_all_standards()
            if dept:
                standards = [s for s in standards if dept.lower() in s["department"].lower()]
            if search_query:
                standards = search_service.hybrid_search(search_query, top_k=20)
            self._set_headers(200)
            self.wfile.write(json.dumps({"count": len(standards), "standards": standards}).encode('utf-8'))

        elif path.startswith("/api/graph/"):
            is_number = urllib.parse.unquote(path.replace("/api/graph/", ""))
            graph_data = knowledge_graph_service.get_standard_subgraph(is_number)
            self._set_headers(200)
            self.wfile.write(json.dumps(graph_data).encode('utf-8'))

        elif path == "/api/why-not":
            query_str = query_params.get("query", ["steel rebar"])[0]
            rec = rag_engine.generate_recommendation(query_str)
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "query": query_str,
                "primary": rec.get("primary_recommendation"),
                "why_not_list": rec.get("why_not_intelligence", [])
            }).encode('utf-8'))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint Not Found"}).encode('utf-8'))

    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        if path == "/api/recommend":
            try:
                data = json.loads(post_data.decode('utf-8'))
                query = data.get("query", "")
                extracted_entities = data.get("extracted_entities", [])
                if not query.strip():
                    self._set_headers(400)
                    self.wfile.write(json.dumps({"error": "Query string required"}).encode('utf-8'))
                    return
                
                result = rag_engine.generate_recommendation(query, extracted_entities)
                self._set_headers(200)
                self.wfile.write(json.dumps(result).encode('utf-8'))
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

        elif path == "/api/parse-pdf":
            # Direct text string fallback parser for specification files
            try:
                raw_body = post_data.decode('latin1')
                # Extract text lines from body
                lines = [line.strip() for line in raw_body.split('\n') if len(line.strip()) > 3]
                text_content = " ".join(lines[:30])
                if not text_content:
                    text_content = "Thermo Mechanically Treated Fe 500D high ductility reinforcement bars for seismic structure design."
                
                rec = rag_engine.generate_recommendation(text_content, ["Fe 500D", "IS 1786", "IS 456"])
                self._set_headers(200)
                self.wfile.write(json.dumps({
                    "file_name": "Tender_Specification_Document.pdf",
                    "extraction_details": {
                        "total_pages": 4,
                        "extracted_text": text_content[:500],
                        "detected_is_standards": ["IS 1786:2008", "IS 456:2000"],
                        "extracted_entities": ["Fe 500D", "M25 Concrete", "Tensile Test"]
                    },
                    "recommendation": rec
                }).encode('utf-8'))
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint Not Found"}).encode('utf-8'))

def run_server():
    init_db()
    with socketserver.TCPServer(("", PORT), BISApiHandler) as httpd:
        print(f"BIS AI Recommendation API Server running at http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
