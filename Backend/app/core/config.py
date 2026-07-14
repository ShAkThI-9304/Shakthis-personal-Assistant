from dotenv import load_dotenv
import os

load_dotenv()

MODEL_PROVIDER = os.getenv("MODEL_PROVIDER")
MODEL_NAME = os.getenv("MODEL_NAME")

ASTRA_DB_API_ENDPOINT = os.getenv(
    "ASTRA_DB_API_ENDPOINT"
)

ASTRA_DB_APPLICATION_TOKEN = os.getenv(
    "ASTRA_DB_APPLICATION_TOKEN"
)


