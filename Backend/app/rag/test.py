from app.rag.retriever import get_retriever

retriever = get_retriever()

docs = retriever.invoke(
    "What is the core skill sets of shakthi"
)

print(f"Documents Found: {len(docs)}")

for i, doc in enumerate(docs, start=1):
    print("\n" + "=" * 50)
    print(f"Document {i}")
    print("=" * 50)
    print(doc.page_content)