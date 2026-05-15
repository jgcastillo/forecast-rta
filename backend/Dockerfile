FROM python:3.13-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para psycopg2/sqlmodel
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Configurar entorno virtual y path
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalación de dependencias iniciales
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#EXPOSE 8000