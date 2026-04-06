from sentence_transformers import SentenceTransformer

_model = None  # 🔥 cache


def load_model():
    global _model

    if _model is None:
        print("🔄 Loading embedding model...")
        _model = SentenceTransformer("BAAI/bge-base-en-v1.5")

    return _model