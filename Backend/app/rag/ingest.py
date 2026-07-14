from pathlib import Path
import os

from dotenv import load_dotenv

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
)

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings
)

from langchain_astradb import (
    AstraDBVectorStore
)

load_dotenv()

ASTRA_DB_API_ENDPOINT = os.getenv(
    "ASTRA_DB_API_ENDPOINT"
)

ASTRA_DB_APPLICATION_TOKEN = os.getenv(
    "ASTRA_DB_APPLICATION_TOKEN"
)

DATA_FOLDER = Path("app/data")


def load_documents():

    documents = []

    for file in DATA_FOLDER.iterdir():

        if file.suffix.lower() == ".pdf":

            loader = PyPDFLoader(
                str(file)
            )

        elif file.suffix.lower() in [
            ".md",
            ".txt"
        ]:

            loader = TextLoader(
                str(file),
                encoding="utf-8"
            )

        else:
            continue

        docs = loader.load()

        for doc in docs:
            doc.metadata["source"] = file.name

        documents.extend(docs)

    return documents


docs = load_documents()

print(f"Loaded Documents: {len(docs)}")

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
)

chunks = splitter.split_documents(
    docs
)

print(f"Chunks Created: {len(chunks)}")

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001"
)

vectorstore = AstraDBVectorStore(
    collection_name="shakthi_assistant",
    embedding=embeddings,
    api_endpoint=ASTRA_DB_API_ENDPOINT,
    token=ASTRA_DB_APPLICATION_TOKEN,
)

vectorstore.add_documents(chunks)

print(
    f"Successfully Stored {len(chunks)} Chunks"
)