from dotenv import load_dotenv
import os

from langchain_astradb import AstraDBVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

ASTRA_DB_API_ENDPOINT = os.getenv(
    "ASTRA_DB_API_ENDPOINT"
)

ASTRA_DB_APPLICATION_TOKEN = os.getenv(
    "ASTRA_DB_APPLICATION_TOKEN"
)

GOOGLE_API_KEY = os.getenv(
    "GOOGLE_API_KEY"
)


def get_retriever():

    embeddings = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001",
        google_api_key=GOOGLE_API_KEY
    )

    vectorstore = AstraDBVectorStore(
        collection_name="shakthi_assistant",
        embedding=embeddings,
        api_endpoint=ASTRA_DB_API_ENDPOINT,
        token=ASTRA_DB_APPLICATION_TOKEN,
    )

    return vectorstore.as_retriever(
        search_kwargs={
            "k": 4
        }
    )