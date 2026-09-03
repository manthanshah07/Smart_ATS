"""
Constants and configuration parameters for the Explainable AI Engine.
"""

# Default open-source embedding model
DEFAULT_EMBEDDING_MODEL = 'all-MiniLM-L6-v2'
DEFAULT_MODEL_VERSION = '1.0.0'

# Authoritative scoring formula weights (Sum must equal 1.0)
WEIGHT_SEMANTIC_SIMILARITY = 0.60  # 60%
WEIGHT_SKILL_MATCH = 0.30          # 30%
WEIGHT_EXPERIENCE_ALIGNMENT = 0.10 # 10%

# File processing limits
MAX_RESUME_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
ALLOWED_RESUME_EXTENSIONS = ['.pdf', '.docx']
ALLOWED_RESUME_MIME_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
]
