from fastapi import FastAPI, HTTPException
import os
import boto3
import botocore
import io

app = FastAPI()

S3_BUCKET = os.getenv("S3_BUCKET", "tracking-ml")
S3_KEY = os.getenv("S3_KEY", "trainig_data3.csv")  # set correct key/path
S3_REGION = os.getenv("AWS_REGION")  # optional

def read_first_n_lines_from_s3(bucket: str, key: str, n: int = 10, encoding: str = "utf-8"):
    s3 = boto3.client("s3", region_name=S3_REGION) if S3_REGION else boto3.client("s3")
    try:
        obj = s3.get_object(Bucket=bucket, Key=key)
        stream = io.TextIOWrapper(obj["Body"], encoding=encoding)
        lines = []
        for i, line in enumerate(stream):
            if i >= n:
                break
            lines.append(line.rstrip("\n"))
        return lines
    except botocore.exceptions.ClientError as e:
        code = e.response.get("Error", {}).get("Code", "Unknown")
        msg = e.response.get("Error", {}).get("Message", str(e))
        raise HTTPException(status_code=403 if code in ("AccessDenied", "403") else 500,
                            detail=f"S3 error {code}: {msg}")

@app.get("/")
def read_root():
    lines = read_first_n_lines_from_s3(S3_BUCKET, S3_KEY, n=10)
    return {
        "environment": os.environ.get("HOSTNAME", "UNKNOWN"),
        "bucket": S3_BUCKET,
        "key": S3_KEY,
        "first_10_lines": lines,
    }
