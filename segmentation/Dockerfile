FROM ubuntu:16.04
LABEL maintainer "ai"

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        libglib2.0-0 \
        libsm6 \
        libxrender1 \
        libxext6 \
        python3-setuptools \
        python3-dev \
        python3-pip \
        python-setuptools \
        python-dev \
        python-pip \
        nginx \
        vim \
        locales \
        libmysqlclient-dev && \
    rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y --no-install-recommends \
        cmake && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/local/share/man /home/faceswap && locale-gen zh_CN.utf8 && \
    #pip install --upgrade pip && \
    pip install --no-cache-dir dlib opencv-python numpy && \
    pip install --no-cache-dir django sqlparse uwsgi mysqlclient

RUN rm -f /etc/nginx/sites-enabled/default
WORKDIR /home/faceswap
EXPOSE 80

ENV LANG=zh_CN.utf-8
ENV LANGUAGE=zh_CN.UTF-8
