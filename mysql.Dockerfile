FROM python:3.10-slim

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir flask docker

EXPOSE 10000

CMD [ "python", "server.py" ]