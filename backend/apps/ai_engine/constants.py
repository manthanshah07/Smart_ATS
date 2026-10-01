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
    # Languages
    "python": "Python",
    "python3": "Python",
    "py": "Python",
    "java": "Java",
    "javascript": "JavaScript",
    "js": "JavaScript",
    "typescript": "TypeScript",
    "ts": "TypeScript",
    "c": "C",
    "c++": "C++",
    "cpp": "C++",
    "c#": "C#",
    "csharp": "C#",
    "go": "Go",
    "golang": "Go",
    "rust": "Rust",
    "ruby": "Ruby",
    "php": "PHP",
    "kotlin": "Kotlin",
    "swift": "Swift",
    "dart": "Dart",
    "scala": "Scala",
    "r": "R",
    "html": "HTML",
    "html5": "HTML",
    "css": "CSS",
    "css3": "CSS",
    "sass": "Sass",
    "scss": "Sass",
    "sql": "SQL",
    "bash": "Bash",
    "shell": "Shell Scripting",

    # Frameworks & Libraries
    "react": "React",
    "reactjs": "React",
    "react.js": "React",
    "react native": "React Native",
    "next.js": "Next.js",
    "nextjs": "Next.js",
    "vue": "Vue",
    "vuejs": "Vue",
    "vue.js": "Vue",
    "angular": "Angular",
    "angularjs": "Angular",
    "angular.js": "Angular",
    "django": "Django",
    "flask": "Flask",
    "fastapi": "FastAPI",
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "node": "Node.js",
    "express": "Express",
    "express.js": "Express",
    "expressjs": "Express",
    "spring": "Spring",
    "spring boot": "Spring Boot",
    "springboot": "Spring Boot",
    "asp.net": "ASP.NET",
    ".net": ".NET",
    "dotnet": ".NET",
    "laravel": "Laravel",
    "flutter": "Flutter",
    "tailwind css": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "tailwind": "Tailwind CSS",
    "bootstrap": "Bootstrap",
    "redux": "Redux",

    # Databases
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "mysql": "MySQL",
    "mongodb": "MongoDB",
    "mongo": "MongoDB",
    "redis": "Redis",
    "sqlite": "SQLite",
    "cassandra": "Cassandra",
    "oracle": "Oracle DB",
    "dynamodb": "DynamoDB",
    "elasticsearch": "Elasticsearch",
    "firebase": "Firebase",
    "supabase": "Supabase",

    # Tools & DevOps
    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "k8s": "Kubernetes",
    "git": "Git",
    "github": "GitHub",
    "gitlab": "GitLab",
    "ci/cd": "CI/CD",
    "jenkins": "Jenkins",
    "linux": "Linux",
    "unix": "Unix",
    "rest api": "REST API",
    "restful api": "REST API",
    "rest": "REST API",
    "restful": "REST API",
    "graphql": "GraphQL",
    "kafka": "Apache Kafka",
    "apache kafka": "Apache Kafka",
    "rabbitmq": "RabbitMQ",
    "nginx": "Nginx",

    # Cloud
    "aws": "AWS",
    "amazon web services": "AWS",
    "azure": "Azure",
    "microsoft azure": "Azure",
    "gcp": "GCP",
    "google cloud": "GCP",
    "google cloud platform": "GCP",
    "cloud": "Cloud Computing",

    # AI, ML & Data
    "machine learning": "Machine Learning",
    "ml": "Machine Learning",
    "deep learning": "Deep Learning",
    "dl": "Deep Learning",
    "nlp": "NLP",
    "natural language processing": "NLP",
    "computer vision": "Computer Vision",
    "cv": "Computer Vision",
    "tensorflow": "TensorFlow",
    "tf": "TensorFlow",
    "pytorch": "PyTorch",
    "scikit-learn": "Scikit-learn",
    "scikit learn": "Scikit-learn",
    "sklearn": "Scikit-learn",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "opencv": "OpenCV",
    "keras": "Keras"
}

# Skill Category Mapping
ATS_SKILLS_CATEGORIES = {
    # Languages
    "Python": "languages",
    "Java": "languages",
    "JavaScript": "languages",
    "TypeScript": "languages",
    "C": "languages",
    "C++": "languages",
    "C#": "languages",
    "Go": "languages",
    "Rust": "languages",
    "Ruby": "languages",
    "PHP": "languages",
    "Kotlin": "languages",
    "Swift": "languages",
    "Dart": "languages",
    "Scala": "languages",
    "R": "languages",
    "HTML": "languages",
    "CSS": "languages",
    "Sass": "languages",
    "SQL": "languages",
    "Bash": "languages",
    "Shell Scripting": "languages",

    # Frameworks
    "React": "frameworks",
    "React Native": "frameworks",
    "Next.js": "frameworks",
    "Vue": "frameworks",
    "Angular": "frameworks",
    "Django": "frameworks",
    "Flask": "frameworks",
    "FastAPI": "frameworks",
    "Node.js": "frameworks",
    "Express": "frameworks",
    "Spring": "frameworks",
    "Spring Boot": "frameworks",
    "ASP.NET": "frameworks",
    ".NET": "frameworks",
    "Laravel": "frameworks",
    "Flutter": "frameworks",
    "Tailwind CSS": "frameworks",
    "Bootstrap": "frameworks",
    "Redux": "frameworks",

    # Databases
    "PostgreSQL": "databases",
    "MySQL": "databases",
    "MongoDB": "databases",
    "Redis": "databases",
    "SQLite": "databases",
    "Cassandra": "databases",
    "Oracle DB": "databases",
    "DynamoDB": "databases",
    "Elasticsearch": "databases",
    "Firebase": "databases",
    "Supabase": "databases",

    # Tools & Infrastructure
    "Docker": "tools",
    "Kubernetes": "tools",
    "Git": "tools",
    "GitHub": "tools",
    "GitLab": "tools",
    "CI/CD": "tools",
    "Jenkins": "tools",
    "Linux": "tools",
    "Unix": "tools",
    "REST API": "tools",
    "GraphQL": "tools",
    "Apache Kafka": "tools",
    "RabbitMQ": "tools",
    "Nginx": "tools",

    # Cloud
    "AWS": "cloud",
    "Azure": "cloud",
    "GCP": "cloud",
    "Cloud Computing": "cloud",

    # AI & ML
    "Machine Learning": "ai_ml",
    "Deep Learning": "ai_ml",
    "NLP": "ai_ml",
    "Computer Vision": "ai_ml",
    "TensorFlow": "ai_ml",
    "PyTorch": "ai_ml",
    "Scikit-learn": "ai_ml",
    "Pandas": "ai_ml",
    "NumPy": "ai_ml",
    "OpenCV": "ai_ml",
    "Keras": "ai_ml"
}
