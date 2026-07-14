import logging

from fastapi import APIRouter

from app.schemas.chat import ChatRequest
from app.core.llm import get_llm, get_fallback_chain
from app.rag.retriever import get_retriever
from app.rag.prompts import SYSTEM_PROMPT

logger = logging.getLogger("shakthi_assistant")

router = APIRouter(
    prefix="/api",
    tags=["Chat"]
)

retriever = get_retriever()


def is_quota_error(error: Exception) -> bool:
    """Detect Gemini's daily/rate quota errors (429 RESOURCE_EXHAUSTED)."""
    text = str(error)
    return "RESOURCE_EXHAUSTED" in text or "429" in text or "quota" in text.lower()


def is_connection_error(error: Exception) -> bool:
    """Detect network/connectivity issues reaching Google's API."""
    text = str(error).lower()
    return any(
        keyword in text
        for keyword in ["connection", "timeout", "timed out", "unreachable"]
    )


def extract_text(content) -> str:
    """
    Normalize LangChain message content into a plain HTML string.

    - Gemini 2.x models return content as a plain string.
    - Gemini 3.x models return content as a list of blocks like
      [{"type": "text", "text": "...", "extras": {"signature": "..."}}].
    """
    if isinstance(content, str):
        return content

    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                parts.append(block.get("text", ""))
            elif isinstance(block, str):
                parts.append(block)
        return "".join(parts)

    return str(content)


def build_prompt(message: str, context: str) -> str:
    return f"""
{SYSTEM_PROMPT}

Context:
{context}

Question:
{message}
"""


def generate_answer(prompt: str):
    """
    Try each model in the fallback chain. If a model's daily quota is
    exhausted, move on to the next one. Any other error stops the chain
    immediately (no point retrying a broken prompt on every model).
    """
    last_error = None

    for model_name in get_fallback_chain():
        try:
            llm = get_llm(model_name)
            response = llm.invoke(prompt)
            return extract_text(response.content), model_name

        except Exception as e:
            last_error = e

            if is_quota_error(e):
                logger.warning(
                    f"[{model_name}] quota exhausted, trying next model..."
                )
                continue

            # Non-quota error (bad request, auth issue, etc.) — don't
            # waste time retrying the same broken request on other models.
            raise e

    # Every model in the chain hit its quota
    raise last_error


@router.post("/chat")
async def chat(request: ChatRequest):
    user_message = request.message.strip()

    if not user_message:
        return {
            "answer": "<p>Please type a question so I can help you. 🙂</p>"
        }

    # --- Step 1: Retrieve context from the vector store ---
    try:
        docs = retriever.invoke(user_message)
        context = "\n".join(doc.page_content for doc in docs)

    except Exception as e:
        logger.exception("Retriever error")
        return {
            "answer": (
                "<p>I'm having trouble accessing Shakthi's knowledge base "
                "right now. Please try again in a moment.</p>"
            ),
            "error": "retriever_unavailable",
        }

    # --- Step 2: Generate the answer, with model fallback ---
    prompt = build_prompt(user_message, context)

    try:
        answer, model_used = generate_answer(prompt)
        return {
            "answer": answer,
            "model": model_used,
        }

    except Exception as e:
        logger.error(f"CHAT ERROR: {e}")

        if is_quota_error(e):
            return {
                "answer": (
                    "<p>I'm getting a lot of questions right now and have "
                    "reached today's usage limit across all my AI models. "
                    "Please try again in a little while — daily limits reset "
                    "every 24 hours. 🙏</p>"
                ),
                "error": "rate_limited",
            }

        if is_connection_error(e):
            return {
                "answer": (
                    "<p>I couldn't connect to my AI service. Please check "
                    "your connection and try again shortly.</p>"
                ),
                "error": "connection_error",
            }

        # Catch-all for anything unexpected (bad API key, malformed
        # response, library errors, etc.)
        return {
            "answer": (
                "<p>Something went wrong while generating a response. "
                "Please try again, and let Shakthi know if this keeps "
                "happening.</p>"
            ),
            "error": "internal_error",
        }