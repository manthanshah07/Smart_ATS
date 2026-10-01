import re
import io
try:
    import pymupdf as fitz
except ImportError:
    try:
        import fitz
    except ImportError:
        fitz = None
import docx


class ResumeParser:
    """Handles text extraction from PDF and DOCX documents."""

    @classmethod
    def extract_text(cls, file_obj, file_extension):
        """
        Extract raw text from PDF/DOCX file object.
        Returns the extracted text or an empty string on failure.
        """
        if not file_obj:
            return ""
        ext = (file_extension or "").lower()
        if ext == '.pdf':
            return cls._extract_from_pdf(file_obj)
        elif ext in ['.docx', '.doc']:
            return cls._extract_from_docx(file_obj)
        return ""

    @classmethod
    def _extract_from_pdf(cls, file_obj):
        if fitz is None:
            return ""
        text = []
        try:
            # We read into memory to let fitz parse it from bytes
            if hasattr(file_obj, 'read'):
                file_bytes = file_obj.read()
            elif isinstance(file_obj, bytes):
                file_bytes = file_obj
            else:
                return ""

            if not file_bytes:
                return ""

            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                page_text = page.get_text("text")
                if page_text:
                    text.append(page_text)
            doc.close()
        except Exception:
            return ""

        return cls._normalize_text("\n".join(text))

    @classmethod
    def _extract_from_docx(cls, file_obj):
        text = []
        try:
            if hasattr(file_obj, 'seek'):
                file_obj.seek(0)
            doc = docx.Document(file_obj)
            for para in doc.paragraphs:
                if para.text.strip():
                    text.append(para.text.strip())

            # Extract text from tables as well
            for table in doc.tables:
                for row in table.rows:
                    row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if row_text:
                        # Avoid duplicate adjacent cells from merged table cells
                        deduped_row = []
                        for cell_val in row_text:
                            if not deduped_row or deduped_row[-1] != cell_val:
                                deduped_row.append(cell_val)
                        text.append(" | ".join(deduped_row))
        except Exception:
            return ""

        return cls._normalize_text("\n".join(text))

    @classmethod
    def _normalize_text(cls, text):
        """
        Normalizes excess whitespace, multiple newlines, special dashes/quotes, and artifacts.
        """
        if not text:
            return ""
        # Remove null characters and replacement characters
        text = text.replace('\x00', ' ').replace('\ufffd', ' ')
        # Normalize typographic quotes and dashes
        text = text.replace('“', '"').replace('”', '"').replace('’', "'").replace('‘', "'")
        text = text.replace('–', '-').replace('—', ' - ').replace('•', '\n- ')
        # Replace 3 or more newlines with 2
        text = re.sub(r'\n{3,}', '\n\n', text)
        # Collapse multiple horizontal spaces/tabs into a single space
        text = re.sub(r'[ \t]+', ' ', text)
        # Clean trailing whitespace per line
        lines = [line.strip() for line in text.split('\n')]
        return "\n".join(lines).strip()
