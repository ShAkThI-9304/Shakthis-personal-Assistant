from langchain.chat_models import init_chat_model

from app.core.config import (
    MODEL_NAME,
    MODEL_PROVIDER,
)

# Ordered by (daily quota, speed) — flash-lite models are both faster
# (lower latency) and have far higher free-tier limits than full "flash".
#
#   gemini-3.1-flash-lite : 500 RPD, 15 RPM  <- primary
#   gemini-2.5-flash-lite :  20 RPD, 10 RPM  <- backup
#   gemini-2.5-flash      :  20 RPD,  5 RPM  <- last resort (slowest, most limited)
FALLBACK_MODELS = [
    MODEL_NAME or "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
]

_llm_cache = {}


def get_llm(model_name: str | None = None):
    """Return a cached chat model instance, tuned for short, fast replies."""
    model_name = model_name or FALLBACK_MODELS[0]

    if model_name not in _llm_cache:
        _llm_cache[model_name] = init_chat_model(
            model=model_name,
            model_provider=MODEL_PROVIDER,
            temperature=0.3,      # less "thinking", more direct answers
            max_tokens=512,       # cap output length -> faster generation
        )

    return _llm_cache[model_name]


def get_fallback_chain():
    seen = set()
    chain = []

    for model in FALLBACK_MODELS:
        if model not in seen:
            seen.add(model)
            chain.append(model)

    return chain