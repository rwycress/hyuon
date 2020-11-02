from django.shortcuts import render
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .models import *
from .serializers import *
from knox.models import AuthToken
from rest_framework.generics import *
from django.http import HttpResponse, JsonResponse
import json
from django.core import serializers

import numpy as np
from collections import Counter

import random

# Create your views here.


class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "token": AuthToken.objects.create(user)[1],
            }
        )


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        # user = serializer
        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "token": AuthToken.objects.create(user)[1],
            }
        )


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserProfileAPI(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(self.object, data=request.data)

        if serializer.is_valid():
            serializer.save()
            self.object.set_password(serializer.data.get("password"))
            self.object.save()

            response = {
                "user": UserSerializer(
                    self.object, context=self.get_serializer_context()
                ).data,
                # "token": AuthToken.objects.create(self.object)[1],
            }

            return Response(response)
        return Response('gang')


class RestAPI(generics.ListAPIView):
    serializer_class = RestSerializer

    def get_queryset(self):
        rests = Rest.objects.all()
        print(rests)
        return rests


class RestHighAPI(generics.ListAPIView):
    serializer_class = RestSerializer

    def get_queryset(self):
        rests = Rest.objects.all()

    def post(self, request):
        highway = request.data["rest_high"]
        direction = request.data["rest_highdirect"]
        high_rest = Rest.objects.filter(
            rest_high=highway, rest_highdirect=direction).values()
        return Response(high_rest)


class RestInfo(generics.ListAPIView):
    serializer_class = RestSerializer

    def get_queryset(self):
        rests = Rest.objects.values("rest_name")

    def post(self, request):
        total = []
        name = request.data["rest_name"]
        x = Rest.objects.filter(rest_name=name).values(
            "rest_address", "rest_feeding", "rest_sleep", "rest_shower", "rest_drug", "rest_fix", "rest_truck")

        a = RestMenu.objects.filter(rest_name=name).values(
            "menu_name", "menu_price", "menu_best")
        b = ExFood.objects.filter(ex_rest=name).values(
            "ex_name", "ex_price", "ex_img", "ex_info")
        c = TopItem.objects.filter(rest_name=name).values(
            "rank", "top_item", "top_shop")
        total = {"rest": x, "food": a, "EX": b, "TOP": c}
        print('check')
        print(total)
        return Response(total)
