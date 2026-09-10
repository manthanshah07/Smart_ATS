import re
import io
import fitz  # PyMuPDF
import docx

class ResumeParser:
    """Handles text extraction from PDF and DOCX documents."""

    @classmethod
    def extract_text(cls, file_obj, file_extension):
        """
        Extract raw text from PDF/DOCX file object.
        Returns the extracted text or an empty string on failure.
        """
        if file_extension.lower() == '.pdf':
            return cls._extract_from_pdf(file_obj)
        elif file_extension.lower() in ['.docx', '.doc']:
            return cls._extract_from_docx(file_obj)
        return ""

    @classmethod
    def _extract_from_pdf(cls, file_obj):
        text = []
        try:
            # We read into memory to let fitz parse it from bytes
            file_bytes = file_obj.read()
            # PyMuPDF Document
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                # extract_text automatically inserts line breaks intuitively
                text.append(page.get_text())
            doc.close()
        except Exception:
            return ""
        
        return cls._normalize_text("\n".join(text))

    @classmethod
    def _extract_from_docx(cls, file_obj):
        text = []
        try:
            # python-docx can parse from a file-like object directly
            doc = docx.Document(file_obj)
            for para in doc.paragraphs:
                text.append(para.text)
            
            # Extract basic text from tables as well
            for table in doc.tables:
                for row in table.rows:
                    row_text = []
                    for cell in row.cells:
                        row_text.append(cell.text)
                    text.append(" | ".join(row_text))
        except Exception:
            return ""
        
        return cls._normalize_text("\n".join(text))

    @classmethod
    def _normalize_text(cls, text):
        """
        Normalizes excess whitespace, multiple newlines, and obvious artifacts.
        """
        if not text:
            return ""
        # Remove null characters
        text = text.replace('\x00', ' ')
        # Replace 3 or more newlines with exactly 2
        text = re.sub(r'\n{3,}', '\n\n', text)
        # Collapse multiple spaces into single space (but preserve newlines)
        text = re.sub(r'[ \t]+', ' ', text)
        return text.strip()
