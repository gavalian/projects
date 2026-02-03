#!/bin/sh 
s3vectors-embed put \
  --vector-bucket-name pas-vectors-bucket \
  --region us-east-1 \
  --index-name pas-vector-operate \
  --model-id amazon.titan-embed-text-v2:0 \
  --text "Arthurs_Adventure.txt"
