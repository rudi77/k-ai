from typing import Dict, Any
import json
from app.core.config import settings
from app.core.encryption import EncryptionService
from openai import AsyncOpenAI
import PyPDF2
import logging

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are a helpful assistant that extracts information from a PDF invoice.
Provide the invoice number, date, total amount, vendor, and line items.
Strictly follow the JSON format. Here is an example:
{
    "invoice_number": "INV-001",
    "date": "2024-03-15",
    "total_amount": 1000.00,
    "vendor": "Example Corp",
    "line_items": [
        {
            "description": "Service 1",
            "quantity": 1,
            "unit_price": 1000.00,
            "total": 1000.00
        }
    ]
}
"""

USER_PROMPT = """
Extract the invoice data from the following text:
{text}
"""

class OpenAIService:
    def __init__(self, api_key: str = None):
        self.encryption = EncryptionService()
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.openai_client = AsyncOpenAI(api_key=self.api_key)

    async def extract_invoice_data(self, file_path: str, system_prompt: str = None, user_prompt: str = None) -> Dict[str, Any]:
        """
        Process the invoice file and extract information using OpenAI API.
        This is a placeholder implementation - we'll add the actual OpenAI integration later.
        """
        # If api_key is encrypted, decrypt it
        if self.api_key and self.api_key.startswith('gAAAAAB'):
            self.api_key = self.encryption.decrypt(self.api_key)

                # Extract text from PDF
        pdf_text = self.extract_text_from_pdf(file_path)

        # Ensure text length is within limits
        if len(pdf_text) > 16000:  # Approximate token limit for GPT models
            pdf_text = pdf_text[:16000]
            logger.warning(f"Text length exceeds limit. Truncating to 16000 characters.")


        if system_prompt is None:
            system_prompt = SYSTEM_PROMPT

        if user_prompt is None:
            user_prompt = USER_PROMPT

        # Call OpenAI API
        response = await self.openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
                {"role": "user", "content": pdf_text}
            ]
        )

        # Parse the response
        response_content = response.choices[0].message.content
        logger.info(f"Response content: {response_content}")
        return json.loads(response_content)

    def extract_text_from_pdf(self, file_path):
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ''
            for page in reader.pages:
                text += page.extract_text()
            return text        