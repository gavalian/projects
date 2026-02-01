from fastapi import FastAPI
import os
app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": f"Environment: {os.environ.get('HOSTNAME','UNKNOWN')}"}
