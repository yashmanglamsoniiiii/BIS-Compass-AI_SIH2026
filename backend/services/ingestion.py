import fitz  # PyMuPDF
import re
from typing import Dict, List, Any

class DocumentProcessor:
    """PyMuPDF Document Extraction Engine for BIS PDFs and Tender Specification Documents."""
    
    @staticmethod
    def extract_from_bytes(pdf_bytes: bytes) -> Dict[str, Any]:
        """Extracts text, metadata, and structural sections from raw PDF bytes using PyMuPDF."""
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        full_text = []
        pages_content = []
        tables_summary = []
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text("text")
            full_text.append(text)
            
            # Simple table detection heuristic (lines with tabs or pipe characters)
            lines = text.split("\n")
            page_tables = [line for line in lines if "|" in line or "\t" in line]
            if page_tables:
                tables_summary.extend(page_tables)
                
            pages_content.append({
                "page_number": page_num + 1,
                "text": text.strip()
            })
            
        combined_text = "\n\n".join(full_text)
        
        # Extract potential IS standard numbers matched in document
        is_matches = list(set(re.findall(r'IS\s*\d+(?:\s*\([^)]+\))?(?::\d{4})?', combined_text, re.IGNORECASE)))
        
        # Extract key technical entities (MPa, Fe, Grade, PE100, TDS, pH, etc.)
        spec_entities = list(set(re.findall(r'\b(Fe\s*\d+D?|PE\s*\d+|M\d+|TDS|pH|N/mm2|MPa|ISO\s*\d+|Amdt\s*\d+)\b', combined_text, re.IGNORECASE)))
        
        doc.close()
        
        return {
            "total_pages": len(pages_content),
            "extracted_text": combined_text[:3000], # Preview snippet
            "full_text": combined_text,
            "detected_is_standards": is_matches,
            "extracted_entities": spec_entities,
            "table_count": len(tables_summary)
        }

    @staticmethod
    def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50) -> List[str]:
        """Splits text into overlapping semantic chunks for embedding index."""
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk:
                chunks.append(chunk)
        return chunks
