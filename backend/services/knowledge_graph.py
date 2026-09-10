from typing import Dict, List, Any
from backend.db.database import get_all_standards

class BISKnowledgeGraph:
    """Pure-Python Graph Data Structure connecting BIS Standards, Normative References, Amendments, and Test Methods."""
    
    def __init__(self):
        self.nodes = {}
        self.edges = []
        self.build_graph()
        
    def add_node(self, node_id: str, **kwargs):
        if node_id not in self.nodes:
            self.nodes[node_id] = kwargs

    def add_edge(self, source: str, target: str, relation: str):
        self.edges.append({"source": source, "target": target, "relation": relation})

    def build_graph(self):
        self.nodes.clear()
        self.edges.clear()
        standards = get_all_standards()
        
        for std in standards:
            is_num = std["is_number"]
            # Add primary Standard node
            self.add_node(is_num, type="Standard", title=std["title"], department=std["department"], status=std["status"], cert=std["mandatory_certification"])
            
            # Add Department node
            dept_node = f"Dept: {std['department']}"
            self.add_node(dept_node, type="Department")
            self.add_edge(is_num, dept_node, relation="BELONGS_TO")
            
            # Add Mandatory Certification node
            cert_node = f"Cert: {std['mandatory_certification']}"
            self.add_node(cert_node, type="Certification")
            self.add_edge(is_num, cert_node, relation="REQUIRES_CERTIFICATION")
            
            # Add Normative References
            for ref in std["normative_references"]:
                self.add_node(ref, type="Standard", title=ref)
                self.add_edge(is_num, ref, relation="NORMATIVE_REFERENCE")
                
            # Add Test Methods
            test_node = f"Tests: {is_num}"
            self.add_node(test_node, type="TestMethod", details=std["test_methods"])
            self.add_edge(is_num, test_node, relation="VERIFIED_BY_TEST")

    def get_standard_subgraph(self, is_number: str) -> Dict[str, Any]:
        """Returns node and edge dictionary representation suitable for interactive 2D/3D Graph Visualizer."""
        if is_number not in self.nodes:
            matched = [n for n in self.nodes if is_number.lower() in n.lower()]
            if matched:
                is_number = matched[0]
            else:
                is_number = "IS 1786:2008" # Fallback default
                
        # Find 1-hop and 2-hop connected nodes
        connected_node_ids = {is_number}
        sub_edges = []
        for edge in self.edges:
            if edge["source"] == is_number or edge["target"] == is_number:
                connected_node_ids.add(edge["source"])
                connected_node_ids.add(edge["target"])
                sub_edges.append(edge)
                
        sub_nodes = []
        for nid in connected_node_ids:
            data = self.nodes.get(nid, {})
            sub_nodes.append({
                "id": nid,
                "label": nid,
                "type": data.get("type", "Standard"),
                "title": data.get("title", nid),
                "cert": data.get("cert", ""),
                "status": data.get("status", "Active")
            })
            
        return {
            "center_node": is_number,
            "nodes": sub_nodes,
            "edges": sub_edges
        }

    def get_full_graph_summary(self) -> Dict[str, Any]:
        return {
            "total_nodes": len(self.nodes),
            "total_edges": len(self.edges)
        }

knowledge_graph_service = BISKnowledgeGraph()
