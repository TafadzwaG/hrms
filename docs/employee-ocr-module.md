# Employee OCR Module

## Laravel setup

Add these environment values:

```env
OCR_SERVICE_URL=http://localhost:8002
OCR_SERVICE_TOKEN=change-me
OCR_DEFAULT_ENGINE=paddleocr
OCR_DEFAULT_LANGUAGE=en
OCR_HTTP_TIMEOUT=120
```

Run the queue worker so OCR jobs can process asynchronously:

```bash
php artisan queue:work
```

## Python OCR service

Use Python `3.11` or `3.12` for the OCR service. PaddlePaddle Windows wheels are not published for every Python release, so `3.13` will fail to install.

Start the FastAPI service locally from the `ocr-service` directory:

```bash
python -m venv .venv
# PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8002
```

If `paddlepaddle` still does not resolve, verify the interpreter version first:

```bash
python --version
```

Or run it with Docker:

```bash
docker build -t hrms-ocr-service .
docker run --rm -p 8002:8002 -e OCR_SERVICE_TOKEN=change-me hrms-ocr-service
```

Health check:

```bash
curl http://localhost:8002/health
```

Laravel sends OCR uploads to `POST /v1/ocr/extract` with bearer-token authentication. The browser never calls the Python service directly.
