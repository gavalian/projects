#=====================================================================
# example code on how to read CSV file from AWS/S3 bucket.
# author: gavalian
# source: www
#=====================================================================
import boto3
import io
#*********************************************************************
def print_first_10_lines(bucket_name, key, encoding="utf-8"):
    s3 = boto3.client("s3")
    response = s3.get_object(Bucket=bucket_name, Key=key)

    stream = io.TextIOWrapper(response["Body"], encoding=encoding)

    for i, line in enumerate(stream):
        if i >= 10:
            break
        print(line.rstrip("\n"))
#---------------------------------------------------------------------
print_first_10_lines(
    bucket_name="tracking-ml",      # <-- bucket NAME, not ARN
    key="trainig_data3.csv"         # <-- key must match exactly
)
