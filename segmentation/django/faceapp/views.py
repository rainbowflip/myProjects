# -*- coding:utf-8 -*-
from django.shortcuts import render,HttpResponse
from django.http import JsonResponse
import json
import datetime
from datetime import timedelta, timezone
import hashlib
import time
import os
import sys
sys.path.append("/bigdata/gemfield/github/semantic-segmentation-pytorch/")
from .models import *
from django.views.decorators.csrf import csrf_exempt
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import FileResponse,StreamingHttpResponse
#import xu_test as xu_test
import seg_binarization as xu_test
import base64
import numpy as np
import cv2
'''
code: 0 success
code: 1 wrong
code: 2 other reson 
'''
static_dir = "/bigdata/gemfield/django/static/images/"
def readFile(filebytes,chunk_size=512):
    while True:
        c=filebytes.read(chunk_size)
        if c:
            yield c
        else:
            break
@csrf_exempt
def faceswap(request):
    #try:
    #print(request.body)
    #print("request.post:",request.POST)
    if request.method != "POST":
        return JsonResponse({"status":"1","msg":"Error: your method must be POST!"})
    try:   
        print("content-type: json") 
        res = json.loads(request.body.decode())
        imageinfo = res["image_info"]
    except:   
        print("content-type: formdata") 
        print("request body won't be decode()")
        imageinfo = request.POST.get("image_info") 
    if "base64," in imageinfo:
        imageinfo = base64.b64decode(imageinfo.split(",")[1])
    img_array = np.fromstring(imageinfo,np.uint8)
    img_array = cv2.imdecode(img_array,cv2.COLOR_BGR2RGB)
    print(img_array.shape)
    resimg = xu_test.run_seg(img_array)
    response = None
    if resimg is None:
        response = JsonResponse({"status":"2","msg":"no faces detected!"})
    else:
        img_str = cv2.imencode('.jpg', resimg)[1].tostring() 
        b64_code = base64.b64encode(img_str)
        img = b64_code.decode()
        response = JsonResponse({"status":"0","msg":"data:image/jpeg;base64,"+img})

    #except Exception as e:

    #    print("------Exception---------")
    #    response = JsonResponse({"status":"2","msg":str(e)})
    #finally:
    response["Access-Control-Allow-Origin"] = "*" 
    return response


class Images(models.Model):
    image = models.ImageField('图片',upload_to='images', default='')
 
from django.core.cache import cache
from io import BytesIO
@csrf_exempt
def bytepost(request):
    image = request.FILES["image_info"]
    print(image.name)
    filename = image.name
    imageinfo = np.fromstring(image.file.getvalue(), np.uint8)
    img_array = cv2.imdecode(imageinfo,cv2.COLOR_BGR2RGB)
    print(img_array.shape)
    imgmax = max(img_array.shape[0],img_array.shape[1])
    resimg = xu_test.run_seg(img_array)
    #response = None
    #if resimg is None:
    #    response = JsonResponse({"status":"2","msg":"no faces detected!"})
    #else:
    #    resimgbytes = cv2.imencode('.jpg', resimg)[1]
    #    response = StreamingHttpResponse(readFile(resimgbytes))
    #    print("-0-0-0-0-0",dir(response))
    #    response['Content-Type']='application/octet-stream'
    #    response['Content-Disposition']='attachment;filename="{0}"'.format(filename)

    ###except Exception as e:

    ###    print("------Exception---------")
    ##finally:
    #response["Access-Control-Allow-Origin"] = "*"
    #return response

    response = None
    if resimg is None:
        response = JsonResponse({"status":"2","msg":"no faces detected!"})
    else:
        img_str = cv2.imencode('.jpg', resimg)[1].tostring() 
        b64_code = base64.b64encode(img_str)
        img = b64_code.decode()
        response = JsonResponse({"status":"0","msg":"data:image/jpeg;base64,"+img})

    #except Exception as e:

    #    print("------Exception---------")
    #    response = JsonResponse({"status":"2","msg":str(e)})
    #finally:
    response["Access-Control-Allow-Origin"] = "*" 
    return response
