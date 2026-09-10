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

# Canonical Skill Vocabulary Map
# Format: "alias": "Canonical Name"
ATS_SKILLS_VOCABULARY = {
    "python": "Python",
    "java": "Java",
    "javascript": "JavaScript",
    "js": "JavaScript",
    "typescript": "TypeScript",
    "ts": "TypeScript",
    "c": "C",
    "c++": "C++",
    "c#": "C#",
    "react": "React",
    "reactjs": "React",
    "react.js": "React",
    "angular": "Angular",
    "vue": "Vue",
    "vuejs": "Vue",
    "django": "Django",
    "flask": "Flask",
    "fastapi": "FastAPI",
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "node": "Node.js",
    "express": "Express",
    "spring": "Spring",
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "mysql": "MySQL",
    "mongodb": "MongoDB",
    "mongo": "MongoDB",
    "sql": "SQL",
    "redis": "Redis",
    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "k8s": "Kubernetes",
    "aws": "AWS",
    "amazon web services": "AWS",
    "azure": "Azure",
    "gcp": "GCP",
    "google cloud": "GCP",
    "git": "Git",
    "machine learning": "Machine Learning",
    "ml": "Machine Learning",
    "deep learning": "Deep Learning",
    "dl": "Deep Learning",
    "nlp": "NLP",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
    "scikit-learn": "Scikit-learn",
    "scikit learn": "Scikit-learn",
    "sklearn": "Scikit-learn",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "rest api": "REST API",
    "rest": "REST API",
    "graphql": "GraphQL",
    "html": "HTML",
    "css": "CSS",
    "tailwind css": "Tailwind CSS",
    "tailwind": "Tailwind CSS",
    "linux": "Linux",
    "unix": "Unix",
    "bash": "Bash",
    "shell": "Shell Scripting"
}

# Skill Category Mapping
ATS_SKILLS_CATEGORIES = {
    "Python": "languages",
    "Java": "languages",
    "JavaScript": "languages",
    "TypeScript": "languages",
    "C": "languages",
    "C++": "languages",
    "C#": "languages",
    "HTML": "languages",
    "CSS": "languages",
    "SQL": "languages",
    "Bash": "languages",
    "Shell Scripting": "languages",
    "React": "frameworks",
    "Angular": "frameworks",
    "Vue": "frameworks",
    "Django": "frameworks",
    "Flask": "frameworks",
    "FastAPI": "frameworks",
    "Node.js": "frameworks",
    "Express": "frameworks",
    "Spring": "frameworks",
    "Tailwind CSS": "frameworks",
    "PostgreSQL": "databases",
    "MySQL": "databases",
    "MongoDB": "databases",
    "Redis": "databases",
    "Docker": "tools",
    "Kubernetes": "tools",
    "Git": "tools",
    "AWS": "cloud",
    "Azure": "cloud",
    "GCP": "cloud",
    "Linux": "tools",
    "Unix": "tools",
    "Machine Learning": "ai_ml",
    "Deep Learning": "ai_ml",
    "NLP": "ai_ml",
    "TensorFlow": "ai_ml",
    "PyTorch": "ai_ml",
    "Scikit-learn": "ai_ml",
    "Pandas": "ai_ml",
    "NumPy": "ai_ml",
    "REST API": "tools",
    "GraphQL": "tools"
}
