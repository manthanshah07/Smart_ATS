import logging
from sentence_transformers import SentenceTransformer
from .constants import DEFAULT_EMBEDDING_MODEL

logger = logging.getLogger(__name__)

class EmbeddingService:
    """Generates dense semantic vector embeddings using Sentence Transformers."""
    
    _model = None

    @classmethod
    def _get_model(cls):
        """
        Lazy-loads the sentence-transformer model as a Singleton.
        Ensures it only loads once per process.
        """
        if cls._model is None:
            logger.info(f"Loading Embedding Model: {DEFAULT_EMBEDDING_MODEL}...")
            try:
                cls._model = SentenceTransformer(DEFAULT_EMBEDDING_MODEL)
                logger.info("Embedding Model loaded successfully.")
            except Exception as e:
                logger.error(f"Failed to load embedding model: {e}")
                raise e
        return cls._model

    @classmethod
    def get_embedding(cls, text):
        """
        Generate 384-dimensional vector embedding for given text.
        Returns a flat list of floats.
        """
        if not text or not text.strip():
            # Return zero vector if empty
            return [0.0] * 384
            
        model = cls._get_model()
        # encode returns a numpy array, convert to list for easy handling
        embedding = model.encode(text)
        return embedding.tolist()
